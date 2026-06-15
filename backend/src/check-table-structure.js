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
    
    // Obtener algunos datos de ejemplo
    const [sample] = await connection.execute('SELECT * FROM anuncios LIMIT 1');
    if (sample.length > 0) {
      console.log('📝 Estructura de un anuncio de ejemplo:');
      console.log(JSON.stringify(sample[0], null, 2));
    }
    
    // Verificar columnas específicas
    const columnNames = columns.map(col => col.Field);
    console.log('🔍 Verificando columnas específicas:');
    console.log(`   - visible: ${columnNames.includes('visible') ? '✅' : '❌'}`);
    console.log(`   - estado_moderacion: ${columnNames.includes('estado_moderacion') ? '✅' : '❌'}`);
    console.log(`   - creado: ${columnNames.includes('creado') ? '✅' : '❌'}`);
    console.log(`   - creado_at: ${columnNames.includes('creado_at') ? '✅' : '❌'}`);
    console.log(`   - comunidad_autonoma: ${columnNames.includes('comunidad_autonoma') ? '✅' : '❌'}`);
    console.log(`   - provincia: ${columnNames.includes('provincia') ? '✅' : '❌'}`);
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTableStructure();
