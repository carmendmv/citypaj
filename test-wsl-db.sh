#!/bin/bash
# Test de conexión desde WSL al MySQL de Windows
BACKEND_DIR="/mnt/c/Users/Carmen/Documents/TFG-2DAW/citypaj/backend"
WINDOWS_HOST=$(grep -m 1 nameserver /etc/resolv.conf | awk '{print $2}')

if [ -z "$WINDOWS_HOST" ]; then
  echo "No se pudo detectar la IP del host Windows."
  exit 1
fi

echo "Probando conexión a MySQL en $WINDOWS_HOST:3306..."

node -e "
const mysql = require('$BACKEND_DIR/node_modules/mysql2/promise');
mysql.createConnection({host:'$WINDOWS_HOST',port:3306,database:'citypaj',user:'citypaj_user',password:'citypaj123'})
  .then(async c => {
    const [tables] = await c.execute('SHOW TABLES');
    const [anuncios] = await c.execute('SELECT COUNT(*) as total FROM anuncios');
    console.log('OK - Tablas:', tables.length);
    console.log('OK - Anuncios:', anuncios[0].total);
    await c.end();
  })
  .catch(err => {
    console.error('ERROR:', err.message);
    process.exit(1);
  });
"
