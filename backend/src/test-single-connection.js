const mysql = require('mysql2/promise');

async function testSingleConnection() {
  console.log('🔍 Probando conexión única sin pool...');
  
  try {
    // Conexión directa sin pool
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión única exitosa');
    
    // Probar consulta simple
    const [result] = await connection.execute('SELECT COUNT(*) as total FROM anuncios');
    console.log(`📊 Total de anuncios: ${result[0].total}`);
    
    // Probar consulta compleja
    const [anuncios] = await connection.execute(`
      SELECT anuncios.id, anuncios.titulo, anuncios.categoria, usuarios.nombre as usuario_nombre
      FROM anuncios
      LEFT JOIN usuarios ON anuncios.usuario_id = usuarios.id
      WHERE anuncios.visible = 1 AND anuncios.estado_moderacion = 'approved'
      ORDER BY anuncios.id DESC
      LIMIT 3
    `);
    
    console.log('📝 Ejemplos de anuncios:');
    anuncios.forEach(anuncio => {
      console.log(`  - ${anuncio.id}: ${anuncio.titulo} (${anuncio.categoria}) - ${anuncio.usuario_nombre}`);
    });
    
    await connection.end();
    
    console.log('🎉 Prueba de conexión única completada exitosamente');
    return true;
    
  } catch (error) {
    console.error('❌ Error en conexión única:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
}

testSingleConnection().then(success => {
  if (success) {
    console.log('\n✅ La conexión funciona correctamente');
    console.log('💡 El problema debe estar en el servidor Express');
  } else {
    console.log('\n❌ Hay un problema fundamental con la conexión');
  }
});
