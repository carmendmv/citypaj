# Despliegue de CityPAJ con base de datos demo

## Arquitectura de conexión

```text
Usuario
  ↓ HTTP
Frontend Next.js  →  http://localhost:3001
  ↓ API REST
Backend Express   →  http://localhost:3002
  ↓ mysql2/pool
MySQL 8.0         →  base de datos citypaj
```

El frontend **nunca** se conecta directamente a MySQL. Toda la comunicación con la base de datos pasa por el backend, que valida peticiones, gestiona autenticación y ejecuta consultas. El navegador solo tiene acceso a la URL pública del backend mediante `NEXT_PUBLIC_API_URL`.

## Base de datos demo

La carpeta `database/init/` contiene dos archivos ejecutados por MySQL al arrancar el contenedor por primera vez:

```text
database/init/01_schema.sql   # Esquema de tablas
database/init/02_seed_demo.sql  # Datos ficticios de demostración
```

Los datos son completamente ficticios y están pensados para la evaluación académica. Incluyen usuarios demo, anuncios de prueba, favoritos, reportes e imágenes de ejemplo.

### Credenciales demo

| Rol       | Email                       | Contraseña    |
|-----------|-----------------------------|---------------|
| Admin     | admin@citypaj.local         | Admin1234     |
| Moderador | moderador@citypaj.local     | Moderador1234 |
| Usuario   | usuario@citypaj.local       | Usuario1234   |

Las contraseñas se almacenan hasheadas con bcrypt. El backend crea o actualiza estos usuarios al iniciar gracias a `seedDemoUsers` en `backend/src/index.ts`.

## Levantar el entorno local

Requisitos: Docker Desktop en ejecución.

```bash
docker compose up --build
```

URLs de acceso:

```text
Frontend:    http://localhost:3001
Backend:     http://localhost:3002
Health:      http://localhost:3002/health
Demo status: http://localhost:3002/api/demo/status
```

## Entorno de producción o demo pública

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Antes de usar en producción real se debe cambiar `JWT_SECRET`, `JWT_REFRESH_SECRET`, `MYSQL_ROOT_PASSWORD` y las contraseñas demo por valores seguros y cargarlos a través de un archivo `.env` real, no compartido en el repositorio.

## Variables de entorno

Los ejemplos están en:

```text
.env.example
backend/.env.example
frontend/.env.example
```

Para despliegues públicos se sustituye `NEXT_PUBLIC_API_URL` por la URL real del backend.

## Comprobación de la conexión

El endpoint `GET /health` devuelve `status: ok` y `database: connected` cuando el backend puede consultar MySQL.

El endpoint `GET /api/demo/status` devuelve el nombre de la base de datos, el número de anuncios y usuarios demo, y un indicador `demoData: true`.

## Reinicio completo desde cero

```bash
docker compose down -v
docker compose up --build
```

Esto borra el volumen de MySQL y vuelve a cargar el esquema y los datos demo.
