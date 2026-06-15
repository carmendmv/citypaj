const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Probando conexión con citypaj_user...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión exitosa con citypaj_user');
    
    // Probar consulta
    const [rows] = await connection.execute('SELECT COUNT(*) as total FROM anuncios');
    console.log(`📊 Total de anuncios: ${rows[0].total}`);
    
    // Probar obtener algunos anuncios
    const [anuncios] = await connection.execute('SELECT id, titulo, categoria FROM anuncios LIMIT 3');
    console.log('📝 Ejemplos de anuncios:');
    anuncios.forEach(anuncio => {
      console.log(`  - ${anuncio.id}: ${anuncio.titulo} (${anuncio.categoria})`);
    });
    
    await connection.end();
    console.log('🎉 Prueba completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la conexión:', error.message);
    process.exit(1);
  }
}

testConnection();
