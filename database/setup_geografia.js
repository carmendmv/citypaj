const mysql = require('mysql2/promise');

async function setupGeografia() {
  console.log('🗺️ Configurando datos geográficos de España...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión exitosa');
    
    // Datos de comunidades autónomas y provincias
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
    
    // Crear tabla de comunidades si no existe
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS comunidades (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Crear tabla de provincias si no existe
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS provincias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL UNIQUE,
        comunidad_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (comunidad_id) REFERENCES comunidades(id)
      )
    `);
    
    console.log('📋 Tablas geográficas creadas');
    
    // Insertar comunidades autónomas
    let comunidadId = 1;
    for (const [comunidad, provincias] of Object.entries(comunidadesProvincias)) {
      await connection.execute(
        'INSERT IGNORE INTO comunidades (id, nombre) VALUES (?, ?)',
        [comunidadId, comunidad]
      );
      
      // Insertar provincias
      let provinciaId = 1;
      for (const provincia of provincias) {
        await connection.execute(
          'INSERT IGNORE INTO provincias (id, nombre, comunidad_id) VALUES (?, ?, ?)',
          [provinciaId, provincia, comunidadId]
        );
        provinciaId++;
      }
      
      console.log(`✅ ${comunidad}: ${provincias.length} provincias`);
      comunidadId++;
    }
    
    // Verificar datos insertados
    const [comunidadesCount] = await connection.execute('SELECT COUNT(*) as total FROM comunidades');
    const [provinciasCount] = await connection.execute('SELECT COUNT(*) as total FROM provincias');
    
    console.log(`📊 Total comunidades: ${comunidadesCount[0].total}`);
    console.log(`📊 Total provincias: ${provinciasCount[0].total}`);
    
    await connection.end();
    console.log('🎉 Configuración geográfica completada');
    
  } catch (error) {
    console.error('❌ Error configurando geografía:', error.message);
  }
}

setupGeografia();
