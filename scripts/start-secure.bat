@echo off
REM CityPAJ - Script de Inicio Seguro para Producción (Windows)
REM Este script inicia el sistema CityPAJ con todas las medidas de seguridad

echo 🚀 Iniciando CityPAJ - Sistema Seguro de Producción
echo ==============================================

REM Verificar dependencias
echo 🔍 Verificando dependencias...

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no encontrado. Por favor instala Node.js
    pause
    exit /b 1
)

REM Verificar OpenSSL
openssl version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ OpenSSL no encontrado. Por favor instala OpenSSL
    echo 📝 Descárgalo desde: https://slproweb.com/products/Win32OpenSSL.html
    pause
    exit /b 1
)

echo ✅ Dependencias verificadas

REM Configurar variables de entorno
echo 🔧 Configurando variables de entorno...

if not exist ".env.production" (
    echo Creando archivo .env.production...
    (
        echo # CityPAJ - Configuración de Producción Segura
        echo NODE_ENV=production
        echo.
        echo # Configuración del Frontend Seguro
        echo FRONTEND_PORT=3000
        echo FRONTEND_HTTPS_PORT=3443
        echo.
        echo # Configuración del Backend Seguro
        echo BACKEND_PORT=3002
        echo BACKEND_HTTPS_PORT=3444
        echo.
        echo # Configuración de la Base de Datos
        echo DB_HOST=127.0.0.1
        echo DB_PORT=3306
        echo DB_USER=citypaj_user
        echo DB_PASSWORD=citypaj_password
        echo DB_NAME=citypaj_db
        echo.
        echo # URLs de los servicios
        echo FRONTEND_URL=https://localhost:3443
        echo BACKEND_URL=https://localhost:3444
        echo.
        echo # Configuración de Seguridad
        echo SSL_CERT_PATH=./certificates
        echo SESSION_SECRET=your-super-secret-session-key-change-this-in-production
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo.
        echo # Configuración de Monitoreo
        echo HEALTH_CHECK_INTERVAL=30000
        echo RECONNECT_DELAY=5000
        echo MAX_RECONNECT_ATTEMPTS=5
        echo.
        echo # Configuración de Logs
        echo LOG_LEVEL=info
        echo LOG_FILE=./logs/citypaj.log
    ) > .env.production
    echo ✅ Archivo .env.production creado
)

REM Cargar variables de entorno
for /f "tokens=*" %%a in ('type .env.production ^| findstr /v "^#"') do set %%a
echo ✅ Variables de entorno configuradas

REM Crear directorios necesarios
echo 📁 Creando directorios necesarios...
if not exist "logs" mkdir logs
if not exist "certificates" mkdir certificates
if not exist "backups" mkdir backups
if not exist "temp" mkdir temp
echo ✅ Directorios creados

REM Generar certificados SSL
echo 🔐 Generando certificados SSL...

REM Certificados para frontend
if not exist "certificates\frontend.key" (
    openssl genrsa -out certificates\frontend.key 2048
    openssl req -new -x509 -key certificates\frontend.key -out certificates\frontend.crt -days 365 -subj "/C=ES/ST=Madrid/L=Madrid/O=CityPAJ/CN=localhost"
    echo ✅ Certificados SSL del frontend generados
)

REM Certificados para backend
if not exist "certificates\backend.key" (
    openssl genrsa -out certificates\backend.key 2048
    openssl req -new -x509 -key certificates\backend.key -out certificates\backend.crt -days 365 -subj "/C=ES/ST=Madrid/L=Madrid/O=CityPAJ/CN=localhost"
    echo ✅ Certificados SSL del backend generados
)

REM Verificar conexión a la base de datos
echo 🗄️ Verificando conexión a la base de datos...
mysql -h 127.0.0.1 -u citypaj_user -pcitypaj_password -e "USE citypaj_db; SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error conectando a MySQL
    echo 📝 Verifica que MySQL está corriendo y que las credenciales son correctas
    pause
    exit /b 1
)
echo ✅ Conexión a MySQL verificada

REM Crear scripts de monitoreo
echo 📊 Creando scripts de monitoreo...
if not exist "scripts" mkdir scripts

REM Script de monitoreo
(
    echo @echo off
    echo REM Script de monitoreo de CityPAJ
    echo set FRONTEND_URL=https://localhost:3443
    echo set BACKEND_URL=https://localhost:3444
    echo set LOG_FILE=./logs/monitor.log
    echo.
    echo :monitor_loop
    echo echo %%date%% %%time%% - Verificando servicios... >> %%LOG_FILE%%
    echo.
    echo REM Verificar frontend
    echo curl -k -s --max-time 10 "%%FRONTEND_URL%%/health" >nul 2^&^&1
    echo if %%errorlevel%% equ 0 ^(
    echo     echo %%date%% %%time%% - ✅ Frontend: OK >> %%LOG_FILE%%
    echo ^) else ^(
    echo     echo %%date%% %%time%% - ❌ Frontend: ERROR >> %%LOG_FILE%%
    echo     echo %%date%% %%time%% - 🔄 Reiniciando frontend... >> %%LOG_FILE%%
    echo     taskkill /F /IM node.exe /FI "WINDOWTITLE eq *secure-server*" >nul 2^&^1
    echo     timeout /t 2 /nobreak >nul
    echo     start /B cd frontend ^&^& node secure-server.js
    echo ^)
    echo.
    echo REM Verificar backend
    echo curl -k -s --max-time 10 "%%BACKEND_URL%%/health" >nul 2^&^&1
    echo if %%errorlevel%% equ 0 ^(
    echo     echo %%date%% %%time%% - ✅ Backend: OK >> %%LOG_FILE%%
    echo ^) else ^(
    echo     echo %%date%% %%time%% - ❌ Backend: ERROR >> %%LOG_FILE%%
    echo     echo %%date%% %%time%% - 🔄 Reiniciando backend... >> %%LOG_FILE%%
    echo     taskkill /F /IM node.exe /FI "WINDOWTITLE eq *secure-backend*" >nul 2^&^1
    echo     timeout /t 2 /nobreak >nul
    echo     start /B cd backend ^&^& node secure-backend.js
    echo ^)
    echo.
    echo timeout /t 60 /nobreak >nul
    echo goto monitor_loop
) > scripts\monitor.bat

REM Script de backup
(
    echo @echo off
    echo REM Script de backup de CityPAJ
    echo set BACKUP_DIR=./backups
    echo for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
    echo set "DATE=%dt:~0,8%_%dt:~8,6%"
    echo.
    echo echo 💾 Creando backup de la base de datos...
    echo mysqldump -h 127.0.0.1 -u citypaj_user -pcitypaj_password citypaj_db ^> "%%BACKUP_DIR%%\db_backup_%%DATE%%.sql"
    echo.
    echo echo 💾 Creando backup de configuración...
    echo tar -czf "%%BACKUP_DIR%%\config_backup_%%DATE%%.tar.gz" certificates/ .env.production scripts/
    echo.
    echo echo 🧹 Limpiando backups antiguos...
    echo forfiles /p "%%BACKUP_DIR%%" /m "*.sql" /d -7 /c "cmd /c del @path"
    echo forfiles /p "%%BACKUP_DIR%%" /m "*.tar.gz" /d -7 /c "cmd /c del @path"
    echo.
    echo echo ✅ Backup completado
) > scripts\backup.bat

echo ✅ Scripts de monitoreo creados

REM Iniciar servicios
echo 🚀 Iniciando servicios CityPAJ...

REM Iniciar backend seguro
echo 🔒 Iniciando backend seguro...
start /B "CityPAJ Backend" cmd /c "cd backend && node secure-backend.js > ../logs/backend.log 2>&1"
timeout /t 5 /nobreak >nul

REM Iniciar frontend seguro
echo 🔒 Iniciando frontend seguro...
start /B "CityPAJ Frontend" cmd /c "cd frontend && node secure-server.js > ../logs/frontend.log 2>&1"
timeout /t 3 /nobreak >nul

echo ✅ Servicios iniciados
echo 📊 Frontend: https://localhost:3443
echo 📊 Backend: https://localhost:3444
echo 📋 Logs: ./logs/

REM Iniciar monitoreo en segundo plano
echo 📊 Iniciando monitoreo automático...
start /B "CityPAJ Monitor" cmd /c "scripts\monitor.bat"

echo.
echo 🎉 CityPAJ Sistema Seguro listo!
echo 📊 Frontend: https://localhost:3443
echo 📊 Backend: https://localhost:3444
echo 📋 Logs: ./logs/
echo 💾 Backups: ./backups/
echo.
echo Para detener los servicios, ejecuta: scripts\stop.bat
echo Para ver el estado, ejecuta: scripts\status.bat
echo.
pause
