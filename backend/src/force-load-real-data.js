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
    
    // Obtener todos los anuncios reales
    const [anuncios] = await connection.execute(`
      SELECT 
        id, usuario_id, titulo, descripcion, categoria, subcategoria,
        comunidad_id, provincia_id, comunidad_autonoma, provincia, barrio,
        precio, modalidad, contacto_email, contacto_telefono, contacto_anonimo,
        visible, estado_moderacion, motivo_rechazo, vistas, creado_at, actualizado_at
      FROM anuncios 
      WHERE visible = 1 AND estado_moderacion = 'approved'
      ORDER BY creado_at DESC
    `);
    
    console.log(`✅ Obtenidos ${anuncios.length} anuncios reales de la base de datos`);
    
    // Guardar en archivo cache
    const cacheData = {
      anuncios: anuncios,
      lastCacheUpdate: new Date().toISOString(),
      dataLoaded: true,
      usandoDatosReales: true,
      totalAnuncios: anuncios.length
    };
    
    fs.writeFileSync('real-data-cache.json', JSON.stringify(cacheData, null, 2));
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
    
    await connection.end();
    
    console.log('🎉 Datos reales cargados y guardados exitosamente');
    console.log('📝 Ahora puedes reiniciar el servidor para que use estos datos');
    
  } catch (error) {
    console.error('❌ Error cargando datos reales:', error.message);
  }
}

forceLoadRealData();
