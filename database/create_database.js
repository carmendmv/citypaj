const mysql = require('mysql2/promise');

async function createDatabase() {
  console.log('🗄️ Creando base de datos citypaj...');
  
  try {
    // Conectar sin especificar base de datos
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: ''
    });
    
    console.log('✅ Conexión exitosa como root');
    
    // Crear base de datos si no existe
    await connection.execute('CREATE DATABASE IF NOT EXISTS citypaj CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Base de datos citypaj creada');
    
    // Crear usuario si no existe
    await connection.execute("CREATE USER IF NOT EXISTS 'citypaj_user'@'localhost' IDENTIFIED BY 'citypaj123'");
    console.log('✅ Usuario citypaj_user creado');
    
    // Dar privilegios al usuario
    await connection.execute('GRANT ALL PRIVILEGES ON citypaj.* TO \'citypaj_user\'@\'localhost\'');
    await connection.execute('FLUSH PRIVILEGES');
    console.log('✅ Privilegios concedidos');
    
    // Conectar a la base de datos citypaj
    await connection.execute('USE citypaj');
    
    // Crear tabla usuarios
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id varchar(36) PRIMARY KEY,
        nombre varchar(100) NOT NULL,
        email varchar(100) NOT NULL UNIQUE,
        password varchar(255) NOT NULL,
        telefono varchar(20),
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla usuarios creada');
    
    // Crear tabla anuncios
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS anuncios (
        id varchar(36) PRIMARY KEY,
        usuario_id varchar(36) NOT NULL,
        titulo varchar(200) NOT NULL,
        descripcion text NOT NULL,
        categoria enum('ocio','servicios','formacion','empleo','comunidad','transporte','vivienda','salud','tecnología','otros') NOT NULL,
        subcategoria varchar(50),
        comunidad_id int(11) NOT NULL,
        provincia_id int(11) NOT NULL,
        comunidad_autonoma varchar(100),
        provincia varchar(100),
        barrio varchar(100),
        precio decimal(10,2),
        modalidad enum('venta','regalo','intercambio','servicio','compra') NOT NULL,
        contacto_email tinyint(1) DEFAULT 1,
        contacto_telefono tinyint(1) DEFAULT 0,
        contacto_anonimo tinyint(1) DEFAULT 0,
        visible tinyint(1) DEFAULT 1,
        estado_moderacion enum('pending','approved','rejected','flagged') DEFAULT 'pending',
        motivo_rechazo text,
        vistas int(11) DEFAULT 0,
        creado_at timestamp DEFAULT CURRENT_TIMESTAMP,
        actualizado_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabla anuncios creada');
    
    await connection.end();
    console.log('🎉 Base de datos y tablas creadas exitosamente');
    
  } catch (error) {
    console.error('❌ Error creando base de datos:', error.message);
  }
}

createDatabase();
