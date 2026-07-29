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

  async function list(q) {
    const [rows] = await c.execute(q);
    return rows.map((r) => Object.values(r)[0]).filter(Boolean);
  }

  console.log('=== comunidad_autonoma ===');
  console.log((await list("SELECT DISTINCT comunidad_autonoma FROM anuncios WHERE comunidad_autonoma IS NOT NULL AND comunidad_autonoma != '' ORDER BY 1")).join('\n'));
  console.log('\n=== provincia ===');
  console.log((await list("SELECT DISTINCT provincia FROM anuncios WHERE provincia IS NOT NULL AND provincia != '' ORDER BY 1")).join('\n'));
  console.log('\n=== categoria ===');
  console.log((await list("SELECT DISTINCT categoria FROM anuncios WHERE categoria IS NOT NULL AND categoria != '' ORDER BY 1")).join('\n'));
  console.log('\n=== estado_moderacion ===');
  console.log((await list("SELECT DISTINCT estado_moderacion FROM anuncios ORDER BY 1")).join('\n'));
  console.log('\n=== reportes_anuncios.estado ===');
  console.log((await list("SELECT DISTINCT estado FROM reportes_anuncios WHERE estado IS NOT NULL ORDER BY 1")).join('\n'));
  await c.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
