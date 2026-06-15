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

console.log('🚀 Iniciando servidor simple con MySQL2 de CityPaj');

// Conexión a la base de datos
let connection = null;

async function connectToDatabase() {
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    console.log('✅ Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
  }
}

// Iniciar conexión al arrancar
connectToDatabase();

// Endpoint principal de anuncios
app.get('/api/anuncios', async (req, res) => {
  console.log('📝 Petición recibida a /api/anuncios');
  
  try {
    if (!connection) {
      await connectToDatabase();
    }
    
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const offset = (pagina - 1) * limite;
    
    // Construir consulta SQL
    let query = 'SELECT * FROM anuncios WHERE visible = 1 AND estado_moderacion = "approved"';
    let params = [];
    
    if (req.query.categoria) {
      query += ' AND categoria = ?';
      params.push(req.query.categoria);
    }
    
    if (req.query.buscar) {
      query += ' AND (titulo LIKE ? OR descripcion LIKE ?)';
      const searchTerm = `%${req.query.buscar}%`;
      params.push(searchTerm, searchTerm);
    }
    
    query += ' ORDER BY creado_at DESC LIMIT ? OFFSET ?';
    params.push(limite, offset);
    
    // Ejecutar consulta
    const [anuncios] = await connection.execute(query, params);
    
    // Obtener total para paginación
    let countQuery = 'SELECT COUNT(*) as total FROM anuncios WHERE visible = 1 AND estado_moderacion = "approved"';
    let countParams = [];
    
    if (req.query.categoria) {
      countQuery += ' AND categoria = ?';
      countParams.push(req.query.categoria);
    }
    
    if (req.query.buscar) {
      countQuery += ' AND (titulo LIKE ? OR descripcion LIKE ?)';
      const searchTerm = `%${req.query.buscar}%`;
      countParams.push(searchTerm, searchTerm);
    }
    
    const [countResult] = await connection.execute(countQuery, countParams);
    const total = countResult[0].total;
    
    console.log(`✅ Sirviendo ${anuncios.length} anuncios de ${total} totales`);

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
    console.error('❌ Error procesando anuncios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener anuncios'
    });
  }
});

// Health check
app.get('/health', async (req, res) => {
  try {
    let dbStatus = 'disconnected';
    if (connection) {
      await connection.ping();
      dbStatus = 'connected';
    }
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      mode: 'SIMPLE-MYSQL2',
      database: dbStatus
    });
  } catch (error) {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      mode: 'SIMPLE-MYSQL2',
      database: 'disconnected'
    });
  }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor simple con MySQL2 corriendo en http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
  console.log('✅ Servidor simple con MySQL2 listo para recibir peticiones');
});
