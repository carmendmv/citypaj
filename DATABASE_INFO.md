# ️ INFORMACIÓN DE LA BASE DE DATOS - CITYPAJ

##  DATOS DE CONEXIÓN
- **Nombre de la Base de Datos**: `citypaj`
- **Host**: `localhost`
- **Puerto**: `3306`
- **Usuario**: `citypaj_user`
- **Contraseña**: `citypaj123`

## ️ ESTRUCTURA DE LA BASE DE DATOS

### Tablas Principales:
- `anuncios` - 1913 anuncios reales
- `usuarios` - 20 usuarios de ejemplo
- `comunidades` - 17 comunidades autónomas
- `provincias` - 50 provincias españolas

### Columnas de la Tabla `anuncios`:
```sql
- id: varchar(36) (NOT NULL)
- usuario_id: varchar(36) (NOT NULL)
- titulo: varchar(200) (NOT NULL)
- descripcion: text (NOT NULL)
- categoria: enum('ocio','servicios','formacion','empleo','comunidad','transporte','vivienda','salud','tecnología','otros') (NOT NULL)
- subcategoria: varchar(50) (NULL)
- comunidad_id: int(11) (NOT NULL)
- provincia_id: int(11) (NOT NULL)
- comunidad_autonoma: varchar(100) (NULL)
- provincia: varchar(100) (NULL)
- barrio: varchar(100) (NULL)
- precio: decimal(10,2) (NULL)
- modalidad: enum('venta','regalo','intercambio','servicio','compra') (NOT NULL)
- contacto_email: tinyint(1) (NULL)
- contacto_telefono: tinyint(1) (NULL)
- contacto_anonimo: tinyint(1) (NULL)
- visible: tinyint(1) (NULL)
- estado_moderacion: enum('pending','approved','rejected','flagged') (NULL)
- motivo_rechazo: text (NULL)
- vistas: int(11) (NULL)
- creado_at: timestamp (NOT NULL)
- actualizado_at: timestamp (NOT NULL)
```

##  ESTADÍSTICAS DE DATOS

### Distribución por Categorías:
- **ocio**: 367 anuncios
- **servicios**: 423 anuncios
- **formacion**: 416 anuncios
- **empleo**: 404 anuncios
- **comunidad**: 390 anuncios
- **transporte**: 100 anuncios
- **vivienda**: 100 anuncios
- **salud**: 100 anuncios
- **tecnología**: 100 anuncios
- **otros**: 100 anuncios

### Distribución Geográfica:
- **17 Comunidades Autónomas** completas
- **50 Provincias** representadas
- **Datos geográficos completos** para todos los anuncios

##  COMANDOS PARA INICIAR EL PROYECTO

### Backend (con datos reales):
```bash
cd backend
npm run dev
```

### Frontend:
```bash
cd frontend
npm run dev
```

### Ambos a la vez:
```bash
npm run dev
```

##  NOTAS IMPORTANTES
- Se utiliza la base de datos `citypaj` como base principal
- Los datos se cargan desde la base de datos MySQL configurada
- El servidor inicia la conexión y el contenido se consulta dinámicamente

##  SEGURIDAD
- Usuario dedicado `citypaj_user` con privilegios limitados
- Contraseña segura: `citypaj123`
- Conexión solo desde localhost
- Datos sensibles excluidos del repositorio Git
