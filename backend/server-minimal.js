const express = require('express');
const cors = require('cors');

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

console.log('🚀 Iniciando servidor minimal de CityPaj');

// Datos de ejemplo minimalistas
const anunciosEjemplo = [
  {
    id: '1',
    titulo: 'Guitarra eléctrica',
    descripcion: 'Guitarra en excelente estado',
    categoria: 'otros',
    precio: 450,
    comunidad_autonoma: 'Andalucía',
    provincia: 'Almería'
  },
  {
    id: '2',
    titulo: 'Clases de yoga',
    descripcion: 'Clases personalizadas',
    categoria: 'salud',
    precio: 25,
    comunidad_autonoma: 'Aragón',
    provincia: 'Huesca'
  }
];

// Endpoint principal de anuncios
app.get('/api/anuncios', (req, res) => {
  console.log('📝 Petición recibida a /api/anuncios');
  
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const offset = (pagina - 1) * limite;
    
    // Filtrar datos
    let filteredAnuncios = [...anunciosEjemplo];
    
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
        total_paginas: Math.ceil(total / limite)
      }
    });

  } catch (error) {
    console.error('❌ Error procesando anuncios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener anuncios'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mode: 'MINIMAL',
    total_anuncios: anunciosEjemplo.length
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor minimal corriendo en http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
  console.log('✅ Servidor minimal listo para recibir peticiones');
});
