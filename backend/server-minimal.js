const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

console.log('🔧 Iniciando servidor MINIMAL de CityPAJ...');

// Test básico
app.get('/', (req, res) => {
  console.log('📡 Endpoint / solicitado');
  res.json({ message: 'CityPAJ Backend Minimal - Funcionando', status: 'OK' });
});

// Test MySQL simple
app.get('/test-db', async (req, res) => {
  console.log('📡 Endpoint /test-db solicitado');
  try {
    console.log('🔄 Intentando conectar a MySQL...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'citypaj_db'
    });
    
    console.log('✅ MySQL conectado');
    
    const [result] = await connection.execute('SELECT COUNT(*) as total FROM usuarios');
    await connection.end();
    
    console.log('✅ Consulta exitosa:', result[0].total, 'usuarios');
    
    res.json({
      success: true,
      message: 'MySQL connection working',
      users: result[0].total
    });
  } catch (error) {
    console.error('❌ Error en MySQL:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Iniciar servidor
const server = app.listen(3002, () => {
  console.log('🚀 CityPAJ Backend Minimal running on port 3002');
  console.log('✅ Servidor minimal listo');
});

server.on('error', (error) => {
  console.error('❌ Error del servidor:', error.message);
});

console.log('📍 Servidor iniciado, esperando conexiones...');
