const mysql = require('mysql2/promise');

async function testSimpleQuery() {
  let connection;
  
  try {
    console.log('🔄 Probando consulta simple a citypaj_db...');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'citypaj_db'
    });
    
    // Probar consulta simple sin filtros
    const [simpleQuery] = await connection.execute(`
      SELECT id, titulo, categoria 
      FROM anuncios 
      WHERE visible = 1 AND estado_moderacion = 'approved' 
      LIMIT 5
    `);
    console.log('✅ Consulta simple exitosa:');
    simpleQuery.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.titulo} (${row.categoria})`);
    });
    
    // Probar consulta con filtro de categoría
    const [categoriaQuery] = await connection.execute(`
      SELECT id, titulo, categoria 
      FROM anuncios 
      WHERE visible = 1 AND estado_moderacion = 'approved' 
      AND categoria = ?
      LIMIT 5
    `, ['ocio']);
    console.log(`\n✅ Consulta con categoría 'ocio': ${categoriaQuery.length} resultados`);
    categoriaQuery.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.titulo} (${row.categoria})`);
    });
    
  } catch (error) {
    console.error('❌ Error en consulta:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

testSimpleQuery();
