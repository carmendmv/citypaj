const mysql = require('mysql2/promise');

async function checkTableStructure() {
  console.log('🔍 Verificando estructura actual de la tabla anuncios...');
  
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
    console.log('📋 Columnas actuales de la tabla anuncios:');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} (${col.Null === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    
    // Verificar si existen las columnas geográficas
    const columnNames = columns.map(col => col.Field);
    console.log('\n🔍 Verificando columnas geográficas:');
    console.log(`   - comunidad_autonoma: ${columnNames.includes('comunidad_autonoma') ? '✅' : '❌'}`);
    console.log(`   - provincia: ${columnNames.includes('provincia') ? '✅' : '❌'}`);
    console.log(`   - comunidad_id: ${columnNames.includes('comunidad_id') ? '✅' : '❌'}`);
    console.log(`   - provincia_id: ${columnNames.includes('provincia_id') ? '✅' : '❌'}`);
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTableStructure();
