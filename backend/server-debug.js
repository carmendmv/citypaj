const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

console.log('🔧 Iniciando servidor debug de CityPAJ...');

// Test básico primero
app.get('/', (req, res) => {
  console.log('📡 Endpoint / solicitado');
  res.json({ message: 'CityPAJ Backend Debug - Funcionando', status: 'OK' });
});

// Test de conexión MySQL
app.get('/test-db', async (req, res) => {
  console.log('📡 Endpoint /test-db solicitado');
  try {
    console.log('🔄 Conectando a MySQL...');
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'citypaj_db'
    });
    
    console.log('✅ MySQL conectado, ejecutando consulta...');
    const [result] = await connection.execute('SELECT COUNT(*) as total FROM usuarios');
    await connection.end();
    
    console.log('✅ Consulta exitosa, usuarios:', result[0].total);
    
    res.json({
      success: true,
      message: 'MySQL connection working',
      users: result[0].total
    });
  } catch (error) {
    console.error('❌ Error en /test-db:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test de anuncios simple
app.get('/api/anuncios', async (req, res) => {
  console.log('📡 Endpoint /api/anuncios solicitado');
  try {
    console.log('🔄 Conectando a MySQL para anuncios...');
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'citypaj_db'
    });
    
    const limit = parseInt(req.query.limit) || 5;
    console.log('📊 Consultando', limit, 'anuncios...');
    
    const [anuncios] = await connection.execute(
      'SELECT id, titulo, descripcion FROM anuncios WHERE visible = 1 LIMIT ?',
      [limit]
    );
    
    await connection.end();
    
    console.log('✅ Anuncios consultados:', anuncios.length);
    
    res.json({
      success: true,
      data: {
        anuncios: anuncios,
        pagination: {
          total: 913,
          page: 1,
          limit: limit
        }
      }
    });
  } catch (error) {
    console.error('❌ Error en /api/anuncios:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Iniciar servidor con manejo de errores
const server = app.listen(3002, () => {
  console.log('🚀 CityPAJ Backend Debug running on port 3002');
  console.log('📊 Endpoints disponibles:');
  console.log('  GET  / - Test básico');
  console.log('  GET  /test-db - Test MySQL');
  console.log('  GET  /api/anuncios - Anuncios simple');
  console.log('');
  console.log('✅ Servidor listo para pruebas');
});

server.on('error', (error) => {
  console.error('❌ Error del servidor:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});
