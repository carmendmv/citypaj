// Test exacto del pool del controlador MySQL
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  database: 'citypaj',
  user: 'citypaj_user',
  password: 'citypaj123',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  idleTimeout: 60000, // 1 minuto
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.execute('SELECT 1');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error en testConnection:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 TEST POOL DIRECTO');
  console.log('=' .repeat(30));
  
  // Simular la llamada exacta al endpoint
  try {
    const startTime = Date.now();
    
    // Verificar conexión
    if (!(await testConnection())) {
      console.log('❌ Error de conexión');
      return;
    }
    
    // Parámetros simulados
    const page = 1;
    const limit = 3;
    const offset = (page - 1) * limit;
    
    // Construir WHERE clause
    const whereConditions = ['a.visible = 1', 'a.estado_moderacion = \'approved\''];
    const queryParams = [];
    
    // WHERE clause
    const whereClause = whereConditions.join(' AND ');
    
    // ORDER BY
    const orderBy = 'a.creado_at DESC';
    
    // Query principal
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

    queryParams.push(limit, offset);

    // Query para contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM anuncios a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE ${whereClause}
    `;

    // Ejecutar ambas consultas en paralelo
    const connection = await pool.getConnection();
    
    try {
      const [anunciosResult, countResult] = await Promise.all([
        connection.execute(query, queryParams),
        connection.execute(countQuery, queryParams.slice(0, -2))
      ]);

      const total = parseInt(countResult[0].total);
      const totalPages = Math.ceil(total / limit);
      const queryTime = Date.now() - startTime;

      // Convertir booleanos de MySQL a JavaScript
      const processedAnuncios = anunciosResult[0].map((anuncio) => ({
        ...anuncio,
        contacto_email: Boolean(anuncio.contacto_email),
        contacto_telefono: Boolean(anuncio.contacto_telefono),
        contacto_anonimo: Boolean(anuncio.contacto_anonimo),
        visible: Boolean(anuncio.visible)
      }));

      const response = {
        success: true,
        data: processedAnuncios,
        meta: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          queryTime: `${queryTime}ms`
        }
      };

      console.log('✅ ÉXITO - Respuesta creada');
      console.log(`📊 Total anuncios: ${response.meta.total}`);
      console.log(`📊 Páginas: ${response.meta.totalPages}`);
      console.log(`📊 Tiempo: ${response.meta.queryTime}`);
      console.log(`📝 Primer anuncio: ${response.data[0]?.titulo}`);
      
      // Simular respuesta JSON
      console.log('\n📋 Respuesta JSON (primeros 200 chars):');
      console.log(JSON.stringify(response).substring(0, 200) + '...');

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('❌ Error en main:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
  
  console.log('\n✅ TEST POOL COMPLETADO');
}

main();
