const mysql = require('mysql2/promise');

async function dropOldDatabase() {
  console.log('🗑️ Eliminando base de datos citypaj_db...');
  
  try {
    // Conectar como root para poder eliminar la base de datos
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '' // Sin contraseña para root en el entorno local
    });
    
    console.log('✅ Conexión exitosa como root');
    
    // Eliminar la base de datos citypaj_db si existe
    await connection.execute('DROP DATABASE IF EXISTS citypaj_db');
    console.log('✅ Base de datos citypaj_db eliminada exitosamente');
    
    // Mostrar información de la base de datos actual
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log('\n📊 Bases de datos disponibles:');
    databases.forEach(db => {
      console.log(`   - ${db.Database}`);
    });
    
    // Verificar que citypaj existe y mostrar su información
    const [citypajInfo] = await connection.execute('SHOW DATABASES LIKE "citypaj"');
    if (citypajInfo.length > 0) {
      console.log('\n✅ Base de datos citypaj encontrada');
      
      // Conectar a citypaj para mostrar información
      await connection.execute('USE citypaj');
      
      // Mostrar tablas
      const [tables] = await connection.execute('SHOW TABLES');
      console.log('\n📋 Tablas en citypaj:');
      tables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
      
      // Mostrar usuarios
      const [users] = await connection.execute("SELECT User, Host FROM mysql.user WHERE User LIKE '%citypaj%' OR User = 'root'");
      console.log('\n👥 Usuarios relacionados:');
      users.forEach(user => {
        console.log(`   - ${user.User}@${user.Host}`);
      });
      
    } else {
      console.log('\n❌ Base de datos citypaj no encontrada');
    }
    
    await connection.end();
    
    console.log('\n🎉 Proceso completado');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

dropOldDatabase();
