const mysql = require('mysql2/promise');

async function expandCategories() {
  console.log('🔄 Expandiendo categorías de anuncios...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión exitosa');
    
    // Definir las nuevas categorías
    const nuevasCategorias = ['transporte', 'vivienda', 'salud', 'tecnología', 'otros'];
    
    // Actualizar el ENUM de la tabla
    await connection.execute(`
      ALTER TABLE anuncios 
      MODIFY COLUMN categoria ENUM('ocio','servicios','formacion','empleo','comunidad','transporte','vivienda','salud','tecnología','otros') NOT NULL
    `);
    console.log('✅ ENUM de categorías actualizado');
    
    // Obtener usuarios existentes
    const [usuarios] = await connection.execute('SELECT id FROM usuarios LIMIT 20');
    console.log(`👥 Usando ${usuarios.length} usuarios existentes`);
    
    // Generar anuncios para cada nueva categoría
    for (const categoria of nuevasCategorias) {
      console.log(`📝 Creando anuncios para categoría: ${categoria}`);
      
      // Títulos específicos para cada categoría
      const titulosPorCategoria = {
        'transporte': ['Coche segunda mano', 'Moto en buen estado', 'Bicicleta eléctrica', 'Patinete eléctrico', 'Servicio de mudanzas'],
        'vivienda': ['Habitación individual', 'Piso compartido', 'Alquiler de apartamento', 'Venta de casa', 'Busco compañero de piso'],
        'salud': ['Clases de yoga', 'Servicio de fisioterapia', 'Productos de salud', 'Consulta nutricionista', 'Ejercicios en casa'],
        'tecnología': ['Portátil gaming', 'Móvil nuevo', 'Tablet iPad', 'Auriculares Bluetooth', 'Smartwatch'],
        'otros': ['Libros universitarios', 'Ropa de temporada', 'Muebles de segunda mano', 'Juegos de mesa', 'Instrumentos musicales']
      };
      
      // Generar 100 anuncios por categoría
      for (let i = 0; i < 100; i++) {
        const usuario = usuarios[Math.floor(Math.random() * usuarios.length)];
        const titulo = typeof titulosPorCategoria[categoria] === 'string' 
          ? titulosPorCategoria[categoria] 
          : titulosPorCategoria[categoria][Math.floor(Math.random() * titulosPorCategoria[categoria].length)];
        
        await connection.execute(`
          INSERT INTO anuncios (
            id, usuario_id, titulo, descripcion, categoria, subcategoria,
            comunidad_id, provincia_id, comunidad_autonoma, provincia,
            precio, modalidad, contacto_email, contacto_telefono, 
            visible, estado_moderacion, creado_at, actualizado_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [
          `id_${categoria}_${i}`,
          usuario.id,
          `${titulo} #${i + 1}`,
          `Descripción detallada para ${titulo} #${i + 1}. Producto en excelente estado.`,
          categoria,
          'general',
          Math.floor(Math.random() * 17) + 1,
          Math.floor(Math.random() * 50) + 1,
          'Andalucía',
          'Almería',
          Math.floor(Math.random() * 1000) + 50,
          'venta',
          1,
          1,
          1,
          'approved'
        ]);
      }
      
      console.log(`✅ Creados 100 anuncios para ${categoria}`);
    }
    
    // Verificar resultados
    const [result] = await connection.execute('SELECT categoria, COUNT(*) as count FROM anuncios GROUP BY categoria ORDER BY count DESC');
    console.log('📊 Distribución final por categorías:');
    result.forEach(row => {
      console.log(`   - ${row.categoria}: ${row.count} anuncios`);
    });
    
    await connection.end();
    console.log('🎉 Categorías expandidas exitosamente');
    
  } catch (error) {
    console.error('❌ Error expandiendo categorías:', error.message);
  }
}

expandCategories();
