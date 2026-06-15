const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

console.log('🔧 Iniciando backend de diagnóstico final...');

// Endpoint básico de prueba
app.get('/', (req, res) => {
  console.log('📡 Endpoint / solicitado');
  res.json({ 
    message: 'CityPAJ Backend Debug - Funcionando', 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Test de conexión MySQL con diagnóstico completo
app.get('/test-db', async (req, res) => {
  try {
    console.log('🔄 Iniciando conexión a MySQL...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'citypaj_db'
    });
    
    console.log('✅ MySQL conectado exitosamente');
    
    const [result] = await connection.execute('SELECT COUNT(*) as total FROM usuarios');
    console.log('✅ Consulta usuarios ejecutada:', result[0].total);
    
    await connection.end();
    console.log('✅ Conexión cerrada correctamente');
    
    res.json({
      success: true,
      message: 'MySQL connection working perfectly',
      users: result[0].total,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error detallado en /test-db:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint de anuncios con diagnóstico
app.get('/api/anuncios', async (req, res) => {
  try {
    console.log('🔄 Iniciando /api/anuncios...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'citypaj_db'
    });
    
    console.log('✅ Conexión establecida para anuncios');
    
    // Consulta simple
    const [anuncios] = await connection.execute(
      'SELECT id, titulo, descripcion, categoria, precio FROM anuncios WHERE visible = 1 ORDER BY creado_at DESC LIMIT 12'
    );
    
    console.log('✅ Consulta anuncios ejecutada:', anuncios.length, 'resultados');
    
    // Conteo
    const [countResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM anuncios WHERE visible = 1'
    );
    
    const total = countResult[0].total;
    console.log('✅ Conteo total:', total);
    
    await connection.end();
    console.log('✅ Conexión cerrada');
    
    res.json({
      success: true,
      data: {
        anuncios,
        pagination: {
          page: 1,
          limit: 12,
          total,
          totalPages: Math.ceil(total / 12)
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error detallado en /api/anuncios:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      stack: error.stack
    });
    
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    });
  }
});

// Iniciar servidor con manejo de errores completo
const server = app.listen(3005, () => {
  console.log('🚀 CityPAJ Backend DEBUG running on port 3005');
  console.log('📊 Endpoints disponibles:');
  console.log('  GET  / - Test básico');
  console.log('  GET  /test-db - Test MySQL con diagnóstico');
  console.log('  GET  /api/anuncios - Anuncios con diagnóstico');
  console.log('');
  console.log('✅ Backend de diagnóstico listo');
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

console.log('📍 Servidor de diagnóstico iniciado');
