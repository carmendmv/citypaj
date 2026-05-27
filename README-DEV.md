# 🚀 CityPaj - Guía de Desarrollo Rápido

## 📋 Requisitos Previos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker Desktop** (para PostgreSQL)

## 🎯 Inicio Rápido (Recomendado)

### Opción 1: Script Automático (Windows)
```bash
# Ejecutar el script de inicio
./start-dev.bat
```

### Opción 2: Comandos Manuales
```bash
# 1. Instalar dependencias en todos los proyectos
npm run install:all

# 2. Iniciar PostgreSQL con Docker
docker-compose up -d postgres

# 3. Iniciar backend y frontend simultáneamente
npm run dev
```

## 🗄️ Configuración de Base de Datos

La base de datos se configura automáticamente al iniciar el backend:

- **Host**: localhost:5432
- **Database**: citypaj
- **User**: postgres
- **Password**: citypaj123

### Comandos Útiles de Base de Datos
```bash
# Conectarse a la base de datos
npm run db:shell

# Reiniciar base de datos (borra todos los datos)
npm run db:reset

# Inicializar tablas y datos de ejemplo
npm run db:init
```

## 🌐 Acceso a la Aplicación

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3002
- **Health Check**: http://localhost:3002/health

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar todo (backend + frontend)
npm run dev:backend      # Solo backend
npm run dev:frontend     # Solo frontend

# Docker
npm start                # Iniciar todos los servicios con Docker
npm stop                 # Detener todos los servicios
npm run clean            # Limpiar Docker

# Base de Datos
npm run db:reset         # Resetear base de datos
npm run db:shell         # Acceder a PostgreSQL
npm run db:init          # Inicializar tablas

# Utilidades
npm run install:all      # Instalar dependencias everywhere
npm run build            # Compilar para producción
npm run test             # Ejecutar tests
npm run logs             # Ver logs de Docker
```

## 📁 Estructura del Proyecto

```
citypaj/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── config/         # Configuración (DB, etc.)
│   │   ├── controllers/    # Controladores
│   │   ├── middleware/     # Middleware
│   │   ├── routes/         # Rutas
│   │   └── scripts/        # Scripts de utilidad
│   └── package.json
├── frontend/               # Next.js App
│   ├── src/
│   │   ├── app/           # Páginas de Next.js
│   │   ├── components/    # Componentes React
│   │   └── lib/           # Utilidades
│   └── package.json
├── docker-compose.yml      # Configuración Docker
├── start-dev.bat          # Script de inicio (Windows)
└── package.json           # Scripts raíz
```

## 🔧 Configuración del Backend

El backend se configura automáticamente con las variables de entorno:

```bash
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=citypaj
DATABASE_USER=postgres
DATABASE_PASSWORD=citypaj123
```

## 🐛 Solución de Problemas

### Docker no está corriendo
```bash
# Iniciar Docker Desktop manualmente
# O reiniciar el servicio
docker start citypaj-postgres
```

### Backend no conecta a la base de datos
```bash
# Verificar que PostgreSQL esté listo
docker exec citypaj-postgres pg_isready -U postgres

# Reiniciar todo
npm run db:reset
npm run dev
```

### Puerto en uso
```bash
# Verificar qué está usando el puerto
netstat -an | findstr :3002
netstat -an | findstr :3001

# Detener servicios
npm stop
```

## 📝 Notas Importantes

1. **La base de datos se inicia automáticamente** al ejecutar `npm run dev`
2. **Las tablas se crean solas** la primera vez que inicia el backend
3. **Los datos persisten** entre reinicios gracias a volúmenes de Docker
4. **No necesitas configurar nada manualmente** - todo está automatizado

## 🎉 ¡Listo!

Una vez ejecutado `npm run dev` o `start-dev.bat`, tendrás:

- ✅ Base de datos PostgreSQL corriendo
- ✅ Backend API en http://localhost:3002
- ✅ Frontend en http://localhost:3001
- ✅ Datos de ejemplo cargados
- ✅ Todo conectado y funcionando

La aplicación está lista para usar sin configuración manual adicional.
