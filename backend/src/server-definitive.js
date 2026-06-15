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

console.log('🚀 Iniciando servidor definitivo de CityPaj');

// Variables globales para datos cacheados
let cachedAnuncios = [];
let lastCacheUpdate = null;
let dataLoaded = false;

// Función para cargar datos reales de la base de datos
async function loadRealData() {
  console.log('📊 Cargando datos reales de la base de datos citypaj...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión a base de datos exitosa');
    
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
    dataLoaded = true;
    
    console.log(`✅ Cargados ${cachedAnuncios.length} anuncios reales de la base de datos`);
    console.log(`📅 Última actualización: ${lastCacheUpdate.toISOString()}`);
    
    // Mostrar distribución por categorías
    const distribution = {};
    cachedAnuncios.forEach(anuncio => {
      distribution[anuncio.categoria] = (distribution[anuncio.categoria] || 0) + 1;
    });
    
    console.log('📊 Distribución por categorías:');
    Object.entries(distribution).forEach(([cat, count]) => {
      console.log(`   - ${cat}: ${count} anuncios`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error cargando datos reales:', error.message);
    
    // Generar datos de ejemplo robustos si falla la conexión
    console.log('🔄 Generando datos de ejemplo como respaldo...');
    cachedAnuncios = generateRobustMockData();
    lastCacheUpdate = new Date();
    dataLoaded = true;
    
    console.log(`✅ Generados ${cachedAnuncios.length} anuncios de ejemplo`);
    return false;
  }
}

function generateRobustMockData() {
  console.log('🏗️  Generando datos de ejemplo robustos...');
  
  const categories = ['empleo', 'servicios', 'formacion', 'ocio', 'comunidad'];
  const comunidades = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Zaragoza', 'Murcia'];
  const provincias = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bizkaia', 'Málaga', 'Zaragoza', 'Murcia'];
  
  const titulos = {
    empleo: [
      'Desarrollador Web Full Stack', 'Diseñador/a UX/UI', 'Marketing Digital', 
      'Administrativo/a', 'Técnico/a Informático', 'Contable', 'Recepcionista',
      'Vendedor/a', 'Encargado/a de Tienda', 'Auxiliar Administrativo'
    ],
    servicios: [
      'Fontanería', 'Electricista', 'Carpintero/a', 'Pintor/a', 'Jardinero/a',
      'Limpieza', 'Mecánico/a', 'Reparaciones', 'Mantenimiento', 'Instalaciones'
    ],
    formacion: [
      'Clases de Inglés', 'Curso de Programación', 'Taller de Fotografía',
      'Clases de Música', 'Curso de Cocina', 'Clases de Matemáticas',
      'Curso de Marketing', 'Taller de Arte', 'Clases de Baile', 'Curso de Idiomas'
    ],
    ocio: [
      'Partido de Fútbol', 'Excursión a la Montaña', 'Cine en el Parque',
      'Concierto de Rock', 'Taller de Pintura', 'Noche de Juegos',
      'Visita a Museo', 'Ruta en Bicicleta', 'Torneo de Padel', 'Picnic en el Parque'
    ],
    comunidad: [
      'Voluntariado', 'Recolección de Alimentos', 'Limpieza de Playas',
      'Visita a Ancianos', 'Taller Reciclaje', 'Campaña Solidaria',
      'Ayuda Escolar', 'Banco de Alimentos', 'Proyecto Medioambiental', 'Apoyo Comunitario'
    ]
  };
  
  const anuncios = [];
  let id = 1;
  
  for (const category of categories) {
    const categoryTitles = titulos[category];
    
    for (let i = 0; i < 200; i++) {
      const titleBase = categoryTitles[i % categoryTitles.length];
      const comunidadIndex = Math.floor(Math.random() * comunidades.length);
      const usuarioIndex = Math.floor(Math.random() * 10) + 1;
      
      anuncios.push({
        id: `mock-${category}-${i + 1}`,
        titulo: `${titleBase} #${i + 1}`,
        descripcion: `Descripción detallada para ${titleBase} #${i + 1}. Servicio profesional con más de ${Math.floor(Math.random() * 10) + 1} años de experiencia. Disponibilidad inmediata y flexible. Precios competitivos y adaptados a cada necesidad. Contactar para más información y sin compromiso. Atención personalizada y garantía de satisfacción.`,
        categoria: category,
        subcategoria: null,
        comunidad_autonoma: comunidades[comunidadIndex],
        provincia: provincias[comunidadIndex],
        barrio: null,
        precio: Math.floor(Math.random() * 500) + 50,
        modalidad: 'servicio',
        contacto_email: true,
        contacto_telefono: Math.random() > 0.3,
        contacto_anonimo: false,
        visible: true,
        estado_moderacion: 'approved',
        usuario_id: `user-${usuarioIndex}`,
        usuario_nombre: `Usuario ${usuarioIndex}`,
        email: `user${usuarioIndex}@example.com`,
        creado: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        actualizado: new Date().toISOString()
      });
      id++;
    }
  }
  
  return anuncios;
}

// Cargar datos al iniciar
loadRealData().then(success => {
  console.log(`🎉 Servidor iniciado con ${success ? 'datos reales' : 'datos de ejemplo'}`);
});

// Endpoint principal de anuncios
app.get('/api/anuncios', async (req, res) => {
  try {
    // Esperar a que los datos se carguen
    if (!dataLoaded) {
      return res.status(503).json({
        success: false,
        error: 'Servidor inicializando datos',
        message: 'Por favor, espere unos segundos y vuelva a intentar'
      });
    }
    
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
    
    if (req.query.comunidad_autonoma) {
      filteredAnuncios = filteredAnuncios.filter(a => 
        a.comunidad_autonoma && a.comunidad_autonoma.toLowerCase().includes(req.query.comunidad_autonoma.toLowerCase())
      );
    }
    
    if (req.query.provincia) {
      filteredAnuncios = filteredAnuncios.filter(a => 
        a.provincia && a.provincia.toLowerCase().includes(req.query.provincia.toLowerCase())
      );
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
          usando_datos_reales: cachedAnuncios.length > 0 && cachedAnuncios[0].id.startsWith('07'),
          data_loaded: dataLoaded
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
    if (!dataLoaded) {
      return res.status(503).json({
        success: false,
        error: 'Servidor inicializando datos',
        message: 'Por favor, espere unos segundos y vuelva a intentar'
      });
    }
    
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
    if (!dataLoaded) {
      return res.status(503).json({
        success: false,
        error: 'Servidor inicializando datos',
        message: 'Por favor, espere unos segundos y vuelva a intentar'
      });
    }
    
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
            usando_datos_reales: cachedAnuncios.length > 0 && cachedAnuncios[0].id.startsWith('07'),
            data_loaded: dataLoaded
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
            usando_datos_reales: cachedAnuncios.length > 0 && cachedAnuncios[0].id.startsWith('07'),
            data_loaded: dataLoaded
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
    dataLoaded = false;
    const success = await loadRealData();
    
    res.json({
      success: true,
      message: success ? 'Datos recargados desde la base de datos' : 'Datos generados como ejemplo',
      data: {
        total_anuncios: cachedAnuncios.length,
        ultima_actualizacion: lastCacheUpdate,
        usando_datos_reales: cachedAnuncios.length > 0 && cachedAnuncios[0].id.startsWith('07'),
        data_loaded: dataLoaded
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
      data_loaded: dataLoaded,
      servidor: 'Funcionando con cache de datos',
      modo: cachedAnuncios.length > 0 && cachedAnuncios[0].id.startsWith('07') ? 'Datos Reales' : 'Datos de Ejemplo'
    }
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor definitivo corriendo en http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`📝 Anuncios endpoints: http://0.0.0.0:${PORT}/api/anuncios`);
  console.log(`⚡ Realtime endpoint: http://0.0.0.0:${PORT}/api/database/realtime`);
  console.log(`🔄 Reload endpoint: http://0.0.0.0:${PORT}/api/admin/reload-data`);
  console.log('✅ Servidor listo para recibir peticiones');
});
