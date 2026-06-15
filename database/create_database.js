const mysql = require('mysql2/promise');

async function createDatabase() {
  let connection;
  
  try {
    console.log('🔄 Conectando a MySQL sin especificar base de datos...');
    
    // Conexión sin especificar base de datos
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: ''
    });
    
    console.log('✅ Conexión exitosa a MySQL');
    
    // Crear la base de datos citypaj_db
    console.log('📦 Creando base de datos citypaj_db...');
    await connection.execute('CREATE DATABASE IF NOT EXISTS citypaj_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    
    console.log('✅ Base de datos citypaj_db creada exitosamente');
    
    // Verificar que la base de datos existe
    const [databases] = await connection.execute('SHOW DATABASES LIKE "citypaj_db"');
    
    if (databases.length > 0) {
      console.log('✅ Verificación: La base de datos citypaj_db existe');
    } else {
      console.log('❌ Error: La base de datos no se creó correctamente');
    }
    
    // Mostrar todas las bases de datos para verificación
    const [allDatabases] = await connection.execute('SHOW DATABASES');
    console.log('\n📋 Bases de datos disponibles:');
    allDatabases.forEach(db => {
      if (db.Database !== 'information_schema' && db.Database !== 'mysql' && db.Database !== 'performance_schema' && db.Database !== 'sys') {
        console.log(`   • ${db.Database}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error al crear la base de datos:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar el script
createDatabase();
