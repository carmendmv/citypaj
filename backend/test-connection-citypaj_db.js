const mysql = require('mysql2/promise');

async function testCitypajDbConnection() {
  let connection;
  
  try {
    console.log('🔄 Probando conexión a citypaj_db...');
    
    // Conexión a la base de datos citypaj_db
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'citypaj_db'
    });
    
    console.log('✅ Conexión exitosa a citypaj_db');
    
    // Verificar que estamos en la base de datos correcta
    const [dbInfo] = await connection.execute('SELECT DATABASE() as current_db');
    console.log('📊 Base de datos actual:', dbInfo[0]);
    
    // Listar tablas en citypaj_db
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Tablas encontradas en citypaj_db:');
    if (tables.length === 0) {
      console.log('   • No hay tablas en la base de datos');
    } else {
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`   • ${tableName}`);
      });
    }
    
    // Probar una consulta simple
    const [testQuery] = await connection.execute('SELECT 1 as test_connection');
    console.log('✅ Consulta de prueba exitosa:', testQuery[0]);
    
    console.log('\n🎉 Conexión a citypaj_db verificada correctamente');
    
  } catch (error) {
    console.error('❌ Error conectando a citypaj_db:', error.message);
    console.error('Detalles del error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar la prueba
testCitypajDbConnection();
