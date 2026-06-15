const mysql = require('mysql2/promise');

async function testDirectConnection() {
  console.log('🔍 PRUEBA DIRECTA DE CONEXIÓN A MYSQL');
  console.log('=====================================');
  
  try {
    // Probar conexión directa sin pool
    console.log('1. Intentando conexión directa...');
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '', // Contraseña vacía
      database: 'citypaj_db'
    });
    
    console.log('✅ Conexión directa exitosa');
    
    // Probar consulta simple
    console.log('2. Probando consulta simple...');
    const [result] = await connection.execute('SELECT COUNT(*) as count FROM anuncios');
    console.log(`✅ Consulta exitosa: ${result[0].count} anuncios encontrados`);
    
    await connection.end();
    
    // Probar con pool
    console.log('3. Intentando conexión con pool...');
    const pool = mysql.createPool({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '', // Contraseña vacía
      database: 'citypaj_db',
      connectionLimit: 10,
    });
    
    const poolConnection = await pool.getConnection();
    const [poolResult] = await poolConnection.execute('SELECT COUNT(*) as count FROM anuncios');
    console.log(`✅ Pool exitoso: ${poolResult[0].count} anuncios encontrados`);
    
    poolConnection.release();
    await pool.end();
    
    console.log('\n✅ AMBAS CONEXIONES FUNCIONAN CORRECTAMENTE');
    
  } catch (error) {
    console.error('\n❌ Error en conexión directa:', error.message);
    console.error('Código:', error.code);
    console.error('SQL State:', error.sqlState);
  }
}

testDirectConnection();
