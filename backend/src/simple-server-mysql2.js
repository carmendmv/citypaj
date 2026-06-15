const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors({
  origin: ['http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));

// Pool de conexiones MySQL2
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  database: 'citypaj',
  user: 'citypaj_user',
  password: 'citypaj123',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('🔍 Configuración de base de datos MySQL2:');
console.log('  - Host: localhost');
console.log('  - Database: citypaj');
console.log('  - User: citypaj_user');
console.log('  - Password: citypaj123');

// Endpoint principal de anuncios
app.get('/api/anuncios', async (req, res) => {
  let connection;
  try {
    console.log('📊 Obteniendo anuncios con MySQL2...');
    
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const offset = (pagina - 1) * limite;

    connection = await pool.getConnection();
    
    // Obtener anuncios
    const [anuncios] = await connection.execute(`
      SELECT 
        anuncios.*,
        usuarios.nombre as usuario_nombre,
        usuarios.email as email
      FROM anuncios
      LEFT JOIN usuarios ON anuncios.usuario_id = usuarios.id
      WHERE anuncios.visible = 1 AND anuncios.estado_moderacion = 'approved'
      ORDER BY anuncios.id DESC
      LIMIT ? OFFSET ?
    `, [limite, offset]);

    // Obtener total
    const [totalResult] = await connection.execute(`
      SELECT COUNT(*) as total
      FROM anuncios
      LEFT JOIN usuarios ON anuncios.usuario_id = usuarios.id
      WHERE anuncios.visible = 1 AND anuncios.estado_moderacion = 'approved'
    `);

    const total = totalResult[0].total;

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
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Endpoint de detalle de anuncio
app.get('/api/anuncios/:id', async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    
    connection = await pool.getConnection();
    
    const [anuncios] = await connection.execute(`
      SELECT 
        anuncios.*,
        usuarios.nombre as usuario_nombre,
        usuarios.email as email
      FROM anuncios
      LEFT JOIN usuarios ON anuncios.usuario_id = usuarios.id
      WHERE anuncios.id = ? AND anuncios.visible = 1 AND anuncios.estado_moderacion = 'approved'
    `, [id]);
    
    const anuncio = anuncios[0];
    
    if (!anuncio) {
      return res.status(404).json({
        success: false,
        error: 'Anuncio no encontrado'
      });
    }

    res.json({
      success: true,
      data: anuncio
    });

  } catch (error) {
    console.error('❌ Error obteniendo anuncio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener anuncio',
      details: error.message
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor MySQL2 corriendo en http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`📝 Anuncios endpoints: http://0.0.0.0:${PORT}/api/anuncios`);
});
