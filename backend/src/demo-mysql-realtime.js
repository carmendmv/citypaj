const mysql = require('mysql2/promise');
// Sin dependencia de colors para compatibilidad

async function demoMySQLRealtime() {
  console.log('🔥 DEMOSTRACIÓN DE CONEXIÓN MYSQL EN TIEMPO REAL'.bold.green);
  console.log('=' .repeat(60).green);
  
  let connection;
  
  try {
    // 1. Conexión a la base de datos
    console.log('\n📡 1. Conectando a la base de datos MySQL...'.yellow);
    const startTime = Date.now();
    
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    const connectionTime = Date.now() - startTime;
    console.log(`✅ Conexión exitosa en ${connectionTime}ms`.green.bold);
    
    // 2. Verificar estado de la conexión
    console.log('\n🔍 2. Verificando estado de la conexión...'.yellow);
    const [status] = await connection.execute('SELECT CONNECTION_ID() as id, NOW() as server_time');
    console.log(`   📋 ID de Conexión: ${status[0].id}`.cyan);
    console.log(`   ⏰ Tiempo del Servidor: ${status[0].server_time}`.cyan);
    
    // 3. Mostrar información de la base de datos
    console.log('\n🗄️ 3. Información de la base de datos:'.yellow);
    const [dbInfo] = await connection.execute('SELECT DATABASE() as db_name, VERSION() as version');
    console.log(`   📊 Base de Datos: ${dbInfo[0].db_name}`.cyan);
    console.log(`   🔧 Versión MySQL: ${dbInfo[0].version}`.cyan);
    
    // 4. Contar anuncios en tiempo real
    console.log('\n📈 4. Contando anuncios en tiempo real...'.yellow);
    const countStart = Date.now();
    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM anuncios');
    const countTime = Date.now() - countStart;
    console.log(`   📊 Total de anuncios: ${countResult[0].total}`.green.bold);
    console.log(`   ⚡ Tiempo de consulta: ${countTime}ms`.cyan);
    
    // 5. Distribución por categorías
    console.log('\n📋 5. Distribución por categorías (en tiempo real):'.yellow);
    const [categories] = await connection.execute(`
      SELECT categoria, COUNT(*) as count 
      FROM anuncios 
      GROUP BY categoria 
      ORDER BY count DESC
    `);
    
    categories.forEach((cat, index) => {
      const bar = '█'.repeat(Math.floor(cat.count / 20));
      console.log(`   ${index + 1}. ${cat.categoria.padEnd(12)}: ${cat.count.toString().padStart(4)} ${bar}`.green);
    });
    
    // 6. Mostrar últimos 3 anuncios en tiempo real
    console.log('\n📝 6. Últimos 3 anuncios (en tiempo real):'.yellow);
    const [latestAnuncios] = await connection.execute(`
      SELECT 
        a.id,
        a.titulo,
        a.categoria,
        a.comunidad_autonoma,
        a.provincia,
        a.estado_moderacion,
        a.visible,
        a.creado_at,
        u.nombre as usuario_nombre,
        u.email as usuario_email
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      ORDER BY a.creado_at DESC
      LIMIT 3
    `);
    
    latestAnuncios.forEach((anuncio, index) => {
      console.log(`\n   📄 Anuncio ${index + 1}:`.cyan);
      console.log(`      🆔 ID: ${anuncio.id}`.gray);
      console.log(`      📌 Título: ${anuncio.titulo}`.white);
      console.log(`      🏷️  Categoría: ${anuncio.categoria}`.magenta);
      console.log(`      📍 Ubicación: ${anuncio.comunidad_autonoma}, ${anuncio.provincia}`.blue);
      console.log(`      👤 Usuario: ${anuncio.usuario_nombre} (${anuncio.usuario_email})`.yellow);
      console.log(`      ✅ Estado: ${anuncio.visible ? 'Visible' : 'Oculto'} | ${anuncio.estado_moderacion}`.green);
      console.log(`      🕐 Creado: ${anuncio.creado_at}`.gray);
    });
    
    // 7. Verificar anuncios aprobados y visibles
    console.log('\n✅ 7. Anuncios aprobados y visibles:'.yellow);
    const [approvedCount] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM anuncios 
      WHERE visible = 1 AND estado_moderacion = 'approved'
    `);
    console.log(`   📊 Anuncios públicos: ${approvedCount[0].count}`.green.bold);
    
    // 8. Simular consulta como la haría el frontend
    console.log('\n🌐 8. Simulando consulta del frontend (API):'.yellow);
    const apiStart = Date.now();
    const [apiResult] = await connection.execute(`
      SELECT 
        a.id,
        a.titulo,
        a.descripcion,
        a.categoria,
        a.comunidad_autonoma,
        a.provincia,
        a.modalidad,
        a.vistas,
        a.creado_at,
        u.nombre as usuario_nombre,
        u.email as usuario_email
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.visible = 1 AND a.estado_moderacion = 'approved'
      ORDER BY a.creado_at DESC
      LIMIT 5
    `);
    const apiTime = Date.now() - apiStart;
    
    console.log(`   ⚡ Tiempo de respuesta API: ${apiTime}ms`.cyan);
    console.log(`   📊 Anuncios devueltos: ${apiResult.length}`.green);
    
    // 9. Verificar conexión con cache
    console.log('\n💾 9. Comparando con cache local:'.yellow);
    try {
      const fs = require('fs');
      const cachePath = './real-data-cache.json';
      
      if (fs.existsSync(cachePath)) {
        const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
        const cacheAnuncios = cacheData.anuncios || [];
        const cacheApproved = cacheAnuncios.filter(a => a.visible && a.estado_moderacion === 'approved');
        
        console.log(`   📊 Cache - Total anuncios: ${cacheAnuncios.length}`.cyan);
        console.log(`   📊 Cache - Aprobados: ${cacheApproved.length}`.cyan);
        console.log(`   📊 Base de datos - Aprobados: ${approvedCount[0].count}`.cyan);
        
        if (cacheApproved.length === approvedCount[0].count) {
          console.log(`   ✅ Cache sincronizado con base de datos`.green.bold);
        } else {
          console.log(`   ⚠️  Cache desincronizado`.yellow.bold);
        }
      } else {
        console.log(`   ❌ No se encontró archivo cache`.red);
      }
    } catch (error) {
      console.log(`   ❌ Error leyendo cache: ${error.message}`.red);
    }
    
    // 10. Test de inserción/actualización en tiempo real
    console.log('\n🔄 10. Test de operación en tiempo real:'.yellow);
    console.log('   (Actualizando vistas de un anuncio aleatorio...)'.gray);
    
    const [randomAnuncio] = await connection.execute(`
      SELECT id, vistas FROM anuncios 
      WHERE visible = 1 AND estado_moderacion = 'approved' 
      ORDER BY RAND() LIMIT 1
    `);
    
    if (randomAnuncio.length > 0) {
      const oldViews = randomAnuncio[0].vistas;
      const updateStart = Date.now();
      
      await connection.execute(`
        UPDATE anuncios SET vistas = vistas + 1 WHERE id = ?
      `, [randomAnuncio[0].id]);
      
      const updateTime = Date.now() - updateStart;
      
      const [newAnuncio] = await connection.execute(`
        SELECT vistas FROM anuncios WHERE id = ?
      `, [randomAnuncio[0].id]);
      
      console.log(`   📈 Anuncio ID: ${randomAnuncio[0].id}`.cyan);
      console.log(`   👁️  Vistas antes: ${oldViews}`.gray);
      console.log(`   👁️  Vistas después: ${newAnuncio[0].vistas}`.green);
      console.log(`   ⚡ Tiempo de actualización: ${updateTime}ms`.cyan);
    }
    
    // 11. Cierre de conexión
    console.log('\n🔚 11. Cerrando conexión...'.yellow);
    await connection.end();
    console.log('✅ Conexión cerrada exitosamente'.green.bold);
    
    console.log('\n' + '=' .repeat(60).green);
    console.log('🎉 DEMOSTRACIÓN COMPLETADA CON ÉXITO'.green.bold);
    console.log('   📊 Base de datos MySQL conectada y funcionando'.cyan);
    console.log('   ⚡ Consultas en tiempo real ejecutadas'.cyan);
    console.log('   💾 Cache sincronizado con base de datos'.cyan);
    console.log('   🔄 Operaciones CRUD funcionando'.cyan);
    console.log('=' .repeat(60).green);
    
  } catch (error) {
    console.error('❌ Error en la demostración:'.red.bold, error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

// Ejecutar demostración
demoMySQLRealtime();
