const mysql = require('mysql2/promise');

async function checkTableStructure() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('🔍 Verificando estructura de la tabla anuncios...');
    
    // Obtener estructura de la tabla anuncios
    const [columns] = await connection.execute(`
      DESCRIBE anuncios
    `);
    
    console.log('\n📋 Columnas de la tabla anuncios:');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} (${col.Null === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    
    // Verificar si existe la columna usuario_id
    const usuarioIdColumn = columns.find(col => col.Field === 'usuario_id');
    
    if (usuarioIdColumn) {
      console.log('\n✅ Columna usuario_id encontrada');
    } else {
      console.log('\n❌ Columna usuario_id NO encontrada');
      
      // Buscar columnas similares
      const similarColumns = columns.filter(col => 
        col.Field.toLowerCase().includes('usuario') || 
        col.Field.toLowerCase().includes('user')
      );
      
      if (similarColumns.length > 0) {
        console.log('🔍 Columnas similares encontradas:');
        similarColumns.forEach(col => {
          console.log(`   - ${col.Field}: ${col.Type}`);
        });
      }
    }
    
    // Mostrar algunas filas de ejemplo
    console.log('\n📊 Muestra de datos (primeras 3 filas):');
    const [rows] = await connection.execute(`
      SELECT * FROM anuncios LIMIT 3
    `);
    
    rows.forEach((row, index) => {
      console.log(`\nFila ${index + 1}:`);
      Object.keys(row).forEach(key => {
        console.log(`   ${key}: ${row[key]}`);
      });
    });
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTableStructure();
