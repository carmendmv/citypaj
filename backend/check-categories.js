const mysql = require('mysql2/promise');

async function checkCategories() {
  console.log('🔍 Verificando categorías de anuncios...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión exitosa');
    
    // Obtener distribución por categorías
    const [categories] = await connection.execute(`
      SELECT categoria, COUNT(*) as count 
      FROM anuncios 
      GROUP BY categoria 
      ORDER BY count DESC
    `);
    
    console.log('📊 Distribución por categorías:');
    categories.forEach(cat => {
      console.log(`   - ${cat.categoria}: ${cat.count} anuncios`);
    });
    
    // Verificar categorías esperadas
    const expectedCategories = ['ocio', 'servicios', 'formacion', 'empleo', 'comunidad', 'transporte', 'vivienda', 'salud', 'tecnología', 'otros'];
    const foundCategories = categories.map(cat => cat.categoria);
    
    console.log('📈 Verificación de categorías esperadas:');
    expectedCategories.forEach(expected => {
      const found = foundCategories.includes(expected);
      const count = categories.find(cat => cat.categoria === expected)?.count || 0;
      console.log(`   - ${expected}: ${found ? '✅' : '❌'} (${count} anuncios)`);
    });
    
    // Verificar estructura del ENUM
    const [enumInfo] = await connection.execute(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'citypaj' 
      AND TABLE_NAME = 'anuncios' 
      AND COLUMN_NAME = 'categoria'
    `);
    
    if (enumInfo.length > 0) {
      console.log('📋 Estructura del ENUM categoria:');
      console.log(`   - ${enumInfo[0].COLUMN_TYPE}`);
    }
    
    await connection.end();
    console.log('✅ Verificación de categorías completada');
    
  } catch (error) {
    console.error('❌ Error verificando categorías:', error.message);
  }
}

checkCategories();
