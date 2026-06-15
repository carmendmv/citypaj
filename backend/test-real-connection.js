const mysql = require('mysql2/promise');

async function testRealConnection() {
  console.log('🔍 Probando conexión real a la base de datos citypaj...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión exitosa a la base de datos citypaj');
    
    // Probar consulta de usuarios
    const [users] = await connection.execute('SELECT COUNT(*) as total FROM usuarios');
    console.log(`👥 Total de usuarios: ${users[0].total}`);
    
    // Probar consulta de anuncios
    const [anuncios] = await connection.execute('SELECT COUNT(*) as total FROM anuncios');
    console.log(`📊 Total de anuncios: ${anuncios[0].total}`);
    
    // Probar consulta con JOIN
    const [result] = await connection.execute(`
      SELECT a.titulo, a.categoria, u.nombre as usuario 
      FROM anuncios a 
      JOIN usuarios u ON a.usuario_id = u.id 
      LIMIT 5
    `);
    console.log('📝 Anuncios con usuarios:');
    result.forEach(row => {
      console.log(`   - ${row.titulo} (${row.categoria}) por ${row.usuario}`);
    });
    
    // Probar consulta de categorías
    const [categories] = await connection.execute('SELECT categoria, COUNT(*) as count FROM anuncios GROUP BY categoria');
    console.log('📈 Distribución por categorías:');
    categories.forEach(cat => {
      console.log(`   - ${cat.categoria}: ${cat.count} anuncios`);
    });
    
    await connection.end();
    console.log('✅ Prueba de conexión real completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la conexión real:', error.message);
  }
}

testRealConnection();
