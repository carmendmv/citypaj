const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;
const DB_ROOT_USER = process.env.DB_ROOT_USER || 'root';
const DB_ROOT_PASSWORD = process.env.DB_ROOT_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'citypaj';
const DB_USER = process.env.DB_USER || 'citypaj_user';
const DB_PASSWORD = process.env.DB_PASSWORD || 'citypaj123';

async function main() {
  console.log(` Conectando a MySQL en ${DB_HOST}:${DB_PORT} como ${DB_ROOT_USER}...`);
  const rootConnection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_ROOT_USER,
    password: DB_ROOT_PASSWORD,
    multipleStatements: true,
  });

  try {
    await rootConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(` Base de datos ${DB_NAME} verificada/creada`);

    await rootConnection.execute(`CREATE USER IF NOT EXISTS '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASSWORD}';`);
    await rootConnection.execute(`GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'%';`);
    await rootConnection.execute('FLUSH PRIVILEGES;');
    console.log(` Usuario ${DB_USER} verificado`);

    const appConnection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      multipleStatements: true,
    });

    const migrationsDir = path.join(__dirname, '..', 'migrations');
    if (fs.existsSync(migrationsDir)) {
      const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
      const ignorableErrors = new Set([
        'ER_DUP_FIELDNAME',
        'ER_DUP_KEYNAME',
        'ER_TABLE_EXISTS_ERROR',
        'ER_DUP_ENTRY'
      ]);

      for (const file of files) {
        const filePath = path.join(migrationsDir, file);
        let sql = fs.readFileSync(filePath, 'utf8');
        // Eliminar comentarios de bloque /* ... */
        sql = sql.replace(/\/\*[\s\S]*?\*\//g, '');
        // Eliminar comentarios de línea --
        sql = sql.replace(/^\s*--.*$/gm, '');
        const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);

        let applied = 0;
        for (const statement of statements) {
          try {
            await appConnection.query(statement + ';');
            applied++;
          } catch (err) {
            if (err.code && ignorableErrors.has(err.code)) {
              console.log(`ℹ️ Migración ${file}: ${err.message} (omitido)`);
            } else {
              console.error(` Error en migración ${file}:`, err.message);
              process.exit(1);
            }
          }
        }
        console.log(` Migración aplicada: ${file} (${applied} sentencias)`);
      }
    }

    await appConnection.end();
    console.log(' Base de datos inicializada correctamente');
  } catch (error) {
    console.error(' Error inicializando base de datos:', error.message);
    process.exit(1);
  } finally {
    await rootConnection.end();
  }
}

main();
