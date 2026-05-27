import express from 'express';
import cors from 'cors';
import { db } from './database-json';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware CORS configurado para permitir todo
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Endpoint de registro con base de datos JSON
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    
    console.log(`📝 Registro: ${email}`);
    
    // Validaciones básicas
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await db.findUsuarioByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    // Hashear contraseña
    const passwordHash = await db.hashPassword(password);
    
    // Crear nuevo usuario
    const newUser = await db.createUsuario({
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      password_hash: passwordHash,
      email_verificado: false,
      rol: 'usuario'
    });
    
    console.log(`✅ Usuario registrado: ${email}`);
    
    // Generar token simple
    const token = Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64');
    
    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email,
        createdAt: newUser.creado
      },
      accessToken: token,
      message: 'Usuario registrado correctamente'
    });
    
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint de login con base de datos JSON
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`🔐 Login: ${email}`);
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }
    
    // Buscar usuario
    const user = await db.findUsuarioByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Verificar contraseña
    const isValidPassword = await db.comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    console.log(`✅ Login exitoso: ${email}`);
    
    // Generar token simple
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
    
    res.json({
      success: true,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        createdAt: user.creado
      },
      accessToken: token,
      message: 'Login exitoso'
    });
    
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint de recuperación de contraseña con base de datos JSON
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log(`🔑 Recuperación solicitada: ${email}`);
    
    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio' });
    }
    
    // Buscar usuario
    const user = await db.findUsuarioByEmail(email);
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return res.json({ 
        message: 'Si el email está registrado, recibirás instrucciones para recuperar tu contraseña',
        success: true 
      });
    }
    
    // Generar token de recuperación (válido por 1 hora)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora
    
    // Guardar token en el usuario
    await db.updateUsuario(user.id, {
      reset_token: resetToken,
      reset_token_expiry: resetTokenExpiry.toISOString()
    });
    
    console.log(`✅ Token generado para: ${email}`);
    
    // En producción, aquí enviaríamos email
    // Por ahora, devolvemos el token para testing
    res.json({ 
      message: 'Se han enviado instrucciones a tu email para recuperar la contraseña',
      success: true,
      debugToken: resetToken // Solo para desarrollo
    });
    
  } catch (error) {
    console.error('❌ Error en recuperación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint de reseteo de contraseña con base de datos JSON
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    console.log(`🔄 Reseteo con token: ${token}`);
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token y nueva contraseña son obligatorios' });
    }
    
    // Buscar usuario con el token válido
    const usuarios = require('./database-json').readUsuarios();
    const user = usuarios.find(u => 
      u.reset_token === token && 
      new Date(u.reset_token_expiry) > new Date()
    );
    
    if (!user) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }
    
    // Hashear nueva contraseña
    const passwordHash = await db.hashPassword(newPassword);
    
    // Actualizar contraseña y limpiar token
    await db.updateUsuario(user.id, {
      password_hash: passwordHash,
      reset_token: null,
      reset_token_expiry: null
    });
    
    console.log(`✅ Contraseña actualizada para: ${user.email}`);
    
    res.json({ 
      message: 'Contraseña actualizada correctamente',
      success: true
    });
    
  } catch (error) {
    console.error('❌ Error en reseteo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para obtener anuncios con base de datos JSON
app.get('/api/anuncios', async (req, res) => {
  try {
    const { 
      pagina = 1, 
      limite = 15, 
      comunidad_autonoma, 
      categoria, 
      orden = 'fecha_desc',
      busqueda 
    } = req.query;
    
    console.log(`🔍 Buscando anuncios:`, { pagina, limite, comunidad_autonoma, categoria, orden, busqueda });
    
    const result = await db.findAnuncios({
      pagina: parseInt(pagina as string),
      limite: parseInt(limite as string),
      comunidad_autonoma,
      categoria,
      orden,
      busqueda
    });
    
    console.log(`📊 Resultado: ${result.data.length} anuncios encontrados, total: ${result.meta.total}`);
    
    res.json(result);
    
  } catch (error) {
    console.error('❌ Error obteniendo anuncios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para obtener un anuncio específico
app.get('/api/anuncios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const anuncio = await db.findAnuncioById(id);
    
    if (!anuncio) {
      return res.status(404).json({ error: 'Anuncio no encontrado' });
    }
    
    res.json(anuncio);
    
  } catch (error) {
    console.error('❌ Error obteniendo anuncio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para crear un anuncio
app.post('/api/anuncios', async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      categoria,
      comunidad_autonoma,
      provincia,
      precio,
      contacto_email = true,
      contacto_telefono = false,
      usuario_id,
      usuario_nombre
    } = req.body;
    
    // Validaciones básicas
    if (!titulo || !descripcion || !categoria || !comunidad_autonoma || !provincia) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben ser completados' });
    }
    
    // Crear anuncio
    const nuevoAnuncio = await db.createAnuncio({
      usuario_id: usuario_id || null,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      categoria: categoria.toLowerCase(),
      comunidad_autonoma: comunidad_autonoma,
      provincia: provincia,
      precio: precio ? parseFloat(precio) : null,
      contacto_email,
      contacto_telefono
    });
    
    console.log(`✅ Anuncio creado: ${nuevoAnuncio.id}`);
    
    // Formatear respuesta
    const anuncioFormateado = {
      ...nuevoAnuncio,
      usuario_nombre: usuario_nombre || 'Usuario',
      precio: nuevoAnuncio.precio ? parseFloat(nuevoAnuncio.precio) : null
    };
    
    res.status(201).json(anuncioFormateado);
    
  } catch (error) {
    console.error('❌ Error creando anuncio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para obtener comunidades
app.get('/api/comunidades', (req, res) => {
  const comunidades = [
    'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias', 'Cantabria',
    'Castilla-La Mancha', 'Castilla y León', 'Cataluña', 'Comunidad Valenciana',
    'Extremadura', 'Galicia', 'Madrid', 'Murcia', 'Navarra', 'País Vasco', 'La Rioja'
  ];
  
  res.json(comunidades);
});

// Endpoint health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'JSON Files',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor CityPaj con Base de Datos JSON corriendo en http://localhost:${PORT}`);
  console.log(`📊 Base de datos: Archivos JSON persistentes`);
  console.log(`🎯 Entorno: Desarrollo`);
});
