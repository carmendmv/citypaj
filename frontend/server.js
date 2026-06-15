const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3001;

app.prepare().then(() => {
  const server = express();
  
  // Middleware para parsear JSON
  server.use(express.json());
  
  // Manejar todas las rutas con Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`🚀 Servidor frontend corriendo en http://localhost:${PORT}`);
    console.log(`📝 Modo: ${dev ? 'desarrollo' : 'producción'}`);
  });
}).catch((ex) => {
  console.error('❌ Error iniciando servidor frontend:', ex.stack);
  process.exit(1);
});
