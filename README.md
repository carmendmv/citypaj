# CityPAJ

Proyecto de fin de ciclo del 2º curso de DAW. Una plataforma web dirigida a jóvenes para publicar y descubrir anuncios, recursos, eventos, propuestas y participación ciudadana.

---

## Índice

1. [Descripción](#descripción)
2. [Características principales](#características-principales)
3. [Arquitectura y stack tecnológico](#arquitectura-y-stack-tecnológico)
4. [Estructura de carpetas](#estructura-de-carpetas)
5. [Requisitos previos](#requisitos-previos)
6. [Configuración inicial](#configuración-inicial)
7. [Instalación paso a paso](#instalación-paso-a-paso)
8. [Cómo arrancar el proyecto](#cómo-arrancar-el-proyecto)
9. [Scripts disponibles](#scripts-disponibles)
10. [Credenciales de demo](#credenciales-de-demo)
11. [Flujo de autenticación](#flujo-de-autenticación)
12. [Moderación de anuncios](#moderación-de-anuncios)
13. [Subida de imágenes](#subida-de-imágenes)
14. [Endpoints API principales](#endpoints-api-principales)
15. [Rutas del frontend](#rutas-del-frontend)
16. [Tests](#tests)
17. [Despliegue](#despliegue)
18. [Solución de problemas](#solución-de-problemas)
19. [FAQ](#faq)
20. [Seguridad](#seguridad)
21. [Licencia y autor](#licencia-y-autor)

---

## Descripción

CityPAJ es una aplicación full-stack que construyo mientras aprendo. Permite a los usuarios publicar anuncios juveniles, buscar contenido por comunidad autónoma y provincia, y participar en secciones como comunidad, buzón de sugerencias y ayudas.

Durante el desarrollo descubro cómo encajan el frontend con React y Next.js, el backend con Express y TypeScript, y una base de datos MySQL. El flujo de moderación humana, con un filtro interno automático que marca contenido dudoso, me sirve para entender cómo gestionar permisos, estados y responsabilidad de contenido en una aplicación real.

El objetivo es ofrecer una experiencia moderna y accesible desde el móvil, con un panel de moderación separado del acceso de los usuarios normales.

---

## Características principales

- **Anuncios**: publicación, edición, búsqueda y filtrado por CCAA, provincia, categoría y texto.
- **Página principal**: sección "Últimos anuncios" con filtros dinámicos y ordenación de más reciente a más antiguo.
- **Autenticación**: registro, login, JWT access/refresh, logout y eliminación de cuenta.
- **Moderación humana**: panel exclusivo para moderadores con selector de estado, notas y acciones de aprobar/rechazar/ver.
- **Filtro interno de palabras inapropiadas**: detecta contenido dudoso y marca anuncios como `flagged` (en revisión); nunca rechaza automáticamente.
- **Responsive**: panel de moderación y toda la interfaz adaptada a móvil.
- **Buzón de sugerencias**: formulario público con panel de lectura para moderadores.
- **Página de ayudas**: directorio de recursos nacionales y por comunidad autónoma.
- **Subida de imágenes**: soporte para hasta 6 imágenes por anuncio (JPEG, PNG, WebP, máximo 5 MB).

---

## Arquitectura y stack tecnológico

| Capa | Tecnología | Versión aprox. |
|------|------------|----------------|
| Frontend | Next.js + React + TypeScript | 14 / 18 |
| Estilos | Tailwind CSS | 3.3 |
| Backend | Node.js + Express + TypeScript | 18+ / 4.18 |
| Base de datos | MySQL (mysql2) | 8.0 |
| ORM/SQL | Knex + SQL raw (mysql2 pool) | — |
| Cache/Sesión | Redis (opcional) | 7 |
| Email | Nodemailer (SMTP) | 6.9 |
| Almacenamiento de imágenes | S3-compatible (opcional) / local | — |

### Puertos por defecto

| Servicio | Puerto | URL local |
|----------|--------|-----------|
| Frontend Next.js | 3001 | http://localhost:3001 |
| Backend Express | 3002 | http://localhost:3002 |
| MySQL | 3306 | localhost:3306 |
| Redis | 6379 | localhost:6379 |

---

## Estructura de carpetas

```
citypaj/
├── .env.example                 # Variables globales de ejemplo
├── .env.production              # Plantilla para producción
├── docker-compose.yml           # MySQL con Docker
├── package.json                 # Scripts raíz y dependencias compartidas
├── citypaj_dump.sql            # Volcado completo de la base de datos
├── backend/
│   ├── src/
│   │   ├── config/             # Configuración (DB, env, logger)
│   │   ├── controllers/        # Lógica de negocio (anuncios, auth, sugerencias...)
│   │   ├── lib/                # Datos oficiales (territorios.ts)
│   │   ├── routes/             # Definición de rutas Express
│   │   ├── middleware/         # Autenticación, validación, errores
│   │   ├── models/             # Tipos y helpers
│   │   ├── utils/              # Utilidades (logger, etc.)
│   │   └── index.ts            # Punto de entrada del servidor
│   ├── migrations/             # Scripts SQL de esquema
│   ├── scripts/                # init-db.js, seed-demo.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/                # Rutas y páginas de Next.js (App Router)
│   │   ├── components/         # Componentes React reutilizables
│   │   ├── data/               # Datos oficiales (territorios.ts)
│   │   ├── lib/                # Utilidades y API (provinces.ts)
│   │   └── hooks/              # Hooks personalizados
│   ├── public/                 # Assets estáticos
│   └── package.json
└── README.md                  # Documentación del proyecto
```

---

## Requisitos previos

- **Node.js** 18 o superior.
- **npm** 9 o superior.
- **MySQL** 8.0+ o Docker Desktop con soporte para Linux containers.
- **Git**.
- (Opcional) **Redis** si se quieren usar sesiones/cache avanzadas.

---

## Configuración inicial

El proyecto usa varios archivos de entorno. Copia los ejemplos y rellena los valores:

```bash
# Desde la raíz del proyecto
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### Variables mínimas necesarias para desarrollo

**`backend/.env`**

```env
PORT=3002
DB_HOST=localhost
DB_PORT=3306
DB_NAME=citypaj
DB_USER=citypaj_user
DB_PASSWORD=citypaj123
NODE_ENV=development
JWT_SECRET=cambia-esta-clave-en-produccion
```

**`frontend/.env.local`**

```env
BACKEND_URL=http://localhost:3002
NEXT_PUBLIC_API_URL=http://localhost:3002
```

**Variables opcionales pero recomendables**

- `REDIS_HOST` / `REDIS_PORT` para cache y sesiones.
- `EMAIL_*` para envío de correos de verificación.
- `S3_*` para almacenar imágenes en S3 en producción.
- `MODERATION_*` para conectar un servicio externo de moderación (opcional).
- `RATE_LIMIT_*` para ajustar límites de peticiones.

---

## Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/carmendmv/anuncios-juvenil.git
cd anuncios-juvenil
```

### 2. Levantar MySQL

**Opción A: con Docker (recomendada)**

```bash
docker compose up -d mysql
```

Esto crea un contenedor `citypaj-mysql` en el puerto `3306` con la base `citypaj`, usuario `citypaj_user` y contraseña `citypaj123`.

**Opción B: MySQL local / XAMPP / WAMP**

Asegúrate de tener MySQL corriendo en `localhost:3306` y crea la base manualmente:

```sql
CREATE DATABASE IF NOT EXISTS citypaj CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'citypaj_user'@'%' IDENTIFIED BY 'citypaj123';
GRANT ALL PRIVILEGES ON citypaj.* TO 'citypaj_user'@'%';
FLUSH PRIVILEGES;
```

### 3. Instalar dependencias

```bash
npm run install:all
```

Equivalente a:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 4. Inicializar la base de datos

```bash
npm run db:init
```

Este comando:

1. Crea la base `citypaj` si no existe.
2. Crea el usuario `citypaj_user` si no existe.
3. Ejecuta todos los archivos `.sql` de `backend/migrations/` en orden.

**Alternativa: restaurar desde el volcado**

```bash
cd backend
# Con el cliente mysql:
mysql -u citypaj_user -pcitypaj123 citypaj < ../citypaj_dump.sql
```

### 5. Crear usuarios de demo

```bash
cd backend
npm run db:seed:demo
```

Si no ejecutas el script, el backend intenta crear el moderador demo automáticamente al arrancar.

### 6. Compilar (opcional en desarrollo)

```bash
npm run build
```

Esto compila TypeScript en `backend/dist` y genera el build de Next.js en `frontend/.next`.

---

## Cómo arrancar el proyecto

### Desarrollo (backend + frontend a la vez)

Desde la raíz:

```bash
npm run dev
```

Esto ejecuta en paralelo:

- `cd backend && npm run dev` → Express + nodemon + ts-node en `http://localhost:3002`
- `cd frontend && npm run dev` → Next.js en `http://localhost:3001`

Espera 10-15 segundos a que `ts-node` compile el backend y conecte a MySQL.

**En WSL / Linux**

```bash
cd /mnt/c/Users/Carmen/Documents/TFG-2DAW/citypaj
npm run dev
```

o con el script incluido:

```bash
./start-wsl.sh
```

**En Windows PowerShell**

```powershell
.\start-all.ps1
```

### Desarrollo por separado

Terminal 1 (backend):

```bash
cd backend
npm run dev
```

Terminal 2 (frontend):

```bash
cd frontend
npm run dev
```

### Producción

```bash
npm run build
npm run start
```

- Backend: `node backend/dist/index.js` en el puerto `PORT`.
- Frontend: `next start -p 3001` en `http://localhost:3001`.

> **Nota:** El script `start:frontend` de la raíz apunta a `npm run dev` en el `package.json` actual. Para producción real se recomienda ejecutar `next start` manualmente o configurar un servicio como PM2.

---

## Scripts disponibles

### Raíz (`package.json`)

| Comando | Descripción |
|---------|-------------|
| `npm run install:all` | Instala dependencias en raíz, backend y frontend |
| `npm run setup` | Levanta MySQL con Docker, inicializa DB, instala dependencias y compila |
| `npm run setup:docker` | Sólo Docker + instalar + build |
| `npm run dev` | Arranca backend y frontend en desarrollo |
| `npm run start` | Arranca backend y frontend para uso |
| `npm run build` | Compila backend y frontend |
| `npm run db:up` | Levanta MySQL con Docker |
| `npm run db:down` | Detiene MySQL de Docker |
| `npm run db:init` | Crea base de datos y aplica migraciones |
| `npm run db:check` | Verifica conexión a MySQL |
| `npm run kill:ports` | Limpia procesos de puertos 3001/3002 |
| `npm run check:ports` | Comprueba si los puertos están libres |

### Backend

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Backend con recarga automática (nodemon + ts-node) |
| `npm run build` | Compila TypeScript |
| `npm start` | Ejecuta el servidor compilado |
| `npm run db:init` | Crea base de datos y tablas |
| `npm run db:check` | Verifica conexión a MySQL |
| `npm run db:verify` | Verifica integridad de datos |
| `npm run db:seed:demo` | Crea/actualiza usuarios demo |
| `npm test` | Ejecuta tests con Jest |
| `npm run lint` | Linter ESLint |

### Frontend

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Next.js en `http://localhost:3001` |
| `npm run build` | Build de producción |
| `npm run start` | Servidor Next.js en `http://localhost:3001` |
| `npm run lint` | Linter Next.js |
| `npm run type-check` | `tsc --noEmit` |
| `npm test` | Tests con Jest |

---

## Credenciales de demo

> Estas credenciales se crean automáticamente en desarrollo. No usar en producción.

| Rol | Email | Contraseña | Acceso / Panel |
|-----|-------|------------|----------------|
| Usuario normal | `usuario@citypaj.demo` | `demo123` | `/acceder` |
| Moderador | `moderador@citypaj.demo` | `demo123` | `/moderador/login` → `/moderador` |
| Administrador | `admin@citypaj.demo` | `demo123` | `/moderador/login` → `/admin/*` |

---

## Flujo de autenticación

1. El usuario se registra en `/api/auth/register`.
2. El backend guarda el hash de la contraseña con `bcrypt`.
3. Al hacer login, el servidor emite un **access token** JWT (15 min) y un **refresh token** (7 días).
4. El frontend almacena ambos tokens y los envía en la cabecera `Authorization: Bearer <token>`.
5. Las rutas protegidas verifican el JWT y el rol (`usuario`, `moderador`, `admin`).
6. El logout invalida el refresh token en el servidor.

---

## Moderación de anuncios

El acceso a la moderación está **desvinculado** del login de usuarios normales.

- **Login exclusivo**: `/moderador/login`
- **Panel de moderador**: `/moderador`
- **Anuncios pendientes**: `/admin/anuncios`
- **Sugerencias**: `/admin/sugerencias`

### Flujo

1. Un usuario publica un anuncio.
2. El sistema ejecuta un filtro interno de palabras inapropiadas que puede marcarlo como `flagged` si detecta contenido dudoso. **Nunca lo rechaza automáticamente**; solo lo deja en revisión humana.
3. Los moderadores ven en `/admin/anuncios` los anuncios en estado `pending` o `flagged`, y también los `approved` que tengan reportes pendientes.
4. Desde el panel se puede:
   - Ver la descripción completa del anuncio.
   - Cambiar el estado desde un selector (`Pendiente`, `En revisión`, `Aprobado`, `Rechazado`).
   - Añadir notas internas o motivos.
   - Aprobar o rechazar con un solo click.
   - Ver reportes asociados.
   - Abrir el anuncio público.
5. Un anuncio aprobado o rechazado desaparece de la lista pendiente.

### Estados de moderación

| Estado | Significado |
|--------|-------------|
| `pending` | Pendiente de revisión |
| `flagged` | Marcado por el filtro interno; requiere revisión humana |
| `approved` | Aprobado y visible públicamente |
| `rejected` | Rechazado; no visible públicamente |

---

## Subida de imágenes

- Se permiten hasta **6 imágenes** por anuncio.
- Formatos: `image/jpeg`, `image/png`, `image/webp`.
- Tamaño máximo por archivo: **5 MB**.
- En producción se puede configurar almacenamiento en S3 con las variables `S3_*`.
- En desarrollo las imágenes se sirven desde el directorio de uploads local.

---

## Endpoints API principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/health` | Healthcheck del backend |
| `GET` | `/test-db` | Comprueba conexión a MySQL |
| `POST` | `/api/auth/register` | Registro de usuario |
| `POST` | `/api/auth/login` | Login (devuelve tokens) |
| `POST` | `/api/auth/logout` | Logout |
| `POST` | `/api/auth/refresh` | Refresca access token |
| `GET` | `/api/auth/me` | Perfil del usuario actual |
| `GET` | `/api/anuncios` | Listar/buscar anuncios |
| `POST` | `/api/anuncios` | Crear anuncio |
| `GET` | `/api/anuncios/:id` | Detalle de un anuncio |
| `PUT` | `/api/anuncios/:id` | Actualizar anuncio |
| `DELETE` | `/api/anuncios/:id` | Eliminar anuncio |
| `GET` | `/api/anuncios/moderacion` | Listado para moderadores |
| `POST` | `/api/anuncios/:id/moderar` | Aprobar/rechazar/actualizar estado |
| `GET` | `/api/anuncios/:id/reportes` | Reportes de un anuncio |
| `POST` | `/api/anuncios/:id/reportar` | Reportar un anuncio |
| `POST` | `/api/sugerencias` | Enviar sugerencia |
| `GET` | `/api/sugerencias/estadisticas` | Estadísticas de sugerencias |
| `GET/POST` | `/api/comunidad` | Publicaciones y comentarios de comunidad |
| `GET` | `/api/territorios` | Listado completo de comunidades y provincias |
| `GET` | `/api/territorios/comunidades` | Listado de comunidades autónomas |
| `GET` | `/api/territorios/provincias?comunidad=ID` | Provincias de una comunidad |
| `GET` | `/api/provincias/:comunidad` | Provincias de una comunidad (compatibilidad) |
| `GET/POST` | `/api/recursos` | Recursos / ayudas |
| `GET/POST` | `/api/eventos` | Eventos |
| `GET` | `/api/usuarios/perfil` | Perfil del usuario |

---

## Rutas del frontend

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal con hero y últimos anuncios |
| `/acceder` | Login de usuarios |
| `/registro` | Registro de usuarios |
| `/publicar` | Formulario para publicar anuncio |
| `/mis-anuncios` | Anuncios del usuario logueado |
| `/anuncios/[id]` | Detalle público de un anuncio |
| `/buscar` | Búsqueda avanzada de anuncios |
| `/comunidad` | Muro de comunidad |
| `/buzon` | Buzón de sugerencias |
| `/ayudas` | Directorio de ayudas |
| `/moderador/login` | Login exclusivo de moderadores |
| `/moderador` | Dashboard de moderador |
| `/admin/anuncios` | Panel de moderación de anuncios |
| `/admin/sugerencias` | Panel de lectura de sugerencias |
| `/contacto`, `/terminos`, `/privacidad` | Páginas legales/informativas |

---

## Tests

Backend:

```bash
cd backend
npm test
```

Frontend:

```bash
cd frontend
npm test
```

---

## Despliegue

### Opción recomendada: Docker Compose (despliegue completo con datos)

Este comando levanta MySQL, el backend y el frontend, y carga automáticamente los datos reales del proyecto desde `citypaj_dump.sql`.

Requisitos en el servidor:
- Docker y Docker Compose instalados.
- Puertos `3001` y `3002` libres (MySQL no se expone fuera de Docker).

Pasos:

```bash
# 1. Clonar el repositorio
git clone https://github.com/carmendmv/anuncios-juvenil.git
cd anuncios-juvenil

# 2. Levantar todo (compilar imágenes e iniciar contenedores)
docker compose up --build -d

# 3. Esperar a que MySQL termine de importar los datos
#    Esto puede tardar un minuto o dos la primera vez.
#    Puedes comprobar el progreso con:
docker logs -f citypaj-mysql

# 4. (Opcional) Crear usuarios de demo para login
#    Admin/moderador/usuario con contraseña demo123:
docker compose exec backend npm run db:seed:demo
```

Acceso una vez iniciado:

- Frontend: `http://IP_DEL_SERVIDOR:3001`
- Backend API: `http://IP_DEL_SERVIDOR:3002`
- La base de datos **no está expuesta** al exterior (solo accesible dentro de los contenedores).

Datos que se muestran:

- `docker compose` monta automáticamente `citypaj_dump.sql` en el contenedor de MySQL.
- Al arrancar por primera vez, MySQL ejecuta las migraciones y el volcado, por lo que la demo muestra los mismos anuncios y datos que tienes en producción.
- Si el volcado cambia en el futuro, basta con rehacer el volumen para recargarlo:

```bash
docker compose down -v
docker compose up --build -d
```

### Variables de entorno (opcional)

Puedes crear un archivo `.env` en la raíz para cambiar contraseñas y secrets:

```env
MYSQL_ROOT_PASSWORD=RootSeguro2025!
MYSQL_PASSWORD=UserSeguro2025!
JWT_SECRET=mi-clave-jwt-segura
JWT_REFRESH_SECRET=mi-clave-refresh-segura
```

Si no creas `.env`, el `docker-compose.yml` usa unos valores por defecto para poder probarlo inmediatamente.

### Opción manual (sin Docker)

1. Configura las variables de entorno en el servidor (`.env.production` como guía).
2. Asegúrate de que MySQL/Redis sean accesibles.
3. Ejecuta `npm run build`.
4. Ejecuta `npm run start` o configura PM2/systemd para mantener los procesos.
5. Coloca un reverse proxy (Nginx, Caddy, etc.) frente al frontend y backend con HTTPS.

### Variables importantes en producción

```env
NODE_ENV=production
PORT=3002
DB_HOST=mysql.tu-dominio.com
DB_SSL=true
JWT_SECRET=<clave-muy-segura>
JWT_REFRESH_SECRET=<clave-muy-segura-refresh>
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com
BACKEND_URL=https://api.tu-dominio.com
```

---

## Solución de problemas

### Los puertos 3001 o 3002 están ocupados

```bash
npm run kill:ports
```

o manualmente:

**WSL/Linux**

```bash
lsof -i :3001
lsof -i :3002
kill -9 <PID>
```

**Windows PowerShell**

```powershell
netstat -ano | findstr :3001
Stop-Process -PID <PID> -Force
```

Si WSL reserva los puertos, elimina el reenvío:

```powershell
netsh interface portproxy delete v4tov4 listenaddress=127.0.0.1 listenport=3001
netsh interface portproxy delete v6tov4 listenaddress=::1 listenport=3001
```

### `localhost` en WSL apunta a otro MySQL

Si tienes MySQL en Windows (XAMPP) y en Docker/WSL, `localhost` puede resolver de forma distinta. Revisa que `DB_HOST` coincida con el MySQL que realmente quieres usar.

### El frontend muestra "Error de conexión"

1. Comprueba que el backend está corriendo: `curl http://localhost:3002/health`.
2. Verifica que `frontend/.env.local` tiene `BACKEND_URL=http://localhost:3002` y `NEXT_PUBLIC_API_URL=http://localhost:3002`.
3. En WSL, si accedes desde Windows, usa `http://127.0.0.1:3002` o la IP de WSL.

### La base de datos `citypaj` no existe

```bash
npm run db:init
```

### Errores de migración

Revisa la consola del backend; el script `init-db.js` detiene el proceso si una migración SQL falla.

---

## FAQ

**¿El frontend se conecta directamente a MySQL?**

No. El frontend solo consume la API del backend. Es el backend quien gestiona el pool de conexiones MySQL.

**¿Puedo usar el panel de moderación desde el móvil?**

Sí. Toda la interfaz, incluido `/admin/anuncios`, está pensada para pantallas pequeñas.

**¿El sistema rechaza anuncios automáticamente?**

No. El filtro interno solo marca anuncios como `flagged`. Un moderador humano decide después aprobar o rechazar.

**¿Cómo cambio el puerto del frontend o backend?**

Modifica `PORT` en `backend/.env` y el flag `-p` en el script `dev` de `frontend/package.json`.

**¿Para qué sirve Redis?**

Es opcional. Se puede usar para cache, rate limiting distribuido y sesiones. Sin él, el backend funciona con memoria local.

---

## Protección de datos y dirección IP

A lo largo del proyecto tengo que mirar cómo se tratan los datos personales en una web real. Según lo que consulto en fuentes oficiales, resumo lo básico:

- **Dirección IP**: la Agencia Española de Protección de Datos (AEPD) indica que la dirección IP puede considerarse un dato personal cuando permite identificar, directa o indirectamente, a una persona. Por eso en CityPAJ la recopilamos de forma limitada, solo para seguridad y prevención de abusos, y no se usa para publicidad.
- **Base jurídica**: siguiendo lo que dice el Reglamento General de Protección de Datos (RGPD) y la LOPDGDD, el uso de la IP y otros datos técnicos se basa en el **interés legítimo** y la **ejecución del servicio**, siempre informando al usuario.
- **Derechos del usuario**: en la plataforma puedes acceder, corregir y eliminar tus datos. También puedes pedir que se borre tu cuenta desde el perfil.
- **Conservación**: los datos técnicos, incluidos los logs con IP, se guardan solo el tiempo necesario para resolver incidencias o problemas de seguridad.

> **Fuentes consultadas**:
> - Agencia Española de Protección de Datos (AEPD): [aepd.es](https://www.aepd.es)
> - Reglamento General de Protección de Datos (RGPD), artículos 6, 13 y 17.
> - Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).

## Seguridad

Voy aprendiendo sobre seguridad web a medida que avanzo. Estas son las medidas que tiene el proyecto:

- Las contraseñas no se guardan en texto plano; se hashean con `bcrypt`.
- Los tokens JWT duran poco (15 min) y hay tokens de refresco.
- Rate limiting en login y subida de archivos para evitar abusos.
- Helmet añade cabeceras de seguridad HTTP.
- CORS limitado a orígenes permitidos.
- En producción hay que cambiar `JWT_SECRET`, `JWT_REFRESH_SECRET` y `SESSION_SECRET` por valores seguros.

---

## Licencia y autor

- **Proyecto**: CityPAJ
- **Autora**: Carmen
- **Contexto**: Trabajo de Fin de Grado del 2º curso del Ciclo Superior de Desarrollo de Aplicaciones Web (DAW).
- **Licencia**: MIT

Si tienes dudas o ves algo que se pueda mejorar, puedes abrir un issue en el repositorio.
