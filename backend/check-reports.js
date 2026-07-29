require('dotenv').config();
const mysql = require('mysql2/promise');

async function main() {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME || 'citypaj',
    user: process.env.DB_USER || 'citypaj_user',
    password: process.env.DB_PASSWORD || 'citypaj123'
  });

  const [rows1] = await c.execute('SELECT COUNT(*) as total FROM reportes_anuncios');
  console.log('Total reportes_anuncios:', rows1[0].total);

  const [rows2] = await c.execute("SELECT estado, COUNT(*) as total FROM reportes_anuncios GROUP BY estado ORDER BY estado");
  console.log('Por estado:', rows2);

  const [rows3] = await c.execute('SELECT anuncio_id, COUNT(*) as reportes FROM reportes_anuncios GROUP BY anuncio_id HAVING reportes > 0 LIMIT 5');
  console.log('Anuncios con reportes (muestra):', rows3);

  await c.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
