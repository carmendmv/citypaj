const mysql = require('mysql2/promise');

async function debugCountResult() {
  console.log('🔍 DEBUG - COUNT RESULT');
  console.log('=' .repeat(30));
  
  const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    database: 'citypaj',
    user: 'citypaj_user',
    password: 'citypaj123',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    idleTimeout: 60000,
  });
  
  try {
    const connection = await pool.getConnection();
    
    // Test exacto del countQuery
    const whereClause = 'a.visible = 1 AND a.estado_moderacion = \'approved\'';
    const countQuery = `
      SELECT COUNT(*) as total
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE ${whereClause}
    `;
    
    console.log('📋 Query:', countQuery.replace(/\s+/g, ' ').trim());
    
    const [countResult] = await connection.execute(countQuery);
    
    console.log('📊 countResult tipo:', typeof countResult);
    console.log('📊 countResult length:', countResult.length);
    console.log('📊 countResult[0] tipo:', typeof countResult[0]);
    console.log('📊 countResult[0]:', countResult[0]);
    
    if (countResult[0]) {
      console.log('📊 countResult[0].total:', countResult[0].total);
      console.log('📊 typeof total:', typeof countResult[0].total);
      
      const total = parseInt(countResult[0].total || '0');
      console.log('📊 parseInt total:', total);
      console.log('📊 isNaN:', isNaN(total));
    }
    
    // Test query principal también
    const query = `
      SELECT 
        a.id,
        a.titulo,
        a.usuario_id
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE ${whereClause}
      LIMIT 3
    `;
    
    const [anunciosResult] = await connection.execute(query);
    
    console.log('📊 anunciosResult tipo:', typeof anunciosResult);
    console.log('📊 anunciosResult length:', anunciosResult.length);
    console.log('📊 anunciosResult[0] tipo:', typeof anunciosResult);
    console.log('📊 anunciosResult[0]:', anunciosResult[0]);
    
    connection.release();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
  
  console.log('\n✅ DEBUG COUNT COMPLETADO');
}

debugCountResult();
