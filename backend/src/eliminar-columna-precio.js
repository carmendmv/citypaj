const mysql = require('mysql2/promise');

async function removePriceColumn() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('🔧 Eliminando columna precio de la tabla anuncios...');
    
    // Verificar si la columna existe
    const [columns] = await connection.execute(`
      DESCRIBE anuncios
    `);
    
    const priceColumn = columns.find(col => col.Field === 'precio');
    
    if (priceColumn) {
      console.log('✅ Columna precio encontrada, eliminando...');
      
      // Eliminar la columna
      await connection.execute(`
        ALTER TABLE anuncios DROP COLUMN precio
      `);
      
      console.log('✅ Columna precio eliminada exitosamente');
    } else {
      console.log('ℹ️  La columna precio no existe en la tabla');
    }
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error eliminando columna precio:', error.message);
  }
}

removePriceColumn();
