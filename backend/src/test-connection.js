const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Probando conexión a la base de datos...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión exitosa');
    
    // Probar consulta simple
    const [result] = await connection.execute('SELECT COUNT(*) as total FROM anuncios');
    console.log(`📊 Total de anuncios en la base de datos: ${result[0].total}`);
    
    // Probar consulta de anuncios
    const [anuncios] = await connection.execute('SELECT * FROM anuncios LIMIT 5');
    console.log('📝 Primeros 5 anuncios:');
    anuncios.forEach(anuncio => {
      console.log(`   - ${anuncio.titulo} (${anuncio.categoria})`);
    });
    
    await connection.end();
    console.log('✅ Prueba completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la conexión:', error.message);
  }
}

testConnection();
