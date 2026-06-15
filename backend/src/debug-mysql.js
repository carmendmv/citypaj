const mysql = require('mysql2/promise');

async function debugMySQL() {
  console.log('🔍 Depurando configuración de MySQL...');
  
  // 1. Probar conexión como root
  try {
    const rootConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });
    
    console.log('✅ Conexión como root exitosa');
    
    // Verificar usuarios
    const [users] = await rootConnection.query('SELECT user, host FROM mysql.user WHERE user = "citypaj_user"');
    console.log('👥 Usuarios citypaj_user encontrados:', users);
    
    // Verificar privilegios del usuario
    const [grants] = await rootConnection.query('SHOW GRANTS FOR "citypaj_user"@"localhost"');
    console.log('🔑 Privilegios de citypaj_user:', grants);
    
    // Verificar bases de datos
    const [databases] = await rootConnection.query('SHOW DATABASES LIKE "citypaj"');
    console.log('🗄️  Base de datos citypaj:', databases);
    
    await rootConnection.end();
    
  } catch (error) {
    console.error('❌ Error conectando como root:', error.message);
  }
  
  // 2. Probar conexión directa como citypaj_user
  try {
    const userConnection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión como citypaj_user exitosa');
    
    // Verificar tablas
    const [tables] = await userConnection.query('SHOW TABLES FROM citypaj');
    console.log('📋 Tablas en citypaj:', tables.map(t => Object.values(t)[0]));
    
    // Verificar conteo de anuncios
    const [count] = await userConnection.query('SELECT COUNT(*) as total FROM anuncios');
    console.log('📊 Total de anuncios:', count[0].total);
    
    await userConnection.end();
    
  } catch (error) {
    console.error('❌ Error conectando como citypaj_user:', error.message);
  }
}

debugMySQL();
