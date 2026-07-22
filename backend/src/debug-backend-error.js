const mysql = require('mysql2/promise');

async function debugBackendError() {
  console.log('🔍 DEBUG - ERROR EN BACKEND');
  console.log('=' .repeat(40));
  
  try {
    // 1. Verificar si el backend está usando el pool correctamente
    console.log('\n📋 1. Test pool como el controlador:');
    
    const pool = mysql.createPool({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      idleTimeout: 60000,
    });
    
    try {
      const connection = await pool.getConnection();
      console.log('   ✅ Conexión del pool obtenida');
      
      // Test query exacta del controlador
      const whereClause = 'a.visible = 1 AND a.estado_moderacion = \'approved\'';
      const orderBy = 'a.creado_at DESC';
      const limit = 3;
      const offset = 0;
      
      const query = `
        SELECT 
          a.id,
          a.usuario_id,
          a.titulo,
          a.descripcion,
          a.categoria,
          a.subcategoria,
          a.comunidad_id,
          a.provincia_id,
          a.comunidad_autonoma,
          a.provincia,
          a.barrio,
          a.modalidad,
          a.contacto_email,
          a.contacto_telefono,
          a.contacto_anonimo,
          a.visible,
          a.estado_moderacion,
          a.motivo_rechazo,
          a.vistas,
          a.creado_at,
          a.actualizado_at,
          u.nombre as usuario_nombre,
          u.email as usuario_email
        FROM anuncios a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        WHERE ${whereClause}
        ORDER BY ${orderBy}
        LIMIT ? OFFSET ?
      `;
      
      const [anunciosResult] = await connection.execute(query, [limit, offset]);
      console.log(`   ✅ Query principal: ${anunciosResult.length} filas`);
      
      // Test query de conteo
      const countQuery = `
        SELECT COUNT(*) as total
        FROM anuncios a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        WHERE ${whereClause}
      `;
      
      const [countResult] = await connection.execute(countQuery);
      console.log(`   ✅ Query conteo: ${countResult[0].total} total`);
      
      // Procesar booleanos como el controlador
      const processedAnuncios = anunciosResult.map((anuncio) => ({
        ...anuncio,
        contacto_email: Boolean(anuncio.contacto_email),
        contacto_telefono: Boolean(anuncio.contacto_telefono),
        contacto_anonimo: Boolean(anuncio.contacto_anonimo),
        visible: Boolean(anuncio.visible)
      }));
      
      console.log(`   ✅ Procesamiento: ${processedAnuncios.length} anuncios procesados`);
      
      // Crear respuesta como el controlador
      const response = {
        success: true,
        data: processedAnuncios,
        meta: {
          page: 1,
          limit: 3,
          total: parseInt(countResult[0].total),
          totalPages: Math.ceil(parseInt(countResult[0].total) / 3),
          hasNext: true,
          hasPrev: false,
          queryTime: '5ms'
        }
      };
      
      console.log('   ✅ Respuesta JSON creada correctamente');
      console.log(`   📊 Total en meta: ${response.meta.total}`);
      console.log(`   📊 Primer anuncio ID: ${response.data[0]?.id}`);
      
      connection.release();
      await pool.end();
      
    } catch (poolError) {
      console.log(`   ❌ Error en pool: ${poolError.message}`);
      await pool.end();
    }
    
    // 2. Verificar si hay errores de TypeScript
    console.log('\n📋 2. Verificar errores de compilación:');
    try {
      const { execSync } = require('child_process');
      const result = execSync('npx tsc --noEmit', { encoding: 'utf8', cwd: process.cwd() });
      console.log('   ✅ Sin errores de TypeScript');
    } catch (tscError) {
      console.log(`   ❌ Error TypeScript: ${tscError.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error en debug:', error.message);
  }
  
  console.log('\n' + '=' .repeat(40));
  console.log('🔍 DEBUG COMPLETADO');
}

debugBackendError();
