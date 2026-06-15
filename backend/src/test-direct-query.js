const mysql = require('mysql2/promise');

async function testDirectQuery() {
  console.log('🔍 Probando consulta directa del servidor...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión exitosa');
    
    // Probar la consulta exacta que usa el servidor
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
    
    console.log(`✅ Consulta exitosa: ${anuncios.length} anuncios`);
    
    // Si falla, probar con diferentes condiciones
    if (anuncios.length === 0) {
      console.log('⚠️  La consulta no devolvió resultados, probando sin filtros...');
      const [allAnuncios] = await connection.execute(`
        SELECT 
          anuncios.*,
          usuarios.nombre as usuario_nombre,
          usuarios.email as email
        FROM anuncios
        LEFT JOIN usuarios ON anuncios.usuario_id = usuarios.id
        ORDER BY anuncios.creado_at DESC
        LIMIT 3
      `);
      console.log(`✅ Sin filtros: ${allAnuncios.length} anuncios`);
    }
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error en la consulta:', error.message);
  }
}

testDirectQuery();
