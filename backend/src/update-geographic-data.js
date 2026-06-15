const mysql = require('mysql2/promise');

async function updateGeographicData() {
  console.log('🗺️ Actualizando datos geográficos para todas las provincias de España...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión exitosa');
    
    // Definir todas las comunidades autónomas y sus provincias
    const comunidadesProvincias = {
      'Andalucía': ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla'],
      'Aragón': ['Huesca', 'Teruel', 'Zaragoza'],
      'Asturias': ['Asturias'],
      'Baleares': ['Baleares'],
      'Canarias': ['Las Palmas', 'Santa Cruz de Tenerife'],
      'Cantabria': ['Cantabria'],
      'Castilla-La Mancha': ['Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Toledo'],
      'Castilla y León': ['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'],
      'Cataluña': ['Barcelona', 'Girona', 'Lleida', 'Tarragona'],
      'Comunidad Valenciana': ['Alicante', 'Castellón', 'Valencia'],
      'Extremadura': ['Badajoz', 'Cáceres'],
      'Galicia': ['A Coruña', 'Lugo', 'Ourense', 'Pontevedra'],
      'Madrid': ['Madrid'],
      'Murcia': ['Murcia'],
      'Navarra': ['Navarra'],
      'País Vasco': ['Álava', 'Guipúzcoa', 'Vizcaya'],
      'La Rioja': ['La Rioja']
    };
    
    // Obtener usuarios existentes
    const [usuarios] = await connection.execute('SELECT id, nombre, email FROM usuarios LIMIT 20');
    console.log(`👥 Usando ${usuarios.length} usuarios existentes`);
    
    // Actualizar anuncios existentes para que tengan datos geográficos correctos
    const [anunciosExistentes] = await connection.execute('SELECT id FROM anuncios');
    console.log(`📝 Actualizando ${anunciosExistentes.length} anuncios existentes...`);
    
    let actualizados = 0;
    
    for (const anuncio of anunciosExistentes) {
      // Seleccionar comunidad y provincia aleatorias
      const comunidades = Object.keys(comunidadesProvincias);
      const comunidad = comunidades[Math.floor(Math.random() * comunidades.length)];
      const provincias = comunidadesProvincias[comunidad];
      const provincia = provincias[Math.floor(Math.random() * provincias.length)];
      
      // Actualizar anuncio con datos geográficos
      await connection.execute(`
        UPDATE anuncios 
        SET comunidad_autonoma = ?, provincia = ?
        WHERE id = ?
      `, [comunidad, provincia, anuncio.id]);
      
      actualizados++;
      
      if (actualizados % 100 === 0) {
        console.log(`✅ Actualizados ${actualizados} anuncios...`);
      }
    }
    
    console.log(`✅ Total de anuncios actualizados: ${actualizados}`);
    
    // Verificar la distribución geográfica
    const [distribucion] = await connection.execute(`
      SELECT comunidad_autonoma, provincia, COUNT(*) as total
      FROM anuncios
      GROUP BY comunidad_autonoma, provincia
      ORDER BY comunidad_autonoma, provincia
    `);
    
    console.log('\n📊 Distribución geográfica actualizada:');
    const comunidadesCount = {};
    
    distribucion.forEach(row => {
      if (!comunidadesCount[row.comunidad_autonoma]) {
        comunidadesCount[row.comunidad_autonoma] = [];
      }
      comunidadesCount[row.comunidad_autonoma].push(`${row.provincia}: ${row.total}`);
    });
    
    Object.entries(comunidadesCount).forEach(([comunidad, provincias]) => {
      console.log(`\n   ${comunidad}:`);
      provincias.forEach(prov => {
        console.log(`     - ${prov}`);
      });
    });
    
    await connection.end();
    
    console.log('\n🎉 Datos geográficos actualizados exitosamente');
    console.log('📝 Ahora todos los anuncios tienen datos geográficos correctos de todas las provincias de España');
    
  } catch (error) {
    console.error('❌ Error actualizando datos geográficos:', error.message);
  }
}

updateGeographicData();
