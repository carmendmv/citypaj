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
console.log('🔍 Configuración de base de datos cargada:');
console.log(JSON.stringify(knexConfig.development.connection, null, 2));

// Crear conexión directa con las credenciales correctas
const db = knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    port: 3306,
    database: 'citypaj',
    user: 'citypaj_user',
    password: 'citypaj123'
  },
  pool: {
    min: 2,
    max: 10
  }
});

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

// Variable global para datos mock persistentes
let mockDataCache = null;
let mockDataCacheV2 = null; // Nueva variable para forzar regeneración

// Función para generar datos mock cuando la base de datos no está disponible
function generateMockData() {
  // Generar datos nuevos cada vez - sin caché

  const COMUNIDADES_AUTONOMAS = [
    'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias', 'Cantabria',
    'Castilla-La Mancha', 'Castilla y León', 'Cataluña', 'Comunidad Valenciana',
    'Extremadura', 'Galicia', 'Madrid', 'Murcia', 'Navarra', 'País Vasco', 'La Rioja'
  ];

  const PROVINCIAS = {
    'Andalucía': ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla'],
    'Aragón': ['Huesca', 'Teruel', 'Zaragoza'],
    'Asturias': ['Asturias'],
    'Baleares': ['Mallorca', 'Menorca', 'Ibiza', 'Formentera'],
    'Canarias': ['Tenerife', 'Gran Canaria', 'Lanzarote', 'Fuerteventura', 'La Palma', 'La Gomera', 'El Hierro'],
    'Cantabria': ['Cantabria'],
    'Castilla-La Mancha': ['Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Toledo'],
    'Castilla y León': ['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'],
    'Cataluña': ['Barcelona', 'Girona', 'Lleida', 'Tarragona'],
    'Comunidad Valenciana': ['Alicante', 'Castellón', 'Valencia'],
    'Extremadura': ['Badajoz', 'Cáceres'],
    'Galicia': ['A Coruña', 'Lugo', 'Ourense', 'Pontevedra'],
    'Madrid': ['Madrid'],
    'Murcia': ['Murcia'],
    'Navarra': ['Navarra'],
    'País Vasco': ['Álava', 'Bizkaia', 'Gipuzkoa'],
    'La Rioja': ['La Rioja']
  };

  const NOMBRES_USUARIOS = ['María García', 'Juan Rodríguez', 'Ana Martínez', 'Carlos López', 'Laura Sánchez', 'David Fernández', 'Sofía Pérez', 'Miguel González', 'Lucía Díaz', 'Javier Martín', 'Paula Ruiz', 'Daniel Hernández', 'Carmen Jiménez', 'Antonio Moreno', 'Isabel Muñoz', 'Francisco Álvarez', 'Elena Castro', 'Manuel Ortiz', 'Sara Rubio', 'José Luis'];
  
  const APELLIDOS_USUARIOS = ['García', 'Rodríguez', 'Martínez', 'López', 'Sánchez', 'Pérez', 'González', 'Díaz', 'Martín', 'Ruiz', 'Hernández', 'Jiménez', 'Moreno', 'Muñoz', 'Álvarez', 'Castro', 'Ortiz', 'Rubio', 'Gómez', 'Fernández'];

  const DATOS_CATEGORIA = {
    ocio: {
      titulos: [
        'Clases de guitarra para principiantes',
        'Excursión a la sierra este fin de semana',
        'Taller de fotografía nocturna',
        'Partido de pádel mixto',
        'Cine de verano en el parque',
        'Concierto de rock en bar local',
        'Visita guiada al museo de arte',
        'Torneo de cartas y juegos de mesa',
        'Clases de baile salsa',
        'Ruta en bicicleta por el río'
      ],
      descripciones: [
        'Aprende a tocar guitarra desde cero con profesor experimentado. Clases individuales o grupales, material incluido. Horarios flexibles.',
        'Únete a nuestra excursión de un día por la sierra local. Transporte compartido, comida incluida. Nivel medio-bajo.',
        'Taller práctico de fotografía nocturna. Aprende técnicas de larga exposición y edición básica. Requiere cámara propia.',
        'Buscamos jugadores para partidos de pádel mixtos. Todos los niveles bienvenidos. Instalaciones con luz y bar.',
        'Disfruta del cine al aire libre en nuestro parque municipal. Entrada gratuita, lleva tu propia silla y manta.',
        'Banda local busca público para concierto este sábado. Música rock original, ambiente animado.',
        'Visita guiada especializada en arte contemporáneo. Duración 2 horas, grupos reducidos. Reserva obligatoria.',
        'Reunión semanal de juegos de mesa. Desde clásicos hasta juegos modernos. Ambiente amigable y educativo.',
        'Clases de salsa para todos los niveles. Profesor profesional, música en vivo. No se necesita experiencia previa.',
        'Ruta en bicicleta de 20km por el río. Paisajes espectaculares, parada para picnic. Guía incluido.'
      ]
    },
    servicios: {
      titulos: [
        'Servicio de jardinería profesional',
        'Reparaciones de fontanería a domicilio',
        'Clases particulares de matemáticas',
        'Servicio de limpieza del hogar',
        'Asesoría legal gratuita',
        'Transporte de mudanzas',
        'Reparación de electrodomésticos',
        'Servicio de cuidado de mascotas',
        'Diseño gráfico para empresas',
        'Instalación de aire acondicionado'
      ],
      descripciones: [
        'Servicio profesional de jardinería y mantenimiento de jardines. Podas, plantación, diseño de espacios. 10 años de experiencia.',
        'Fontanero certificado disponible 24/7. Reparaciones, instalaciones, mantenimiento. Garantía en todos los trabajos.',
        'Profesor de matemáticas con 15 años de experiencia. Prepara ESO, Bachillerato y selectividad. Clases personalizadas.',
        'Equipo de limpieza profesional para hogares y oficinas. Productos ecológicos, seguro incluido. Fija o por horas.',
        'Abogada ofrece primera consulta gratuita. Derecho civil, laboral y administrativo. Atención personalizada.',
        'Empresa de mudanzas con seguro completo. Montaje y desmontaje de muebles. Material de embalaje incluido.',
        'Técnico especializado en reparación de electrodomésticos. Servicio a domicilio, presupuesto sin compromiso.',
        'Cuidador de mascotas con experiencia. Paseos, guardería, alojamiento. Certificado en primeros auxilios animales.',
        'Diseñador gráfico freelance. Logotipos, páginas web, material publicitario. Portfolio disponible.',
        'Instalación profesional de aire acondicionado. Marcas líderes, garantía 3 años. Mantenimiento incluido primer año.'
      ]
    },
    educacion: {
      titulos: [
        'Curso de inglés intensivo verano',
        'Preparación oposiciones enseñanza',
        'Taller de programación web',
        'Clases de apoyo primaria',
        'Curso de marketing digital',
        'Formación en primeros auxilios',
        'Taller de cocina saludable',
        'Clases de idiomas online',
        'Curso de fotografía digital',
        'Formación en habilidades sociales'
      ],
      descripciones: [
        'Curso intensivo de inglés durante el verano. Niveles A1-C1. Profesores nativos, certificado oficial.',
        'Preparación integral para oposiciones de enseñanza. Temario actualizado, simulacros exámenes. Alta tasa de éxito.',
        'Aprende programación web desde cero. HTML, CSS, JavaScript, React. Proyectos prácticos incluidos.',
        'Clases de apoyo para primaria en todas las materias. Profesores cualificados, método personalizado.',
        'Curso completo de marketing digital. SEO, redes sociales, email marketing. Certificado profesional.',
        'Formación oficial en primeros auxilios. Reconocido por Cruz Roja. Prácticas con maniquíes.',
        'Taller de cocina saludable y nutritiva. Aprende recetas equilibradas, técnicas culinarias básicas. Incluye ingredientes.',
        'Clases de idiomas por videollamada. Inglés, francés, alemán, italiano. Horarios flexibles, materiales incluidos.',
        'Curso de fotografía digital para principiantes. Composición, iluminación, edición básica. Requiere cámara DSLR.',
        'Taller de desarrollo de habilidades sociales. Comunicación asertiva, inteligencia emocional. Grupos reducidos.'
      ]
    },
    empleo: {
      titulos: [
        'Busco camarero con experiencia',
        'Programador junior JavaScript',
        'Repartidor con propio vehículo',
        'Administrativo para oficina',
        'Profesor particular de inglés',
        'Dependiente para tienda ropa',
        'Auxiliar de enfermería',
        'Diseñador gráfico freelance',
        'Teleoperador atención cliente',
        'Montador de muebles'
      ],
      descripciones: [
        'Restaurantes buscan camareros con experiencia. Contrato temporal con posibilidad de indefinido. Horario flexible.',
        'Empresa tecnológica busca programador junior. Conocimientos JavaScript, React. Formación continua, buen ambiente.',
        'Buscamos repartidor con propio vehículo. Contrato por horas, zona urbana. Ingresos adicionales por propinas.',
        'Oficina necesita administrativo/a. Conocimientos Office, atención al detalle. Jornada completa, estable.',
        'Buscamos profesor particular de inglés. Experiencia con niños, horario tardes. Certificados valorables.',
        'Tienda de moda busca dependiente. Experiencia en ventas, buen trato al cliente. Contrato temporal + comisiones.',
        'Centro de salud busca auxiliar de enfermería. Titulación oficial, disponibilidad inmediata. Turnos rotativos.',
        'Empresa busca diseñador gráfico freelance. Proyectos puntuales con posibilidad de colaboración continua. Portfolio requerido.',
        'Call center busca teleoperadores. Atención al cliente, ventas. Formación inicial, bonos por objetivos.',
        'Tienda de muebles busca montador. Experiencia en montaje, carné de conducir. Contrato temporal, posibilidad fijo.'
      ]
    },
    comunidad: {
      titulos: [
        'Voluntariado en comedor social',
        'Asociación juvenil busca miembros',
        'Proyecto de limpieza de playas',
        'Taller de reciclaje creativo',
        'Grupo de apoyo mutuo estudiantes',
        'Campaña de recogida de alimentos',
        'Voluntariado en refugio animales',
        'Asociación cultural busca colaboradores',
        'Proyecto de huerto urbano',
        'Grupo de lectura comunitario'
      ],
      descripciones: [
        'Comedor social busca voluntarios para reparto de comidas. Compromiso 4 horas semanales. Formación incluida.',
        'Asociación juvenil busca nuevos miembros. Actividades culturales, deportivas, formativas. Reuniones semanales.',
        'Organizamos limpieza de playas este mes. Material proporcionado, certificado de voluntariado. Familias bienvenidas.',
        'Taller de reciclaje creativo con materiales reutilizados. Aprende a crear objetos útiles. Gratuito, inscripción previa.',
        'Grupo de apoyo mutuo para estudiantes universitarios. Compartir experiencias, recursos, estudio conjunto. Gratuito.',
        'Campaña anual de recogida de alimentos. Puntos de recolección en toda la ciudad. Voluntarios necesarios.',
        'Refugio de animales busca voluntarios. Cuidado de perros y gatos, limpieza, socialización. Formación proporcionada.',
        'Asociación cultural busca colaboradores para eventos. Organización de conciertos, exposiciones, talleres. Flexible.',
        'Proyecto comunitario de huerto urbano. Cultivo ecológico, distribución local. No se requiere experiencia.',
        'Grupo de lectura mensual en biblioteca municipal. Libros variados, debate moderado. Inscripción gratuita.'
      ]
    }
  };

  const CATEGORIAS = ['ocio', 'servicios', 'educacion', 'empleo', 'comunidad'];

  // Generar anuncios mock realistas con IDs fijos - 100 por categoría
  const anuncios = [];
  let idCounter = 1;
  
  // Para cada categoría, generar 100 anuncios
  for (const categoria of CATEGORIAS) {
    const datosCategoria = DATOS_CATEGORIA[categoria];
    
    for (let i = 0; i < 100; i++) {
      const comunidad = COMUNIDADES_AUTONOMAS[Math.floor(Math.random() * COMUNIDADES_AUTONOMAS.length)];
      const provincia = PROVINCIAS[comunidad][Math.floor(Math.random() * PROVINCIAS[comunidad].length)];
      const tituloIndex = Math.floor(Math.random() * datosCategoria.titulos.length);
      
      const nombreUsuario = NOMBRES_USUARIOS[Math.floor(Math.random() * NOMBRES_USUARIOS.length)];
      const apellidoUsuario = APELLIDOS_USUARIOS[Math.floor(Math.random() * APELLIDOS_USUARIOS.length)];
      const emailUsuario = `${nombreUsuario.toLowerCase().replace(' ', '.')}.${apellidoUsuario.toLowerCase()}@email.com`;
      
      anuncios.push({
        id: `mock-${categoria}-${i + 1}`, // ID fijo y predecible por categoría
        titulo: datosCategoria.titulos[tituloIndex],
        descripcion: datosCategoria.descripciones[tituloIndex],
        categoria,
        subcategoria: null,
        comunidad_autonoma: comunidad,
        provincia,
        precio: Math.floor(Math.random() * 150) + 10,
        modalidad: categoria === 'ocio' || categoria === 'servicios' ? 'servicio' : 'oferta',
        usuario_nombre: `${nombreUsuario} ${apellidoUsuario}`,
        email: emailUsuario,
        telefono: Math.random() > 0.5 ? `6${Math.floor(Math.random() * 90000000) + 10000000}` : null,
        contacto_email: true,
        contacto_telefono: Math.random() > 0.3,
        contacto_anonimo: false,
        visible: true,
        estado_moderacion: 'approved',
        creado: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        actualizado: new Date().toISOString(),
        vistas: Math.floor(Math.random() * 200) + 10
      });
      
      idCounter++;
    }
  }
  
  // Guardar en caché y devolver
  mockDataCacheV2 = anuncios;
  return anuncios;
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

// Anuncios routes con base de datos real y fallback a datos mock
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

    let anuncios;
    let total;
    const page = parseInt(pagina);
    const limit = parseInt(limite);

    try {
      // Intentar usar base de datos real
      let query = db('anuncios')
        .select([
          'anuncios.*',
          'usuarios.nombre as usuario_nombre',
          'usuarios.email as email'
        ])
        .leftJoin('usuarios', 'anuncios.usuario_id', 'usuarios.id')
        .where('anuncios.visible', 1)
        .where('anuncios.estado_moderacion', 'approved');

    // Aplicar filtros a la consulta de base de datos
      if (categoria) {
        query = query.where('anuncios.categoria', categoria);
      }

      // Temporalmente desactivamos filtros de ubicación hasta verificar columnas correctas
      /*
      if (comunidad_autonoma) {
        query = query.where('anuncios.comunidad_autonoma', 'like', `%${comunidad_autonoma}%`);
      }

      if (provincia) {
        query = query.where('anuncios.provincia', provincia);
      }
      */

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
          query = query.orderBy('anuncios.id', 'asc');
          break;
        case 'fecha_desc':
          query = query.orderBy('anuncios.id', 'desc');
          break;
        case 'precio_asc':
          query = query.orderBy('anuncios.precio', 'asc');
          break;
        case 'precio_desc':
          query = query.orderBy('anuncios.precio', 'desc');
          break;
        default:
          query = query.orderBy('anuncios.id', 'desc');
      }

      // Obtener total para paginación
      const countQuery = query.clone().clearSelect().clearOrder().count('* as total');
      const [{ total: dbTotal }] = await countQuery;

      // Aplicar paginación
      const page = parseInt(pagina);
      const limit = parseInt(limite);
      const offset = (page - 1) * limit;

      anuncios = await query.limit(limit).offset(offset);
      total = dbTotal;

    } catch (dbError) {
      console.error('Error al obtener anuncios de la base de datos:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener anuncios de la base de datos',
        details: dbError.message
      });
    }

    // Formatear datos para el frontend
    const formattedAnuncios = anuncios.map(anuncio => ({
      id: anuncio.id,
      titulo: anuncio.titulo,
      descripcion: anuncio.descripcion,
      categoria: anuncio.categoria,
      subcategoria: anuncio.subcategoria,
      comunidad_autonoma: anuncio.comunidad_autonoma,
      provincia: anuncio.provincia,
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
      creado: anuncio.creado,
      actualizado: anuncio.actualizado
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
    
    let anuncio;

    try {
      // Intentar usar base de datos real
      anuncio = await db('anuncios')
        .select([
          'anuncios.*',
          'usuarios.nombre as usuario_nombre',
          'usuarios.email as email'
        ])
        .leftJoin('usuarios', 'anuncios.usuario_id', 'usuarios.id')
        .where('anuncios.id', id)
        .where('anuncios.visible', 1)
        .where('anuncios.estado_moderacion', 'approved')
        .first();
    } catch (dbError) {
      console.error('Error al obtener anuncio de la base de datos:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener anuncio de la base de datos',
        details: dbError.message
      });
    }
    
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

// Endpoint para obtener todos los datos en tiempo real desde base de datos con fallback
app.get('/api/database/realtime', async (req, res) => {
  try {
    const { categoria, comunidad, format = 'json' } = req.query;

    let allAnuncios;

    try {
      // Intentar usar base de datos real
      let query = db('anuncios')
        .select([
          'anuncios.*',
          'usuarios.nombre as usuario_nombre',
          'usuarios.email as email'
        ])
        .leftJoin('usuarios', 'anuncios.usuario_id', 'usuarios.id')
        .where('anuncios.visible', 1)
        .where('anuncios.estado_moderacion', 'approved');

      // Aplicar filtros
      if (comunidad && typeof comunidad === 'string') {
        query = query.where('anuncios.comunidad_autonoma', 'like', `%${comunidad}%`);
      }

      if (categoria && typeof categoria === 'string') {
        query = query.where('anuncios.categoria', categoria);
      }

      allAnuncios = await query;

    } catch (dbError) {
      console.error('Error al obtener datos en tiempo real de la base de datos:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener datos en tiempo real de la base de datos',
        details: dbError.message
      });
    }

    // Agrupar por categorías
    const dataByCategory = allAnuncios.reduce((acc, anuncio) => {
      if (!acc[anuncio.categoria]) {
        acc[anuncio.categoria] = [];
      }
      acc[anuncio.categoria].push(anuncio);
      return acc;
    }, {});

    // Agrupar por comunidades
    const dataByCommunity = allAnuncios.reduce((acc, anuncio) => {
      if (!acc[anuncio.comunidad_autonoma]) {
        acc[anuncio.comunidad_autonoma] = [];
      }
      acc[anuncio.comunidad_autonoma].push(anuncio);
      return acc;
    }, {});

    // Estadísticas en tiempo real
    const stats = {
      total: allAnuncios.length,
      categories: Object.keys(dataByCategory).length,
      communities: Object.keys(dataByCommunity).length,
      lastUpdated: new Date().toISOString(),
      byCategory: Object.fromEntries(
        Object.entries(dataByCategory).map(([cat, items]) => [cat, items.length])
      ),
      byCommunity: Object.fromEntries(
        Object.entries(dataByCommunity).map(([com, items]) => [com, items.length])
      ),
    };

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      data: format === 'categorized' ? {
        byCategory: dataByCategory,
        byCommunity: dataByCommunity,
        stats
      } : {
        all: allAnuncios,
        stats
      }
    };

    // Configurar headers para tiempo real
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.json(response);

  } catch (error) {
    console.error('Error en getAllDataRealtime:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo datos en tiempo real'
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
