const mysql = require('mysql2/promise');

async function testCitypajDbConnection() {
  console.log('🔍 Probando conexión a la base de datos citypaj_db...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj_db',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión exitosa a citypaj_db');
    
    // Probar consulta simple
    const [result] = await connection.execute('SELECT COUNT(*) as total FROM anuncios');
    console.log(`📊 Total de anuncios en citypaj_db: ${result[0].total}`);
    
    await connection.end();
    console.log('✅ Prueba completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la conexión a citypaj_db:', error.message);
    console.log('ℹ️  Nota: citypaj_db ha sido eliminada, ahora se usa citypaj');
  }
}

testCitypajDbConnection();
