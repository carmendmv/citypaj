// Test específico del JOIN que está causando el problema
const mysql = require('mysql2/promise');

async function debugJoinIssue() {
  console.log('🔍 DEBUG - PROBLEMA CON JOIN');
  console.log('=' .repeat(40));
  
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
  
  try {
    // 1. Test query SIN JOIN
    console.log('\n📋 Test 1 - Query SIN JOIN:');
    try {
      const query1 = `
        SELECT 
          a.id,
          a.usuario_id,
          a.titulo,
          a.categoria
        FROM anuncios a
        WHERE a.visible = 1 AND a.estado_moderacion = 'approved'
        LIMIT 3
      `;
      
      const [result1] = await pool.execute(query1);
      console.log(`   ✅ Query sin JOIN: ${result1.length} filas`);
      console.log(`   📝 Primer resultado: ${result1[0]?.titulo}`);
      
    } catch (error1) {
      console.log(`   ❌ Error query sin JOIN: ${error1.message}`);
    }
    
    // 2. Verificar tabla usuarios
    console.log('\n📋 Test 2 - Verificar tabla usuarios:');
    try {
      const [tables] = await pool.execute('SHOW TABLES');
      const hasUsuarios = tables.some(table => 
        Object.values(table)[0] === 'usuarios'
      );
      console.log(`   📊 Tabla usuarios existe: ${hasUsuarios ? '✅' : '❌'}`);
      
      if (hasUsuarios) {
        const [userColumns] = await pool.execute('DESCRIBE usuarios');
        console.log(`   📊 Columnas usuarios: ${userColumns.length}`);
        
        const hasId = userColumns.some(col => col.Field === 'id');
        console.log(`   📊 Columna id existe: ${hasId ? '✅' : '❌'}`);
        
        const [userCount] = await pool.execute('SELECT COUNT(*) as total FROM usuarios');
        console.log(`   📊 Total usuarios: ${userCount[0].total}`);
      }
      
    } catch (error2) {
      console.log(`   ❌ Error verificando usuarios: ${error2.message}`);
    }
    
    // 3. Test query CON JOIN
    console.log('\n📋 Test 3 - Query CON JOIN:');
    try {
      const query3 = `
        SELECT 
          a.id,
          a.usuario_id,
          a.titulo,
          u.nombre as usuario_nombre,
          u.email as usuario_email
        FROM anuncios a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        WHERE a.visible = 1 AND a.estado_moderacion = 'approved'
        LIMIT 3
      `;
      
      const [result3] = await pool.execute(query3);
      console.log(`   ✅ Query con JOIN: ${result3.length} filas`);
      console.log(`   📝 Primer resultado: ${result3[0]?.titulo}`);
      console.log(`   👤 Usuario: ${result3[0]?.usuario_nombre || 'SIN USUARIO'}`);
      
    } catch (error3) {
      console.log(`   ❌ Error query con JOIN: ${error3.message}`);
      console.log(`   📊 Código: ${error3.code}`);
      
      // Si falla el JOIN, probar con alias diferente
      console.log('\n📋 Test 4 - Query CON JOIN (alias diferente):');
      try {
        const query4 = `
          SELECT 
          anuncios.id,
          anuncios.usuario_id,
          anuncios.titulo,
          usuarios.nombre as usuario_nombre,
          usuarios.email as usuario_email
        FROM anuncios
        LEFT JOIN usuarios ON anuncios.usuario_id = usuarios.id
        WHERE anuncios.visible = 1 AND anuncios.estado_moderacion = 'approved'
        LIMIT 3
        `;
        
        const [result4] = await pool.execute(query4);
        console.log(`   ✅ Query JOIN alias: ${result4.length} filas`);
        
      } catch (error4) {
        console.log(`   ❌ Error JOIN alias: ${error4.message}`);
      }
    }
    
    // 4. Test query exacta del backend
    console.log('\n📋 Test 5 - Query EXACTA del backend:');
    try {
      const query5 = `
        SELECT 
          a.id,
          a.titulo,
          a.descripcion,
          a.categoria,
          a.usuario_id,
          a.visible,
          a.estado_moderacion,
          a.creado_at,
          u.nombre as usuario_nombre,
          u.email as usuario_email
        FROM anuncios a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        WHERE a.visible = 1 AND a.estado_moderacion = 'approved'
        ORDER BY a.creado_at DESC
        LIMIT ? OFFSET ?
      `;
      
      const [result5] = await pool.execute(query5, [3, 0]);
      console.log(`   ✅ Query exacta backend: ${result5.length} filas`);
      
    } catch (error5) {
      console.log(`   ❌ Error query exacta: ${error5.message}`);
      console.log(`   📋 Stack: ${error5.stack}`);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  } finally {
    await pool.end();
  }
  
  console.log('\n' + '=' .repeat(40));
  console.log('✅ DEBUG JOIN COMPLETADO');
}

debugJoinIssue();
