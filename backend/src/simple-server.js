const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://172.28.138.61:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mock database
const mockUsers = [];
// Generar anuncios masivos para coincidir con el frontend
function generarAnunciosBackend() {
  const anuncios = [];
  const categorias = ['ocio', 'servicios', 'educacion', 'empleo', 'intercambios', 'noticias'];
  const comunidades = ['Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias', 'Cantabria', 'Castilla-La Mancha', 'Castilla y León', 'Cataluña', 'Comunidad Valenciana', 'Extremadura', 'Galicia', 'Madrid', 'Murcia', 'Navarra', 'País Vasco', 'La Rioja'];
  const provincias = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Zaragoza', 'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón', 'Hospitalet', 'La Coruña', 'Granada', 'Vitoria', 'Elche'];
  const nombres = ['Ana Martínez', 'Carlos Rodríguez', 'María López', 'Juan García', 'Laura Sánchez', 'David Fernández', 'Carmen Pérez', 'José Martín', 'Sofía Gómez', 'Miguel Díaz'];
  const titulos = [
    'Clases particulares', 'Busco compañero para', 'Se regala', 'Vendo', 'Necesito ayuda con', 'Ofrezco servicios de',
    'Busco trabajo como', 'Intercambio de', 'Noticia importante sobre', 'Actividad deportiva', 'Evento cultural',
    'Curso de', 'Taller de', 'Reparación de', 'Mudanza', 'Transporte', 'Cuidado de', 'Asesoría legal',
    'Diseño gráfico', 'Programación', 'Traducciones', 'Fotografía', 'Música', 'Cocina', 'Limpieza'
  ];

  // Generar 420 anuncios para cubrir todos los IDs posibles del frontend
  for (let i = 1; i <= 420; i++) {
    const categoria = categorias[Math.floor(Math.random() * categorias.length)];
    const comunidad = comunidades[Math.floor(Math.random() * comunidades.length)];
    const provincia = provincias[Math.floor(Math.random() * provincias.length)];
    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const titulo = titulos[Math.floor(Math.random() * titulos.length)];
    const diasAtras = Math.floor(Math.random() * 30) + 1;
    const vistas = Math.floor(Math.random() * 500) + 10;
    const precio = Math.random() > 0.5 ? Math.floor(Math.random() * 200) + 10 : 0;

    anuncios.push({
      id: `demo-${i}`,
      usuario_id: `user-${i}`,
      titulo: `${titulo} - Anuncio ${i}`,
      descripcion: `Descripción detallada del anuncio ${i}. Este es un anuncio de ${categoria} en ${comunidad}. Ofrezco/busco servicios de calidad con experiencia garantizada. Para más información, contactar directamente. Disponibilidad inmediata.`,
      categoria: categoria,
      subcategoria: 'general',
      comunidad_autonoma: comunidad,
      provincia: provincia,
      precio: precio,
      modalidad: precio > 0 ? 'venta' : 'servicio',
      autor: nombre,
      usuario_nombre: nombre,
      email: `${nombre.toLowerCase().replace(' ', '.')}${i}@citypaj.es`,
      telefono: `600${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
      contacto_email: true,
      contacto_telefono: Math.random() > 0.3,
      contacto_anonimo: false,
      visible: true,
      estado_moderacion: 'approved',
      creado: new Date(Date.now() - diasAtras * 24 * 60 * 60 * 1000).toISOString(),
      actualizado: new Date(Date.now() - diasAtras * 24 * 60 * 60 * 1000).toISOString(),
      vistas: vistas,
    });
  }

  return anuncios;
}

const mockAnuncios = generarAnunciosBackend();

// JWT Secret
const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = 'your-super-secret-refresh-key-change-in-production';

// Utility functions
function generateRequestId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Middleware para añadir request ID
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || generateRequestId();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, nombre } = req.body;

    // Validaciones básicas
    if (!email || !password || !nombre) {
      return res.status(400).json({
        success: false,
        error: 'Email, password y nombre son obligatorios',
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email no válido',
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres',
      });
    }

    // Validar longitud del nombre
    if (nombre.length < 2 || nombre.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'El nombre debe tener entre 2 y 100 caracteres',
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'El email ya está registrado',
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = {
      id: randomUUID(),
      email: email.toLowerCase(),
      password: hashedPassword,
      nombre: nombre.trim(),
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
      verificado: false,
    };

    // Guardar usuario
    mockUsers.push(newUser);

    // Generar tokens JWT
    const accessToken = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email 
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email 
      },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Responder con éxito
    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        usuario: {
          id: newUser.id,
          email: newUser.email,
          nombre: newUser.nombre,
          verificado: newUser.verificado,
          creado: newUser.creado,
        },
      },
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y password son obligatorios',
      });
    }

    // Buscar usuario por email
    const user = mockUsers.find(u => u.email === email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
      });
    }

    // Generar tokens JWT
    const accessToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Actualizar último acceso
    user.actualizado = new Date().toISOString();

    // Responder con éxito
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        usuario: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          verificado: user.verificado,
          creado: user.creado,
        },
      },
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Sesión cerrada correctamente',
  });
});

// Anuncios routes con filtrado avanzado
app.get('/api/anuncios', (req, res) => {
  try {
    const {
      categoria,
      comunidad_autonoma,
      provincia,
      modalidad,
      precio_min,
      precio_max,
      orden = 'fecha_desc',
      pagina = '1',
      limite = '20',
      buscar
    } = req.query;

    let filtrados = [...mockAnuncios];

    // Filtrar por categoría
    if (categoria) {
      filtrados = filtrados.filter(a => a.categoria === categoria);
    }

    // Filtrar por comunidad autónoma
    if (comunidad_autonoma) {
      filtrados = filtrados.filter(a => a.comunidad_autonoma === comunidad_autonoma);
    }

    // Filtrar por provincia
    if (provincia) {
      filtrados = filtrados.filter(a => a.provincia === provincia);
    }

    // Filtrar por modalidad
    if (modalidad) {
      filtrados = filtrados.filter(a => a.modalidad === modalidad);
    }

    // Filtrar por precio mínimo
    if (precio_min) {
      const min = parseFloat(precio_min);
      filtrados = filtrados.filter(a => a.precio && a.precio >= min);
    }

    // Filtrar por precio máximo
    if (precio_max) {
      const max = parseFloat(precio_max);
      filtrados = filtrados.filter(a => !a.precio || a.precio <= max);
    }

    // Búsqueda por texto en título y descripción
    if (buscar) {
      const termino = buscar.toLowerCase();
      filtrados = filtrados.filter(a => 
        a.titulo.toLowerCase().includes(termino) || 
        a.descripcion.toLowerCase().includes(termino)
      );
    }

    // Ordenamiento
    switch (orden) {
      case 'fecha_asc':
        filtrados.sort((a, b) => new Date(a.creado).getTime() - new Date(b.creado).getTime());
        break;
      case 'fecha_desc':
        filtrados.sort((a, b) => new Date(b.creado).getTime() - new Date(a.creado).getTime());
        break;
      case 'precio_asc':
        filtrados.sort((a, b) => (a.precio || 0) - (b.precio || 0));
        break;
      case 'precio_desc':
        filtrados.sort((a, b) => (b.precio || 0) - (a.precio || 0));
        break;
      default:
        filtrados.sort((a, b) => new Date(b.creado).getTime() - new Date(a.creado).getTime());
    }

    // Paginación
    const page = parseInt(pagina);
    const limit = parseInt(limite);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginados = filtrados.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginados,
      meta: {
        pagina: page,
        limite: limit,
        total: filtrados.length,
        total_paginas: Math.ceil(filtrados.length / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener anuncios',
    });
  }
});

app.get('/api/anuncios/:id', (req, res) => {
  const { id } = req.params;
  const anuncio = mockAnuncios.find(a => a.id === id);
  
  if (!anuncio) {
    return res.status(404).json({
      success: false,
      error: 'Anuncio no encontrado',
    });
  }

  res.json({
    success: true,
    data: anuncio,
  });
});

app.post('/api/anuncios/guardados', (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere un array de IDs',
      });
    }

    // Filtrar anuncios mock por los IDs proporcionados
    const anunciosFiltrados = mockAnuncios.filter(anuncio => 
      ids.includes(anuncio.id)
    );

    res.json({
      success: true,
      data: anunciosFiltrados,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener anuncios guardados',
    });
  }
});

app.post('/api/anuncios/publico', (req, res) => {
  try {
    const { titulo, descripcion, categoria, comunidad_autonoma, provincia, email, telefono } = req.body;
    
    const newAnuncio = {
      id: randomUUID(),
      titulo,
      descripcion,
      categoria,
      subcategoria: null,
      comunidad_autonoma,
      provincia,
      precio: null,
      modalidad: 'servicio',
      autor: email.split('@')[0],
      email,
      telefono,
      contacto_email: true,
      contacto_telefono: !!telefono,
      contacto_anonimo: false,
      visible: true,
      estado_moderacion: 'approved',
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
      vistas: 0,
    };

    mockAnuncios.push(newAnuncio);

    res.status(201).json({
      success: true,
      message: 'Anuncio publicado correctamente',
      data: newAnuncio,
    });
  } catch (error) {
    console.error('Error al publicar anuncio:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    requestId: req.requestId,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong',
    requestId: req.requestId,
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`🔗 API endpoints: http://0.0.0.0:${PORT}/api`);
  console.log(`👥 Auth endpoints: http://0.0.0.0:${PORT}/api/auth`);
  console.log(`📝 Anuncios endpoints: http://0.0.0.0:${PORT}/api/anuncios`);
});

module.exports = app;
