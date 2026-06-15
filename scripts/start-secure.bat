@echo off
REM Script para iniciar CityPaj con seguridad (Windows)
REM Este script inicia el frontend y backend con configuraciones de seguridad

echo 🔒 Iniciando CityPaj con seguridad...

REM Verificar si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no está instalado. Por favor, instálalo primero.
    pause
    exit /b 1
)

REM Verificar si npm está instalado
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm no está instalado. Por favor, instálalo primero.
    pause
    exit /b 1
)

REM Iniciar backend en modo seguro
echo 🚀 Iniciando backend seguro...
cd /d "%~dp0..\backend"
start "Backend Seguro" cmd /k "node secure-backend.js"

REM Esperar a que el backend inicie
timeout /t 3 /nobreak >nul

REM Iniciar frontend en modo seguro
echo 🎨 Iniciando frontend seguro...
cd /d "%~dp0..\frontend"
start "Frontend Seguro" cmd /k "node secure-server.js"

REM Esperar a que el frontend inicie
timeout /t 3 /nobreak >nul

echo ✅ CityPaj iniciado con seguridad:
echo    - Backend: http://localhost:3002
echo    - Frontend: http://localhost:3001
echo    - Ambos servidores con seguridad habilitada
echo.
echo Para detener los servidores, cierra las ventanas correspondientes.
pause
