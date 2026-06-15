#!/bin/bash

# CityPAJ - Script de Inicio Seguro para Producción
# Este script inicia el sistema CityPAJ con todas las medidas de seguridad

echo "🚀 Iniciando CityPAJ - Sistema Seguro de Producción"
echo "=============================================="

# Verificar dependencias
check_dependencies() {
    echo "🔍 Verificando dependencias..."
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js no encontrado. Por favor instala Node.js"
        exit 1
    fi
    
    # Verificar OpenSSL
    if ! command -v openssl &> /dev/null; then
        echo "❌ OpenSSL no encontrado. Por favor instala OpenSSL"
        exit 1
    fi
    
    # Verificar MySQL
    if ! command -v mysql &> /dev/null; then
        echo "⚠️ MySQL client no encontrado. Asegúrate de que MySQL server está corriendo"
    fi
    
    echo "✅ Dependencias verificadas"
}

# Configurar variables de entorno
setup_environment() {
    echo "🔧 Configurando variables de entorno..."
    
    # Crear archivo .env.production si no existe
    if [ ! -f ".env.production" ]; then
        cat > .env.production << EOF
# CityPAJ - Configuración de Producción Segura
NODE_ENV=production

# Configuración del Frontend Seguro
FRONTEND_PORT=3000
FRONTEND_HTTPS_PORT=3443

# Configuración del Backend Seguro
BACKEND_PORT=3002
BACKEND_HTTPS_PORT=3444

# Configuración de la Base de Datos
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=citypaj_user
DB_PASSWORD=citypaj_password
DB_NAME=citypaj_db

# URLs de los servicios
FRONTEND_URL=https://localhost:3443
BACKEND_URL=https://localhost:3444

# Configuración de Seguridad
SSL_CERT_PATH=./certificates
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Configuración de Monitoreo
HEALTH_CHECK_INTERVAL=30000
RECONNECT_DELAY=5000
MAX_RECONNECT_ATTEMPTS=5

# Configuración de Logs
LOG_LEVEL=info
LOG_FILE=./logs/citypaj.log
EOF
        echo "✅ Archivo .env.production creado"
    fi
    
    # Cargar variables de entorno
    export $(cat .env.production | grep -v '^#' | xargs)
    echo "✅ Variables de entorno configuradas"
}

# Crear directorios necesarios
setup_directories() {
    echo "📁 Creando directorios necesarios..."
    
    mkdir -p logs
    mkdir -p certificates
    mkdir -p backups
    mkdir -p temp
    
    echo "✅ Directorios creados"
}

# Generar certificados SSL
generate_certificates() {
    echo "🔐 Generando certificados SSL..."
    
    # Certificados para frontend
    if [ ! -f "certificates/frontend.key" ] || [ ! -f "certificates/frontend.crt" ]; then
        openssl genrsa -out certificates/frontend.key 2048
        openssl req -new -x509 -key certificates/frontend.key -out certificates/frontend.crt -days 365 -subj "/C=ES/ST=Madrid/L=Madrid/O=CityPAJ/CN=localhost"
        echo "✅ Certificados SSL del frontend generados"
    fi
    
    # Certificados para backend
    if [ ! -f "certificates/backend.key" ] || [ ! -f "certificates/backend.crt" ]; then
        openssl genrsa -out certificates/backend.key 2048
        openssl req -new -x509 -key certificates/backend.key -out certificates/backend.crt -days 365 -subj "/C=ES/ST=Madrid/L=Madrid/O=CityPAJ/CN=localhost"
        echo "✅ Certificados SSL del backend generados"
    fi
}

# Verificar conexión a la base de datos
check_database() {
    echo "🗄️ Verificando conexión a la base de datos..."
    
    # Intentar conectar a MySQL
    if mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME; SELECT 1;" &> /dev/null; then
        echo "✅ Conexión a MySQL verificada"
        return 0
    else
        echo "❌ Error conectando a MySQL"
        echo "📝 Verifica que MySQL está corriendo y que las credenciales son correctas"
        return 1
    fi
}

# Función de monitoreo
monitor_services() {
    echo "📊 Iniciando monitoreo de servicios..."
    
    # Crear script de monitoreo
    cat > scripts/monitor.sh << 'EOF'
#!/bin/bash

# Script de monitoreo de CityPAJ
FRONTEND_URL="https://localhost:3443"
BACKEND_URL="https://localhost:3444"
LOG_FILE="./logs/monitor.log"

check_service() {
    local url=$1
    local service_name=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    if curl -k -s --max-time 10 "$url/health" > /dev/null 2>&1; then
        echo "[$timestamp] ✅ $service_name: OK" >> "$LOG_FILE"
        return 0
    else
        echo "[$timestamp] ❌ $service_name: ERROR" >> "$LOG_FILE"
        echo "[$timestamp] 🔄 Reiniciando $service_name..." >> "$LOG_FILE"
        
        # Reiniciar servicio (esto podría ser más sofisticado)
        if [ "$service_name" = "Frontend" ]; then
            pkill -f "secure-server.js"
            sleep 2
            cd frontend && node secure-server.js > ../logs/frontend.log 2>&1 &
        elif [ "$service_name" = "Backend" ]; then
            pkill -f "secure-backend.js"
            sleep 2
            cd backend && node secure-backend.js > ../logs/backend.log 2>&1 &
        fi
        
        return 1
    fi
}

# Monitoreo continuo
while true; do
    check_service "$FRONTEND_URL" "Frontend"
    check_service "$BACKEND_URL" "Backend"
    sleep 60
done
EOF
    
    chmod +x scripts/monitor.sh
    echo "✅ Script de monitoreo creado"
}

# Función de backup
setup_backups() {
    echo "💾 Configurando sistema de backups..."
    
    # Crear script de backup
    cat > scripts/backup.sh << 'EOF'
#!/bin/bash

# Script de backup de CityPAJ
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="citypaj_db"
DB_USER="citypaj_user"
DB_PASS="citypaj_password"

# Backup de la base de datos
echo "💾 Creando backup de la base de datos..."
mysqldump -h 127.0.0.1 -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_DIR/db_backup_$DATE.sql"

# Backup de archivos de configuración
echo "💾 Creando backup de configuración..."
tar -czf "$BACKUP_DIR/config_backup_$DATE.tar.gz" certificates/ .env.production scripts/

# Limpiar backups antiguos (mantener últimos 7 días)
echo "🧹 Limpiando backups antiguos..."
find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "✅ Backup completado"
EOF
    
    chmod +x scripts/backup.sh
    echo "✅ Script de backup creado"
}

# Función de recuperación
setup_recovery() {
    echo "🔄 Configurando sistema de recuperación..."
    
    # Crear script de recuperación
    cat > scripts/recovery.sh << 'EOF'
#!/bin/bash

# Script de recuperación de CityPAJ
BACKUP_DIR="./backups"

echo "🔄 Sistema de Recuperación de CityPAJ"
echo "================================="

# Listar backups disponibles
echo "📋 Backups disponibles:"
ls -la "$BACKUP_DIR"/*.sql 2>/dev/null | tail -5

if [ $? -ne 0 ]; then
    echo "❌ No se encontraron backups"
    exit 1
fi

echo ""
echo "Ingrese el nombre del backup a restaurar (ej: db_backup_20231201_120000.sql):"
read backup_file

if [ ! -f "$BACKUP_DIR/$backup_file" ]; then
    echo "❌ Backup no encontrado"
    exit 1
fi

echo "⚠️ ADVERTENCIA: Esto sobrescribirá la base de datos actual"
echo "¿Está seguro? (y/N):"
read confirm

if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
    echo "🔄 Restaurando backup..."
    mysql -h 127.0.0.1 -u citypaj_user -pcitypaj_password citypaj_db < "$BACKUP_DIR/$backup_file"
    echo "✅ Backup restaurado correctamente"
else
    echo "❌ Operación cancelada"
fi
EOF
    
    chmod +x scripts/recovery.sh
    echo "✅ Script de recuperación creado"
}

# Iniciar servicios
start_services() {
    echo "🚀 Iniciando servicios CityPAJ..."
    
    # Iniciar backend seguro
    echo "🔒 Iniciando backend seguro..."
    cd backend
    node secure-backend.js > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    # Esperar a que el backend esté listo
    sleep 5
    
    # Iniciar frontend seguro
    echo "🔒 Iniciando frontend seguro..."
    cd frontend
    node secure-server.js > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    
    # Guardar PIDs
    echo $BACKEND_PID > logs/backend.pid
    echo $FRONTEND_PID > logs/frontend.pid
    
    echo "✅ Servicios iniciados"
    echo "📊 Frontend: https://localhost:3443"
    echo "📊 Backend: https://localhost:3444"
    echo "📋 Logs: ./logs/"
}

# Función de detención
stop_services() {
    echo "🛑 Deteniendo servicios CityPAJ..."
    
    # Detener servicios usando los PIDs guardados
    if [ -f "logs/backend.pid" ]; then
        kill $(cat logs/backend.pid) 2>/dev/null
        rm logs/backend.pid
    fi
    
    if [ -f "logs/frontend.pid" ]; then
        kill $(cat logs/frontend.pid) 2>/dev/null
        rm logs/frontend.pid
    fi
    
    # Forzar detención si es necesario
    pkill -f "secure-server.js" 2>/dev/null
    pkill -f "secure-backend.js" 2>/dev/null
    
    echo "✅ Servicios detenidos"
}

# Función de estado
show_status() {
    echo "📊 Estado de los servicios CityPAJ"
    echo "================================"
    
    # Verificar frontend
    if curl -k -s --max-time 5 "https://localhost:3443/" > /dev/null 2>&1; then
        echo "✅ Frontend: Activo (https://localhost:3443)"
    else
        echo "❌ Frontend: Inactivo"
    fi
    
    # Verificar backend
    if curl -k -s --max-time 5 "https://localhost:3444/health" > /dev/null 2>&1; then
        echo "✅ Backend: Activo (https://localhost:3444)"
    else
        echo "❌ Backend: Inactivo"
    fi
    
    # Verificar base de datos
    if mysql -h 127.0.0.1 -u citypaj_user -pcitypaj_password -e "USE citypaj_db; SELECT 1;" &> /dev/null; then
        echo "✅ Base de datos: Conectada"
    else
        echo "❌ Base de datos: Desconectada"
    fi
    
    # Mostrar logs recientes
    echo ""
    echo "📋 Logs recientes:"
    if [ -f "logs/monitor.log" ]; then
        tail -5 logs/monitor.log
    fi
}

# Menú principal
case "${1:-start}" in
    "start")
        check_dependencies
        setup_environment
        setup_directories
        generate_certificates
        check_database || exit 1
        monitor_services
        setup_backups
        setup_recovery
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        sleep 2
        start_services
        ;;
    "status")
        show_status
        ;;
    "monitor")
        scripts/monitor.sh
        ;;
    "backup")
        scripts/backup.sh
        ;;
    "recovery")
        scripts/recovery.sh
        ;;
    *)
        echo "Uso: $0 {start|stop|restart|status|monitor|backup|recovery}"
        echo ""
        echo "Comandos:"
        echo "  start    - Inicia todos los servicios"
        echo "  stop     - Detiene todos los servicios"
        echo "  restart  - Reinicia todos los servicios"
        echo "  status   - Muestra el estado de los servicios"
        echo "  monitor  - Inicia el monitoreo continuo"
        echo "  backup   - Crea un backup de la base de datos"
        echo "  recovery - Restaura un backup de la base de datos"
        exit 1
        ;;
esac

echo ""
echo "🎉 CityPAJ Sistema Seguro listo!"
echo "📊 Frontend: https://localhost:3443"
echo "📊 Backend: https://localhost:3444"
echo "📋 Logs: ./logs/"
echo "💾 Backups: ./backups/"
