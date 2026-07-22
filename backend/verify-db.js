const mysql = require('mysql2/promise');

async function verifyDatabase() {
  console.log('🔍 Verificando integridad de la base de datos...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión exitosa');
    
    // Verificar estructura completa
    const verificationResults = {
      tables: {},
      data: {},
      constraints: {}
    };
    
    // 1. Verificar tablas
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Verificando tablas...');
    
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      
      // Contar registros
      const [count] = await connection.execute(`SELECT COUNT(*) as total FROM ${tableName}`);
      verificationResults.tables[tableName] = count[0].total;
      
      console.log(`   - ${tableName}: ${count[0].total} registros`);
    }
    
    // 2. Verificar datos de anuncios
    if (verificationResults.tables.anuncios > 0) {
      console.log('📊 Verificando datos de anuncios...');
      
      // Categorías
      const [categories] = await connection.execute('SELECT categoria, COUNT(*) as count FROM anuncios GROUP BY categoria');
      verificationResults.data.categories = categories;
      
      // Comunidades autónomas
      const [communities] = await connection.execute('SELECT DISTINCT comunidad_autonoma FROM anuncios WHERE comunidad_autonoma IS NOT NULL');
      verificationResults.data.communities = communities.length;
      
      // Provincias
      const [provinces] = await connection.execute('SELECT DISTINCT provincia FROM anuncios WHERE provincia IS NOT NULL');
      verificationResults.data.provinces = provinces.length;
      
      console.log(`   - Categorías: ${categories.length}`);
      console.log(`   - Comunidades autónomas: ${communities.length}`);
      console.log(`   - Provincias: ${provinces.length}`);
    }
    
    // 3. Verificar usuarios
    if (verificationResults.tables.usuarios > 0) {
      console.log('👥 Verificando usuarios...');
      
      const [users] = await connection.execute('SELECT COUNT(*) as total FROM usuarios');
      verificationResults.data.users = users[0].total;
      
      console.log(`   - Usuarios totales: ${users[0].total}`);
    }
    
    // 4. Verificar integridad de datos
    console.log('🔍 Verificando integridad de datos...');
    
    // Anuncios con usuarios válidos
    const [validAnuncios] = await connection.execute(`
      SELECT COUNT(*) as total FROM anuncios a 
      LEFT JOIN usuarios u ON a.usuario_id = u.id 
      WHERE u.id IS NOT NULL
    `);
    
    verificationResults.constraints.validUserReferences = validAnuncios[0].total;
    console.log(`   - Anuncios con usuarios válidos: ${validAnuncios[0].total}`);
    
    // Anuncios sin usuario válido
    const [invalidAnuncios] = await connection.execute(`
      SELECT COUNT(*) as total FROM anuncios a 
      LEFT JOIN usuarios u ON a.usuario_id = u.id 
      WHERE u.id IS NULL
    `);
    
    verificationResults.constraints.invalidUserReferences = invalidAnuncios[0].total;
    console.log(`   - Anuncios con usuarios inválidos: ${invalidAnuncios[0].total}`);
    
    // 5. Verificar columnas importantes
    console.log('📋 Verificando columnas importantes...');
    
    const [columns] = await connection.execute('DESCRIBE anuncios');
    const importantColumns = ['id', 'usuario_id', 'titulo', 'descripcion', 'categoria', 'comunidad_autonoma', 'provincia', 'precio', 'creado_at'];
    
    const foundColumns = columns.map(col => col.Field);
    const missingColumns = importantColumns.filter(col => !foundColumns.includes(col));
    
    if (missingColumns.length === 0) {
      console.log('   - ✅ Todas las columnas importantes presentes');
    } else {
      console.log(`   - ❌ Columnas faltantes: ${missingColumns.join(', ')}`);
    }
    
    await connection.end();
    
    // Resumen final
    console.log('\n📊 RESUMEN DE VERIFICACIÓN:');
    console.log(`✅ Tablas verificadas: ${Object.keys(verificationResults.tables).length}`);
    console.log(`📊 Total anuncios: ${verificationResults.tables.anuncios || 0}`);
    console.log(`👥 Total usuarios: ${verificationResults.data.users || 0}`);
    console.log(`🏛️ Comunidades autónomas: ${verificationResults.data.communities || 0}`);
    console.log(`📍 Provincias: ${verificationResults.data.provinces || 0}`);
    console.log(`🔗 Referencias válidas: ${verificationResults.constraints.validUserReferences || 0}`);
    console.log(`❌ Referencias inválidas: ${verificationResults.constraints.invalidUserReferences || 0}`);
    
    console.log('\n🎉 Verificación de base de datos completada');
    
  } catch (error) {
    console.error('❌ Error verificando base de datos:', error.message);
  }
}

verifyDatabase();
