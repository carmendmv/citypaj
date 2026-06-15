const mysql = require('mysql2/promise');

async function checkCategories() {
  let connection;
  
  try {
    console.log('🔄 Verificando categorías en citypaj_db...');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'citypaj_db'
    });
    
    // Verificar categorías disponibles en la base de datos
    const [categories] = await connection.execute('SELECT DISTINCT categoria FROM anuncios ORDER BY categoria');
    console.log('\n📋 Categorías en la base de datos citypaj_db:');
    categories.forEach(row => {
      console.log(`   • ${row.categoria}`);
    });
    
    // Contar anuncios por categoría
    const [categoryCounts] = await connection.execute(`
      SELECT categoria, COUNT(*) as count 
      FROM anuncios 
      WHERE visible = 1 AND estado_moderacion = 'approved'
      GROUP BY categoria 
      ORDER BY count DESC
    `);
    console.log('\n📊 Anuncios por categoría (visibles y aprobados):');
    categoryCounts.forEach(row => {
      console.log(`   • ${row.categoria}: ${row.count} anuncios`);
    });
    
    // Verificar si existe la categoría 'ocio'
    const [ocioCheck] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM anuncios 
      WHERE categoria = 'ocio' AND visible = 1 AND estado_moderacion = 'approved'
    `);
    console.log(`\n🔍 Categoría 'ocio' encontrada: ${ocioCheck[0].count} anuncios`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkCategories();
