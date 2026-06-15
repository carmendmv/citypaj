const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

console.log('🔧 Iniciando backend mínimo funcional...');

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

// Endpoint de prueba
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
    console.error('Error en /test-db:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint de anuncios
app.get('/api/anuncios', async (req, res) => {
  try {
    console.log('🔄 Obteniendo anuncios...');
    
    const connection = await getDBConnection();
    
    try {
      // Consulta simple y directa
      const [anuncios] = await connection.execute(
        'SELECT id, titulo, descripcion, categoria, precio FROM anuncios WHERE visible = 1 ORDER BY creado_at DESC LIMIT 12'
      );
      
      // Conteo total
      const [countResult] = await connection.execute(
        'SELECT COUNT(*) as total FROM anuncios WHERE visible = 1'
      );
      
      const total = countResult[0].total;
      
      console.log(`✅ Consulta ejecutada: ${anuncios.length} anuncios de ${total} totales`);

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

    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Error en /api/anuncios:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Iniciar servidor
const server = app.listen(3005, () => {
  console.log('🚀 CityPAJ Backend MÍNIMO running on port 3005');
  console.log('📊 Endpoints disponibles:');
  console.log('  GET  /test-db - Test MySQL connection');
  console.log('  GET  /api/anuncios - Anuncios simples');
  console.log('');
  console.log('✅ Backend mínimo listo para conectar con frontend');
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

console.log('📍 Servidor iniciado, esperando conexiones...');
