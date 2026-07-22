const mysql = require('mysql2/promise');

const configs = [
  { label: 'localhost TCP', host: 'localhost', port: 3306, user: 'citypaj_user', password: 'citypaj123', database: 'citypaj' },
  { label: '127.0.0.1 TCP', host: '127.0.0.1', port: 3306, user: 'citypaj_user', password: 'citypaj123', database: 'citypaj' },
];

async function test() {
  for (const cfg of configs) {
    const { label, ...connCfg } = cfg;
    console.log(`\n🔌 Probando: ${label}`);
    try {
      const connection = await mysql.createConnection(connCfg);
      const [rows] = await connection.execute('SELECT 1 AS ok, DATABASE() AS db');
      console.log('✅ Conectado:', rows[0]);
      await connection.end();
    } catch (err) {
      console.error('❌ Error:', err.message);
      if (err.code) console.error('   Código:', err.code);
      if (err.sqlState) console.error('   SQL State:', err.sqlState);
    }
  }
}

test();
