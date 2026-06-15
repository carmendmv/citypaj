const mysql = require('mysql2/promise');

async function expandCategories() {
  console.log('🚀 Expandiendo categorías y generando anuncios completos...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión exitosa a la base de datos');
    
    // 1. Actualizar el ENUM de categorías
    console.log('📝 Actualizando ENUM de categorías...');
    try {
      await connection.execute(`
        ALTER TABLE anuncios 
        MODIFY COLUMN categoria ENUM('ocio','servicios','formacion','empleo','comunidad','transporte','vivienda','salud','tecnología','otros') NOT NULL
      `);
      console.log('✅ ENUM de categorías actualizado');
    } catch (error) {
      console.log('ℹ️  El ENUM ya contiene las nuevas categorías o error:', error.message);
    }
    
    // 2. Obtener usuarios existentes para asignar a los nuevos anuncios
    const [usuarios] = await connection.execute('SELECT id, nombre, email FROM usuarios LIMIT 20');
    console.log(`👥 Usando ${usuarios.length} usuarios existentes`);
    
    // 3. Definir todas las comunidades autónomas y sus provincias
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
    
    // 4. Definir títulos para cada categoría
    const titulosPorCategoria = {
      'ocio': [
        'Partido de fútbol', 'Excursión a la montaña', 'Cine en el parque', 'Concierto de rock',
        'Taller de pintura', 'Noche de juegos', 'Visita a museo', 'Ruta en bicicleta',
        'Torneo de pádel', 'Picnic en el parque', 'Festival de música', 'Evento deportivo',
        'Taller de fotografía', 'Caminata nocturna', 'Encuentro de lectura', 'Clases de baile',
        'Sesión de yoga', 'Torneo de cartas', 'Visita guiada', 'Evento cultural'
      ],
      'servicios': [
        'Fontanería', 'Electricista', 'Carpintero', 'Pintor', 'Jardinería', 'Limpieza',
        'Mecánico', 'Reparaciones', 'Mantenimiento', 'Instalaciones', 'Fontanería',
        'Electricidad', 'Carpintería', 'Pintura', 'Jardinería', 'Limpieza', 'Mecánica',
        'Reparación', 'Mantenimiento', 'Instalación'
      ],
      'formacion': [
        'Clases de inglés', 'Curso de programación', 'Taller de fotografía', 'Clases de música',
        'Curso de cocina', 'Clases de matemáticas', 'Curso de marketing', 'Taller de arte',
        'Clases de baile', 'Curso de idiomas', 'Taller de escritura', 'Curso de diseño',
        'Clases de guitarra', 'Curso de finanzas', 'Taller de teatro', 'Clases de informática',
        'Curso de contabilidad', 'Taller de cerámica', 'Clases de yoga', 'Curso de idiomas'
      ],
      'empleo': [
        'Desarrollador web', 'Diseñador UX/UI', 'Marketing digital', 'Administrativo',
        'Técnico informático', 'Contable', 'Recepcionista', 'Vendedor', 'Encargado de tienda',
        'Auxiliar administrativo', 'Programador', 'Diseñador gráfico', 'Community manager',
        'Analista de datos', 'Project manager', 'Recursos humanos', 'Atención al cliente',
        'Técnico de soporte', 'Analista financiero', 'Consultor'
      ],
      'comunidad': [
        'Voluntariado', 'Recolección de alimentos', 'Limpieza de playas', 'Visita a ancianos',
        'Taller de reciclaje', 'Campaña solidaria', 'Ayuda escolar', 'Banco de alimentos',
        'Proyecto medioambiental', 'Apoyo comunitario', 'Voluntariado social', 'Campaña de donación',
        'Ayuda a refugiados', 'Proyecto educativo', 'Apoyo a discapacitados', 'Campaña de salud',
        'Voluntariado animalista', 'Proyecto cultural', 'Apoyo a mujeres', 'Campaña de integración'
      ],
      'transporte': [
        'Traslado de muebles', 'Transporte de mercancías', 'Servicio de mudanza', 'Reparto local',
        'Transporte de personas', 'Servicio de taxi', 'Alquiler de furgoneta', 'Transporte de mascotas',
        'Reparto de paquetes', 'Servicio de mensajería', 'Transporte escolar', 'Traslado médico',
        'Alquiler de coche', 'Transporte de comida', 'Servicio de grúa', 'Transporte de bicicletas',
        'Reparto urgente', 'Transporte de equipos', 'Servicio de logística', 'Alquiler de camión'
      ],
      'vivienda': [
        'Alquiler de piso', 'Venta de casa', 'Habitación compartida', 'Alquiler de garaje',
        'Venta de apartamento', 'Alquiler de local', 'Habitación para estudiantes', 'Venta de chalet',
        'Alquiler de habitación', 'Venta de terreno', 'Alquiler de oficina', 'Habitación con baño',
        'Venta de piso amueblado', 'Alquiler de ático', 'Venta de estudio', 'Alquiler de duplex',
        'Venta de loft', 'Alquiler de plaza parking', 'Venta de finca', 'Alquiler de casa rural'
      ],
      'salud': [
        'Clases de yoga', 'Servicio de fisioterapia', 'Nutricionista', 'Psicólogo',
        'Clases pilates', 'Masaje terapéutico', 'Entrenador personal', 'Acupuntura',
        'Reiki', 'Meditación guiada', 'Terapia ocupacional', 'Clases de spinning',
        'Consejo nutricional', 'Terapia física', 'Clases de zumba', 'Servicio de podología',
        'Hidroterapia', 'Yoga terapéutico', 'Masaje deportivo', 'Terapia de lenguaje'
      ],
      'tecnología': [
        'Reparación de ordenadores', 'Instalación de software', 'Soporte técnico',
        'Diseño web', 'Programación', 'Instalación de redes', 'Reparación de móviles',
        'Configuración de servidores', 'Asesoría tecnológica', 'Desarrollo de apps',
        'Mantenimiento informático', 'Recuperación de datos', 'Instalación de cámaras',
        'Configuración de email', 'Soporte remoto', 'Instalación de antivirus',
        'Optimización de PC', 'Configuración de WiFi', 'Reparación de tablets', 'Ciberseguridad'
      ],
      'otros': [
        'Intercambio de idiomas', 'Club de lectura', 'Grupo de senderismo', 'Taller de costura',
        'Intercambio de habilidades', 'Grupo de estudio', 'Club de debate', 'Taller de jardinería',
        'Grupo de inversión', 'Club de cine', 'Taller de cocina', 'Grupo de fotografía',
        'Intercambio de libros', 'Club de ajedrez', 'Grupo de running', 'Taller de manualidades',
        'Club de teatro', 'Grupo de música', 'Taller de escritura', 'Club de videojuegos'
      ]
    };
    
    // 5. Generar 100 anuncios para cada categoría
    const categorias = ['ocio', 'servicios', 'formacion', 'empleo', 'comunidad', 'transporte', 'vivienda', 'salud', 'tecnología', 'otros'];
    let totalAnunciosCreados = 0;
    
    for (const categoria of categorias) {
      console.log(`📝 Generando 100 anuncios para categoría: ${categoria}`);
      
      const titulos = titulosPorCategoria[categoria];
      const comunidades = Object.keys(comunidadesProvincias);
      
      for (let i = 0; i < 100; i++) {
        // Seleccionar comunidad y provincia aleatorias
        const comunidad = comunidades[Math.floor(Math.random() * comunidades.length)];
        const provincias = comunidadesProvincias[comunidad];
        const provincia = provincias[Math.floor(Math.random() * provincias.length)];
        
        // Seleccionar usuario aleatorio
        const usuario = usuarios[Math.floor(Math.random() * usuarios.length)];
        
        // Seleccionar título
        const tituloBase = titulos[i % titulos.length];
        const titulo = `${tituloBase} - ${provincia}`;
        
        // Generar descripción
        const descripcion = `${tituloBase} disponible en ${provincia}, ${comunidad}. Servicio profesional con experiencia garantizada. Disponibilidad inmediata y flexible. Precios competitivos y adaptados a cada necesidad. Contactar para más información y sin compromiso. Atención personalizada y garantía de satisfacción. Ubicación: ${provincia}.`;
        
        // Generar precio según categoría
        let precio = null;
        if (categoria === 'vivienda') {
          precio = Math.floor(Math.random() * 1500) + 300; // 300-1800€
        } else if (categoria === 'transporte') {
          precio = Math.floor(Math.random() * 100) + 20; // 20-120€
        } else if (categoria === 'tecnología') {
          precio = Math.floor(Math.random() * 200) + 50; // 50-250€
        } else if (categoria === 'salud') {
          precio = Math.floor(Math.random() * 80) + 30; // 30-110€
        } else if (categoria === 'empleo') {
          precio = Math.floor(Math.random() * 3000) + 1000; // 1000-4000€
        } else if (categoria === 'formacion') {
          precio = Math.floor(Math.random() * 150) + 25; // 25-175€
        } else {
          precio = Math.floor(Math.random() * 100) + 10; // 10-110€
        }
        
        // Seleccionar modalidad según categoría
        let modalidad = 'servicio';
        if (categoria === 'vivienda') modalidad = 'venta';
        else if (categoria === 'empleo') modalidad = 'servicio';
        else if (categoria === 'transporte') modalidad = 'servicio';
        else if (Math.random() > 0.5) modalidad = 'intercambio';
        
        // Insertar anuncio
        await connection.execute(`
          INSERT INTO anuncios (
            id, usuario_id, titulo, descripcion, categoria, subcategoria,
            comunidad_id, provincia_id, barrio, precio, modalidad,
            contacto_email, contacto_telefono, contacto_anonimo, visible,
            estado_moderacion, vistas, creado_at, actualizado_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [
          `new-${categoria}-${i + 1}`,
          usuario.id,
          titulo,
          descripcion,
          categoria,
          null,
          Math.floor(Math.random() * 50) + 1, // comunidad_id aleatorio
          Math.floor(Math.random() * 50) + 1, // provincia_id aleatorio
          null,
          precio,
          modalidad,
          1, // contacto_email
          Math.random() > 0.3 ? 1 : 0, // contacto_telefono
          0, // contacto_anonimo
          1, // visible
          'approved', // estado_moderacion
          Math.floor(Math.random() * 1000) + 100 // vistas
        ]);
        
        totalAnunciosCreados++;
      }
      
      console.log(`✅ Creados 100 anuncios para ${categoria}`);
    }
    
    // 6. Verificar resultados
    const [resultado] = await connection.execute(`
      SELECT categoria, COUNT(*) as total 
      FROM anuncios 
      GROUP BY categoria 
      ORDER BY categoria
    `);
    
    console.log('\n📊 Resumen final de anuncios por categoría:');
    resultado.forEach(row => {
      console.log(`   - ${row.categoria}: ${row.total} anuncios`);
    });
    
    const [total] = await connection.execute('SELECT COUNT(*) as total FROM anuncios');
    console.log(`\n🎉 Total de anuncios en la base de datos: ${total[0].total}`);
    console.log(`🆕 Nuevos anuncios creados: ${totalAnunciosCreados}`);
    
    await connection.end();
    
    console.log('\n✅ Proceso completado exitosamente');
    console.log('📝 Ahora puedes reiniciar el servidor para que cargue todos los nuevos datos');
    
  } catch (error) {
    console.error('❌ Error en el proceso:', error.message);
    if (connection) await connection.end();
  }
}

expandCategories();
