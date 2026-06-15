const mysql = require('mysql2/promise');

async function diagnoseMySQLAccess() {
  console.log('🔍 DIAGNÓSTICO DE ACCESO A MySQL');
  console.log('=====================================');
  
  // Probar diferentes configuraciones de conexión
  const configs = [
    {
      name: 'Configuración actual (sin password)',
      config: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'citypaj_db'
      }
    },
    {
      name: 'Configuración con password null',
      config: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: null,
        database: 'citypaj_db'
      }
    },
    {
      name: 'Configuración sin especificar database',
      config: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: ''
      }
    }
  ];
  
  for (const { name, config } of configs) {
    console.log(`\n📋 Probando: ${name}`);
    console.log(`   Config: ${JSON.stringify(config)}`);
    
    try {
      const connection = await mysql.createConnection(config);
      console.log('   ✅ Conexión exitosa');
      
      // Si no especificamos database, probar listar bases de datos
      if (!config.database) {
        const [databases] = await connection.execute('SHOW DATABASES');
        console.log('   📊 Bases de datos disponibles:');
        databases.forEach(db => {
          const dbName = Object.values(db)[0];
          if (dbName.includes('citypaj')) {
            console.log(`      • ${dbName} ⭐`);
          } else {
            console.log(`      • ${dbName}`);
          }
        });
      } else {
        // Probar consulta simple
        const [result] = await connection.execute('SELECT DATABASE() as current_db');
        console.log(`   📊 Base de datos actual: ${result[0].current_db}`);
        
        const [tables] = await connection.execute('SHOW TABLES');
        console.log(`   📊 Tablas encontradas: ${tables.length}`);
      }
      
      await connection.end();
      console.log('   🔌 Conexión cerrada');
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      console.log(`   📝 Código: ${error.code}`);
      console.log(`   📝 SQL State: ${error.sqlState}`);
    }
  }
  
  console.log('\n🔍 VERIFICANDO VARIABLES DE ENTORNO');
  console.log('===================================');
  console.log(`DB_USER: ${process.env.DB_USER || 'NO DEFINIDO'}`);
  console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD || 'NO DEFINIDO'}`);
  console.log(`DB_NAME: ${process.env.DB_NAME || 'NO DEFINIDO'}`);
  console.log(`DB_HOST: ${process.env.DB_HOST || 'NO DEFINIDO'}`);
}

diagnoseMySQLAccess();
