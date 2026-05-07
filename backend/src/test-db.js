// Script para probar la conexión a la base de datos
const { testConnection, executeQuery } = require('./src/config/database.ts');

async function testDatabase() {
  console.log('🔍 Probando conexión a MariaDB...');
  
  const isConnected = await testConnection();
  
  if (isConnected) {
    try {
      // Probar consulta simple
      const comunidades = await executeQuery('SELECT * FROM comunidades LIMIT 5');
      console.log('✅ Comunidades encontradas:', comunidades);
      
      const anuncios = await executeQuery('SELECT COUNT(*) as total FROM anuncios');
      console.log('✅ Total de anuncios:', anuncios[0]?.total);
      
      console.log('🎉 ¡Conexión exitosa a MariaDB!');
      
    } catch (error) {
      console.error('❌ Error en las consultas:', error);
    }
  } else {
    console.error('❌ No se pudo conectar a MariaDB');
    console.log('💡 Asegúrate de que:');
    console.log('   1. MariaDB está corriendo');
    console.log('   2. La base de datos citypaj_db existe');
    console.log('   3. El archivo .env está configurado correctamente');
  }
}

testDatabase();
