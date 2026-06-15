const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3001;

app.prepare().then(() => {
  const server = express();
  
  // Middleware básico de seguridad
  server.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
  
  // Middleware para parsear JSON
  server.use(express.json());
  
  // Manejar todas las rutas con Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`🔒 Servidor frontend simple seguro corriendo en http://localhost:${PORT}`);
    console.log(`📝 Modo: ${dev ? 'desarrollo' : 'producción'}`);
  });
}).catch((ex) => {
  console.error('❌ Error iniciando servidor frontend:', ex.stack);
  process.exit(1);
});
