#!/bin/bash
# Migra la base de datos citypaj del MySQL de Windows (XAMPP) al MySQL de WSL
# Uso: ./migrate-to-wsl.sh (pide contraseña de sudo para mysql en WSL)

set -e

PROJECT_DIR="/mnt/c/Users/Carmen/Documents/TFG-2DAW/citypaj"
DUMP_FILE="$PROJECT_DIR/citypaj_dump.sql"

# Buscar mysqldump.exe de XAMPP/MySQL en Windows
MysqldumpCandidates=(
  "/mnt/c/xampp/mysql/bin/mysqldump.exe"
  "/mnt/c/Program Files/MySQL/MySQL Server 8.0/bin/mysqldump.exe"
  "/mnt/c/Program Files (x86)/MySQL/MySQL Server 8.0/bin/mysqldump.exe"
)

MysqldumpExe=""
for c in "${MysqldumpCandidates[@]}"; do
  if [ -f "$c" ]; then
    MysqldumpExe="$c"
    break
  fi
done

if [ -z "$MysqldumpExe" ]; then
  echo "No se encontró mysqldump.exe de Windows. Instala/ruta XAMPP o MySQL de Windows."
  exit 1
fi

echo "Usando mysqldump.exe: $MysqldumpExe"

# 1. Volcar la base de datos de Windows
echo "Volcando citypaj desde Windows MySQL..."
"$MysqldumpExe" -u citypaj_user -pcitypaj123 --single-transaction --skip-lock-tables citypaj > "$DUMP_FILE"
echo "Dump guardado en: $DUMP_FILE"

# 2. Eliminar y recrear la base en WSL MySQL (necesita sudo/root)
echo "Recreando base citypaj en WSL MySQL..."
sudo mysql -e "DROP DATABASE IF EXISTS citypaj; CREATE DATABASE citypaj CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 3. Importar el dump
echo "Importando dump en WSL MySQL..."
sudo mysql citypaj < "$DUMP_FILE"

# 4. Crear/actualizar usuario citypaj_user para el backend
echo "Creando usuario citypaj_user..."
sudo mysql -e "CREATE USER IF NOT EXISTS 'citypaj_user'@'%' IDENTIFIED BY 'citypaj123'; ALTER USER 'citypaj_user'@'%' IDENTIFIED BY 'citypaj123'; GRANT ALL PRIVILEGES ON citypaj.* TO 'citypaj_user'@'%'; FLUSH PRIVILEGES;"

echo ""
echo "MIGRACIÓN COMPLETADA. Ya puedes arrancar el proyecto en WSL:"
echo "  cd $PROJECT_DIR"
echo "  npm run dev"
