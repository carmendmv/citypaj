const mysql = require('mysql2/promise');

async function setupDatabase() {
  console.log('🔧 Configurando base de datos citypaj...');
  
  // Intentar diferentes configuraciones de conexión
  const connectionConfigs = [
    { host: 'localhost', user: 'root', password: '' },
    { host: 'localhost', user: 'root', password: 'root' },
    { host: 'localhost', user: 'root', password: 'password' },
    { host: 'localhost', user: 'root', password: 'mysql' },
    { host: 'localhost', user: 'root', password: '123456' },
    { host: 'localhost', user: 'root', password: 'noalumno' },
  ];

  let connection = null;
  
  for (const config of connectionConfigs) {
    try {
      console.log(`🔍 Intentando conexión con: root@${config.host}:${config.password || '(sin contraseña)'}`);
      
      connection = await mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
      });
      
      console.log('✅ Conexión exitosa a MySQL');
      
      // Crear base de datos citypaj si no existe
      await connection.query('CREATE DATABASE IF NOT EXISTS citypaj CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
      console.log('✅ Base de datos citypaj creada o verificada');
      
      // Verificar si hay datos en citypaj_db para copiar
      try {
        const [tables] = await connection.query('SHOW TABLES FROM citypaj_db');
        console.log(`📊 Encontradas ${tables.length} tablas en citypaj_db`);
        
        if (tables.length > 0) {
          console.log('🔄 Copiando datos de citypaj_db a citypaj...');
          
          // Copiar estructura de tablas
          for (const table of tables) {
            const tableName = Object.values(table)[0];
            console.log(`📋 Copiando tabla: ${tableName}`);
            
            try {
              // Copiar estructura
              await connection.query(`CREATE TABLE IF NOT EXISTS citypaj.${tableName} LIKE citypaj_db.${tableName}`);
              
              // Copiar datos
              await connection.query(`INSERT INTO citypaj.${tableName} SELECT * FROM citypaj_db.${tableName}`);
              
              const [count] = await connection.query(`SELECT COUNT(*) as count FROM citypaj.${tableName}`);
              console.log(`✅ ${tableName}: ${count[0].count} registros copiados`);
            } catch (error) {
              console.log(`⚠️  Error copiando tabla ${tableName}:`, error.message);
            }
          }
        }
      } catch (error) {
        console.log('ℹ️  No se encontró citypaj_db, creando estructura desde cero');
        
        // Crear estructura básica de tablas
        await createBasicTables(connection);
      }
      
      // Crear usuario con contraseña simple si no existe
      try {
        await connection.query("CREATE USER IF NOT EXISTS 'citypaj_user'@'localhost' IDENTIFIED BY 'citypaj123'");
        await connection.query('GRANT ALL PRIVILEGES ON citypaj.* TO \'citypaj_user\'@\'localhost\'');
        await connection.query('FLUSH PRIVILEGES');
        console.log('✅ Usuario citypaj_user creado con privilegios');
      } catch (error) {
        console.log('ℹ️  Usuario citypaj_user ya existe o error en creación:', error.message);
      }
      
      console.log('🎉 Configuración completada');
      console.log('📝 Puedes usar estas credenciales:');
      console.log('   - Usuario: citypaj_user');
      console.log('   - Contraseña: citypaj123');
      console.log('   - Base de datos: citypaj');
      
      await connection.end();
      return true;
      
    } catch (error) {
      console.log(`❌ Error con contraseña "${config.password}":`, error.message);
      if (connection) {
        await connection.end();
      }
      continue;
    }
  }
  
  console.log('❌ No se pudo conectar a MySQL con ninguna de las contraseñas probadas');
  console.log('💡 Sugiero verificar la instalación de MySQL o las credenciales del usuario root');
  return false;
}

async function createBasicTables(connection) {
  console.log('🏗️  Creando estructura básica de tablas...');
  
  try {
    // Tabla usuarios
    await connection.query(`
      CREATE TABLE IF NOT EXISTS citypaj.usuarios (
        id VARCHAR(36) PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        telefono VARCHAR(50),
        password_hash VARCHAR(255),
        creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Tabla anuncios
    await connection.query(`
      CREATE TABLE IF NOT EXISTS citypaj.anuncios (
        id VARCHAR(36) PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        subcategoria VARCHAR(50),
        comunidad_autonoma VARCHAR(100),
        provincia VARCHAR(100),
        barrio VARCHAR(100),
        precio DECIMAL(10,2),
        modalidad VARCHAR(50),
        contacto_email BOOLEAN DEFAULT TRUE,
        contacto_telefono BOOLEAN DEFAULT FALSE,
        contacto_anonimo BOOLEAN DEFAULT FALSE,
        visible BOOLEAN DEFAULT TRUE,
        estado_moderacion VARCHAR(20) DEFAULT 'pending',
        usuario_id VARCHAR(36),
        creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      )
    `);
    
    console.log('✅ Tablas básicas creadas');
    
    // Insertar datos de ejemplo
    await insertSampleData(connection);
    
  } catch (error) {
    console.log('❌ Error creando tablas:', error.message);
    throw error;
  }
}

async function insertSampleData(connection) {
  console.log('📝 Insertando datos de ejemplo...');
  
  try {
    // Insertar usuarios de ejemplo
    const usuarios = [
      ['1', 'Juan Pérez', 'juan@example.com', '600123456'],
      ['2', 'María García', 'maria@example.com', '600789012'],
      ['3', 'Carlos López', 'carlos@example.com', '600345678'],
    ];
    
    for (const [id, nombre, email, telefono] of usuarios) {
      await connection.query(
        'INSERT IGNORE INTO citypaj.usuarios (id, nombre, email, telefono) VALUES (?, ?, ?, ?)',
        [id, nombre, email, telefono]
      );
    }
    
    // Insertar anuncios de ejemplo (100 por categoría)
    const categorias = ['empleo', 'servicios', 'formacion', 'ocio', 'comunidad'];
    const titulos = {
      empleo: ['Desarrollador Web', 'Diseñador Gráfico', 'Marketing Digital', 'Administrativo', 'Técnico Informático'],
      servicios: ['Fontanería', 'Electricista', 'Carpintero', 'Pintor', 'Jardinería'],
      formacion: ['Clases de Inglés', 'Curso de Programación', 'Taller de Fotografía', 'Clases de Música', 'Curso de Cocina'],
      ocio: ['Partido de Fútbol', 'Excursión a la Montaña', 'Cine en el Parque', 'Concierto de Rock'],
      comunidad: ['Voluntariado', 'Recolección de Alimentos', 'Limpieza de Playas', 'Visita a Ancianos', 'Taller Reciclaje']
    };
    
    let anuncioId = 1;
    for (const categoria of categorias) {
      for (let i = 0; i < 100; i++) {
        const tituloArray = titulos[categoria];
        const titulo = `${tituloArray[i % tituloArray.length]} #${i + 1}`;
        const descripcion = `Descripción detallada para ${titulo}. Servicio profesional con experiencia garantizada. Disponibilidad inmediata. Precios competitivos. Contactar para más información.`;
        const precio = Math.floor(Math.random() * 500) + 50;
        const usuarioId = (i % 3) + 1;
        
        await connection.query(
          `INSERT INTO citypaj.anuncios (id, titulo, descripcion, categoria, precio, usuario_id, visible, estado_moderacion) 
           VALUES (?, ?, ?, ?, ?, ?, TRUE, 'approved')`,
          [anuncioId.toString(), titulo, descripcion, categoria, precio, usuarioId.toString()]
        );
        
        anuncioId++;
      }
    }
    
    console.log('✅ Datos de ejemplo insertados: 500 anuncios creados');
    
  } catch (error) {
    console.log('❌ Error insertando datos:', error.message);
    throw error;
  }
}

// Ejecutar configuración
setupDatabase().then(success => {
  if (success) {
    console.log('\n🎯 Ahora actualiza tu knexfile.js con:');
    console.log('   database: "citypaj"');
    console.log('   user: "citypaj_user"');
    console.log('   password: "citypaj123"');
    process.exit(0);
  } else {
    process.exit(1);
  }
}).catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
