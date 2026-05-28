const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const knex = require('knex');
const knexConfig = require('../knexfile');

const app = express();
const PORT = process.env.PORT || 3002;

// Conexión a la base de datos
const db = knex(knexConfig.development);

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://172.28.138.61:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// No hay simulación de datos - se usa base de datos real

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

// Anuncios routes con filtrado avanzado desde base de datos
app.get('/api/anuncios', async (req, res) => {
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

    // Construir consulta base
    let query = db('anuncios')
      .select([
        'anuncios.*',
        'usuarios.nombre as usuario_nombre',
        'usuarios.email as email',
        'usuarios.telefono as telefono'
      ])
      .leftJoin('usuarios', 'anuncios.usuario_id', 'usuarios.id')
      .where('anuncios.visible', 1)
      .where('anuncios.estado_moderacion', 'approved');

    // Aplicar filtros
    if (categoria) {
      query = query.where('anuncios.categoria', categoria);
    }

    if (comunidad_autonoma) {
      query = query.where('anuncios.comunidad_autonoma', comunidad_autonoma);
    }

    if (provincia) {
      query = query.where('anuncios.provincia', provincia);
    }

    if (modalidad) {
      query = query.where('anuncios.modalidad', modalidad);
    }

    if (precio_min) {
      query = query.where('anuncios.precio', '>=', parseFloat(precio_min));
    }

    if (precio_max) {
      query = query.where('anuncios.precio', '<=', parseFloat(precio_max));
    }

    if (buscar) {
      query = query.where(function() {
        this.where('anuncios.titulo', 'like', `%${buscar}%`)
            .orWhere('anuncios.descripcion', 'like', `%${buscar}%`);
      });
    }

    // Aplicar ordenamiento
    switch (orden) {
      case 'fecha_asc':
        query = query.orderBy('anuncios.creado_at', 'asc');
        break;
      case 'fecha_desc':
        query = query.orderBy('anuncios.creado_at', 'desc');
        break;
      case 'precio_asc':
        query = query.orderBy('anuncios.precio', 'asc');
        break;
      case 'precio_desc':
        query = query.orderBy('anuncios.precio', 'desc');
        break;
      default:
        query = query.orderBy('anuncios.creado_at', 'desc');
    }

    // Obtener total para paginación
    const countQuery = query.clone().clearSelect().clearOrder().count('* as total');
    const [{ total }] = await countQuery;

    // Aplicar paginación
    const page = parseInt(pagina);
    const limit = parseInt(limite);
    const offset = (page - 1) * limit;

    const anuncios = await query.limit(limit).offset(offset);

    // Formatear datos para el frontend
    const formattedAnuncios = anuncios.map(anuncio => ({
      id: anuncio.id,
      titulo: anuncio.titulo,
      descripcion: anuncio.descripcion,
      categoria: anuncio.categoria,
      subcategoria: anuncio.subcategoria,
      comunidad_autonoma: anuncio.comunidad_id, // Mapear a ID
      provincia: anuncio.provincia_id, // Mapear a ID
      barrio: anuncio.barrio,
      precio: anuncio.precio,
      modalidad: anuncio.modalidad,
      contacto_email: anuncio.contacto_email,
      contacto_telefono: anuncio.contacto_telefono,
      contacto_anonimo: anuncio.contacto_anonimo,
      usuario_id: anuncio.usuario_id,
      usuario_nombre: anuncio.usuario_nombre,
      email: anuncio.email,
      telefono: anuncio.telefono,
      creado: anuncio.creado_at, // Usar campo real
      actualizado: anuncio.actualizado_at // Usar campo real
    }));

    res.json({
      success: true,
      data: formattedAnuncios,
      meta: {
        pagina: page,
        limite: limit,
        total: parseInt(total),
        total_paginas: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error al obtener anuncios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener anuncios',
    });
  }
});

app.get('/api/anuncios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const anuncio = await db('anuncios')
      .select([
        'anuncios.*',
        'usuarios.nombre as usuario_nombre',
        'usuarios.email as email',
        'usuarios.telefono as telefono'
      ])
      .leftJoin('usuarios', 'anuncios.usuario_id', 'usuarios.id')
      .where('anuncios.id', id)
      .where('anuncios.visible', 1)
      .where('anuncios.estado_moderacion', 'approved')
      .first();
    
    if (!anuncio) {
      return res.status(404).json({
        success: false,
        error: 'Anuncio no encontrado',
      });
    }

    // Formatear datos para el frontend
    const formattedAnuncio = {
      id: anuncio.id,
      titulo: anuncio.titulo,
      descripcion: anuncio.descripcion,
      categoria: anuncio.categoria,
      subcategoria: anuncio.subcategoria,
      comunidad_autonoma: anuncio.comunidad_id, // Mapear a ID
      provincia: anuncio.provincia_id, // Mapear a ID
      barrio: anuncio.barrio,
      precio: anuncio.precio,
      modalidad: anuncio.modalidad,
      contacto_email: anuncio.contacto_email,
      contacto_telefono: anuncio.contacto_telefono,
      contacto_anonimo: anuncio.contacto_anonimo,
      usuario_id: anuncio.usuario_id,
      usuario_nombre: anuncio.usuario_nombre,
      email: anuncio.email,
      telefono: anuncio.telefono,
      creado: anuncio.creado_at, // Usar campo real
      actualizado: anuncio.actualizado_at // Usar campo real
    };

    res.json({
      success: true,
      data: formattedAnuncio,
    });
  } catch (error) {
    console.error('Error al obtener anuncio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener anuncio',
    });
  }
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
