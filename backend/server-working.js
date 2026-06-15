const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log('🔧 Iniciando backend funcional...');

// Endpoint básico
app.get('/', (req, res) => {
  console.log('📡 Petición a /');
  res.json({ 
    message: 'CityPAJ Backend Working', 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Test MySQL
app.get('/test-db', async (req, res) => {
  try {
    console.log('🔄 Conectando a MySQL...');
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'citypaj_db'
    });
    
    const [result] = await connection.execute('SELECT COUNT(*) as total FROM usuarios');
    await connection.end();
    
    console.log('✅ MySQL OK - Usuarios:', result[0].total);
    
    res.json({
      success: true,
      message: 'MySQL connection working',
      users: result[0].total
    });
  } catch (error) {
    console.error('❌ MySQL Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Anuncios
app.get('/api/anuncios', async (req, res) => {
  try {
    console.log('🔄 Obteniendo anuncios...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'citypaj_db'
    });
    
    const [anuncios] = await connection.execute(
      'SELECT id, titulo, descripcion, categoria, precio FROM anuncios WHERE visible = 1 ORDER BY creado_at DESC LIMIT 12'
    );
    
    const [countResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM anuncios WHERE visible = 1'
    );
    
    const total = countResult[0].total;
    
    await connection.end();
    
    console.log(`✅ Anuncios obtenidos: ${anuncios.length} de ${total} totales`);
    
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
      }
    });
  } catch (error) {
    console.error('❌ Anuncios Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Iniciar servidor
const PORT = 3005;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CityPAJ Backend WORKING running on port ${PORT}`);
  console.log(`📊 Endpoints disponibles:`);
  console.log(`  GET  http://localhost:${PORT}/ - Test básico`);
  console.log(`  GET  http://localhost:${PORT}/test-db - Test MySQL`);
  console.log(`  GET  http://localhost:${PORT}/api/anuncios - Anuncios`);
  console.log('');
  console.log('✅ Backend funcional listo');
});

console.log('📍 Iniciando servidor...');
