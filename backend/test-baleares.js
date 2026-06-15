const mysql = require('mysql2/promise');

async function testBalearesQuery() {
  let connection;
  
  try {
    console.log('🔄 Probando consulta de anuncios de ocio en Baleares, Mallorca');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'citypaj_db'
    });
    
    // Primero, encontrar los IDs de Baleares y Mallorca
    console.log('\n📍 Buscando IDs de Baleares y Mallorca...');
    
    const [comunidades] = await connection.execute('SELECT id, nombre FROM comunidades WHERE nombre LIKE "%Baleares%"');
    console.log('Comunidades Baleares encontradas:');
    comunidades.forEach(com => {
      console.log(`   • ID: ${com.id}, Nombre: ${com.nombre}`);
    });
    
    const [provincias] = await connection.execute('SELECT id, nombre FROM provincias WHERE nombre LIKE "%Mallorca%" OR nombre LIKE "%Baleares%"');
    console.log('\nProvincias relacionadas con Mallorca/Baleares:');
    provincias.forEach(prov => {
      console.log(`   • ID: ${prov.id}, Nombre: ${prov.nombre}`);
    });
    
    // Ahora buscar anuncios de ocio en Baleares/Mallorca
    console.log('\n🔍 Buscando anuncios de ocio en Baleares, Mallorca...');
    
    // Intentar con diferentes combinaciones de IDs
    let query = `
      SELECT 
        a.id, a.titulo, a.descripcion, a.categoria, 
        a.precio, a.creado_at as fecha_creacion,
        c.nombre as comunidad, p.nombre as provincia
      FROM anuncios a
      INNER JOIN comunidades c ON a.comunidad_id = c.id
      INNER JOIN provincias p ON a.provincia_id = p.id
      WHERE a.categoria = 'ocio' 
        AND a.visible = 1 
        AND a.estado_moderacion = 'approved'
        AND (c.nombre LIKE '%Baleares%' OR p.nombre LIKE '%Mallorca%')
      ORDER BY a.creado_at DESC
      LIMIT 10
    `;
    
    const [anuncios] = await connection.execute(query);
    console.log(`\n✅ Encontrados ${anuncios.length} anuncios de ocio en Baleares/Mallorca:`);
    
    anuncios.forEach((anuncio, index) => {
      console.log(`\n   ${index + 1}. ${anuncio.titulo}`);
      console.log(`      📍 ${anuncio.comunidad} - ${anuncio.provincia}`);
      console.log(`      💰 ${anuncio.precio ? anuncio.precio + '€' : 'Gratis'}`);
      console.log(`      📅 ${new Date(anuncio.fecha_creacion).toLocaleDateString('es-ES')}`);
      console.log(`      📝 ${anuncio.descripcion.substring(0, 100)}...`);
    });
    
    if (anuncios.length === 0) {
      console.log('\n❌ No se encontraron anuncios de ocio en Baleares/Mallorca');
      console.log('🔍 Probando con todos los anuncios de ocio para ver las comunidades disponibles...');
      
      const [todosOcio] = await connection.execute(`
        SELECT DISTINCT c.nombre as comunidad, COUNT(*) as count
        FROM anuncios a
        INNER JOIN comunidades c ON a.comunidad_id = c.id
        WHERE a.categoria = 'ocio' AND a.visible = 1 AND a.estado_moderacion = 'approved'
        GROUP BY c.nombre
        ORDER BY count DESC
        LIMIT 10
      `);
      
      console.log('\n📊 Comunidades con anuncios de ocio:');
      todosOcio.forEach(com => {
        console.log(`   • ${com.comunidad}: ${com.count} anuncios`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

testBalearesQuery();
