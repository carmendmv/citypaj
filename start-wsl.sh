#!/bin/bash
# Arranque completo para WSL: apunta al MySQL de Windows y levanta backend + frontend
set -e

PROJECT_DIR="/mnt/c/Users/Carmen/Documents/TFG-2DAW/citypaj"
BACKEND_DIR="$PROJECT_DIR/backend"

# IP del host Windows en WSL2 (normalmente la primera línea nameserver de resolv.conf)
WINDOWS_HOST=$(grep -m 1 nameserver /etc/resolv.conf | awk '{print $2}')

if [ -z "$WINDOWS_HOST" ]; then
  echo "No se pudo detectar la IP del host Windows."
  exit 1
fi

echo "Host Windows detectado: $WINDOWS_HOST"

# Probar conexión al MySQL correcto (donde están las tablas completas)
node -e "
const mysql = require('$BACKEND_DIR/node_modules/mysql2/promise');
mysql.createConnection({host:'$WINDOWS_HOST',port:3306,database:'citypaj',user:'citypaj_user',password:'citypaj123'})
  .then(async c => {
    const [tables] = await c.execute('SHOW TABLES');
    const [anuncios] = await c.execute('SELECT COUNT(*) as total FROM anuncios');
    console.log('Tablas encontradas:', tables.length);
    console.log('Anuncios en MySQL de Windows:', anuncios[0].total);
    await c.end();
  })
  .catch(err => {
    console.error('No se pudo conectar al MySQL de Windows:', err.message);
    process.exit(1);
  });
"

echo "Conexión OK. Arrancando backend y frontend..."

# Exportar DB_HOST para que el backend en WSL use el MySQL de Windows
export DB_HOST="$WINDOWS_HOST"
export DB_PORT=3306
export DB_NAME=citypaj
export DB_USER=citypaj_user
export DB_PASSWORD=citypaj123

cd "$PROJECT_DIR"
npm run dev
