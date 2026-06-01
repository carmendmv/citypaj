const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { randomUUID } = require('crypto');

const app = express();
const PORT = process.env.PORT || 3002;

// Conexión a PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3307,
  database: process.env.DB_NAME || 'citypaj',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'noalumno',
  ssl: false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://172.28.138.61:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// JWT Secret
const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = 'your-super-secret-refresh-key-change-in-production';

// Health check
app.get('/health', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Endpoint para obtener anuncios con filtros
app.get('/api/anuncios', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      categoria,
      comunidad,
      provincia,
      ordenar = 'creado-desc',
      busqueda
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir WHERE clause
    const whereConditions = ['a.visible = true', 'a.estado_moderacion = \'approved\''];
    const queryParams = [];
    let paramIndex = 1;

    if (categoria) {
      whereConditions.push(`a.categoria = $${paramIndex++}`);
      queryParams.push(categoria);
    }

    if (comunidad) {
      whereConditions.push(`a.comunidad_autonoma = $${paramIndex++}`);
      queryParams.push(comunidad);
    }

    if (provincia) {
      whereConditions.push(`a.provincia = $${paramIndex++}`);
      queryParams.push(provincia);
    }

    if (busqueda) {
      whereConditions.push(`(a.titulo ILIKE $${paramIndex++} OR a.descripcion ILIKE $${paramIndex++})`);
      queryParams.push(`%${busqueda}%`, `%${busqueda}%`);
    }

    // Construir ORDER BY
    let orderBy = 'a.creado DESC';
    if (ordenar) {
      const [field, direction] = ordenar.split('-');
      const directionSQL = direction === 'asc' ? 'ASC' : 'DESC';
      
      switch (field) {
        case 'titulo':
          orderBy = `a.titulo ${directionSQL}`;
          break;
        case 'precio':
          orderBy = `a.precio ${directionSQL} NULLS LAST`;
          break;
        case 'vistas':
          orderBy = `a.vistas ${directionSQL}`;
          break;
        case 'creado':
        default:
          orderBy = `a.creado ${directionSQL}`;
          break;
      }
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Query principal
    const query = `
      SELECT 
        a.id,
        a.titulo,
        a.descripcion,
        a.categoria,
        a.comunidad_autonoma,
        a.provincia,
        a.precio,
        a.creado,
        a.actualizado,
        a.vistas,
        u.nombre as usuario_nombre,
        u.email as usuario_email,
        u.telefono as usuario_telefono
      FROM anuncios a
      JOIN usuarios u ON a.usuario_id = u.id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(parseInt(limit), offset);

    // Query para contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM anuncios a
      JOIN usuarios u ON a.usuario_id = u.id
      ${whereClause}
    `;

    const [result, countResult] = await Promise.all([
      pool.query(query, queryParams),
      pool.query(countQuery, queryParams.slice(0, -2))
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: result.rows,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Error fetching anuncios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoint para obtener un anuncio específico
app.get('/api/anuncios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        a.id,
        a.titulo,
        a.descripcion,
        a.categoria,
        a.comunidad_autonoma,
        a.provincia,
        a.precio,
        a.creado,
        a.actualizado,
        a.vistas,
        u.nombre as usuario_nombre,
        u.email as usuario_email,
        u.telefono as usuario_telefono
      FROM anuncios a
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.id = $1 AND a.visible = true AND a.estado_moderacion = 'approved'
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Anuncio no encontrado'
      });
    }

    // Incrementar vistas
    await pool.query('UPDATE anuncios SET vistas = vistas + 1 WHERE id = $1', [id]);

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error fetching anuncio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoint para crear anuncio
app.post('/api/anuncios', async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      categoria,
      comunidad_autonoma,
      provincia,
      precio,
      usuario_id
    } = req.body;

    // Validaciones básicas
    if (!titulo || !descripcion || !categoria || !comunidad_autonoma || !provincia || !usuario_id) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos'
      });
    }

    const query = `
      INSERT INTO anuncios (
        id, usuario_id, titulo, descripcion, categoria, 
        comunidad_autonoma, provincia, precio, 
        visible, estado_moderacion, creado, actualizado, vistas
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, true, 'approved', NOW(), NOW(), 0
      ) RETURNING *
    `;

    const result = await pool.query(query, [
      randomUUID(),
      usuario_id,
      titulo,
      descripcion,
      categoria,
      comunidad_autonoma,
      provincia,
      precio || null
    ]);

    res.status(201).json({
      success: true,
      message: 'Anuncio creado correctamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error creating anuncio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoint para guardar sugerencias del buzón de sugerencias
app.post('/api/suggestions', async (req, res) => {
  try {
    const { nombre, email, titulo, descripcion, tipo, categoria, prioridad } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !titulo || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: nombre, email, titulo, descripcion'
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }

    // Insertar sugerencia en la base de datos
    const query = `
      INSERT INTO sugerencias (
        id, nombre, email, titulo, descripcion, tipo, categoria, prioridad, 
        estado, creado, actualizado
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, 'pendiente', NOW(), NOW()
      ) RETURNING id
    `;

    const result = await pool.query(query, [
      randomUUID(),
      nombre.trim(),
      email.trim(),
      titulo.trim(),
      descripcion.trim(),
      tipo || 'sugerencia',
      categoria || 'general',
      prioridad || 'media'
    ]);

    console.log('✅ Sugerencia guardada:', result.rows[0].id);

    res.status(201).json({
      success: true,
      message: 'Sugerencia guardada correctamente',
      data: {
        id: result.rows[0].id,
        nombre,
        email,
        titulo,
        tipo,
        estado: 'pendiente',
        creado: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error guardando sugerencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al guardar la sugerencia'
    });
  }
});

// Endpoint de login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          telefono: user.telefono
        }
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Backend con base de datos real corriendo en http://localhost:${PORT}`);
  
  // Probar conexión a la base de datos
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Base de datos PostgreSQL conectada correctamente');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
  }
});
