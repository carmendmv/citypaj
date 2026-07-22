const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuración para conectarse como root
const rootConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '', // Asumimos que root no tiene contraseña en desarrollo
};

// Configuración del usuario citypaj
const citypajConfig = {
  host: 'localhost',
  port: 3306,
  user: 'citypaj_user',
  password: 'citypaj_password',
  database: 'citypaj_db'
};

async function setupMySQL() {
  console.log('🔧 Configurando MySQL para CityPAJ...');
  
  try {
    // Paso 1: Conectar como root
    console.log('📊 Conectando como root...');
    const connection = await mysql.createConnection(rootConfig);
    console.log('✅ Conectado como root');
    
    // Paso 2: Crear base de datos si no existe
    console.log('📁 Creando base de datos citypaj_db...');
    await connection.execute('CREATE DATABASE IF NOT EXISTS citypaj_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Base de datos citypaj_db creada/verificada');
    
    // Paso 3: Crear usuario si no existe
    console.log('👤 Creando usuario citypaj_user...');
    try {
      await connection.execute("CREATE USER IF NOT EXISTS 'citypaj_user'@'localhost' IDENTIFIED BY 'citypaj_password'");
      console.log('✅ Usuario citypaj_user creado/verificado');
    } catch (error) {
      console.log('⚠️ El usuario ya existe o hay un permiso:', error.message);
    }
    
    // Paso 4: Otorgar privilegios
    console.log('🔐 Otorgando privilegios...');
    await connection.execute("GRANT ALL PRIVILEGES ON citypaj_db.* TO 'citypaj_user'@'localhost'");
    await connection.execute('FLUSH PRIVILEGES');
    console.log('✅ Privilegios otorgados');
    
    // Paso 5: Verificar conexión con el nuevo usuario
    console.log('🔍 Verificando conexión con citypaj_user...');
    await connection.end();
    
    const citypajConnection = await mysql.createConnection(citypajConfig);
    console.log('✅ Conexión verificada con citypaj_user');
    
    // Paso 6: Crear tabla anuncios si no existe
    console.log('📋 Creando tabla anuncios...');
    await citypajConnection.execute(`
      CREATE TABLE IF NOT EXISTS anuncios (
        id VARCHAR(36) PRIMARY KEY,
        usuario_id VARCHAR(36) NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        categoria VARCHAR(50),
        subcategoria VARCHAR(50),
        comunidad_id INT,
        provincia_id INT,
        barrio VARCHAR(100),
        precio DECIMAL(10,2),
        modalidad ENUM('servicio', 'compra', 'venta', 'intercambio', 'alquiler'),
        contacto_email TINYINT(1) DEFAULT 1,
        contacto_telefono TINYINT(1) DEFAULT 1,
        contacto_anonimo TINYINT(1) DEFAULT 0,
        visible TINYINT(1) DEFAULT 1,
        estado_moderacion ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        motivo_rechazo TEXT,
        vistas INT DEFAULT 0,
        creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_categoria (categoria),
        INDEX idx_estado (estado_moderacion),
        INDEX idx_visible (visible),
        INDEX idx_creado_at (creado_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabla anuncios creada/verificada');
    
    // Paso 7: Insertar datos de ejemplo si la tabla está vacía
    const [count] = await citypajConnection.execute('SELECT COUNT(*) as total FROM anuncios');
    if (count[0].total === 0) {
      console.log('📝 Insertando datos de ejemplo...');
      
      const sampleData = [
        {
          id: '07d6d810-5aab-11f1-a334-5811223fa053',
          usuario_id: '048752e8-5aab-11f1-a334-5811223fa053',
          titulo: 'Oferta de ingeniero/a técnico',
          descripcion: 'Maestro/a con especialidad en educación primaria busca sustitución o puesto interino. 5 años de experiencia en colegios públicos y concertados.',
          categoria: 'empleo',
          comunidad_id: 17,
          provincia_id: 50,
          modalidad: 'servicio',
          contacto_email: 1,
          contacto_telefono: 1,
          contacto_anonimo: 0,
          visible: 1,
          estado_moderacion: 'approved',
          vistas: 266
        },
        {
          id: '07d6d6ed-5aab-11f1-a334-5811223fa053',
          usuario_id: '048762f7-5aab-11f1-a334-5811223fa053',
          titulo: 'Clases de baile salón',
          descripcion: 'Libera tu creatividad con este taller de escritura. Aprende técnicas para escribir relatos, poemas y tu primera novela.',
          categoria: 'formacion',
          comunidad_id: 17,
          provincia_id: 50,
          modalidad: 'compra',
          contacto_email: 1,
          contacto_telefono: 1,
          contacto_anonimo: 1,
          visible: 1,
          estado_moderacion: 'approved',
          vistas: 848
        },
        {
          id: '07d6d615-5aab-11f1-a334-5811223fa053',
          usuario_id: '04875df8-5aab-11f1-a334-5811223fa053',
          titulo: 'Concierto benéfico ONG',
          descripcion: 'Concierto benéfico a favor de la ONG local que trabaja con niños en riesgo de exclusión.',
          categoria: 'comunidad',
          comunidad_id: 17,
          provincia_id: 50,
          modalidad: 'intercambio',
          contacto_email: 1,
          contacto_telefono: 1,
          contacto_anonimo: 1,
          visible: 1,
          estado_moderacion: 'rejected',
          motivo_rechazo: 'Contenido inapropiado o información incompleta',
          vistas: 656
        }
      ];
      
      for (const anuncio of sampleData) {
        await citypajConnection.execute(`
          INSERT INTO anuncios (id, usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, contacto_email, contacto_telefono, contacto_anonimo, visible, estado_moderacion, motivo_rechazo, vistas)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          anuncio.id, anuncio.usuario_id, anuncio.titulo, anuncio.descripcion, anuncio.categoria,
          anuncio.comunidad_id, anuncio.provincia_id, anuncio.modalidad, anuncio.contacto_email,
          anuncio.contacto_telefono, anuncio.contacto_anonimo, anuncio.visible, anuncio.estado_moderacion,
          anuncio.motivo_rechazo, anuncio.vistas
        ]);
      }
      
      console.log('✅ Datos de ejemplo insertados');
    } else {
      console.log(`✅ La tabla ya contiene ${count[0].total} anuncios`);
    }
    
    await citypajConnection.end();
    
    console.log('');
    console.log('🎉 ¡Configuración MySQL completada!');
    console.log('📊 Base de datos: citypaj_db');
    console.log('👤 Usuario: citypaj_user');
    console.log('🔐 Contraseña: citypaj_password');
    console.log('📋 Tabla: anuncios');
    console.log('');
    console.log('Ahora puedes iniciar el backend seguro:');
    console.log('node secure-backend-simple.js');
    
  } catch (error) {
    console.error('❌ Error en la configuración:', error.message);
    
    if (error.message.includes('Access denied')) {
      console.log('');
      console.log('🔧 Solución:');
      console.log('1. Asegúrate de que MySQL está corriendo');
      console.log('2. Verifica que puedes conectarte como root');
      console.log('3. Si root tiene contraseña, modifica el script');
      console.log('');
      console.log('Para conectar con contraseña de root, ejecuta:');
      console.log('mysql -u root -p');
      console.log('Y luego introduce la contraseña cuando te la pida.');
    }
    
    process.exit(1);
  }
}

// Ejecutar configuración
setupMySQL();
