const mysql = require('mysql2/promise');

async function testDirectConnection() {
  console.log('🔍 Probando conexión directa a MySQL...');
  
  try {
    // Conexión directa sin especificar base de datos
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: ''
    });
    
    console.log('✅ Conexión directa exitosa como root');
    
    // Listar bases de datos
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log('📋 Bases de datos disponibles:');
    databases.forEach(db => {
      console.log(`   - ${db.Database}`);
    });
    
    // Verificar si citypaj existe
    const [citypajCheck] = await connection.execute('SHOW DATABASES LIKE "citypaj"');
    if (citypajCheck.length > 0) {
      console.log('✅ Base de datos citypaj encontrada');
      
      // Conectar a citypaj
      await connection.execute('USE citypaj');
      
      // Verificar tablas
      const [tables] = await connection.execute('SHOW TABLES');
      console.log('📋 Tablas en citypaj:');
      tables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
      
      // Verificar estructura de anuncios
      const [columns] = await connection.execute('DESCRIBE anuncios');
      console.log('📋 Columnas de la tabla anuncios:');
      columns.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type}`);
      });
      
    } else {
      console.log('❌ Base de datos citypaj no encontrada');
    }
    
    await connection.end();
    console.log('✅ Prueba de conexión directa completada');
    
  } catch (error) {
    console.error('❌ Error en la conexión directa:', error.message);
  }
}

testDirectConnection();
