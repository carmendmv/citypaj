const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'citypaj',
    user: 'citypaj_user',
    password: 'citypaj123',
    multipleStatements: true
  });

  const sqlPath = path.join(__dirname, '..', 'migrations', '003_add_precio_anuncios.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  try {
    await connection.query(sql);
    console.log('✅ Migración 003 ejecutada correctamente');
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration();
