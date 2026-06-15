const mysql = require('mysql2/promise');

async function testBaleares() {
  console.log('🏝️ Probando conexión y datos de Baleares...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión exitosa');
    
    // Buscar anuncios en Baleares
    const [balearesAnuncios] = await connection.execute(`
      SELECT * FROM anuncios 
      WHERE comunidad_autonoma = 'Baleares' OR provincia = 'Baleares'
      LIMIT 10
    `);
    
    console.log(`📊 Anuncios encontrados en Baleares: ${balearesAnuncios.length}`);
    
    balearesAnuncios.forEach(anuncio => {
      console.log(`   - ${anuncio.titulo} (${anuncio.categoria}) - ${anuncio.precio || 'Gratis'}`);
    });
    
    // Verificar provincias de Baleares
    const [provincias] = await connection.execute(`
      SELECT DISTINCT provincia FROM anuncios 
      WHERE comunidad_autonoma = 'Baleares'
    `);
    
    console.log('🏝️ Provincias de Baleares con anuncios:');
    provincias.forEach(prov => {
      console.log(`   - ${prov.provincia}`);
    });
    
    await connection.end();
    console.log('✅ Prueba de Baleares completada');
    
  } catch (error) {
    console.error('❌ Error en la prueba de Baleares:', error.message);
  }
}

testBaleares();
