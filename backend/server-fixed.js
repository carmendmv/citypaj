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
  origin: ['http://localhost:3000', 'http://localhost:3001'],
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
      comunidad_autonoma,
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

    if (comunidad_autonoma) {
      whereConditions.push(`a.comunidad_autonoma = $${paramIndex++}`);
      queryParams.push(comunidad_autonoma);
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

    const whereClause = whereConditions.join(' AND ');

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
        a.modalidad,
        a.creado,
        a.actualizado,
        a.vistas,
        u.nombre as autor,
        u.email as email,
        u.telefono as telefono
      FROM anuncios a
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(parseInt(limit), offset);

    // Query para contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM anuncios a
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE ${whereClause}
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
        a.modalidad,
        a.creado,
        a.actualizado,
        a.vistas,
        u.nombre as autor,
        u.email as email,
        u.telefono as telefono
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

// Endpoint para actualizar anuncio
app.put('/api/anuncios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      descripcion,
      categoria,
      comunidad_autonoma,
      provincia,
      precio,
      modalidad
    } = req.body;

    // Validaciones básicas
    if (!titulo || !descripcion || !categoria || !comunidad_autonoma) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos'
      });
    }

    const query = `
      UPDATE anuncios SET 
        titulo = $1,
        descripcion = $2,
        categoria = $3,
        comunidad_autonoma = $4,
        provincia = $5,
        precio = $6,
        modalidad = $7,
        actualizado = NOW()
      WHERE id = $8 AND visible = true
      RETURNING *
    `;

    const result = await pool.query(query, [
      titulo,
      descripcion,
      categoria,
      comunidad_autonoma,
      provincia || comunidad_autonoma,
      precio || null,
      modalidad || 'servicio',
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Anuncio no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Anuncio actualizado exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating anuncio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoint para eliminar anuncio (soft delete)
app.delete('/api/anuncios/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE anuncios SET 
        visible = false,
        actualizado = NOW()
      WHERE id = $1
      RETURNING id
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Anuncio no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Anuncio eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting anuncio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoint para crear anuncio
// Endpoint para crear anuncios (público, sin autenticación requerida)
app.post('/api/anuncios', async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      categoria,
      comunidad_autonoma,
      provincia,
      precio,
      modalidad,
      nombre,
      email,
      telefono
    } = req.body;

    // Validaciones básicas
    if (!titulo || !descripcion || !categoria || !comunidad_autonoma) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: titulo, descripcion, categoria, comunidad_autonoma'
      });
    }

    // Crear usuario temporal si no existe
    let usuarioId = null;
    if (email) {
      try {
        // Verificar si usuario ya existe
        const existingUserQuery = 'SELECT id FROM usuarios WHERE email = $1';
        const existingUser = await pool.query(existingUserQuery, [email.toLowerCase()]);
        
        if (existingUser.rows.length > 0) {
          usuarioId = existingUser.rows[0].id;
        } else {
          // Crear usuario temporal
          const tempPassword = 'temp_' + randomUUID();
          const hashedPassword = await bcrypt.hash(tempPassword, 10);
          
          const insertUserQuery = `
            INSERT INTO usuarios (id, nombre, email, password_hash, telefono, creado, actualizado)
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
            RETURNING id
          `;
          
          const userResult = await pool.query(insertUserQuery, [
            randomUUID(),
            nombre || email.split('@')[0],
            email.toLowerCase(),
            hashedPassword,
            telefono || null
          ]);
          
          usuarioId = userResult.rows[0].id;
        }
      } catch (userError) {
        console.error('Error creando/verificando usuario:', userError);
        // Continuar sin usuario si falla
      }
    }

    const query = `
      INSERT INTO anuncios (
        id, usuario_id, titulo, descripcion, categoria, 
        comunidad_autonoma, provincia, precio, modalidad,
        visible, estado_moderacion, creado, actualizado, vistas
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, true, 'approved', NOW(), NOW(), 0
      ) RETURNING *
    `;

    const result = await pool.query(query, [
      randomUUID(),
      usuarioId,
      titulo,
      descripcion,
      categoria,
      comunidad_autonoma,
      provincia || comunidad_autonoma,
      precio || null,
      modalidad || 'servicio'
    ]);

    res.status(201).json({
      success: true,
      message: 'Anuncio creado exitosamente',
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

// Endpoint de registro
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, email, password, telefono } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son requeridos'
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

    // Verificar si usuario ya existe
    const existingUserQuery = 'SELECT * FROM usuarios WHERE email = $1';
    const existingUser = await pool.query(existingUserQuery, [email.toLowerCase()]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const insertQuery = `
      INSERT INTO usuarios (id, nombre, email, password_hash, telefono, creado, actualizado)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, nombre, email, telefono, creado
    `;

    const result = await pool.query(insertQuery, [
      randomUUID(),
      nombre.trim(),
      email.toLowerCase().trim(),
      hashedPassword,
      telefono || null
    ]);

    const newUser = result.rows[0];

    // Generar token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        token,
        user: {
          id: newUser.id,
          nombre: newUser.nombre,
          email: newUser.email,
          telefono: newUser.telefono
        }
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
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
    const result = await pool.query(query, [email.toLowerCase()]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

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

// Endpoint de logout
app.post('/api/auth/logout', async (req, res) => {
  try {
    // En una implementación real, aquí invalidaríamos el token
    // Por ahora, simplemente respondemos exitosamente
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoint para solicitar recuperación de contraseña
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email es requerido'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      });
    }

    // Verificar si el usuario existe
    const userQuery = 'SELECT * FROM usuarios WHERE email = $1';
    const userResult = await pool.query(userQuery, [email.toLowerCase()]);

    if (userResult.rows.length === 0) {
      // Por seguridad, no revelamos si el email existe o no
      return res.json({
        success: true,
        message: 'Si el email está registrado, recibirás instrucciones para recuperar tu contraseña'
      });
    }

    // Generar token de recuperación (válido por 1 hora)
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Guardar token en la base de datos
    const updateQuery = `
      UPDATE usuarios 
      SET reset_token = $1, reset_token_expiry = $2 
      WHERE email = $3
    `;
    await pool.query(updateQuery, [resetToken, resetTokenExpiry, email.toLowerCase()]);

    // En desarrollo, devolver el token para testing
    const debugToken = process.env.NODE_ENV === 'development' ? resetToken : undefined;

    // TODO: En producción, aquí se enviaría el email real
    console.log('🔑 Token de recuperación (desarrollo):', resetToken);
    console.log('📧 Email de recuperación enviado a:', email);

    res.json({
      success: true,
      message: 'Si el email está registrado, recibirás instrucciones para recuperar tu contraseña',
      debugToken
    });

  } catch (error) {
    console.error('Error en forgot-password:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Endpoint para restablecer contraseña
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Token y nueva contraseña son requeridos'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar token y encontrar usuario
    const userQuery = `
      SELECT id FROM usuarios 
      WHERE reset_token = $1 AND reset_token_expiry > NOW()
    `;
    const userResult = await pool.query(userQuery, [token]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Token inválido o expirado'
      });
    }

    // Hashear nueva contraseña
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña y limpiar token
    const updateQuery = `
      UPDATE usuarios 
      SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL 
      WHERE id = $2
    `;
    await pool.query(updateQuery, [hashedPassword, userResult.rows[0].id]);

    res.json({
      success: true,
      message: 'Contraseña restablecida exitosamente'
    });

  } catch (error) {
    console.error('Error en reset-password:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticación requerido'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    req.user = user;
    next();
  });
};

// Endpoint para guardar anuncio
app.post('/api/anuncios/guardar', authenticateToken, async (req, res) => {
  try {
    const { anuncio_id } = req.body;
    const userId = req.user.userId;

    if (!anuncio_id) {
      return res.status(400).json({
        success: false,
        message: 'ID del anuncio es requerido'
      });
    }

    // Verificar si el anuncio existe
    const anuncioQuery = 'SELECT id FROM anuncios WHERE id = $1 AND visible = true';
    const anuncioResult = await pool.query(anuncioQuery, [anuncio_id]);

    if (anuncioResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Anuncio no encontrado'
      });
    }

    // Verificar si ya está guardado
    const existingQuery = 'SELECT * FROM anuncios_guardados WHERE usuario_id = $1 AND anuncio_id = $2';
    const existingResult = await pool.query(existingQuery, [userId, anuncio_id]);

    if (existingResult.rows.length > 0) {
      // Eliminar de guardados
      await pool.query('DELETE FROM anuncios_guardados WHERE usuario_id = $1 AND anuncio_id = $2', [userId, anuncio_id]);
      
      res.json({
        success: true,
        message: 'Anuncio eliminado de guardados',
        data: { guardado: false }
      });
    } else {
      // Agregar a guardados
      await pool.query(
        'INSERT INTO anuncios_guardados (id, usuario_id, anuncio_id, creado) VALUES ($1, $2, $3, NOW())',
        [randomUUID(), userId, anuncio_id]
      );
      
      res.json({
        success: true,
        message: 'Anuncio guardado exitosamente',
        data: { guardado: true }
      });
    }

  } catch (error) {
    console.error('Error al guardar anuncio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoint para reportar anuncio
app.post('/api/anuncios/reportar', async (req, res) => {
  try {
    const { anuncio_id, motivo, descripcion } = req.body;

    if (!anuncio_id || !motivo) {
      return res.status(400).json({
        success: false,
        message: 'ID del anuncio y motivo son requeridos'
      });
    }

    // Verificar si el anuncio existe
    const anuncioQuery = 'SELECT id FROM anuncios WHERE id = $1 AND visible = true';
    const anuncioResult = await pool.query(anuncioQuery, [anuncio_id]);

    if (anuncioResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Anuncio no encontrado'
      });
    }

    // Crear reporte
    const reportQuery = `
      INSERT INTO reportes_anuncios (id, anuncio_id, motivo, descripcion, creado, estado)
      VALUES ($1, $2, $3, $4, NOW(), 'pendiente')
      RETURNING id
    `;

    const result = await pool.query(reportQuery, [
      randomUUID(),
      anuncio_id,
      motivo.trim(),
      descripcion?.trim() || null
    ]);

    res.status(201).json({
      success: true,
      message: 'Anuncio reportado exitosamente',
      data: {
        id: result.rows[0].id,
        anuncio_id,
        motivo,
        estado: 'pendiente'
      }
    });

  } catch (error) {
    console.error('Error al reportar anuncio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoint para obtener anuncios guardados de un usuario
app.get('/api/anuncios/guardados', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const query = `
      SELECT a.*, ag.creado as guardado_el
      FROM anuncios a
      JOIN anuncios_guardados ag ON a.id = ag.anuncio_id
      WHERE ag.usuario_id = $1 AND a.visible = true AND a.estado_moderacion = 'approved'
      ORDER BY ag.creado DESC
    `;

    const result = await pool.query(query, [userId]);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error al obtener anuncios guardados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoint para sugerencias
app.post('/api/sugerencias', async (req, res) => {
  try {
    const {
      nombre,
      email,
      titulo,
      descripcion,
      tipo,
      categoria,
      prioridad
    } = req.body;

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
        descripcion,
        tipo,
        categoria,
        prioridad,
        estado: 'pendiente'
      }
    });

  } catch (error) {
    console.error('Error guardando sugerencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoint para inicializar tablas
app.post('/api/init-database', async (req, res) => {
  try {
    const client = await pool.connect();
    
    // Crear tabla usuarios si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id UUID PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        telefono VARCHAR(50),
        email_verificado BOOLEAN DEFAULT false,
        telefono_verificado BOOLEAN DEFAULT false,
        usuario_verificado BOOLEAN DEFAULT false,
        reset_token VARCHAR(255),
        reset_token_expiry TIMESTAMP,
        creado TIMESTAMP DEFAULT NOW(),
        actualizado TIMESTAMP DEFAULT NOW()
      )
    `);

    // Crear tabla anuncios si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS anuncios (
        id UUID PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT NOT NULL,
        categoria VARCHAR(100) NOT NULL,
        comunidad_autonoma VARCHAR(255),
        provincia VARCHAR(255),
        precio DECIMAL(10,2),
        modalidad VARCHAR(100) DEFAULT 'servicio',
        usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        visible BOOLEAN DEFAULT true,
        estado_moderacion VARCHAR(50) DEFAULT 'pending',
        vistas INTEGER DEFAULT 0,
        creado TIMESTAMP DEFAULT NOW(),
        actualizado TIMESTAMP DEFAULT NOW()
      )
    `);

    // Crear tabla anuncios_guardados si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS anuncios_guardados (
        id UUID PRIMARY KEY,
        usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        anuncio_id UUID NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
        creado TIMESTAMP DEFAULT NOW(),
        UNIQUE(usuario_id, anuncio_id)
      )
    `);

    // Crear tabla reportes_anuncios si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS reportes_anuncios (
        id UUID PRIMARY KEY,
        anuncio_id UUID NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
        motivo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        creado TIMESTAMP DEFAULT NOW(),
        estado VARCHAR(50) DEFAULT 'pendiente'
      )
    `);

    // Crear tabla sugerencias si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS sugerencias (
        id UUID PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT NOT NULL,
        tipo VARCHAR(100) DEFAULT 'sugerencia',
        categoria VARCHAR(100) DEFAULT 'general',
        prioridad VARCHAR(50) DEFAULT 'media',
        estado VARCHAR(50) DEFAULT 'pendiente',
        creado TIMESTAMP DEFAULT NOW(),
        actualizado TIMESTAMP DEFAULT NOW()
      )
    `);

    client.release();
    
    res.json({
      success: true,
      message: 'Tablas creadas exitosamente'
    });

  } catch (error) {
    console.error('Error creando tablas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear tablas: ' + error.message
    });
  }
});

// Debug endpoint - verificar tablas
app.get('/debug/tables', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    client.release();
    
    res.status(200).json({
      success: true,
      tables: result.rows
    });
  } catch (error) {
    console.error('Debug tables failed:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Debug endpoint - verificar estructura tabla usuarios
app.get('/debug/usuarios', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'usuarios' AND table_schema = 'public' 
      ORDER BY ordinal_position
    `);
    client.release();
    
    res.status(200).json({
      success: true,
      columns: result.rows
    });
  } catch (error) {
    console.error('Debug usuarios failed:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Debug endpoint - probar consulta SELECT
app.get('/debug/select', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM usuarios WHERE email = $1', ['test@test.com']);
    client.release();
    
    res.status(200).json({
      success: true,
      result: result.rows
    });
  } catch (error) {
    console.error('Debug select failed:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
  
  // Probar conexión a la base de datos
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Base de datos PostgreSQL conectada correctamente');
    
    // Inicializar tablas automáticamente
    console.log('🔧 Inicializando tablas de la base de datos...');
    try {
      const initResponse = await fetch(`http://localhost:${PORT}/api/init-database`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const initResult = await initResponse.json();
      if (initResult.success) {
        console.log('✅ Tablas inicializadas correctamente');
      } else {
        console.log('⚠️ Error inicializando tablas:', initResult.message);
      }
    } catch (initError) {
      console.log('⚠️ No se pudo inicializar tablas automáticamente:', initError.message);
    }
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
  }
});
