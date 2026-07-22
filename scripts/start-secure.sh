#!/bin/bash

# Script para iniciar CityPaj con seguridad
# Este script inicia el frontend y backend con configuraciones de seguridad

echo "🔒 Iniciando CityPaj con seguridad..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor, instálalo primero."
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor, instálalo primero."
    exit 1
fi

# Iniciar backend en modo seguro
echo "🚀 Iniciando backend seguro..."
cd backend
node secure-backend.js &
BACKEND_PID=$!

# Esperar a que el backend inicie
sleep 3

# Iniciar frontend en modo seguro
echo "🎨 Iniciando frontend seguro..."
cd ../frontend
node secure-server.js &
FRONTEND_PID=$!

# Esperar a que el frontend inicie
sleep 3

echo "✅ CityPaj iniciado con seguridad:"
echo "   - Backend: http://localhost:3002 (PID: $BACKEND_PID)"
echo "   - Frontend: http://localhost:3001 (PID: $FRONTEND_PID)"
echo "   - Ambos servidores con seguridad habilitada"
echo ""
echo "Para detener los servidores, presiona Ctrl+C o ejecuta:"
echo "   kill $BACKEND_PID $FRONTEND_PID"

# Esperar señal de interrupción
trap 'echo "🛑 Deteniendo servidores..."; kill $BACKEND_PID $FRONTEND_PID; exit' INT

# Mantener el script corriendo
wait
