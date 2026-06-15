const mysql = require('mysql2/promise');

async function debugServerConnection() {
  console.log('🔍 Depurando conexión del servidor...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión exitosa');
    
    // Verificar total de anuncios
    const [total] = await connection.execute('SELECT COUNT(*) as total FROM anuncios');
    console.log(`📊 Total de anuncios en BD: ${total[0].total}`);
    
    // Verificar categorías
    const [categorias] = await connection.execute(`
      SELECT categoria, COUNT(*) as total 
      FROM anuncios 
      GROUP BY categoria 
      ORDER BY categoria
    `);
    
    console.log('📋 Categorías en BD:');
    categorias.forEach(cat => {
      console.log(`   - ${cat.categoria}: ${cat.total} anuncios`);
    });
    
    // Probar la consulta exacta del servidor
    console.log('🔍 Probando consulta del servidor...');
    const [anuncios] = await connection.execute(`
      SELECT 
        anuncios.*,
        usuarios.nombre as usuario_nombre,
        usuarios.email as email
      FROM anuncios
      LEFT JOIN usuarios ON anuncios.usuario_id = usuarios.id
      WHERE anuncios.visible = 1 AND anuncios.estado_moderacion = 'approved'
      ORDER BY anuncios.creado_at DESC
      LIMIT 3
    `);
    
    console.log(`✅ Consulta del servidor exitosa: ${anuncios.length} anuncios`);
    if (anuncios.length > 0) {
      console.log('📝 Ejemplo de anuncio:');
      console.log(`   ID: ${anuncios[0].id}`);
      console.log(`   Título: ${anuncios[0].titulo}`);
      console.log(`   Categoría: ${anuncios[0].categoria}`);
      console.log(`   Usuario: ${anuncios[0].usuario_nombre}`);
    }
    
    await connection.end();
    
    console.log('\n✅ La conexión a la base de datos funciona correctamente');
    console.log('💡 El problema debe estar en el código del servidor');
    
  } catch (error) {
    console.error('❌ Error en la conexión:', error.message);
  }
}

debugServerConnection();
