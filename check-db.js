const mysql = require('mysql2/promise');

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: ''
    });
    
    console.log('🔍 Analizando estructura y datos de citypaj_db:');
    
    // Verificar estructura de tablas principales
    const tables = ['usuarios', 'anuncios', 'favoritos', 'reportes_anuncios', 'sugerencias'];
    
    for (const table of tables) {
      try {
        const [structure] = await connection.execute(`DESCRIBE ${table}`);
        console.log(`\n📋 Estructura de ${table}:`);
        structure.forEach(col => console.log(`  - ${col.Field}: ${col.Type}`));
        
        const [count] = await connection.execute(`SELECT COUNT(*) as total FROM ${table}`);
        console.log(`  📊 Total registros: ${count[0].total}`);
        
        if (count[0].total > 0 && count[0].total <= 3) {
          const [sample] = await connection.execute(`SELECT * FROM ${table} LIMIT 3`);
          console.log('  📄 Muestra de datos:');
          sample.forEach(row => console.log('    ', JSON.stringify(row, null, 2)));
        }
      } catch (error) {
        console.log(`  ❌ Error en tabla ${table}:`, error.message);
      }
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();
