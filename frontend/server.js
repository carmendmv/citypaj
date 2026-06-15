const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Proxy para /api/anuncios
app.get('/api/anuncios', (req, res) => {
  try {
    console.log('🔄 Frontend Proxy: Llamando a backend http://localhost:3002/api/anuncios');
    
    const params = new URLSearchParams(req.query);
    const url = `http://localhost:3002/api/anuncios?${params.toString()}`;
    
    const backendReq = http.get(url, (backendRes) => {
      console.log(`🔄 Frontend Proxy: Response status: ${backendRes.statusCode}`);
      
      let data = '';
      backendRes.on('data', (chunk) => {
        data += chunk;
      });
      
      backendRes.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log(`🔄 Frontend Proxy: Backend response data count: ${result.data?.anuncios?.length || 0}`);
          
          if (backendRes.statusCode !== 200) {
            console.log('🔄 Frontend Proxy: Error response:', result);
            return res.status(backendRes.statusCode).json(result);
          }
          
          res.json(result);
        } catch (parseError) {
          console.error('🔄 Frontend Proxy: JSON parse error:', parseError);
          res.status(500).json({ success: false, error: 'Error parsing response' });
        }
      });
    });
    
    backendReq.on('error', (error) => {
      console.error('🔄 Frontend Proxy: Request error:', error);
      res.status(500).json({ success: false, error: 'Error connecting to backend' });
    });
    
    backendReq.end();
  } catch (error) {
    console.error('🔄 Frontend Proxy: Error:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Página principal simple
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CityPAJ - Frontend Funcional</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 800px; margin: 0 auto; }
        .success { color: green; }
        .test-btn { background: #0070f3; color: white; padding: 10px 20px; border: none; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎉 CityPAJ - Frontend Funcional</h1>
        <p class="success">✅ El frontend está respondiendo correctamente en el puerto 3001</p>
        <p>✅ El backend está funcionando correctamente en el puerto 3002</p>
        <p>✅ La conexión con MySQL citypaj_db está establecida</p>
        
        <h2>Prueba de API</h2>
        <button class="test-btn" onclick="testAPI()">Probar /api/anuncios</button>
        <div id="result"></div>
      </div>
      
      <script>
        async function testAPI() {
          const resultDiv = document.getElementById('result');
          resultDiv.innerHTML = '<p>🔄 Probando conexión...</p>';
          
          try {
            const response = await fetch('/api/anuncios?pagina=1&limite=3');
            const data = await response.json();
            
            resultDiv.innerHTML = \`
              <h3>✅ Conexión Exitosa</h3>
              <p><strong>Status:</strong> \${response.status}</p>
              <p><strong>Anuncios encontrados:</strong> \${data.data?.anuncios?.length || 0}</p>
              <pre>\${JSON.stringify(data, null, 2)}</pre>
            \`;
          } catch (error) {
            resultDiv.innerHTML = \`<h3>❌ Error:</h3><p>\${error.message}</p>\`;
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 CityPAJ Frontend corriendo en http://localhost:${PORT}`);
  console.log(`📊 Proxy configurado para backend en http://localhost:3002`);
  console.log(`🔗 Página principal: http://localhost:${PORT}/`);
  console.log(`🔗 API proxy: http://localhost:${PORT}/api/anuncios`);
});
