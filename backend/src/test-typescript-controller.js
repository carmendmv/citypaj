// Test del controlador TypeScript convertido a JavaScript para comparar
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
});

async function getAnuncios(req, res) {
  try {
    console.log('📋 Petición recibida:', req.query);
    
    const page = parseInt(req.query.pagina) || 1;
    const limit = parseInt(req.query.limite) || 3;
    const offset = (page - 1) * limit;
    
    // Query simple que funciona
    const query = `
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
    
    const [anunciosResult] = await pool.execute(query, [limit, offset]);
    
    // Query de conteo
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM anuncios WHERE visible = 1 AND estado_moderacion = "approved"'
    );
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    console.log('📊 Resultados:', {
      anuncios: anunciosResult.length,
      total,
      totalPages
    });
    
    const response = {
      success: true,
      data: anunciosResult,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        queryTime: '5ms'
      }
    };
    
    console.log('✅ Respuesta creada');
    res.json(response);
    
  } catch (error) {
    console.error('❌ Error en endpoint:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
}

// Test directo
async function testController() {
  console.log('🔍 TEST CONTROLLER JAVASCRIPT');
  console.log('=' .repeat(40));
  
  const mockReq = {
    query: {
      pagina: '1',
      limite: '3'
    }
  };
  
  const mockRes = {
    json: (data) => {
      console.log('✅ Respuesta JSON:');
      console.log(`📊 Success: ${data.success}`);
      console.log(`📊 Data length: ${data.data.length}`);
      console.log(`📊 Total: ${data.meta.total}`);
      console.log(`📊 Pages: ${data.meta.totalPages}`);
      console.log(`📝 Primer anuncio: ${data.data[0]?.titulo}`);
    },
    status: (code) => ({
      json: (data) => {
        console.log(`❌ Error ${code}: ${data.error}`);
        if (data.details) console.log(`   Details: ${data.details}`);
      }
    })
  };
  
  await getAnuncios(mockReq, mockRes);
  
  await pool.end();
  console.log('\n✅ TEST CONTROLLER COMPLETADO');
}

testController();
