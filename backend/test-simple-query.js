const mysql = require('mysql2/promise');

async function testSimpleQuery() {
  console.log('🔍 Probando consulta simple a la base de datos...');
  
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
    console.log(`📊 Total de anuncios: ${result[0].total}`);
    
    // Probar consulta con límite
    const [anuncios] = await connection.execute('SELECT * FROM anuncios LIMIT 3');
    console.log('📝 Primeros 3 anuncios:');
    anuncios.forEach(anuncio => {
      console.log(`   - ${anuncio.titulo} (${anuncio.categoria})`);
    });
    
    await connection.end();
    console.log('✅ Prueba completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la consulta:', error.message);
  }
}

testSimpleQuery();
