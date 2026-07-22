const mysql = require('mysql2/promise');

async function testQuery() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('🔍 Probando consulta SQL...');
    
    // Primero probar una consulta simple a anuncios
    console.log('\n1. Probando consulta simple a anuncios:');
    try {
      const [simpleResult] = await connection.execute(`
        SELECT id, usuario_id, titulo FROM anuncios LIMIT 3
      `);
      console.log('✅ Consulta simple exitosa');
      console.log(`   - ${simpleResult.length} filas obtenidas`);
    } catch (error) {
      console.log('❌ Error en consulta simple:', error.message);
    }
    
    // Probar la consulta completa paso a paso
    console.log('\n2. Probando consulta con JOIN:');
    try {
      const [joinResult] = await connection.execute(`
        SELECT 
          a.id, a.usuario_id, a.titulo,
          u.nombre as usuario_nombre, u.email as usuario_email
        FROM anuncios a 
        LEFT JOIN usuarios u ON a.usuario_id = u.id 
        LIMIT 3
      `);
      console.log('✅ Consulta con JOIN exitosa');
      console.log(`   - ${joinResult.length} filas obtenidas`);
      
      // Mostrar una fila de ejemplo
      if (joinResult.length > 0) {
        console.log('\n📊 Ejemplo de fila combinada:');
        Object.keys(joinResult[0]).forEach(key => {
          console.log(`   ${key}: ${joinResult[0][key]}`);
        });
      }
    } catch (error) {
      console.log('❌ Error en consulta con JOIN:', error.message);
    }
    
    // Probar la consulta completa
    console.log('\n3. Probando consulta completa:');
    try {
      const [fullResult] = await connection.execute(`
        SELECT 
          a.id, a.usuario_id, a.titulo, a.descripcion, a.categoria, a.subcategoria, 
          a.comunidad_id, a.provincia_id, a.comunidad_autonoma, a.provincia, a.barrio, 
          a.modalidad, a.contacto_email, a.contacto_telefono, a.contacto_anonimo, 
          a.visible, a.estado_moderacion, a.motivo_rechazo, a.vistas, a.creado_at, a.actualizado_at,
          u.nombre as usuario_nombre, u.email as usuario_email
        FROM anuncios a 
        LEFT JOIN usuarios u ON a.usuario_id = u.id 
        ORDER BY a.creado_at DESC
        LIMIT 3
      `);
      console.log('✅ Consulta completa exitosa');
      console.log(`   - ${fullResult.length} filas obtenidas`);
    } catch (error) {
      console.log('❌ Error en consulta completa:', error.message);
      console.log('   - SQL State:', error.sqlState);
      console.log('   - Code:', error.code);
    }
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

testQuery();
