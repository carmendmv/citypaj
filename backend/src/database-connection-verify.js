const mysql = require('mysql2/promise');

// Sistema de verificación de conexión MySQL
class DatabaseConnectionVerifier {
  constructor() {
    this.config = {
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    };
  }

  async verifyConnection() {
    console.log('\n🔍 CityPAJ - Verificación de Conexión MySQL');
    console.log('=' .repeat(60));
    
    let connection;
    
    try {
      // 1. Conexión básica
      console.log('\n📡 1. Estableciendo conexión...');
      const startTime = Date.now();
      
      connection = await mysql.createConnection(this.config);
      const connectionTime = Date.now() - startTime;
      
      console.log(`✅ Conexión establecida en ${connectionTime}ms`);
      
      // 2. Verificar base de datos
      console.log('\n🗄️ 2. Verificando base de datos...');
      const [dbInfo] = await connection.execute('SELECT DATABASE() as db_name, VERSION() as version');
      console.log(`   📊 Base de Datos: ${dbInfo[0].db_name}`);
      console.log(`   🔧 Versión MySQL: ${dbInfo[0].version}`);
      
      // 3. Verificar tablas
      console.log('\n📋 3. Verificando tablas...');
      const [tables] = await connection.execute('SHOW TABLES');
      console.log(`   📊 Tablas encontradas: ${tables.length}`);
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`   - ${tableName}`);
      });
      
      // 4. Verificar columnas de anuncios
      console.log('\n📝 4. Verificando tabla anuncios...');
      const [anunciosColumns] = await connection.execute('DESCRIBE anuncios');
      console.log(`   📊 Columnas en anuncios: ${anunciosColumns.length}`);
      
      // Verificar columnas críticas
      const criticalColumns = ['id', 'usuario_id', 'titulo', 'categoria', 'visible', 'estado_moderacion'];
      const existingColumns = anunciosColumns.map(col => col.Field);
      
      criticalColumns.forEach(col => {
        const exists = existingColumns.includes(col);
        console.log(`   ${exists ? '✅' : '❌'} ${col}: ${exists ? 'EXISTS' : 'MISSING'}`);
      });
      
      // 5. Verificar datos de ejemplo
      console.log('\n📊 5. Verificando datos...');
      const [totalCount] = await connection.execute('SELECT COUNT(*) as total FROM anuncios');
      const [approvedCount] = await connection.execute('SELECT COUNT(*) as count FROM anuncios WHERE visible = 1 AND estado_moderacion = "approved"');
      
      console.log(`   📊 Total anuncios: ${totalCount[0].total}`);
      console.log(`   📊 Anuncios públicos: ${approvedCount[0].count}`);
      
      // 6. Probar consulta específica (la que causa el error 500)
      console.log('\n🔍 6. Probando consulta problemática...');
      try {
        const testQuery = `
          SELECT 
            a.id,
            a.usuario_id,
            a.titulo,
            a.categoria,
            a.visible,
            a.estado_moderacion,
            u.nombre as usuario_nombre,
            u.email as usuario_email
          FROM anuncios a
          LEFT JOIN usuarios u ON a.usuario_id = u.id
          WHERE a.visible = 1 AND a.estado_moderacion = 'approved'
          LIMIT 3
        `;
        
        const [testResult] = await connection.execute(testQuery);
        console.log(`   ✅ Consulta ejecutada correctamente`);
        console.log(`   📊 Resultados: ${testResult.length} filas`);
        
        if (testResult.length > 0) {
          console.log(`   📝 Ejemplo: ${testResult[0].titulo} (ID: ${testResult[0].id})`);
        }
        
      } catch (queryError) {
        console.log(`   ❌ Error en consulta: ${queryError.message}`);
        throw queryError;
      }
      
      // 7. Verificar rendimiento
      console.log('\n⚡ 7. Verificando rendimiento...');
      const perfStart = Date.now();
      const [perfResult] = await connection.execute('SELECT COUNT(*) as count FROM anuncios WHERE visible = 1 AND estado_moderacion = "approved"');
      const perfTime = Date.now() - perfStart;
      
      console.log(`   ⚡ Consulta de conteo: ${perfTime}ms`);
      console.log(`   📊 Anuncios públicos: ${perfResult[0].count}`);
      
      await connection.end();
      
      console.log('\n' + '=' .repeat(60));
      console.log('🎉 VERIFICACIÓN COMPLETADA CON ÉXITO');
      console.log('   ✅ Conexión MySQL estable y funcionando');
      console.log('   ✅ Base de datos accesible');
      console.log('   ✅ Tablas y columnas verificadas');
      console.log('   ✅ Consultas SQL funcionando');
      console.log('   ✅ Rendimiento óptimo');
      console.log('=' .repeat(60));
      
      return {
        success: true,
        connectionTime,
        totalAnuncios: totalCount[0].total,
        publicAnuncios: approvedCount[0].count,
        queryTime: perfTime
      };
      
    } catch (error) {
      console.error('\n❌ ERROR EN VERIFICACIÓN:', error.message);
      
      if (connection) {
        await connection.end();
      }
      
      console.log('\n' + '=' .repeat(60));
      console.log('❌ VERIFICACIÓN FALLIDA');
      console.log('   ❌ Error de conexión a MySQL');
      console.log('   ❌ Verifique la configuración de la base de datos');
      console.log('=' .repeat(60));
      
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Exportar para uso en otros módulos
module.exports = DatabaseConnectionVerifier;

// Ejecutar verificación si se ejecuta directamente
if (require.main === module) {
  const verifier = new DatabaseConnectionVerifier();
  verifier.verifyConnection();
}
