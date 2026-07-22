const mysql = require('mysql2/promise');

async function checkColumns() {
  console.log('🔍 Verificando estructura de la base de datos...');
  
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión a MySQL establecida');
    
    // Verificar tabla anuncios
    const [anunciosColumns] = await connection.execute('DESCRIBE anuncios');
    console.log('\n📋 Columnas en tabla anuncios:');
    anunciosColumns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type}`);
    });
    
    // Verificar tabla usuarios
    const [usuariosColumns] = await connection.execute('DESCRIBE usuarios');
    console.log('\n📋 Columnas en tabla usuarios:');
    usuariosColumns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type}`);
    });
    
    // Verificar si hay columna usuario_id en anuncios
    const hasUsuarioId = anunciosColumns.some(col => col.Field === 'usuario_id');
    console.log(`\n🔍 ¿Existe columna 'usuario_id' en anuncios? ${hasUsuarioId ? '✅ SÍ' : '❌ NO'}`);
    
    // Buscar columnas relacionadas con usuario
    const usuarioColumns = anunciosColumns.filter(col => 
      col.Field.toLowerCase().includes('usuario') || 
      col.Field.toLowerCase().includes('user')
    );
    console.log('\n🔍 Columnas relacionadas con usuario en anuncios:');
    usuarioColumns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type}`);
    });
    
    // Verificar algunos datos de ejemplo
    const [sampleData] = await connection.execute('SELECT * FROM anuncios LIMIT 1');
    if (sampleData.length > 0) {
      console.log('\n📊 Ejemplo de datos en anuncios:');
      Object.keys(sampleData[0]).forEach(key => {
        console.log(`   - ${key}: ${sampleData[0][key]}`);
      });
    }
    
    await connection.end();
    console.log('\n✅ Verificación completada');
    
  } catch (error) {
    console.error('❌ Error verificando columnas:', error.message);
    if (connection) {
      await connection.end();
    }
  }
}

checkColumns();
