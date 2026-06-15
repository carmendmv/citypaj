const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MySQL
const getDBConnection = async () => {
  return await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'citypaj_db'
  });
};

// Cache para mapeos de comunidades y provincias
let comunidadesCache = {};
let provinciasCache = {};

// Cargar mapeos desde la base de datos
const cargarMapeos = async () => {
  if (Object.keys(comunidadesCache).length > 0) return;
  
  const connection = await getDBConnection();
  
  try {
    // Cargar comunidades
    const [comunidades] = await connection.execute('SELECT id, nombre FROM comunidades');
    comunidades.forEach(com => {
      comunidadesCache[com.nombre.toLowerCase()] = com.id;
    });
    
    // Cargar provincias  
    const [provincias] = await connection.execute('SELECT id, nombre FROM provincias');
    provincias.forEach(prov => {
      provinciasCache[prov.nombre.toLowerCase()] = prov.id;
    });
    
    console.log('✅ Mapeos cargados:', {
      comunidades: Object.keys(comunidadesCache).length,
      provincias: Object.keys(provinciasCache).length
    });
    
  } finally {
    await connection.end();
  }
};

// Convertir nombres a IDs
const getComunidadId = (nombre) => {
  if (!nombre) return null;
  return comunidadesCache[nombre.toLowerCase()] || null;
};

const getProvinciaId = (nombre) => {
  if (!nombre) return null;
  return provinciasCache[nombre.toLowerCase()] || null;
};

// Endpoint de prueba de conexión
app.get('/test-db', async (req, res) => {
  try {
    const connection = await getDBConnection();
    const [result] = await connection.execute('SELECT COUNT(*) as total FROM usuarios');
    await connection.end();
    
    res.json({
      success: true,
      message: 'MySQL connection working',
      users: result[0].total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint de login
app.post('/test-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const connection = await getDBConnection();
    const [users] = await connection.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    await connection.end();
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }
    
    const user = users[0];
    let passwordValid = user.password_hash === '$2b$10$example_hash_password_hash';
    
    if (passwordValid) {
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email
        }
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid password' });
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint principal de anuncios (el que usa el frontend)
app.get('/api/anuncios', async (req, res) => {
  try {
    console.log('🔄 Obteniendo anuncios con MySQL real y mapeo correcto');
    
    // Cargar mapeos de comunidades/provincias
    await cargarMapeos();
    
    const {
      page = '1',
      limit = '12',
      categoria,
      comunidad_autonoma,
      provincia,
      busqueda,
      orden
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Convertir nombres a IDs
    const comunidadId = comunidad_autonoma ? getComunidadId(comunidad_autonoma) : null;
    const provinciaId = provincia ? getProvinciaId(provincia) : null;

    console.log('🔍 Mapeo de filtros:', {
      comunidad_autonoma,
      comunidad_id: comunidadId,
      provincia,
      provincia_id: provinciaId
    });

    const connection = await getDBConnection();
    
    try {
      // Consulta base optimizada
      let query = `
        SELECT 
          id, titulo, descripcion, categoria, 
          comunidad_id, provincia_id, barrio as localidad, 
          precio, visible, estado_moderacion,
          creado_at as fecha_creacion, actualizado_at as fecha_actualizacion, 
          usuario_id, contacto_email, contacto_telefono
        FROM anuncios 
        WHERE visible = 1 AND estado_moderacion = 'approved'
      `;
      
      const params = [];

      // Aplicar filtros
      if (categoria && categoria !== 'todos') {
        query += ` AND categoria = ?`;
        params.push(categoria);
      }

      if (comunidadId) {
        query += ` AND comunidad_id = ?`;
        params.push(comunidadId);
      }

      if (provinciaId) {
        query += ` AND provincia_id = ?`;
        params.push(provinciaId);
      }

      if (busqueda) {
        query += ` AND (titulo LIKE ? OR descripcion LIKE ?)`;
        params.push(`%${busqueda}%`, `%${busqueda}%`);
      }

      // Aplicar ordenamiento
      switch (orden) {
        case 'fecha_asc':
          query += ` ORDER BY creado_at ASC`;
          break;
        case 'fecha_desc':
          query += ` ORDER BY creado_at DESC`;
          break;
        case 'precio_asc':
          query += ` ORDER BY precio ASC`;
          break;
        case 'precio_desc':
          query += ` ORDER BY precio DESC`;
          break;
        default:
          query += ` ORDER BY creado_at DESC`;
          break;
      }

      // Conteo para paginación
      let countQuery = `
        SELECT COUNT(*) as total 
        FROM anuncios 
        WHERE visible = 1 AND estado_moderacion = 'approved'
      `;
      
      const countParams = [];
      
      if (categoria && categoria !== 'todos') {
        countQuery += ` AND categoria = ?`;
        countParams.push(categoria);
      }

      if (comunidadId) {
        countQuery += ` AND comunidad_id = ?`;
        countParams.push(comunidadId);
      }

      if (provinciaId) {
        countQuery += ` AND provincia_id = ?`;
        countParams.push(provinciaId);
      }

      if (busqueda) {
        countQuery += ` AND (titulo LIKE ? OR descripcion LIKE ?)`;
        countParams.push(`%${busqueda}%`, `%${busqueda}%`);
      }

      // Ejecutar consulta de conteo
      const [countResult] = await connection.execute(countQuery, countParams);
      const total = countResult[0].total;

      // Aplicar paginación a la consulta principal
      query += ` LIMIT ? OFFSET ?`;
      params.push(limitNum, offset);

      // Ejecutar consulta principal
      const [anuncios] = await connection.execute(query, params);
      
      console.log(`✅ Consulta ejecutada: ${anuncios.length} anuncios de ${total} totales`);

      res.status(200).json({
        success: true,
        data: {
          anuncios,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum)
          }
        }
      });

    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Error en /api/anuncios:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Endpoint de login para el frontend
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔄 Procesando login con MySQL real');
    
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos'
      });
      return;
    }

    const connection = await getDBConnection();
    
    try {
      const [users] = await connection.execute(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
      );
      
      const user = users[0];
      
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
        });
        return;
      }

      // Para desarrollo: aceptar cualquier contraseña si el hash es el de ejemplo
      let passwordValid = false;
      if (user.password_hash === '$2b$10$example_hash_password_hash') {
        passwordValid = true;
      } else {
        passwordValid = await bcrypt.compare(password, user.password_hash);
      }

      if (!passwordValid) {
        res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
        });
        return;
      }

      // Generar JWT token
      const token = jwt.sign(
        { 
          userId: user.id,
          email: user.email 
        },
        'your-super-secret-jwt-key-change-in-production',
        { expiresIn: '24h' }
      );

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            verificado: user.verificado === 1,
            creado_at: user.creado_at
          },
          token
        },
        message: 'Login exitoso'
      });

    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Endpoint para anuncios destacados (home)
app.get('/api/anuncios/destacados', async (req, res) => {
  try {
    const connection = await getDBConnection();
    
    try {
      const [anuncios] = await connection.execute(`
        SELECT 
          a.*,
          u.nombre as usuario_nombre,
          u.verificado as usuario_verificado,
          0 as numero_imagenes
        FROM anuncios a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        WHERE a.visible = 1 
          AND a.estado_moderacion = 'approved'
        ORDER BY a.vistas DESC, a.creado_at DESC
        LIMIT 6
      `);
      
      res.json({
        success: true,
        data: anuncios,
        total: anuncios.length
      });
      
    } finally {
      await connection.end();
    }
    
  } catch (error) {
    console.error('Error en anuncios destacados:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Endpoint para estadísticas del home
app.get('/api/estadisticas/home', async (req, res) => {
  try {
    const connection = await getDBConnection();
    
    try {
      // Contar anuncios totales
      const [anunciosResult] = await connection.execute(
        'SELECT COUNT(*) as total FROM anuncios WHERE visible = 1 AND estado_moderacion = "approved"'
      );
      
      // Contar usuarios registrados
      const [usuariosResult] = await connection.execute(
        'SELECT COUNT(*) as total FROM usuarios'
      );
      
      // Contar sugerencias recibidas
      const [sugerenciasResult] = await connection.execute(
        'SELECT COUNT(*) as total FROM sugerencias'
      );
      
      // Contar comunidades con anuncios
      const [comunidadesResult] = await connection.execute(`
        SELECT COUNT(DISTINCT c.id) as total 
        FROM comunidades c
        INNER JOIN anuncios a ON c.id = a.comunidad_id
        WHERE a.visible = 1 AND a.estado_moderacion = 'approved'
      `);
      
      const stats = {
        anuncios_publicados: anunciosResult[0].total,
        usuarios_registrados: usuariosResult[0].total,
        sugerencias_recibidas: sugerenciasResult[0].total,
        comunidades_activas: comunidadesResult[0].total
      };
      
      res.json({
        success: true,
        data: stats
      });
      
    } finally {
      await connection.end();
    }
    
  } catch (error) {
    console.error('Error en estadísticas home:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Endpoint para comunidad por provincias
app.get('/api/comunidad/provincias', async (req, res) => {
  try {
    const { comunidad } = req.query;
    
    if (!comunidad) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere el parámetro comunidad'
      });
    }
    
    const connection = await getDBConnection();
    
    try {
      // Asegurar que la caché esté cargada
      await cargarMapeos();
      
      // Obtener ID de la comunidad directamente desde la base de datos
      const [comunidades] = await connection.execute(
        'SELECT id FROM comunidades WHERE nombre = ?',
        [comunidad]
      );
      
      if (comunidades.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Comunidad no encontrada'
        });
      }
      
      const comunidadId = comunidades[0].id;
      
      // Obtener provincias de esa comunidad
      const [provincias] = await connection.execute(`
        SELECT id, nombre 
        FROM provincias 
        WHERE comunidad_id = ? 
        ORDER BY nombre
      `, [comunidadId]);
      
      // Por ahora, devolver entradas vacías ya que no existe la tabla comunidad_entradas
      const entradas = [];
      
      res.json({
        success: true,
        data: {
          provincias,
          entradas_recientes: entradas,
          comunidad_nombre: comunidad
        }
      });
      
    } finally {
      await connection.end();
    }
    
  } catch (error) {
    console.error('Error en comunidad provincias:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Manejo de errores global
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Iniciar servidor
const server = app.listen(3002, () => {
  console.log('🚀 CityPAJ Backend completo running on port 3002');
  console.log('📊 Endpoints disponibles:');
  console.log('  GET  /test-db - Test MySQL connection');
  console.log('  POST /test-login - Test real login');
  console.log('  GET  /api/anuncios - Anuncios con filtros reales');
  console.log('  GET  /api/anuncios/destacados - Anuncios destacados para home');
  console.log('  GET  /api/estadisticas/home - Estadísticas para home');
  console.log('  GET  /api/comunidad/provincias - Comunidad por provincias');
  console.log('  POST /api/auth/login - Login para frontend');
  console.log('');
  console.log('✅ Backend listo para conectar con frontend');
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
});
