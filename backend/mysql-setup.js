const mysql = require('mysql2/promise');

async function setupMySQL() {
  let connection;
  
  try {
    console.log('🔧 Configurando MySQL para CityPAJ...');
    
    // Intentar conectar como root con diferentes configuraciones
    const rootConfigs = [
      { host: 'localhost', port: 3306, user: 'root', password: '' },
      { host: '127.0.0.1', port: 3306, user: 'root', password: '' },
      { host: 'localhost', port: 3306, user: 'root', password: 'root' },
      { host: '127.0.0.1', port: 3306, user: 'root', password: 'root' }
    ];

    let rootConnection = null;
    for (const config of rootConfigs) {
      try {
        console.log(`🔄 Intentando conectar como root: ${config.user}@${config.host}:${config.port}`);
        rootConnection = await mysql.createConnection(config);
        console.log('✅ Conexión root establecida');
        break;
      } catch (error) {
        console.log(`❌ Fallo: ${error.code}`);
        continue;
      }
    }

    if (!rootConnection) {
      throw new Error('No se pudo conectar a MySQL como root con ninguna configuración');
    }

    // Verificar si citypaj_db existe
    console.log('🔍 Verificando base de datos citypaj_db...');
    const [databases] = await rootConnection.execute('SHOW DATABASES LIKE "citypaj_db"');
    
    if (databases.length === 0) {
      console.log('❌ La base de datos citypaj_db no existe');
      console.log('📋 Bases de datos disponibles:');
      const [allDatabases] = await rootConnection.execute('SHOW DATABASES');
      allDatabases.forEach(db => console.log(`  - ${db.Database}`));
      throw new Error('Base de datos citypaj_db no encontrada');
    }
    
    console.log('✅ Base de datos citypaj_db encontrada');

    // Crear usuario citypaj_user
    console.log('👤 Creando usuario citypaj_user...');
    
    try {
      await rootConnection.execute("DROP USER IF EXISTS 'citypaj_user'@'localhost'");
      await rootConnection.execute("DROP USER IF EXISTS 'citypaj_user'@'%'");
    } catch (error) {
      console.log('🔄 Usuario no existía, continuando...');
    }

    await rootConnection.execute(
      "CREATE USER 'citypaj_user'@'localhost' IDENTIFIED BY 'citypaj_password'"
    );
    
    await rootConnection.execute(
      "CREATE USER 'citypaj_user'@'%' IDENTIFIED BY 'citypaj_password'"
    );

    // Otorgar permisos
    console.log('🔐 Otorgando permisos a citypaj_user...');
    await rootConnection.execute(
      "GRANT ALL PRIVILEGES ON citypaj_db.* TO 'citypaj_user'@'localhost'"
    );
    
    await rootConnection.execute(
      "GRANT ALL PRIVILEGES ON citypaj_db.* TO 'citypaj_user'@'%'"
    );

    await rootConnection.execute('FLUSH PRIVILEGES');

    // Probar conexión con el nuevo usuario
    console.log('🧪 Probando conexión con citypaj_user...');
    await rootConnection.end();
    
    const testConnection = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'citypaj_user',
      password: 'citypaj_password',
      database: 'citypaj_db'
    });

    const [result] = await testConnection.execute('SELECT DATABASE() as current_db');
    console.log(`✅ Base de datos actual: ${result[0].current_db}`);

    const [tables] = await testConnection.execute('SHOW TABLES');
    console.log(`📋 Tablas encontradas: ${tables.length}`);
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`  - ${tableName}`);
    });

    if (tables.length > 0) {
      const [count] = await testConnection.execute('SELECT COUNT(*) as total FROM anuncios');
      console.log(`📊 Anuncios en citypaj_db: ${count[0].total}`);
    }

    await testConnection.end();
    
    console.log('🎉 MySQL configurado exitosamente para CityPAJ');
    console.log('📝 Usuario: citypaj_user');
    console.log('📝 Contraseña: citypaj_password');
    console.log('📝 Base de datos: citypaj_db');
    
  } catch (error) {
    console.error('❌ Error en la configuración de MySQL:', error.message);
    if (error.code) {
      console.error('❌ Código MySQL:', error.code);
    }
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

setupMySQL();
