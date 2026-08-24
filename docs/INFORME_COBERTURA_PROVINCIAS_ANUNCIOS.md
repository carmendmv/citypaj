# Informe de cobertura provincial y datos de moderación/admin

## 1. Objetivo

Garantizar que el panel de moderación y el panel de administración dispongan de datos de prueba para **todas las provincias de España**, corregir los errores observados en el API y dejar el esquema SQL preparado para Docker Compose.

## 2. Alcance

- Cubrir las 52 provincias (50 provincias peninsulares/insulares + Ceuta + Melilla).
- Generar anuncios en estados `pending`, `rejected` y `flagged` para el panel de moderación.
- Rellenar tablas utilizadas por el panel de administración y la comunidad:
  `comunidad_publicaciones`, `comunidad_comentarios`, `comunidad_likes`, `comunidad_reportes`,
  `propuestas`, `recursos`, `eventos`, `sugerencias`, `contactos_institucionales`,
  `comunicaciones_institucionales`, `admin_tareas`, `agenda_notas`, `mensajes_staff`,
  `admin_activity_logs`, `moderacion_logs`, `reportes_anuncios`.
- Corregir el esquema MySQL para que la sintaxis `DEFAULT (UUID())` sea compatible con MySQL 8.0/MariaDB.
- Robustecer `login` y el logger para evitar errores 500 silenciosos.

## 3. Cambios realizados

### 3.1 Esquema SQL (`database/init/01_schema.sql`)

Se corrigió la sintaxis de generación de UUIDs:

```sql
-- Antes
id VARCHAR(36) PRIMARY KEY DEFAULT uuid()

-- Después
id VARCHAR(36) PRIMARY KEY DEFAULT (UUID())
```

Afecta a las columnas `id` de `anuncios` y `usuarios`.

### 3.2 Seed territorial (`database/init/03_seed_territorial.sql`)

- Normaliza los nombres oficiales de comunidades y provincias.
- Inserta Ceuta y Melilla.
- Genera 156 anuncios generales recientes y 52 anuncios culturales antiguos, con al menos 3 anuncios aprobados por provincia.

### 3.3 Seed de moderación y administración (`backend/scripts/seed-admin-moderacion.js`)

Script ejecutable contra la base de datos actual para completar, por cada provincia:

| Sección | Registros por provincia |
|---|---|
| Anuncios `pending` | 1 |
| Anuncios `rejected` | 1 |
| Anuncios `flagged` | 1 |
| Reportes de anuncios | 2 (pending + flagged) |
| Logs de moderación | 3 (uno por anuncio) |
| Publicaciones de comunidad | 1 |
| Comentarios de comunidad | 1 |
| Likes de comunidad | 1 |
| Reportes de comunidad | 1 |
| Propuestas | 2 |
| Recursos | 2 |
| Eventos | 1 |
| Sugerencias | 2 |
| Contactos institucionales | 1 |
| Comunicaciones institucionales | 1 |
| Tareas de admin | 1 |
| Notas de agenda | 1 |
| Mensajes de staff | 2 |
| Logs de actividad admin | 1 |

Además se añaden 5 plantillas de comunicación generales.

### 3.4 Correcciones en backend

- `backend/src/controllers/auth-simple.ts`:
  - Envuelve `bcrypt.compare` en `try/catch` para que un hash inválido devuelva `401` en lugar de `500`.
  - El `catch` del controlador ahora escribe el error en consola y lo envía al logger en formato objeto, asegurando que se persista en `logs/error.log`.

- `backend/src/controllers/anuncios-mysql.ts`:
  - Sustituye `console.error` por `logger.error` formateado para registrar las causas de los errores 500.

- Alias de importación:
  - `backend/src/controllers/comunidad.ts`
  - `backend/src/routes/provincias.ts`
  - `backend/src/routes/territorios.ts`
  Se pasaron a rutas relativas para que `tsc` compile correctamente.

## 4. Validación funcional

### 4.1 Login

```
POST /api/auth/login
Body: { "email": "admin@citypaj.local", "password": "Admin1234" }
Resultado: 200 OK con token
```

### 4.2 Panel de moderación

```
GET /api/anuncios/moderacion?limit=5
Authorization: Bearer <token admin>
Resultado: 200 OK
{
  "success": true,
  "data": [...],
  "meta": { "page": 1, "limit": 20, "total": 3083 }
}
```

La respuesta contiene anuncios `pending`, `rejected` y `flagged` de todas las provincias.

### 4.3 Anuncio existente

```
GET /api/anuncios/ct-51-1
Resultado: 200 OK
```

Se confirma que el anuncio `ct-51-1` (Ceuta) se recupera correctamente.

## 5. Cobertura de datos

- **Provincias con anuncios aprobados:** 52/52.
- **Anuncios totales:** 3083 (incluye aprobados, pending, rejected, flagged).
- **Estados de moderación representados:** `approved`, `pending`, `rejected`, `flagged`.
- **Todas las comunidades autónomas** tienen al menos un anuncio y datos asociados.

## 6. Archivos añadidos o modificados destacados

- `database/init/01_schema.sql` (corrección UUID).
- `database/init/03_seed_territorial.sql` (seed territorial).
- `backend/scripts/seed-admin-moderacion.js` (nuevo script de seed para admin/moderación).
- `backend/src/controllers/auth-simple.ts` (robustez login y logging).
- `backend/src/controllers/anuncios-mysql.ts` (mejora de logging).
- `backend/src/controllers/comunidad.ts` (rutas relativas).
- `backend/src/routes/provincias.ts` (rutas relativas).
- `backend/src/routes/territorios.ts` (rutas relativas).
- `docs/INFORME_COBERTURA_PROVINCIAS_ANUNCIOS.md` (este informe).

## 7. Próximos pasos recomendados

- Validar `docker-compose up --build` con el esquema corregido.
- Revisar y actualizar el `README.md` con las instrucciones de seed y credenciales demo.
- Revisar que `logs/` esté correctamente ignorado en Git y no se suban archivos de log.
