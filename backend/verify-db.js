const mysql = require('mysql2/promise');

async function verifyConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'citypaj_db'
  });
  try {
    const [result] = await connection.execute('SELECT COUNT(*) as total FROM anuncios WHERE visible = 1 AND estado_moderacion = "approved"');
    const [users] = await connection.execute('SELECT COUNT(*) as total FROM usuarios');
    const [sugerencias] = await connection.execute('SELECT COUNT(*) as total FROM sugerencias');
    const [comunidades] = await connection.execute('SELECT COUNT(DISTINCT comunidad_id) as total FROM anuncios WHERE visible = 1');
    
    console.log('=== VERIFICACIÓN DIRECTA BBDD ===');
    console.log('Anuncios:', result[0].total);
    console.log('Usuarios:', users[0].total);
    console.log('Sugerencias:', sugerencias[0].total);
    console.log('Comunidades con anuncios:', comunidades[0].total);
    console.log('==========================');
  } finally {
    await connection.end();
  }
}

verifyConnection().catch(console.error);
