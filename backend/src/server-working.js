const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://172.28.138.61:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

console.log('🚀 Iniciando servidor CityPaj con solución alternativa');

// Cargar datos reales de la base de datos al iniciar
let cachedAnuncios = [];
let lastCacheUpdate = null;

async function loadRealData() {
  console.log('📊 Cargando datos reales de la base de datos...');
  
  try {
    // Conectar temporalmente para obtener los datos
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    // Obtener todos los anuncios con información de usuarios
    const [anuncios] = await connection.execute(`
      SELECT 
        anuncios.*,
        usuarios.nombre as usuario_nombre,
        usuarios.email as email
      FROM anuncios
      LEFT JOIN usuarios ON anuncios.usuario_id = usuarios.id
      WHERE anuncios.visible = 1 AND anuncios.estado_moderacion = 'approved'
      ORDER BY anuncios.id DESC
    `);
    
    await connection.end();
    
    cachedAnuncios = anuncios;
    lastCacheUpdate = new Date();
    
    console.log(`✅ Cargados ${cachedAnuncios.length} anuncios reales de la base de datos`);
    console.log(`📅 Última actualización: ${lastCacheUpdate.toISOString()}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error cargando datos reales:', error.message);
    
    // Generar datos de ejemplo si falla la conexión
    console.log('🔄 Generando datos de ejemplo como respaldo...');
    cachedAnuncios = generateExampleData();
    lastCacheUpdate = new Date();
    
    console.log(`✅ Generados ${cachedAnuncios.length} anuncios de ejemplo`);
    return false;
  }
}

function generateExampleData() {
  const categories = ['empleo', 'servicios', 'formacion', 'ocio', 'comunidad'];
  const anuncios = [];
  
  let id = 1;
  for (const category of categories) {
    for (let i = 0; i < 200; i++) {
      anuncios.push({
        id: `example-${category}-${i}`,
        titulo: `Ejemplo ${category} #${i + 1}`,
        descripcion: `Descripción detallada para anuncio de ${category}. Este es un ejemplo generado automáticamente mientras se resuelve el problema de conexión a la base de datos.`,
        categoria: category,
        subcategoria: null,
        comunidad_autonoma: Math.random() > 0.5 ? 'Madrid' : 'Barcelona',
        provincia: Math.random() > 0.5 ? 'Madrid' : 'Barcelona',
        barrio: null,
        precio: Math.floor(Math.random() * 1000) + 50,
        modalidad: 'servicio',
        contacto_email: true,
        contacto_telefono: true,
        contacto_anonimo: false,
        visible: true,
        estado_moderacion: 'approved',
        usuario_id: `user-${(i % 3) + 1}`,
        usuario_nombre: `Usuario ${(i % 3) + 1}`,
        email: `user${(i % 3) + 1}@example.com`,
        creado: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        actualizado: new Date().toISOString()
      });
      id++;
    }
  }
  
  return anuncios;
}

// Cargar datos al iniciar
loadRealData();

// Endpoint principal de anuncios
app.get('/api/anuncios', async (req, res) => {
  try {
    console.log('📊 Procesando solicitud de anuncios...');
    
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const offset = (pagina - 1) * limite;
    
    // Filtrar datos cacheados
    let filteredAnuncios = [...cachedAnuncios];
    
    if (req.query.categoria) {
      filteredAnuncios = filteredAnuncios.filter(a => a.categoria === req.query.categoria);
    }
    
    if (req.query.buscar) {
      const searchTerm = req.query.buscar.toLowerCase();
      filteredAnuncios = filteredAnuncios.filter(a => 
        a.titulo.toLowerCase().includes(searchTerm) ||
        a.descripcion.toLowerCase().includes(searchTerm)
      );
    }
    
    if (req.query.precio_min) {
      filteredAnuncios = filteredAnuncios.filter(a => a.precio >= parseFloat(req.query.precio_min));
    }
    
    if (req.query.precio_max) {
      filteredAnuncios = filteredAnuncios.filter(a => a.precio <= parseFloat(req.query.precio_max));
    }
    
    // Ordenamiento
    if (req.query.orden) {
      switch (req.query.orden) {
        case 'fecha_asc':
          filteredAnuncios.sort((a, b) => new Date(a.creado).getTime() - new Date(b.creado).getTime());
          break;
        case 'fecha_desc':
          filteredAnuncios.sort((a, b) => new Date(b.creado).getTime() - new Date(a.creado).getTime());
          break;
        case 'precio_asc':
          filteredAnuncios.sort((a, b) => (a.precio || 0) - (b.precio || 0));
          break;
        case 'precio_desc':
          filteredAnuncios.sort((a, b) => (b.precio || 0) - (a.precio || 0));
          break;
        default:
          filteredAnuncios.sort((a, b) => new Date(b.creado).getTime() - new Date(a.creado).getTime());
      }
    }
    
    // Paginación
    const paginatedAnuncios = filteredAnuncios.slice(offset, offset + limite);
    const total = filteredAnuncios.length;
    
    console.log(`✅ Devolviendo ${paginatedAnuncios.length} anuncios de ${total} totales`);

    res.json({
      success: true,
      data: paginatedAnuncios,
      meta: {
        pagina,
        limite,
        total,
        total_paginas: Math.ceil(total / limite),
        cache_info: {
          total_cacheados: cachedAnuncios.length,
          ultima_actualizacion: lastCacheUpdate,
          usando_datos_reales: cachedAnuncios.length > 0 && cachedAnuncios[0].id.startsWith('07')
        }
      }
    });

  } catch (error) {
    console.error('❌ Error procesando anuncios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener anuncios',
      details: error.message
    });
  }
});

// Endpoint de detalle de anuncio
app.get('/api/anuncios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const anuncio = cachedAnuncios.find(a => a.id === id);
    
    if (!anuncio) {
      return res.status(404).json({
        success: false,
        error: 'Anuncio no encontrado'
      });
    }

    res.json({
      success: true,
      data: anuncio
    });

  } catch (error) {
    console.error('❌ Error obteniendo anuncio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener anuncio',
      details: error.message
    });
  }
});

// Endpoint de tiempo real
app.get('/api/database/realtime', async (req, res) => {
  try {
    const { categoria, comunidad, format = 'json' } = req.query;
    
    let filteredAnuncios = [...cachedAnuncios];
    
    if (categoria) {
      filteredAnuncios = filteredAnuncios.filter(a => a.categoria === categoria);
    }
    
    if (comunidad) {
      filteredAnuncios = filteredAnuncios.filter(a => 
        a.comunidad_autonoma && a.comunidad_autonoma.toLowerCase().includes(comunidad.toLowerCase())
      );
    }

    if (format === 'categorized') {
      const dataByCategory = filteredAnuncios.reduce((acc, anuncio) => {
        if (!acc[anuncio.categoria]) {
          acc[anuncio.categoria] = [];
        }
        acc[anuncio.categoria].push(anuncio);
        return acc;
      }, {});

      res.json({
        success: true,
        data: dataByCategory,
        meta: {
          total: filteredAnuncios.length,
          categories: Object.keys(dataByCategory),
          cache_info: {
            total_cacheados: cachedAnuncios.length,
            ultima_actualizacion: lastCacheUpdate,
            usando_datos_reales: cachedAnuncios.length > 0 && cachedAnuncios[0].id.startsWith('07')
          }
        }
      });
    } else {
      res.json({
        success: true,
        data: filteredAnuncios,
        meta: {
          total: filteredAnuncios.length,
          cache_info: {
            total_cacheados: cachedAnuncios.length,
            ultima_actualizacion: lastCacheUpdate,
            usando_datos_reales: cachedAnuncios.length > 0 && cachedAnuncios[0].id.startsWith('07')
          }
        }
      });
    }

  } catch (error) {
    console.error('❌ Error obteniendo datos en tiempo real:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener datos en tiempo real',
      details: error.message
    });
  }
});

// Endpoint para recargar datos
app.post('/api/admin/reload-data', async (req, res) => {
  try {
    console.log('🔄 Recargando datos desde la base de datos...');
    const success = await loadRealData();
    
    res.json({
      success: true,
      message: success ? 'Datos recargados desde la base de datos' : 'Datos generados como ejemplo',
      data: {
        total_anuncios: cachedAnuncios.length,
        ultima_actualizacion: lastCacheUpdate,
        usando_datos_reales: cachedAnuncios.length > 0 && cachedAnuncios[0].id.startsWith('07')
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error recargando datos',
      details: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    data: {
      total_anuncios_cacheados: cachedAnuncios.length,
      ultima_actualizacion_cache: lastCacheUpdate,
      usando_datos_reales: cachedAnuncios.length > 0 && cachedAnuncios[0].id.startsWith('07'),
      servidor: 'Funcionando con cache de datos'
    }
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor alternativo corriendo en http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`📝 Anuncios endpoints: http://0.0.0.0:${PORT}/api/anuncios`);
  console.log(`⚡ Realtime endpoint: http://0.0.0.0:${PORT}/api/database/realtime`);
  console.log(`🔄 Reload endpoint: http://0.0.0.0:${PORT}/api/admin/reload-data`);
  console.log('✅ Servidor listo para recibir peticiones');
});
