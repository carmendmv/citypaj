const mysql = require('mysql2/promise');

async function checkTableStructure() {
  let connection;
  
  try {
    console.log('🔄 Conectando a citypaj_db para verificar estructura de tablas...');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'citypaj_db'
    });
    
    console.log('✅ Conexión exitosa a citypaj_db');
    
    // Verificar estructura de la tabla anuncios
    const [anunciosStructure] = await connection.execute('DESCRIBE anuncios');
    console.log('\n📋 Estructura de la tabla anuncios:');
    anunciosStructure.forEach(column => {
      console.log(`   • ${column.Field}: ${column.Type} ${column.Null === 'NO' ? '(NOT NULL)' : '(NULL)'} ${column.Key ? `(${column.Key})` : ''}`);
    });
    
    // Verificar algunas filas de ejemplo
    const [sampleData] = await connection.execute('SELECT * FROM anuncios LIMIT 3');
    console.log('\n📄 Datos de ejemplo de anuncios:');
    sampleData.forEach((row, index) => {
      console.log(`   Fila ${index + 1}:`, row);
    });
    
    // Verificar todas las tablas
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('\n📊 Todas las tablas en citypaj_db:');
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   • ${tableName}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

checkTableStructure();
