const mysql = require('mysql2/promise');
const fs = require('fs');

async function fixLocationConsistency() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('🔧 Corrigiendo consistencia de ubicación...');
    
    // Obtener todos los anuncios
    const [anuncios] = await connection.execute(`
      SELECT id, titulo, descripcion, comunidad_autonoma, provincia, comunidad_id, provincia_id
      FROM anuncios
    `);
    
    console.log(`📊 Analizando ${anuncios.length} anuncios...`);
    
    // Mapeo de comunidades autónomas con sus provincias
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
      'Galicia': ['La Coruña', 'Lugo', 'Ourense', 'Pontevedra'],
      'La Rioja': ['La Rioja'],
      'Madrid': ['Madrid'],
      'Murcia': ['Murcia'],
      'Navarra': ['Navarra'],
      'País Vasco': ['Álava', 'Guipúzcoa', 'Vizcaya']
    };
    
    // Mapeo de provincias a comunidades
    const provinciaAComunidad = {};
    Object.entries(comunidadesProvincias).forEach(([comunidad, provincias]) => {
      provincias.forEach(provincia => {
        provinciaAComunidad[provincia.toLowerCase()] = comunidad;
      });
    });
    
    let corregidos = 0;
    
    for (const anuncio of anuncios) {
      const textoCompleto = `${anuncio.titulo} ${anuncio.descripcion}`.toLowerCase();
      let nuevaComunidad = null;
      let nuevaProvincia = null;
      
      // Buscar menciones de comunidades autónomas
      for (const [comunidad, provincias] of Object.entries(comunidadesProvincias)) {
        if (textoCompleto.includes(comunidad.toLowerCase())) {
          nuevaComunidad = comunidad;
          
          // Buscar si menciona alguna provincia de esa comunidad
          for (const provincia of provincias) {
            if (textoCompleto.includes(provincia.toLowerCase())) {
              nuevaProvincia = provincia;
              break;
            }
          }
          
          // Si no menciona provincia, usar la primera de la comunidad
          if (!nuevaProvincia && provincias.length > 0) {
            nuevaProvincia = provincias[0];
          }
          
          break;
        }
      }
      
      // Buscar menciones directas de provincias
      if (!nuevaComunidad) {
        for (const provincia of Object.keys(provinciaAComunidad)) {
          if (textoCompleto.includes(provincia)) {
            nuevaProvincia = provincia.charAt(0).toUpperCase() + provincia.slice(1);
            nuevaComunidad = provinciaAComunidad[provincia];
            break;
          }
        }
      }
      
      // Si encontramos una ubicación diferente y es válida
      if (nuevaComunidad && nuevaComunidad !== anuncio.comunidad_autonoma) {
        console.log(`🔧 Corrigiendo anuncio ${anuncio.id}:`);
        console.log(`   Antes: ${anuncio.comunidad_autonoma} / ${anuncio.provincia}`);
        console.log(`   Después: ${nuevaComunidad} / ${nuevaProvincia}`);
        
        // Obtener IDs de comunidad y provincia
        const [comunidadData] = await connection.execute(
          'SELECT id FROM comunidades WHERE nombre = ?', [nuevaComunidad]
        );
        
        const [provinciaData] = await connection.execute(
          'SELECT id FROM provincias WHERE nombre = ?', [nuevaProvincia]
        );
        
        if (comunidadData.length > 0 && provinciaData.length > 0) {
          await connection.execute(
            'UPDATE anuncios SET comunidad_autonoma = ?, provincia = ?, comunidad_id = ?, provincia_id = ? WHERE id = ?',
            [nuevaComunidad, nuevaProvincia, comunidadData[0].id, provinciaData[0].id, anuncio.id]
          );
          corregidos++;
        }
      }
    }
    
    console.log(`\n✅ Se corrigieron ${corregidos} anuncios`);
    
    await connection.end();
    
    // Recargar el cache con los datos corregidos
    console.log('🔄 Recargando cache...');
    const { spawn } = require('child_process');
    const loadProcess = spawn('node', ['src/load-data-simple.js'], { cwd: process.cwd() });
    
    loadProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Cache actualizado con los datos corregidos');
      } else {
        console.log('❌ Error al actualizar el cache');
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixLocationConsistency();
