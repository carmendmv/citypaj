const mysql = require('mysql2/promise');

async function testFinalQuery() {
  console.log('🔍 TEST FINAL QUERY CON ESTRUCTURA COMPLETA');
  console.log('=' .repeat(50));
  
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión establecida');
    
    // Test query exacta del controlador restaurado
    console.log('\n📋 Test - Query exacta del controlador:');
    const exactQuery = `
      SELECT 
        a.id,
        a.usuario_id,
        a.titulo,
        a.descripcion,
        a.categoria,
        a.subcategoria,
        a.comunidad_id,
        a.provincia_id,
        a.comunidad_autonoma,
        a.provincia,
        a.barrio,
        a.modalidad,
        a.contacto_email,
        a.contacto_telefono,
        a.contacto_anonimo,
        a.visible,
        a.estado_moderacion,
        a.motivo_rechazo,
        a.vistas,
        a.creado_at,
        a.actualizado_at,
        u.nombre as usuario_nombre,
        u.email as usuario_email
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.visible = 1 AND a.estado_moderacion = 'approved'
      ORDER BY a.creado_at DESC
      LIMIT 3
    `;
    
    try {
      const [result] = await connection.execute(exactQuery);
      console.log(`   ✅ Query ejecutada: ${result.length} filas`);
      
      if (result.length > 0) {
        console.log('   📝 Primer resultado:');
        console.log(`      ID: ${result[0].id}`);
        console.log(`      Usuario ID: ${result[0].usuario_id}`);
        console.log(`      Título: ${result[0].titulo}`);
        console.log(`      Usuario Nombre: ${result[0].usuario_nombre}`);
        console.log(`      Usuario Email: ${result[0].usuario_email}`);
        console.log(`      Visible: ${result[0].visible}`);
        console.log(`      Estado: ${result[0].estado_moderacion}`);
      }
      
    } catch (queryError) {
      console.log(`   ❌ Error query: ${queryError.message}`);
      console.log(`   Código: ${queryError.code}`);
    }
    
    // Test query de conteo
    console.log('\n📋 Test - Query de conteo:');
    try {
      const [countResult] = await connection.execute(`
        SELECT COUNT(*) as total
        FROM anuncios a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        WHERE a.visible = 1 AND a.estado_moderacion = 'approved'
      `);
      console.log(`   ✅ Query conteo: ${countResult[0].total} anuncios públicos`);
    } catch (countError) {
      console.log(`   ❌ Error conteo: ${countError.message}`);
    }
    
    await connection.end();
    
    console.log('\n' + '=' .repeat(50));
    console.log('✅ TEST FINAL COMPLETADO');
    
  } catch (error) {
    console.error('❌ Error en test:', error.message);
    if (connection) {
      await connection.end();
    }
  }
}

testFinalQuery();
