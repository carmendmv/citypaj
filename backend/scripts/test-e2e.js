const http = require('http');
const { app } = require('../dist/app');
const { pool } = require('../dist/config/database');

async function request(path) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: 'localhost', port: 3002, path }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    req.setTimeout(3000, () => reject(new Error('timeout')));
  });
}

(async () => {
  let server;
  try {
    await new Promise((resolve, reject) => {
      server = app.listen(3002, (err) => err ? reject(err) : resolve(undefined));
    });
    console.log('Backend started on 3002');

    const health = await request('/health');
    console.log('/health', health.status, JSON.stringify(health.body).slice(0, 200));

    const testDb = await request('/test-db');
    console.log('/test-db', testDb.status, JSON.stringify(testDb.body).slice(0, 200));

    const anuncios = await request('/api/anuncios?limit=2&ordenar=creado-desc');
    console.log('/api/anuncios', anuncios.status, JSON.stringify(anuncios.body).slice(0, 200));

    const estadisticas = await request('/api/estadisticas/home');
    console.log('/api/estadisticas/home', estadisticas.status, JSON.stringify(estadisticas.body).slice(0, 200));

    const sugerencias = await request('/api/sugerencias/estadisticas');
    console.log('/api/sugerencias/estadisticas', sugerencias.status, JSON.stringify(sugerencias.body).slice(0, 200));

  } catch (error) {
    console.error('E2E test error:', error.message);
    process.exitCode = 1;
  } finally {
    if (server) server.close();
    await pool.end();
  }
})();
