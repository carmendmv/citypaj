const mysql = require('mysql2/promise');

async function diagnoseMysqlAccess() {
  console.log('🔍 Diagnosticando acceso a MySQL...');
  
  // Probar diferentes configuraciones de conexión
  const connectionConfigs = [
    {
      name: 'Root sin contraseña',
      config: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: ''
      }
    },
    {
      name: 'Root con contraseña vacía',
      config: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: ''
      }
    },
    {
      name: 'Usuario citypaj_user',
      config: {
        host: 'localhost',
        port: 3306,
        database: 'citypaj',
        user: 'citypaj_user',
        password: 'citypaj123'
      }
    },
    {
      name: 'Usuario citypaj_user sin base de datos',
      config: {
        host: 'localhost',
        port: 3306,
        user: 'citypaj_user',
        password: 'citypaj123'
      }
    }
  ];
  
  for (const { name, config } of connectionConfigs) {
    console.log(`\n🔍 Probando: ${name}`);
    
    try {
      const connection = await mysql.createConnection(config);
      console.log(`✅ Conexión exitosa`);
      
      // Si no hay base de datos especificada, listar bases de datos
      if (!config.database) {
        const [databases] = await connection.execute('SHOW DATABASES');
        console.log('📋 Bases de datos disponibles:');
        databases.slice(0, 5).forEach(db => {
          console.log(`   - ${db.Database}`);
        });
        if (databases.length > 5) {
          console.log(`   ... y ${databases.length - 5} más`);
        }
      } else {
        // Si hay base de datos, verificar tablas
        const [tables] = await connection.execute('SHOW TABLES');
        console.log(`📋 Tablas en ${config.database}: ${tables.length}`);
        if (tables.length > 0) {
          tables.slice(0, 3).forEach(table => {
            console.log(`   - ${Object.values(table)[0]}`);
          });
        }
      }
      
      await connection.end();
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n🎉 Diagnóstico completado');
}

diagnoseMysqlAccess();
