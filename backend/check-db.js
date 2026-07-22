const mysql = require('mysql2/promise');

async function checkDatabase() {
  console.log('🔍 Verificando estado de la base de datos...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión exitosa a citypaj');
    
    // Verificar tablas
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Tablas encontradas:');
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });
    
    // Verificar usuarios
    const [users] = await connection.execute('SELECT COUNT(*) as total FROM usuarios');
    console.log(`👥 Total de usuarios: ${users[0].total}`);
    
    // Verificar anuncios
    const [anuncios] = await connection.execute('SELECT COUNT(*) as total FROM anuncios');
    console.log(`📊 Total de anuncios: ${anuncios[0].total}`);
    
    // Verificar categorías
    const [categories] = await connection.execute('SELECT DISTINCT categoria FROM anuncios');
    console.log('📈 Categorías encontradas:');
    categories.forEach(cat => {
      console.log(`   - ${cat.categoria}`);
    });
    
    // Verificar comunidades autónomas
    const [communities] = await connection.execute('SELECT DISTINCT comunidad_autonoma FROM anuncios WHERE comunidad_autonoma IS NOT NULL');
    console.log('🏛️ Comunidades autónomas encontradas:');
    communities.forEach(com => {
      console.log(`   - ${com.comunidad_autonoma}`);
    });
    
    await connection.end();
    console.log('✅ Verificación de base de datos completada');
    
  } catch (error) {
    console.error('❌ Error verificando base de datos:', error.message);
  }
}

checkDatabase();
