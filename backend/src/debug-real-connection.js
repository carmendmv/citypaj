// Verificación EXACTA de la conexión y estructura real
const mysql = require('mysql2/promise');

async function debugRealConnection() {
  console.log('🔍 DEBUG - CONEXIÓN REAL DEL BACKEND');
  console.log('=' .repeat(50));
  
  try {
    // Conexión EXACTAMENTE como la usa el backend
    const pool = mysql.createPool({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    
    console.log('✅ Pool creado');
    
    const connection = await pool.getConnection();
    console.log('✅ Conexión obtenida');
    
    // 1. Verificar base de datos actual
    const [dbResult] = await connection.execute('SELECT DATABASE() as current_db');
    console.log(`📊 Base de datos actual: ${dbResult[0].current_db}`);
    
    // 2. Verificar tablas
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`📊 Tablas encontradas: ${tables.length}`);
    
    const hasAnuncios = tables.some(table => 
      Object.values(table)[0] === 'anuncios'
    );
    
    if (!hasAnuncios) {
      console.log('❌ NO EXISTE TABLA anuncios');
      await connection.release();
      await pool.end();
      return;
    }
    
    // 3. Verificar estructura EXACTA de anuncios
    console.log('\n📋 ESTRUCTURA EXACTA TABLA anuncios:');
    const [columns] = await connection.execute('DESCRIBE anuncios');
    
    console.log(`   📊 Total columnas: ${columns.length}`);
    
    const columnNames = columns.map(col => col.Field);
    console.log('   📝 Columnas:');
    columnNames.forEach(col => {
      console.log(`      - ${col}`);
    });
    
    // 4. Verificar si usuario_id existe
    const hasUsuarioId = columnNames.includes('usuario_id');
    console.log(`\n🔍 ¿Existe usuario_id?: ${hasUsuarioId ? '✅ SÍ' : '❌ NO'}`);
    
    if (!hasUsuarioId) {
      console.log('\n❌ ERROR CONFIRMADO: usuario_id NO EXISTE');
      console.log('📊 Columnas relacionadas con usuario:');
      const userColumns = columnNames.filter(col => 
        col.toLowerCase().includes('usuario') || 
        col.toLowerCase().includes('user') ||
        col.toLowerCase().includes('propietario') ||
        col.toLowerCase().includes('owner')
      );
      
      if (userColumns.length > 0) {
        console.log('   📝 Posibles alternativas:');
        userColumns.forEach(col => console.log(`      - ${col}`));
      } else {
        console.log('   ❌ No hay columnas relacionadas con usuario');
      }
    }
    
    // 5. Verificar si hay datos
    const [count] = await connection.execute('SELECT COUNT(*) as total FROM anuncios');
    console.log(`\n📊 Total anuncios: ${count[0].total}`);
    
    if (count[0].total > 0) {
      // 6. Verificar estructura de datos reales
      const [sample] = await connection.execute('SELECT * FROM anuncios LIMIT 1');
      console.log('\n📝 ESTRUCTURA DE DATOS REALES:');
      Object.keys(sample[0]).forEach(key => {
        console.log(`      ${key}: ${sample[0][key]}`);
      });
    }
    
    // 7. Probar la query que falla
    console.log('\n📋 TEST QUERY QUE FALLA:');
    try {
      const problematicQuery = `
        SELECT a.id, a.usuario_id, a.titulo
        FROM anuncios a
        WHERE a.visible = 1 AND a.estado_moderacion = 'approved'
        LIMIT 1
      `;
      
      console.log(`   SQL: ${problematicQuery.replace(/\s+/g, ' ').trim()}`);
      
      const [result] = await connection.execute(problematicQuery);
      console.log(`   ✅ Query ejecutada: ${result.length} filas`);
      
    } catch (queryError) {
      console.log(`   ❌ Error en query: ${queryError.message}`);
      console.log(`   Código: ${queryError.code}`);
    }
    
    await connection.release();
    await pool.end();
    
    console.log('\n' + '=' .repeat(50));
    console.log('✅ DEBUG CONEXIÓN COMPLETADO');
    
  } catch (error) {
    console.error('❌ Error en debug:', error.message);
  }
}

debugRealConnection();
