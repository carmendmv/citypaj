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

  console.log('--- anuncios columns ---');
  const [cols] = await c.execute('SHOW COLUMNS FROM anuncios');
  console.log(cols.map(col => `${col.Field}: ${col.Type} ${col.Null==='NO'?'NOT NULL':''} ${col.Default!==null?`DEFAULT ${col.Default}`:''} ${col.Extra}`).join('\n'));

  console.log('\n--- usuarios id ---');
  const [users] = await c.execute('SELECT id, email, nombre FROM usuarios LIMIT 3');
  console.log(users);

  console.log('\n--- comunidades ---');
  try {
    const [coms] = await c.execute('SELECT id, nombre FROM comunidades LIMIT 5');
    console.log(coms);
  } catch (e) { console.log('No tabla comunidades'); }

  console.log('\n--- provincias ---');
  try {
    const [provs] = await c.execute('SELECT id, nombre, comunidad_id FROM provincias LIMIT 5');
    console.log(provs);
  } catch (e) { console.log('No tabla provincias'); }

  await c.end();
}

main().catch(e => { console.error(e); process.exit(1); });
