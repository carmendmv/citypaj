const mysql = require('mysql2/promise');
const fs = require('fs');

async function forceLoadRealData() {
  console.log('🔥 Forzando carga de datos reales...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión exitosa');
    
    // Obtener todos los anuncios con información de usuarios
    const [anuncios] = await connection.execute(`
      SELECT 
        anuncios.*,
        usuarios.nombre as usuario_nombre,
        usuarios.email as email
      FROM anuncios
      LEFT JOIN usuarios ON anuncios.usuario_id = usuarios.id
      WHERE anuncios.visible = 1 AND anuncios.estado_moderacion = 'approved'
      ORDER BY anuncios.creado_at DESC
    `);
    
    await connection.end();
    
    console.log(`✅ Obtenidos ${anuncios.length} anuncios reales de la base de datos`);
    
    // Guardar los datos en un archivo para que el servidor los use
    const dataToSave = {
      anuncios: anuncios,
      lastCacheUpdate: new Date().toISOString(),
      usandoDatosReales: true,
      dataLoaded: true
    };
    
    fs.writeFileSync('real-data-cache.json', JSON.stringify(dataToSave, null, 2));
    console.log('✅ Datos guardados en real-data-cache.json');
    
    // Mostrar distribución por categorías
    const distribution = {};
    anuncios.forEach(anuncio => {
      distribution[anuncio.categoria] = (distribution[anuncio.categoria] || 0) + 1;
    });
    
    console.log('📊 Distribución por categorías:');
    Object.entries(distribution).forEach(([cat, count]) => {
      console.log(`   - ${cat}: ${count} anuncios`);
    });
    
    console.log('\n🎉 Datos reales cargados y guardados exitosamente');
    console.log('📝 Ahora puedes reiniciar el servidor para que use estos datos');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

forceLoadRealData();
