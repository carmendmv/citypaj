const mysql = require('mysql2/promise');

async function fixUser() {
  console.log('🔧 Arreglando usuario citypaj_user...');
  
  let connection = null;
  
  // Intentar conectar como root sin contraseña primero
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });
    console.log('✅ Conexión exitosa como root');
  } catch (error) {
    console.log('❌ Error conectando como root sin contraseña:', error.message);
    
    // Intentar con otras contraseñas comunes
    const passwords = ['root', 'password', 'mysql', '123456', 'noalumno'];
    
    for (const pwd of passwords) {
      try {
        connection = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: pwd
        });
        console.log(`✅ Conexión exitosa como root con contraseña: ${pwd}`);
        break;
      } catch (e) {
        continue;
      }
    }
    
    if (!connection) {
      console.log('❌ No se pudo conectar a MySQL con ninguna contraseña');
      process.exit(1);
    }
  }
  
  try {
    // Eliminar el usuario si existe
    try {
      await connection.query("DROP USER IF EXISTS 'citypaj_user'@'localhost'");
      console.log('🗑️  Usuario citypaj_user eliminado si existía');
    } catch (error) {
      console.log('ℹ️  El usuario no existía o error al eliminar:', error.message);
    }
    
    // Crear el usuario nuevamente
    await connection.query("CREATE USER 'citypaj_user'@'localhost' IDENTIFIED BY 'citypaj123'");
    console.log('✅ Usuario citypaj_user creado');
    
    // Conceder todos los privilegios
    await connection.query('GRANT ALL PRIVILEGES ON citypaj.* TO \'citypaj_user\'@\'localhost\'');
    console.log('✅ Privilegios concedidos');
    
    // Actualizar privilegios
    await connection.query('FLUSH PRIVILEGES');
    console.log('✅ Privilegios actualizados');
    
    // Probar la conexión con el nuevo usuario
    await connection.end();
    
    const testConnection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    const [rows] = await testConnection.execute('SELECT COUNT(*) as total FROM anuncios');
    console.log(`📊 Total de anuncios en citypaj: ${rows[0].total}`);
    
    await testConnection.end();
    
    console.log('🎉 Usuario citypaj_user configurado correctamente');
    
  } catch (error) {
    console.error('❌ Error configurando usuario:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

fixUser();
