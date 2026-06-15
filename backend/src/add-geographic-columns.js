const mysql = require('mysql2/promise');

async function addGeographicColumns() {
  console.log('🗺️ Agregando columnas geográficas a la tabla anuncios...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión exitosa');
    
    // Agregar columnas si no existen
    try {
      await connection.execute(`
        ALTER TABLE anuncios 
        ADD COLUMN comunidad_autonoma VARCHAR(100) AFTER provincia_id
      `);
      console.log('✅ Columna comunidad_autonoma agregada');
    } catch (error) {
      console.log('ℹ️  La columna comunidad_autonoma ya existe o error:', error.message);
    }
    
    try {
      await connection.execute(`
        ALTER TABLE anuncios 
        ADD COLUMN provincia VARCHAR(100) AFTER comunidad_autonoma
      `);
      console.log('✅ Columna provincia agregada');
    } catch (error) {
      console.log('ℹ️  La columna provincia ya existe o error:', error.message);
    }
    
    // Verificar estructura final
    const [columns] = await connection.execute('DESCRIBE anuncios');
    console.log('\n📋 Estructura final de la tabla:');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type}`);
    });
    
    await connection.end();
    
    console.log('\n✅ Columnas geográficas agregadas exitosamente');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addGeographicColumns();
