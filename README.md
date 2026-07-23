# CityPAJ

Plataforma web para jóvenes que conecta recursos, anuncios, eventos, propuestas y participación ciudadana.

## Novedades recientes (para no perderse)

- **Navegación renovada**: el menú principal ahora tiene **Empleo**, **Comunidad**, **Buzón de sugerencias** y **Ayudas**. Se han quitado las secciones antiguas de Ocio, Servicios y Formación.
- **Página de ayudas (`/ayudas`)**: recursos nacionales para jóvenes y extranjería, más un directorio por comunidad autónoma.
- **Publicar anuncio con IA**: cuando publicas, el sistema muestra un mensaje avisando de que un moderador automático (IA interna) revisa el contenido antes de publicarlo. Si detecta algo inapropiado, lo rechaza y explica el motivo.
- **Panel de moderación de anuncios**: desde `/admin/anuncios` puedes ver los anuncios reportados o pendientes, aprobarlos, rechazarlos o dejar que la IA los revise.
- **Idiomas corregidos**: la advertencia de `react-i18next` desapareció; la traducción se inicializa correctamente y los textos clave tienen valores por defecto.
- **Usuarios demo preparados**: puedes probar con `usuario@citypaj.demo` / `demo123` (usuario normal) y `moderador@citypaj.demo` / `demo123` (panel de moderación).

---

## Stack tecnológico

- **Frontend**: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + MySQL2
- **Base de datos**: MySQL (`citypaj`)
- **Puertos**: Frontend 3001, Backend 3002, MySQL 3306

---

## Requisitos previos

- Node.js 18+
- MySQL 8.0+ o Docker Desktop
- npm 9+

## Configuración inicial

Las credenciales por defecto en desarrollo son:

| Servicio | Valor |
|----------|-------|
| Base de datos | `citypaj` |
| Usuario MySQL | `citypaj_user` |
| Contraseña | `citypaj123` |
| Host MySQL | `localhost` |
| Puerto MySQL | `3306` |
| Puerto backend | `3002` |
| Puerto frontend | `3001` |

Los archivos `.env.example` y `.env.local.example` están preparados. El proyecto incluye `.env` y `.env.local` con esos valores para desarrollo local.

---

## Arranque automático recomendado

Desde la raíz del proyecto:

```powershell
# Levantar MySQL con Docker, crear la base de datos si no existe, instalar dependencias y compilar
npm run setup

# O solo levantar MySQL con Docker
npm run db:up

# Luego arrancar backend y frontend juntos
npm run dev
```

### WSL

Si trabajas en WSL, ejecuta desde la raíz del proyecto en una terminal de Ubuntu/WSL:

```bash
cd /mnt/c/Users/Carmen/Documents/TFG-2DAW/citypaj
npm run dev
```

Esto arranca backend (`nodemon` con `ts-node` en el puerto 3002) y frontend (Next.js en el puerto 3001) a la vez. Espera unos 10-15 segundos a que `ts-node` compile y el backend conecte a MySQL.

Si no usas Docker, asegúrate de tener MySQL corriendo en `localhost:3306` con la base de datos `citypaj` y el usuario `citypaj_user`.

> **Importante:** Si en Windows también tienes un servidor MySQL (XAMPP, MySQL Installer, etc.), `localhost` en WSL puede apuntar a una base de datos distinta. Si ves errores como `Unknown column` o `Table doesn't exist` en WSL, es porque el backend se conectó a un MySQL incorrecto. En ese caso, la opción más sencilla es arrancar todo en **PowerShell de Windows** (ver apartado anterior) para que backend y frontend usen el mismo `localhost` que el MySQL de Windows.

### Si el puerto 3001 o 3002 está ocupado

`npm run dev` ejecuta automáticamente `predev`, que limpia procesos stale del proyecto (anteriores `next dev`, `nodemon`, `ts-node` o `concurrently`) antes de arrancar. Si quieres forzar la limpieza manualmente:

```bash
npm run kill:ports
```

Antes de arrancar, comprueba qué proceso los usa:

```bash
npm run check:ports
```

O manualmente:

**Linux/WSL:**

```bash
lsof -i :3001
lsof -i :3002
ss -ltnp | grep -E '3001|3002'
```

**Windows PowerShell:**

```powershell
netstat -ano | findstr :3001
netstat -ano | findstr :3002
```

Cierra el proceso antiguo antes de volver a arrancar:

**Linux/WSL:**

```bash
kill -9 <PID>
```

**Windows PowerShell (como administrador si es necesario):**

```powershell
Stop-Process -PID <PID> -Force
```

Si el conflicto persiste en Windows por `iphlpsvc` o WSL, abre PowerShell como administrador y elimina el reenvío:

```powershell
netsh interface portproxy delete v4tov4 listenaddress=127.0.0.1 listenport=3001
netsh interface portproxy delete v6tov4 listenaddress=::1 listenport=3001
```

---

## Arranque manual

### 1. MySQL

**Con Docker:**

```powershell
docker compose up -d mysql
```

**Con XAMPP / MySQL local:**

Asegúrate de que MySQL esté corriendo en el puerto 3306 y de que exista la base de datos `citypaj`.

Para crear la base e inicializar las tablas:

```bash
cd backend
npm run db:init
```

### 2. Backend

```bash
cd backend
npm install
npm run build
npm start
```

El backend arranca en `http://localhost:3002` y se conecta automáticamente a MySQL usando la base `citypaj`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend arranca en `http://localhost:3001` y consume la API del backend en `http://localhost:3002`.

---

## Comprobación de conexión

Una vez levantado todo:

```bash
curl http://localhost:3002/health
curl http://localhost:3002/test-db
curl "http://localhost:3002/api/anuncios?pagina=1&limite=5"
```

- `/health` indica que el backend responde.
- `/test-db` confirma que el backend está conectado a la base `citypaj`.
- `/api/anuncios` devuelve anuncios reales de la base de datos.

---

## Scripts principales

Desde la raíz:

| Comando | Descripción |
|---------|-------------|
| `npm run setup` | Levanta MySQL con Docker, crea la base, instala dependencias y compila |
| `npm run db:up` | Levanta MySQL con Docker |
| `npm run db:down` | Detiene MySQL de Docker |
| `npm run db:init` | Crea la base `citypaj` y aplica migraciones |
| `npm run install:all` | Instala dependencias en raíz, backend y frontend |
| `npm run build` | Compila backend y frontend |
| `npm run dev` | Arranca backend y frontend en modo desarrollo |
| `npm run start` | Arranca backend y frontend para uso |

Desde `backend`:

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Backend con recarga automática (nodemon) |
| `npm run build` | Compila TypeScript |
| `npm start` | Inicia backend compilado |
| `npm run db:init` | Crea la base de datos y tablas |
| `npm run db:check` | Verifica conexión a MySQL |
| `npm run db:verify` | Verifica integridad de la base de datos |
| `npm run db:seed:demo` | Crea/actualiza usuarios demo (usuario, moderador y admin) |

Desde `frontend`:

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia Next.js en `http://localhost:3001` |
| `npm run build` | Build de producción |
| `npm start` | Servidor Next.js en `http://localhost:3001` |

---

## Variables de entorno

**backend/.env** (desarrollo local):

```env
PORT=3002
DB_HOST=localhost
DB_PORT=3306
DB_NAME=citypaj
DB_USER=citypaj_user
DB_PASSWORD=citypaj123
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

**frontend/.env.local** (desarrollo local):

```env
BACKEND_URL=http://localhost:3002
NEXT_PUBLIC_API_URL=http://localhost:3002
```

---

## Estructura de carpetas principales

```
citypaj/
├── backend/
│   ├── src/               # Código fuente de la API
│   ├── migrations/        # Migraciones SQL de MySQL
│   ├── scripts/           # Scripts utilitarios (init-db, etc.)
│   └── package.json
├── frontend/
│   ├── src/app/           # Páginas y rutas API de Next.js
│   ├── src/components/    # Componentes React
│   ├── src/lib/           # Utilidades (configuración API)
│   └── package.json
├── docker-compose.yml     # MySQL con Docker
└── README.md
```

---

## Endpoints principales

| Recurso | Ruta backend |
|---------|--------------|
| Health | `GET /health` |
| Test DB | `GET /test-db` |
| Anuncios | `GET/POST /api/anuncios` |
| Moderación de anuncios | `GET /api/anuncios/moderacion` |
| Reportes de un anuncio | `GET /api/anuncios/:id/reportes` |
| Moderar un anuncio | `POST /api/anuncios/:id/moderar` |
| Moderar con IA | `POST /api/anuncios/:id/moderar-ia` |
| Comunidad | `GET/POST /api/comunidad` |
| Propuestas | `GET /api/propuestas` |
| Recursos | `GET/POST /api/recursos` |
| Eventos | `GET/POST /api/eventos` |
| Sugerencias | `POST /api/sugerencias` |
| Estadísticas | `GET /api/sugerencias/estadisticas` |
| Autenticación | `POST /api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/refresh`, `GET /api/auth/me` |
| Usuarios | `GET /api/usuarios/perfil` |

---

## Panel de moderación

El panel principal de moderación está en **`/moderador`**.

- **Login de moderador**: `/moderador/login`
- **Panel de moderador**: `/moderador`
- **Sugerencias**: `/admin/sugerencias`
- **Anuncios**: `/admin/anuncios`

Desde el panel puedes revisar anuncios reportados o pendientes de aprobación, aprobar, rechazar o dejar que la IA los revise. También hay enlaces a sugerencias y comunidad.

Para entrar usa la **cuenta demo de moderador**: `moderador@citypaj.demo` / `demo123`.

---

## Solución de problemas

### MySQL no responde

Asegúrate de que MySQL está corriendo. Con Docker:

```powershell
docker compose up -d mysql
```

Con XAMPP, inicia el servicio MySQL desde el panel de control.

### La base de datos `citypaj` no existe

```bash
cd backend
npm run db:init
```

### El backend no conecta con MySQL

Revisa `backend/.env` y verifica que los valores coincidan con tu MySQL.

### El frontend no encuentra el backend

Asegúrate de que `frontend/.env.local` tiene `BACKEND_URL=http://localhost:3002` y de que el backend está corriendo.

---

## ¿El frontend está conectado al backend y a la base de datos?

**Sí.** El frontend no habla directamente con MySQL, sino con el backend a través de las rutas `/api/*` de Next.js. Esas rutas actúan como intermediarias y le piden los datos al backend en `http://localhost:3002`, que es quien consulta MySQL.

Por ejemplo:
- Página de inicio → `/api/anuncios` → backend → tabla `anuncios`
- `/comunidad` → `/api/comunidad` → backend → tablas `comunidad_publicaciones` y `comunidad_comentarios`
- `/admin/sugerencias` → `/api/sugerencias` → backend → tabla `sugerencias`
- `/admin/anuncios` → `/api/anuncios/moderacion` → backend → tablas `anuncios` + `reportes_anuncios`
- `/moderador` → `/api/anuncios/moderacion`, `/api/sugerencias`, `/api/comunidad`, `/api/reportes` → backend → base de datos

Casi todo el contenido que ves en la web viene de la base de datos. Lo único estático son algunos desplegables de comunidades/provincias en formularios y la página de `/ayudas`, que es un directorio de enlaces externos.

## Credenciales de demo

> **Nota:** Estas credenciales son solo para entorno demo/desarrollo. No deben usarse en producción.

Puedes crear o actualizar los usuarios demo ejecutando:

```bash
cd backend
npm run db:seed:demo
```

### Usuario normal

| Campo | Valor |
|-------|-------|
| Email | `usuario@citypaj.demo` |
| Contraseña | `demo123` |
| Rol | `usuario` |
| Ruta de acceso | `/acceder` |

### Moderador

| Campo | Valor |
|-------|-------|
| Email | `moderador@citypaj.demo` |
| Contraseña | `demo123` |
| Rol | `moderador` |
| Ruta de acceso | `/moderador/login` |
| Panel | `/moderador` |

### Administrador (opcional)

| Campo | Valor |
|-------|-------|
| Email | `admin@citypaj.demo` |
| Contraseña | `demo123` |
| Rol | `admin` |
| Ruta de acceso | `/moderador/login` |

## Notas

- El frontend no se conecta directamente a MySQL; siempre consume el backend.
- El backend usa `mysql2/promise` con un pool centralizado en `src/config/database.ts`.
- No se usa el puerto 3005 ni la base `citypaj_db` en el código activo.
- Los servidores temporales (`server-simple.js`, etc.) no forman parte del arranque oficial.
