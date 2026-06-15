require('dotenv').config({ path: '.env.config' });
const mysql = require('mysql2/promise');

console.log('🔍 VERIFICANDO CONEXIÓN REAL A MYSQL');
console.log('=====================================');
console.log('Variables de entorno cargadas:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD === '' ? '(vacía)' : process.env.DB_PASSWORD);

async function testRealConnection() {
  try {
    console.log('\n📡 Intentando conectar a MySQL...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'citypaj_db'
    });
    
    console.log('✅ Conexión exitosa a MySQL');
    
    // Verificar base de datos actual
    const [dbResult] = await connection.execute('SELECT DATABASE() as current_db');
    console.log('📊 Base de datos actual:', dbResult[0].current_db);
    
    // Verificar tablas
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📊 Tablas encontradas:', tables.length);
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });
    
    // Verificar si hay anuncios
    const [anunciosCount] = await connection.execute('SELECT COUNT(*) as count FROM anuncios');
    console.log('📊 Total anuncios:', anunciosCount[0].count);
    
    // Verificar si hay usuarios
    const [usuariosCount] = await connection.execute('SELECT COUNT(*) as count FROM usuarios');
    console.log('📊 Total usuarios:', usuariosCount[0].count);
    
    await connection.end();
    console.log('\n✅ CONEXIÓN VERIFICADA - citypaj_db es accesible');
    
  } catch (error) {
    console.error('\n❌ Error en conexión real:', error.message);
    console.error('Código:', error.code);
    console.error('SQL State:', error.sqlState);
  }
}

testRealConnection();
