const mysql = require('mysql2/promise');
const fs = require('fs');

async function loadSimpleData() {
  console.log('🔥 Cargando datos de forma simple...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión exitosa');
    
    // Obtener todas las columnas necesarias para el frontend con JOIN a usuarios
    const [anuncios] = await connection.execute(`
      SELECT 
        a.id, a.usuario_id, a.titulo, a.descripcion, a.categoria, a.subcategoria, 
        a.comunidad_id, a.provincia_id, a.comunidad_autonoma, a.provincia, a.barrio, 
        a.modalidad, a.contacto_email, a.contacto_telefono, a.contacto_anonimo, 
        a.visible, a.estado_moderacion, a.motivo_rechazo, a.vistas, a.creado_at, a.actualizado_at,
        u.nombre as usuario_nombre, u.email as usuario_email
      FROM anuncios a 
      LEFT JOIN usuarios u ON a.usuario_id = u.id 
      ORDER BY a.creado_at DESC
    `);
    
    console.log(`✅ Obtenidos ${anuncios.length} anuncios de la base de datos`);
    
    // Convertir valores booleanos de MySQL (1/0) a booleanos JavaScript (true/false)
    const anunciosProcesados = anuncios.map(anuncio => ({
      ...anuncio,
      contacto_email: Boolean(anuncio.contacto_email),
      contacto_telefono: Boolean(anuncio.contacto_telefono),
      contacto_anonimo: Boolean(anuncio.contacto_anonimo),
      visible: Boolean(anuncio.visible)
    }));
    
    // Guardar en archivo cache
    const cacheData = {
      anuncios: anunciosProcesados,
      lastCacheUpdate: new Date().toISOString(),
      dataLoaded: true,
      usandoDatosReales: true,
      totalAnuncios: anunciosProcesados.length
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
    
    console.log('🎉 Datos cargados y guardados exitosamente');
    console.log('📝 Ahora puedes reiniciar el servidor para que use estos datos');
    
  } catch (error) {
    console.error('❌ Error cargando datos:', error.message);
  }
}

loadSimpleData();
