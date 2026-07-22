# CityPAJ - Arranque completo automatizado
# Uso: .\start-all.ps1 desde la raíz del proyecto

$ErrorActionPreference = "Stop"

function Wait-ForBackend {
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 1
        try {
            $res = Invoke-RestMethod -Uri "http://localhost:3002/health" -TimeoutSec 2
            if ($res.status -eq "ok") { return $true }
        } catch {}
    }
    return $false
}

function Wait-ForFrontend {
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 1
        try {
            $res = Invoke-WebRequest -Uri "http://localhost:3001" -TimeoutSec 2 -UseBasicParsing
            if ($res.StatusCode -eq 200) { return $true }
        } catch {}
    }
    return $false
}

Write-Host "🚀 Iniciando CityPAJ..." -ForegroundColor Cyan

# Verificar si MySQL ya está corriendo en localhost:3306
$mysqlReady = $false
try {
    $conn = Test-NetConnection -ComputerName localhost -Port 3306 -WarningAction SilentlyContinue
    if ($conn.TcpTestSucceeded) { $mysqlReady = $true }
} catch {}

if ($mysqlReady) {
    Write-Host "✅ MySQL detectado en localhost:3306. Usando base de datos existente." -ForegroundColor Green
} elseif ((Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "🐳 Docker detectado. Levantando MySQL..." -ForegroundColor Yellow
    docker compose up -d mysql
    Write-Host "⏳ Esperando a que MySQL esté listo..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
} else {
    Write-Host "⚠️ No se detectó MySQL en localhost:3306 ni Docker. Se asume que lo levantarás manualmente." -ForegroundColor Yellow
}

# Inicializar base de datos si hace falta
Write-Host "🗄️ Verificando base de datos citypaj..." -ForegroundColor Yellow
cd backend
$envCheck = node -e "console.log('check')" 2>$null
if ($LASTEXITCODE -ne 1) {
    npm run db:init 2>$null | Out-Null
}
cd ..

# Compilar backend si no existe dist
if (-not (Test-Path "$PWD\backend\dist\index.js")) {
    Write-Host "🔨 Compilando backend..." -ForegroundColor Yellow
    Set-Location "$PWD\backend"
    npm run build
    Set-Location "$PWD\.."
}

# Backend
Write-Host "🔧 Arrancando backend en http://localhost:3002" -ForegroundColor Yellow
$backend = Start-Job -ScriptBlock {
    Set-Location "$using:PWD\backend"
    node dist\index.js
}

if (-not (Wait-ForBackend)) {
    Write-Host "❌ El backend no respondió. Revisa los logs: Receive-Job -Id $($backend.Id)" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend listo" -ForegroundColor Green

# Frontend
Write-Host "🎨 Arrancando frontend en http://localhost:3001" -ForegroundColor Yellow
$frontend = Start-Job -ScriptBlock {
    Set-Location "$using:PWD\frontend"
    npm run dev
}

if (-not (Wait-ForFrontend)) {
    Write-Host "⚠️ El frontend puede tardar más en arrancar. Revisa los logs: Receive-Job -Id $($frontend.Id)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ CityPAJ iniciado" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:3002" -ForegroundColor Cyan
Write-Host "   Panel de moderación: http://localhost:3001/admin/sugerencias" -ForegroundColor Cyan
Write-Host ""
Write-Host "Comandos útiles:" -ForegroundColor Gray
Write-Host "   Receive-Job -Id $($backend.Id) -Keep   # ver logs del backend" -ForegroundColor Gray
Write-Host "   Receive-Job -Id $($frontend.Id) -Keep  # ver logs del frontend" -ForegroundColor Gray
Write-Host "   Stop-Job -Id $($backend.Id); Stop-Job -Id $($frontend.Id)  # detener" -ForegroundColor Gray
