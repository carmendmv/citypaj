const express = require('express');
const next = require('next');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3001;

// Configuración de seguridad
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones por ventana
  message: {
    error: 'Too many requests',
    message: 'Demasiadas peticiones, por favor intenta más tarde'
  }
});

app.prepare().then(() => {
  const server = express();
  
  // Middleware de seguridad
  server.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));
  
  // Rate limiting
  server.use(limiter);
  
  // Middleware para parsear JSON
  server.use(express.json({ limit: '10mb' }));
  
  // Headers de seguridad adicionales
  server.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });
  
  // Manejar todas las rutas con Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`🔒 Servidor frontend seguro corriendo en http://localhost:${PORT}`);
    console.log(`📝 Modo: ${dev ? 'desarrollo' : 'producción'}`);
    console.log(`🛡️  Seguridad: Habilitada`);
  });
}).catch((ex) => {
  console.error('❌ Error iniciando servidor frontend seguro:', ex.stack);
  process.exit(1);
});
