const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://172.28.138.61:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuración de conexión
const dbConfig = {
  host: 'localhost',
  port: 3306,
  database: 'citypaj',
  user: 'citypaj_user',
  password: 'citypaj123'
};

console.log('🚀 Iniciando servidor final de CityPaj');
console.log('📊 Configuración de base de datos:');
console.log(`   - Host: ${dbConfig.host}`);
console.log(`   - Database: ${dbConfig.database}`);
console.log(`   - User: ${dbConfig.user}`);
console.log(`   - Port: ${dbConfig.port}`);

// Función para ejecutar consultas con conexión individual
async function executeQuery(sql, params = []) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Endpoint principal de anuncios
app.get('/api/anuncios', async (req, res) => {
  try {
    console.log('📊 Obteniendo anuncios...');
    
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const offset = (pagina - 1) * limite;
    
    // Aplicar filtros
    let whereClause = 'WHERE anuncios.visible = 1 AND anuncios.estado_moderacion = "approved"';
    let queryParams = [];
    
    if (req.query.categoria) {
      whereClause += ' AND anuncios.categoria = ?';
      queryParams.push(req.query.categoria);
    }
    
    if (req.query.buscar) {
      whereClause += ' AND (anuncios.titulo LIKE ? OR anuncios.descripcion LIKE ?)';
      const searchTerm = `%${req.query.buscar}%`;
      queryParams.push(searchTerm, searchTerm);
    }
    
    if (req.query.precio_min) {
      whereClause += ' AND anuncios.precio >= ?';
      queryParams.push(parseFloat(req.query.precio_min));
    }
    
    if (req.query.precio_max) {
      whereClause += ' AND anuncios.precio <= ?';
      queryParams.push(parseFloat(req.query.precio_max));
    }
    
    // Ordenamiento
    let orderClause = 'ORDER BY anuncios.id DESC';
    if (req.query.orden) {
      switch (req.query.orden) {
        case 'fecha_asc':
          orderClause = 'ORDER BY anuncios.creado ASC';
          break;
        case 'precio_asc':
          orderClause = 'ORDER BY anuncios.precio ASC';
          break;
        case 'precio_desc':
          orderClause = 'ORDER BY anuncios.precio DESC';
          break;
        default:
          orderClause = 'ORDER BY anuncios.id DESC';
      }
    }
    
    // Obtener anuncios
    const anunciosQuery = `
      SELECT 
        anuncios.*,
        usuarios.nombre as usuario_nombre,
        usuarios.email as email
      FROM anuncios
      LEFT JOIN usuarios ON anuncios.usuario_id = usuarios.id
      ${whereClause}
      ${orderClause}
      LIMIT ? OFFSET ?
    `;
    
    const anuncios = await executeQuery(anunciosQuery, [...queryParams, limite, offset]);
    
    // Obtener total
    const totalQuery = `
      SELECT COUNT(*) as total
      FROM anuncios
      LEFT JOIN usuarios ON anuncios.usuario_id = usuarios.id
      ${whereClause}
    `;
    
    const [totalResult] = await executeQuery(totalQuery, queryParams);
    const total = totalResult.total;

    console.log(`✅ Obtenidos ${anuncios.length} anuncios de ${total} totales`);

    res.json({
      success: true,
      data: anuncios,
      meta: {
        pagina,
        limite,
        total,
        total_paginas: Math.ceil(total / limite)
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo anuncios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener anuncios de la base de datos',
      details: error.message
    });
  }
});

// Endpoint de detalle de anuncio
app.get('/api/anuncios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const anuncio = await executeQuery(`
      SELECT 
        anuncios.*,
        usuarios.nombre as usuario_nombre,
        usuarios.email as email
      FROM anuncios
      LEFT JOIN usuarios ON anuncios.usuario_id = usuarios.id
      WHERE anuncios.id = ? AND anuncios.visible = 1 AND anuncios.estado_moderacion = 'approved'
    `, [id]);
    
    if (!anuncio || anuncio.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Anuncio no encontrado'
      });
    }

    res.json({
      success: true,
      data: anuncio[0]
    });

  } catch (error) {
    console.error('❌ Error obteniendo anuncio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener anuncio',
      details: error.message
    });
  }
});

// Endpoint de tiempo real
app.get('/api/database/realtime', async (req, res) => {
  try {
    console.log('📊 Obteniendo datos en tiempo real...');
    
    const { categoria, comunidad, format = 'json' } = req.query;
    
    let whereClause = 'WHERE anuncios.visible = 1 AND anuncios.estado_moderacion = "approved"';
    let queryParams = [];
    
    if (categoria) {
      whereClause += ' AND anuncios.categoria = ?';
      queryParams.push(categoria);
    }
    
    if (comunidad) {
      whereClause += ' AND anuncios.comunidad_autonoma LIKE ?';
      queryParams.push(`%${comunidad}%`);
    }
    
    const allAnuncios = await executeQuery(`
      SELECT 
        anuncios.*,
        usuarios.nombre as usuario_nombre,
        usuarios.email as email
      FROM anuncios
      LEFT JOIN usuarios ON anuncios.usuario_id = usuarios.id
      ${whereClause}
      ORDER BY anuncios.id DESC
    `, queryParams);

    if (format === 'categorized') {
      const dataByCategory = allAnuncios.reduce((acc, anuncio) => {
        if (!acc[anuncio.categoria]) {
          acc[anuncio.categoria] = [];
        }
        acc[anuncio.categoria].push(anuncio);
        return acc;
      }, {});

      res.json({
        success: true,
        data: dataByCategory,
        meta: {
          total: allAnuncios.length,
          categories: Object.keys(dataByCategory)
        }
      });
    } else {
      res.json({
        success: true,
        data: allAnuncios,
        meta: {
          total: allAnuncios.length
        }
      });
    }

  } catch (error) {
    console.error('❌ Error obteniendo datos en tiempo real:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener datos en tiempo real',
      details: error.message
    });
  }
});

// Health check
app.get('/health', async (req, res) => {
  try {
    // Probar conexión a la base de datos
    const [result] = await executeQuery('SELECT COUNT(*) as total FROM anuncios');
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        total_anuncios: result.total
      }
    });
  } catch (error) {
    res.json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error.message
      }
    });
  }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor final corriendo en http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`📝 Anuncios endpoints: http://0.0.0.0:${PORT}/api/anuncios`);
  console.log(`⚡ Realtime endpoint: http://0.0.0.0:${PORT}/api/database/realtime`);
  console.log('✅ Servidor listo para recibir peticiones');
});
