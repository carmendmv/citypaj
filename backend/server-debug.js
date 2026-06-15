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

console.log('🔍 Iniciando servidor de debug de CityPaj');

// Variables globales para datos cacheados
let cachedAnuncios = [];
let lastCacheUpdate = null;
let dataLoaded = false;
let usandoDatosReales = false;

// Cargar datos reales del archivo cache
function loadRealDataFromCache() {
  console.log('📊 Cargando datos reales del cache...');
  
  try {
    const fs = require('fs');
    if (fs.existsSync('src/real-data-cache.json')) {
      const cacheData = JSON.parse(fs.readFileSync('src/real-data-cache.json', 'utf8'));
      cachedAnuncios = cacheData.anuncios;
      lastCacheUpdate = new Date(cacheData.lastCacheUpdate);
      dataLoaded = cacheData.dataLoaded;
      usandoDatosReales = cacheData.usandoDatosReales;
      
      console.log(`✅ Cargados ${cachedAnuncios.length} anuncios reales del cache`);
      console.log(`📅 Última actualización: ${lastCacheUpdate.toISOString()}`);
      
      return true;
    } else {
      console.log('❌ No existe el archivo de cache');
      return false;
    }
  } catch (error) {
    console.error('❌ Error cargando cache:', error.message);
    return false;
  }
}

// Cargar datos al iniciar
const success = loadRealDataFromCache();
console.log(`🎉 Servidor iniciado con ${success ? 'datos reales del cache' : 'error al cargar datos'}`);

// Endpoint principal de anuncios con debug
app.get('/api/anuncios', async (req, res) => {
  console.log('🔍 Debug: Petición recibida a /api/anuncios');
  console.log('🔍 Debug: Query params:', req.query);
  
  try {
    if (!dataLoaded || cachedAnuncios.length === 0) {
      console.log('❌ Debug: Sin datos cacheados');
      return res.status(503).json({
        success: false,
        error: 'Servidor sin datos',
        message: 'Por favor, ejecute force-load-real-data.js primero'
      });
    }
    
    console.log(`🔍 Debug: Total de anuncios cacheados: ${cachedAnuncios.length}`);
    
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const offset = (pagina - 1) * limite;
    
    console.log(`🔍 Debug: Página ${pagina}, límite ${limite}, offset ${offset}`);
    
    // Filtrar datos cacheados
    let filteredAnuncios = [...cachedAnuncios];
    
    if (req.query.categoria) {
      console.log(`🔍 Debug: Filtrando por categoría: ${req.query.categoria}`);
      filteredAnuncios = filteredAnuncios.filter(a => a.categoria === req.query.categoria);
    }
    
    if (req.query.buscar) {
      console.log(`🔍 Debug: Filtrando por búsqueda: ${req.query.buscar}`);
      const searchTerm = req.query.buscar.toLowerCase();
      filteredAnuncios = filteredAnuncios.filter(a => 
        a.titulo.toLowerCase().includes(searchTerm) ||
        a.descripcion.toLowerCase().includes(searchTerm)
      );
    }
    
    console.log(`🔍 Debug: Anuncios después de filtrar: ${filteredAnuncios.length}`);
    
    // Paginación
    const paginatedAnuncios = filteredAnuncios.slice(offset, offset + limite);
    const total = filteredAnuncios.length;
    
    console.log(`🔍 Debug: Enviando ${paginatedAnuncios.length} anuncios paginados`);

    res.json({
      success: true,
      data: paginatedAnuncios,
      meta: {
        pagina,
        limite,
        total,
        total_paginas: Math.ceil(total / limite),
        debug_info: {
          total_cacheados: cachedAnuncios.length,
          filtrados: filteredAnuncios.length,
          paginados: paginatedAnuncios.length
        }
      }
    });

  } catch (error) {
    console.error('❌ Debug: Error procesando anuncios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener anuncios',
      debug_error: error.message
    });
  }
});

// Health check con debug
app.get('/health', (req, res) => {
  console.log('🔍 Debug: Petición a health check');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    debug: {
      total_anuncios_cacheados: cachedAnuncios.length,
      ultima_actualizacion_cache: lastCacheUpdate,
      usando_datos_reales: usandoDatosReales,
      data_loaded: dataLoaded,
      server_mode: 'DEBUG'
    }
  });
});

// Endpoint de debug para ver cache
app.get('/debug/cache', (req, res) => {
  console.log('🔍 Debug: Petición a debug cache');
  res.json({
    debug: true,
    cache_info: {
      total_anuncios: cachedAnuncios.length,
      ultima_actualizacion: lastCacheUpdate,
      data_loaded: dataLoaded,
      usando_datos_reales: usandoDatosReales,
      sample_anuncios: cachedAnuncios.slice(0, 3)
    }
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔍 Servidor de debug corriendo en http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`🔍 Debug cache: http://0.0.0.0:${PORT}/debug/cache`);
  console.log('✅ Servidor de debug listo para recibir peticiones');
});
