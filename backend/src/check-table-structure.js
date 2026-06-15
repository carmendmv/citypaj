const mysql = require('mysql2/promise');

async function checkTableStructure() {
  console.log('🔍 Verificando estructura de la tabla anuncios...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión exitosa');
    
    // Obtener estructura de la tabla anuncios
    const [columns] = await connection.execute('DESCRIBE anuncios');
    console.log('📋 Columnas de la tabla anuncios:');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} (${col.Null === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    
    // Obtener algunas estadísticas
    const [stats] = await connection.execute('SELECT COUNT(*) as total FROM anuncios');
    console.log(`📊 Total de anuncios: ${stats[0].total}`);
    
    // Obtener distribución por categorías
    const [categories] = await connection.execute('SELECT categoria, COUNT(*) as count FROM anuncios GROUP BY categoria');
    console.log('📈 Distribución por categorías:');
    categories.forEach(cat => {
      console.log(`   - ${cat.categoria}: ${cat.count} anuncios`);
    });
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTableStructure();
