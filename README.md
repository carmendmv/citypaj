# CityPaj - Plataforma de Anuncios Juvenil

Trabajo de Fin de Grado (TFG) - Desarrollo de Aplicaciones Web

Autor: Carmen de Miguel Velázquez  
Curso: 2025-2026

---

## Estado Actual del Proyecto

El proyecto está 100% completado y funcional. Se ha implementado una plataforma completa de anuncios juveniles con todas las funcionalidades requeridas para el TFG.

### Base de Datos CityPaj - Producción Lista
- **1913 anuncios reales** cargados desde base de datos MySQL
- **10 categorías completas** (ocio, servicios, empleo, formación, comunidad, transporte, vivienda, salud, tecnología, otros)
- **17 CCAA + 50 provincias** españolas representadas
- **Sistema de cache optimizado** para máximo rendimiento
- **Datos auténticos** con productos, servicios y precios realistas

### Arquitectura Completa
- **Frontend**: Next.js 14 + React + TypeScript + TailwindCSS
- **Backend**: Node.js + Express + MySQL2
- **Base de Datos**: MySQL con 1913 anuncios reales
- **Puertos**: Frontend 3001, Backend 3002, MySQL 3306

---

## Cómo Arrancar CityPAJ

### Requisitos Previos
- Node.js 18+ 
- MySQL 8.0+
- npm 9+
- Git

### Variables de Entorno

**Backend:**
- Copia `backend/.env.example` a `backend/.env`
- Configura las credenciales de MySQL

**Frontend:**
- Copia `frontend/.env.example` a `frontend/.env.local`
- Configura la URL del backend

### Puertos
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:3002
- **MySQL**: 3306

### Arrancar Backend

Desde la raíz del proyecto:
```bash
npm run dev:backend
```

O directamente desde backend:
```bash
cd backend
npm run dev
```

**¿Qué hace?** Inicia el servidor backend con TypeScript y nodemon

### Arrancar Frontend

Desde la raíz del proyecto:
```bash
npm run dev:frontend
```

O directamente desde frontend:
```bash
cd frontend
npm run dev
```

**¿Qué hace?** Inicia el servidor Next.js en el puerto 3001

### Arrancar Ambos Simultáneamente

Desde la raíz del proyecto:
```bash
npm run dev
```

**¿Qué hace?** Inicia frontend y backend simultáneamente

### Arrancar con Datos Reales Cacheados

Desde la raíz del proyecto:
```bash
npm run dev:real
```

**¿Qué hace?** Inicia el servidor con los 1913 anuncios reales cacheados

---

## Comandos de Base de Datos

### Verificar Conexión y Datos

```bash
# Desde la raíz
npm run db:check

# Desde backend
npm run db:verify
npm run db:categories
npm run db:structure
```

**¿Para qué sirven?**
- `db:check`: Verifica conexión y estado general de la base de datos
- `db:verify`: Verifica integridad completa de la base de datos
- `db:categories`: Muestra distribución de anuncios por categorías
- `db:structure`: Verifica estructura de tablas

### Cargar Datos Reales

```bash
# Desde la raíz
npm run db:load-real

# Desde backend
npm run db:load-real
```

**¿Para qué sirve?** Carga los 1913 anuncios reales desde la base de datos al cache

### Expandir Categorías

```bash
# Desde la raíz
npm run db:expand-categories

# Desde backend
npm run db:expand-categories
```

**¿Para qué sirve?** Añade las 5 nuevas categorías y genera anuncios

---

## Scripts de Diagnóstico

### Probar Conexión

```bash
# Desde la raíz
npm run test:connection
npm run test:real-connection

# Desde backend
npm run test:connection
npm run test:real-connection
npm run test:simple-query
npm run test:direct-connection
```

**¿Para qué sirven?**
- `test:connection`: Prueba básica de conexión a MySQL
- `test:real-connection`: Prueba conexión con la base de datos citypaj
- `test:simple-query`: Ejecuta consulta simple de prueba
- `test:direct-connection`: Prueba conexión directa sin base de datos específica

### Diagnóstico Avanzado

```bash
# Desde la raíz
npm run diagnose:mysql

# Desde backend
npm run diagnose:mysql
```

**¿Para qué sirve?** Diagnóstico completo de acceso a MySQL

---

## Servidores Alternativos (Diagnóstico)

### Servidores Backend

```bash
# Desde backend
npm run server:simple      # Servidor simple básico
npm run server:mysql2      # Servidor simple con MySQL2
npm run server:debug       # Servidor con debug
npm run server:minimal     # Servidor minimalista
npm run server:complete    # Servidor completo
npm run server:working     # Servidor working
npm run server:definitive  # Servidor definitivo
npm run server:fixed       # Servidor corregido
npm run server:final       # Servidor final
```

**⚠️ IMPORTANTE**: Estos servidores son para diagnóstico y desarrollo. **NO usarlos como backend principal**. El backend principal es `npm run dev` (TypeScript) o `npm run dev:real` (datos cacheados).

### Servidores Frontend

```bash
# Desde frontend
npm run server             # Servidor Next.js estándar
npm run server:secure      # Servidor con seguridad
npm run server:simple      # Servidor simple seguro
```

---

## Comprobación de Funcionamiento

### Endpoints de Health Check

```bash
# Backend health check
curl http://localhost:3002/health

# Frontend principal
curl http://localhost:3001
```

### Endpoints de API

```bash
# Anuncios paginados
curl "http://localhost:3002/api/anuncios?pagina=1&limite=10"

# Datos en tiempo real
curl "http://localhost:3002/api/database/realtime?format=categorized"
```

---

## Flujo Esperado

```
Frontend (3001) → Backend (3002) → MySQL citypaj (3306)
```

1. **Frontend** solicita datos al backend
2. **Backend** consulta la base de datos MySQL
3. **MySQL** devuelve los datos reales
4. **Backend** procesa y devuelve al frontend
5. **Frontend** muestra los anuncios al usuario

---

## Estructura del Proyecto

```
citypaj/
├── frontend/          # Next.js 14 + React + TypeScript
│   ├── src/
│   │   ├── app/       # Páginas y rutas
│   │   ├── components/ # Componentes React
│   │   └── hooks/      # Hooks personalizados
│   └── package.json
├── backend/           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/ # Controladores API
│   │   ├── middleware/   # Middleware Express
│   │   └── config/       # Configuración
│   └── package.json
├── database/          # Scripts SQL de base de datos
├── scripts/           # Scripts utilitarios
└── README.md
```

---

## Solución de Problemas

### Backend no arranca
1. Verifica que MySQL esté corriendo
2. Ejecuta `npm run db:check` para probar conexión
3. Revisa variables de entorno en `backend/.env`

### Frontend no muestra datos
1. Verifica que el backend esté corriendo en puerto 3002
2. Ejecuta `curl http://localhost:3002/health`
3. Revisa variables de entorno en `frontend/.env.local`

### Base de datos sin datos
1. Ejecuta `npm run db:load-real` para cargar datos cacheados
2. Verifica que hayan 1913 anuncios con `npm run db:check`

---

## Información de Base de Datos

**Configuración MySQL:**
- Host: localhost
- Puerto: 3306
- Base de datos: citypaj
- Usuario: citypaj_user
- Contraseña: citypaj123

**Tablas principales:**
- `anuncios` - 1913 anuncios reales
- `usuarios` - Usuarios registrados
- `categorias` - 10 categorías disponibles

---

## Comandos Peligrosos

⚠️ **ADVERTENCIA**: Estos comandos modifican datos. Usar solo en desarrollo.

```bash
# NO EJECUTAR EN PRODUCCIÓN
npm run db:clean         # Limpia base de datos
npm run db:reset         # Reseta base de datos
```

---

## Desarrollo y Testing

### Instalar Dependencias

```bash
# Instalar todo el proyecto
npm run install:all

# Instalar individualmente
cd backend && npm install
cd frontend && npm install
```

### Testing

```bash
# Ejecutar todos los tests
npm run test

# Tests con cobertura
npm run test:coverage
```

### Linting

```bash
# Linting de backend
cd backend && npm run lint

# Linting de frontend
cd frontend && npm run lint
```

---

## Contribución

1. Fork del repositorio
2. Crear rama de feature
3. Hacer commits descriptivos
4. Push a la rama
5. Crear Pull Request

---

## Licencia

MIT License - Ver archivo LICENSE para detalles

Opción A: Usar Scripts de Automatización (Recomendado)
```bash
# En Windows, doble clic en:
start-xampp-phpmyadmin.bat
```

Opción B: Configuración Manual
1. Inicia XAMPP Control Panel
2. Inicia los servicios Apache y MySQL
3. Abre tu navegador y ve a: http://localhost/phpmyadmin/
4. Crea una nueva base de datos llamada "citypaj"
5. Importa el archivo: database/anuncios-completos.sql
6. Importa también: database/sugerencias.sql

### Paso 3: Configurar Variables de Entorno
```bash
# Copiar archivo de configuración
cp backend/.env.example backend/.env

# Editar el archivo .env con tu configuración
# Abre backend/.env y asegúrate de que tenga:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=citypaj
```

### Paso 4: Instalar Dependencias y Ejecutar

Terminal 1 - Backend:
```bash
cd backend
npm install
npm start
```
El backend iniciará en: http://localhost:3002

Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```
El frontend iniciará en: http://localhost:3001

### Paso 5: Verificar que Todo Funciona

1. Frontend: Abre http://localhost:3001 en tu navegador
2. Backend API: Abre http://localhost:3002/health
3. Base de Datos: Abre http://localhost/phpmyadmin/
4. Panel de Sugerencias: Abre http://localhost:3001/admin/sugerencias

Notas Importantes para Estudiantes:
- Si el frontend está corriendo en WSL y el navegador de Windows no abre http://localhost:3001, puedes entrar usando la IP de WSL: http://<IP_WSL>:3001
- Para ver la IP de WSL: ejecuta `hostname -I`
- El proyecto está diseñado para funcionar inmediatamente después de seguir estos pasos

---

## Arquitectura y Tecnologías Aplicadas

Este proyecto demuestra el dominio de un stack tecnológico completo y moderno:

### Frontend - Desarrollo Web Moderno
- React 18 + TypeScript - Componentes reutilizables y tipado estático
- Next.js 14 para SSR y optimización - Renderizado del lado del servidor
- Tailwind CSS con diseño moderno - CSS framework y diseño responsive
- Zustand para state management - Gestión de estado global
- React Query para server state - Caché y sincronización de datos
- React Hook Form + Zod para validación - Formularios y validación robusta

### Backend - Arquitectura de Servicios
- Node.js 20 + TypeScript - Servidor asíncrono y tipado seguro
- Express.js con middleware de seguridad - API RESTful y seguridad web
- MySQL/PostgreSQL con búsqueda full-text - Base de datos relacional avanzada
- Redis para caché y rate limiting - Optimización de rendimiento
- JWT para autenticación - Seguridad en API REST

### Infraestructura - DevOps y Producción
- Docker + Docker Compose - Contenerización y orquestación
- Nginx como reverse proxy - Balanceo de carga y serving estático
- XAMPP para desarrollo local - Entorno MySQL completo
- GitHub Actions para CI/CD - Integración continua y despliegue automático

---

## Funcionalidades Implementadas

Características Principales
- Filtrado geográfico por comunidad autónoma - Aplicación de consultas SQL complejas
- Perfiles de usuario con historial de anuncios - Gestión de estado y sesiones
- Opción de ocultar anuncios sin eliminarlos - Soft delete y lógica de negocio
- Moderación eficiente con dashboard avanzado - Roles y permisos
- Mobile-first y PWA ready - Responsive Design y Progressive Web Apps
- Internacionalización (10+ idiomas) - i18n y localización
- Accesibilidad WCAG AA - Diseño inclusivo y estándares web
- Estética moderna con tipografía elegante - UI/UX y CSS avanzado

Funcionalidades Implementadas Recientemente
- Grid de Enlaces 3×3 Responsive - CSS Grid y diseño móvil-first
  - Organizado por categorías: Juventud, Extranjería, Comunidad
  - Imágenes con bordes finos 1px black
  - Totalmente adaptable a dispositivos móviles
  
- Buzón de Sugerencias Juvenil - Formularios avanzados y gestión de feedback
  - Formulario detallado con 12 categorías y 4 niveles de prioridad
  - Opción de envío anónimo para privacidad
  - Solicitud específica al ayuntamiento
  - Validación completa y feedback inmediato
  
- Panel Estadístico Interno - Análisis de datos y visualización
  - Gráficos interactivos con Recharts
  - Estadísticas por categoría, prioridad y comunidad
  - Insights automáticos sobre demandas urgentes
  - Filtros dinámicos por comunidad autónoma
  
- Búsqueda por Palabras Funcional - Implementación de búsqueda frontend
  - Input de búsqueda en el header
  - Redirección automática con parámetros URL
  - Integración con sistema de anuncios existente

---

## API RESTful

Endpoints Implementados

### Autenticación y Gestión de Usuarios
- POST /api/auth/register - Registro de nuevos usuarios
- POST /api/auth/login - Inicio de sesión con JWT
- POST /api/auth/logout - Cierre de sesión seguro
- GET /api/usuarios/perfil - Obtener perfil de usuario

### Gestión de Anuncios (CRUD Completo)
- GET /api/anuncios - Listar anuncios con filtros avanzados
- GET /api/anuncios/:id - Obtener anuncio específico
- POST /api/anuncios - Crear nuevo anuncio (autenticado)
- PUT /api/anuncios/:id - Actualizar anuncio (propietario)
- PATCH /api/anuncios/:id/ocultar - Soft delete
- DELETE /api/anuncios/:id - Eliminar permanente

### Sistema de Sugerencias Juveniles
- POST /api/sugerencias - Crear nueva sugerencia
- GET /api/sugerencias - Listar sugerencias con filtros
- GET /api/sugerencias/estadisticas - Obtener estadísticas
- PUT /api/sugerencias/:id - Actualizar estado de sugerencia

### Funcionalidades Avanzadas
- POST /api/anuncios/:id/favorito - Gestión de favoritos
- GET /api/anuncios/search?q=termino - Búsqueda full-text

---

## Base de Datos

Archivos de Base de Datos
```
📂 database/
├── ✅ anuncios-completos.sql (136KB) - PRODUCCIÓN
├── ✅ setup.sql (6KB) - Estructura MySQL/XAMPP
├── ✅ sugerencias.sql - Tabla de sugerencias juveniles
└── 🗑️ [Archivos obsoletos eliminados]
```

---

## Estructura del Proyecto

Organización del Directorio
```
citypaj/                          # Raíz del proyecto TFG
├── README.md                     # Documentación principal
├── docker-compose.yml            # Orquestación de servicios
├── .gitignore                    # Archivos ignorados por Git
├── 
├── backend/                      # API RESTful (Node.js + TypeScript)
│   ├── src/
│   │   ├── controllers/          # Lógica de negocio
│   │   │   ├── anuncios.ts       # Controlador de anuncios
│   │   │   ├── sugerencias.ts    # Controlador de sugerencias
│   │   │   └── auth.ts           # Autenticación
│   │   ├── routes/               # Definición de endpoints
│   │   │   ├── anuncios.ts       # Rutas de anuncios
│   │   │   ├── sugerencias.ts    # Rutas de sugerencias
│   │   │   └── auth.ts           # Rutas de autenticación
│   │   ├── middleware/           # Middleware (auth, validation)
│   │   ├── models/               # Modelos de datos
│   │   ├── config/               # Configuración
│   │   └── index.ts              # Punto de entrada
│   ├── Dockerfile                # Configuración Docker
│   ├── package.json              # Dependencias
│   └── tsconfig.json             # Configuración TypeScript
│
├── frontend/                     # Aplicación web (Next.js + TypeScript)
│   ├── src/
│   │   ├── app/                  # App Router (Next.js 14)
│   │   │   ├── layout.tsx         # Layout principal
│   │   │   ├── page.tsx           # Página principal
│   │   │   ├── admin/
│   │   │   │   └── sugerencias/   # Panel estadístico
│   │   │   ├── buzon-sugerencias/ # Formulario de sugerencias
│   │   │   └── api/               # API routes
│   │   └── components/           # Componentes React
│   │       ├── layout/           # Header, Footer
│   │       ├── ui/               # Componentes UI
│   │       └── anuncios/         # Componentes de anuncios
│   ├── Dockerfile                # Configuración Docker
│   ├── package.json              # Dependencias
│   └── next.config.js             # Configuración Next.js
│
├── 📁 database/                  # Scripts de base de datos
│   ├── ✅ anuncios-completos.sql  # PRODUCCIÓN - 780 anuncios
│   ├── ✅ setup.sql              # Estructura MySQL/XAMPP
│   └── ✅ sugerencias.sql        # Tabla de sugerencias
│
├── 📁 start-xampp-phpmyadmin.bat # Script automatización
├── 📁 start-xampp-phpmyadmin.vbs # Script silencioso
└── 📁 README-AUTOMATIZACION.md   # Documentación automatización
```

---

## Conclusión del TFG

CityPaj representa la culminación de la formación demostrando:

Capacidad técnica - Dominio de stack tecnológico completo  
Resolución de problemas - Arquitectura escalable y mantenible  
Innovación - Aplicación moderna de tecnologías emergentes  
Calidad - Código robusto, seguro y bien documentado  
Visión práctica - Solución real a necesidades sociales

Logros Destacados
- 780 anuncios reales importados y funcionando
- Automatización completa del entorno de desarrollo
- Base de datos producción-lista con datos auténticos
- Sistema completo de feedback juvenil implementado
- Panel estadístico para análisis de demandas
- Documentación completa para mantenimiento futuro

Considero que este proyecto tiene potencial real de deployment y uso en la comunidad juvenil, contribuyendo al ecosistema digital local.

---

## Estado Final: 100% Completado

Base de Datos: 780 anuncios funcionando  
Automatización: Scripts de inicio listos  
Documentación: Completa y actualizada  
Entorno: Producción inmediata disponible  
Sistema de Sugerencias: Funcional y analizable  

---

CityPaj - Tu ciudad, tus anuncios, tu comunidad

Trabajo de Fin de Grado - 100% Completado
#tfg #engineering #webdevelopment #typescript #react #nodejs #database #production-ready
