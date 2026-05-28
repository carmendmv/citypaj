# 🗄️ DIAGRAMA COMPLETO DE LA BASE DE DATOS MYSQL - CITYPAJ

## 📋 RESUMEN DE TABLAS (8 tablas principales):

1. **`usuarios`** - Usuarios registrados
2. **`comunidades`** - Comunidades autónomas de España
3. **`provincias`** - Provincias españolas
4. **`anuncios`** - Anuncios publicados
5. **`anuncio_imagenes`** - Imágenes de anuncios
6. **`favoritos`** - Anuncios guardados por usuarios
7. **`sugerencias`** - Sistema de sugerencias
8. **`buzon_sugerencias`** - Buzón de sugerencias

---

## 🔗 DIAGRAMA DE RELACIONES (ASCII):

```
┌─────────────────┐       ┌──────────────────┐       ┌─────────────────┐
│    usuarios     │       │    anuncios      │       │ anuncio_imagenes│
│─────────────────┤       │──────────────────┤       │─────────────────│
│ id (PK) VARCHAR │◄──────┤ id (PK) VARCHAR  │◄──────┤ id (PK) INT     │
│ email VARCHAR   │ 1:N  │ usuario_id FK    │ 1:N  │ anuncio_id FK   │
│ password_hash   │       │ titulo VARCHAR   │       │ url VARCHAR     │
│ nombre VARCHAR  │       │ descripcion TEXT │       │ orden INT       │
│ verificado BOOL │       │ categoria ENUM   │       └─────────────────┘
│ creado_at TIMESTAMP│    │ comunidad_id FK  │◀──────┐
│ actualizado_at TIMESTAMP││ provincia_id FK  │       │
└─────────────────┘       │ visible TINYINT │       │
         │                │ estado_moderacion│       │
         │                │ creado_at TIMESTAMP│       │
         │                │ actualizado_at TIMESTAMP│       │
         │                └──────────────────┘       │
         │                         │                │
         │                         │                │
         │                ┌──────────────────┐       │
         │                │    favoritos     │       │
         │                │──────────────────┤       │
         │                │ id (PK) INT      │       │
         └────────────────┤ usuario_id FK    │       │
                          │ anuncio_id FK    │       │
                          │ creado_at TIMESTAMP│       │
                          └──────────────────┘       │
                                                   │
┌─────────────────┐       ┌──────────────────┐       │
│   comunidades   │       │    provincias    │       │
│─────────────────┤       │──────────────────┤       │
│ id (PK) INT     │◄──────┤ id (PK) INT      │       │
│ nombre VARCHAR  │ 1:N  │ nombre VARCHAR   │       │
└─────────────────┘       │ comunidad_id FK  │       │
                          └──────────────────┘       │
                                                   │
┌─────────────────┐                                │
│  sugerencias    │                                │
│─────────────────┤                                │
│ id (PK) INT     │                                │
│ email VARCHAR   │                                │
│ mensaje TEXT    │                                │
│ creado_at TIMESTAMP│                               │
│ estado ENUM     │                                │
└─────────────────┘                                │
                                                   │
┌─────────────────┐                                │
│buzon_sugerencias│                                │
│─────────────────┤                                │
│ id (PK) INT     │                                │
│ nombre VARCHAR  │                                │
│ email VARCHAR   │                                │
│ asunto VARCHAR  │                                │
│ mensaje TEXT    │                                │
│ creado_at TIMESTAMP│                               │
└─────────────────┘                                │
                                                   │
└───────────────────────────────────────────────────┘
```

---

## 📊 DETALLE COMPLETO DE CADA TABLA:

### 🧑 1. TABLA `usuarios`

| Campo | Tipo | Nulo | PK/FK | Default | Descripción |
|-------|------|------|-------|---------|-------------|
| `id` | VARCHAR(36) | NOT NULL | **PK** | UUID() | ID único del usuario |
| `email` | VARCHAR(255) | NOT NULL | - | - | Email único |
| `password_hash` | VARCHAR(255) | NOT NULL | - | - | Contraseña encriptada |
| `nombre` | VARCHAR(100) | NOT NULL | - | - | Nombre del usuario |
| `verificado` | BOOLEAN | - | - | FALSE | Email verificado |
| `creado_at` | TIMESTAMP | - | - | CURRENT_TIMESTAMP | Fecha creación |
| `actualizado_at` | TIMESTAMP | - | - | CURRENT_TIMESTAMP | Última actualización |

---

### 🏛️ 2. TABLA `comunidades`

| Campo | Tipo | Nulo | PK/FK | Default | Descripción |
|-------|------|------|-------|---------|-------------|
| `id` | INT | NOT NULL | **PK** | AUTO_INCREMENT | ID comunidad |
| `nombre` | VARCHAR(50) | NOT NULL | - | - | Nombre comunidad |

**Datos:** 17 comunidades autónomas españolas

---

### 📍 3. TABLA `provincias`

| Campo | Tipo | Nulo | PK/FK | Default | Descripción |
|-------|------|------|-------|---------|-------------|
| `id` | INT | NOT NULL | **PK** | AUTO_INCREMENT | ID provincia |
| `nombre` | VARCHAR(100) | NOT NULL | - | - | Nombre provincia |
| `comunidad_id` | INT | NOT NULL | **FK** | - | ID comunidad (ref. comunidades) |

**Datos:** 52 provincias españolas

---

### 📢 4. TABLA `anuncios`

| Campo | Tipo | Nulo | PK/FK | Default | Descripción |
|-------|------|------|-------|---------|-------------|
| `id` | VARCHAR(36) | NOT NULL | **PK** | UUID() | ID único anuncio |
| `usuario_id` | VARCHAR(36) | NOT NULL | **FK** | - | ID usuario (ref. usuarios) |
| `titulo` | VARCHAR(200) | NOT NULL | - | - | Título del anuncio |
| `descripcion` | TEXT | NOT NULL | - | - | Descripción completa |
| `categoria` | ENUM | NOT NULL | - | - | ocio, servicios, formacion, empleo, comunidad |
| `subcategoria` | VARCHAR(50) | - | - | - | Subcategoría opcional |
| `comunidad_id` | INT | NOT NULL | **FK** | - | ID comunidad (ref. comunidades) |
| `provincia_id` | INT | NOT NULL | **FK** | - | ID provincia (ref. provincias) |
| `barrio` | VARCHAR(100) | - | - | - | Barrio/localidad |
| `precio` | DECIMAL(10,2) | - | - | - | Precio (opcional) |
| `modalidad` | ENUM | NOT NULL | - | - | venta, regalo, intercambio, servicio, compra |
| `contacto_email` | BOOLEAN | - | - | TRUE | Permite contacto email |
| `contacto_telefono` | BOOLEAN | - | - | TRUE | Permite contacto teléfono |
| `contacto_anonimo` | BOOLEAN | - | - | FALSE | Contacto anónimo |
| `visible` | BOOLEAN | - | - | TRUE | Anuncio visible |
| `estado_moderacion` | ENUM | - | - | pending | pending, approved, rejected, flagged |
| `motivo_rechazo` | TEXT | - | - | - | Motivo de rechazo |
| `vistas` | INT | - | - | 0 | Número de vistas |
| `creado_at` | TIMESTAMP | - | - | CURRENT_TIMESTAMP | Fecha creación |
| `actualizado_at` | TIMESTAMP | - | - | CURRENT_TIMESTAMP | Última actualización |

---

### 🖼️ 5. TABLA `anuncio_imagenes`

| Campo | Tipo | Nulo | PK/FK | Default | Descripción |
|-------|------|------|-------|---------|-------------|
| `id` | INT | NOT NULL | **PK** | AUTO_INCREMENT | ID imagen |
| `anuncio_id` | VARCHAR(36) | NOT NULL | **FK** | - | ID anuncio (ref. anuncios) |
| `url` | VARCHAR(500) | NOT NULL | - | - | URL de la imagen |
| `orden` | INT | - | - | 0 | Orden de visualización |

**Relación:** `ON DELETE CASCADE` - Si se borra el anuncio, se borran sus imágenes

---

### ❤️ 6. TABLA `favoritos`

| Campo | Tipo | Nulo | PK/FK | Default | Descripción |
|-------|------|------|-------|---------|-------------|
| `id` | INT | NOT NULL | **PK** | AUTO_INCREMENT | ID favorito |
| `usuario_id` | VARCHAR(36) | NOT NULL | **FK** | - | ID usuario (ref. usuarios) |
| `anuncio_id` | VARCHAR(36) | NOT NULL | **FK** | - | ID anuncio (ref. anuncios) |
| `creado_at` | TIMESTAMP | - | - | CURRENT_TIMESTAMP | Fecha creación |

**Restricción:** `UNIQUE(usuario_id, anuncio_id)` - Un usuario no puede guardar el mismo anuncio dos veces

---

### 💡 7. TABLA `sugerencias`

| Campo | Tipo | Nulo | PK/FK | Default | Descripción |
|-------|------|------|-------|---------|-------------|
| `id` | INT | NOT NULL | **PK** | AUTO_INCREMENT | ID sugerencia |
| `email` | VARCHAR(255) | NOT NULL | - | - | Email del usuario |
| `mensaje` | TEXT | NOT NULL | - | - | Mensaje de sugerencia |
| `creado_at` | TIMESTAMP | - | - | CURRENT_TIMESTAMP | Fecha creación |
| `estado` | ENUM | - | - | pendiente | pendiente, revisado, implementado |

---

### 📬 8. TABLA `buzon_sugerencias`

| Campo | Tipo | Nulo | PK/FK | Default | Descripción |
|-------|------|------|-------|---------|-------------|
| `id` | INT | NOT NULL | **PK** | AUTO_INCREMENT | ID mensaje |
| `nombre` | VARCHAR(100) | NOT NULL | - | - | Nombre del remitente |
| `email` | VARCHAR(255) | NOT NULL | - | - | Email del remitente |
| `asunto` | VARCHAR(200) | NOT NULL | - | - | Asunto del mensaje |
| `mensaje` | TEXT | NOT NULL | - | - | Contenido del mensaje |
| `creado_at` | TIMESTAMP | - | - | CURRENT_TIMESTAMP | Fecha creación |

---

## 🔗 RELACIONES EXPLICADAS:

### Relaciones 1:N (Uno a Muchos):

1. **`usuarios` → `anuncios`** (1:N) - Un usuario puede tener muchos anuncios
2. **`usuarios` → `favoritos`** (1:N) - Un usuario puede tener muchos favoritos
3. **`anuncios` → `anuncio_imagenes`** (1:N) - Un anuncio puede tener muchas imágenes
4. **`comunidades` → `provincias`** (1:N) - Una comunidad tiene muchas provincias
5. **`comunidades` → `anuncios`** (1:N) - Una comunidad tiene muchos anuncios
6. **`provincias` → `anuncios`** (1:N) - Una provincia tiene muchos anuncios

### Relaciones N:N (Muchos a Muchos):

1. **`usuarios` ↔ `anuncios`** (a través de `favoritos`) - Muchos usuarios guardan muchos anuncios

### Relaciones 1:1 (Uno a Uno):

- No hay relaciones 1:1 directas en esta estructura

---

## 🎯 CARACTERÍSTICAS IMPORTANTES:

✅ **Base de datos MySQL** con charset UTF-8  
✅ **IDs UUID** para usuarios y anuncios  
✅ **IDs numéricos** para comunidades y provincias  
✅ **Timestamps automáticos** con `ON UPDATE CURRENT_TIMESTAMP`  
✅ **Índices optimizados** para búsquedas y filtros  
✅ **Búsqueda full-text** en títulos y descripciones  
✅ **Cascading deletes** en imágenes de anuncios  
✅ **Restricciones UNIQUE** para evitar duplicados  

---

## 📝 FOREIGN KEYS (Claves Foráneas):

| Tabla | Campo | Referencia | Acción |
|-------|-------|------------|--------|
| `anuncios` | `usuario_id` | `usuarios.id` | - |
| `anuncios` | `comunidad_id` | `comunidades.id` | - |
| `anuncios` | `provincia_id` | `provincias.id` | - |
| `anuncio_imagenes` | `anuncio_id` | `anuncios.id` | CASCADE |
| `favoritos` | `usuario_id` | `usuarios.id` | - |
| `favoritos` | `anuncio_id` | `anuncios.id` | - |
| `provincias` | `comunidad_id` | `comunidades.id` | - |

---

## 🚀 GENERADO POR:

**Sistema CityPaj - Base de Datos MySQL**  
**Fecha:** $(date)  
**Versión:** 1.0  

*Documentación completa del esquema de base de datos*
