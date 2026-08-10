# CityPAJ - Plataforma de anuncios y servicios juveniles

## 1. Qué es CityPAJ

Este proyecto, **CityPAJ**, es mi Trabajo de Fin de Grado del Grado Superior de Desarrollo de Aplicaciones Web. He construido una aplicación web fullstack dirigida a jóvenes para que puedan publicar anuncios, buscar servicios, formación, empleo, vivienda y otras oportunidades cercanas a su comunidad.

El objetivo era crear una plataforma útil y sencilla: un usuario puede publicar un anuncio, que pasa por revisión de un moderador antes de ser visible. También he incluido paneles de administración y moderación para gestionar esos contenidos.

## 2. Stack técnico y por qué lo elegí

A lo largo del ciclo fui aprendiendo diferentes tecnologías y quise ponerlas en práctica en un solo proyecto. La elección fue la siguiente:

- **Frontend**: Next.js 14 con React y TypeScript, para practicar enrutamiento, estado y tipado seguro.
- **Estilos**: Tailwind CSS, porque me ha permitido maquetar rápido y mantener consistencia visual.
- **Backend**: Node.js + Express + TypeScript, para entender bien el flujo de peticiones, middlewares y controladores.
- **Base de datos**: MySQL 8.0, donde he diseñado el esquema relacional y he trabajado consultas, filtros y transacciones.
- **Contenedores**: Docker y Docker Compose, porque al final del proyecto vi que dockerizarlo facilitaba mucho la entrega y la revisión.

## 3. Arquitectura del proyecto

La comunicación entre las partes es directa:

```
Usuario
  ↓
Frontend Next.js  →  http://localhost:3001
  ↓
Backend Express   →  http://localhost:3002
  ↓
MySQL (Docker)    →  base de datos citypaj
```

El usuario interactúa con el frontend en Next.js. Cuando se necesitan datos, las rutas internas de `app/api` hacen de proxy y se comunican con el backend a través de la red de Docker. El backend ejecuta las consultas en MySQL y devuelve el resultado en JSON.

He entregado el proyecto **100 % dockerizado**. Con un solo comando se levantan frontend, backend y base de datos, sin necesidad de instalar nada más ni depender de servicios externos como Vercel, Render o PlanetScale.

## 4. Requisitos previos

Solo se necesita:

- **Docker Desktop** en ejecución.
- **Git** para clonar el repositorio.

No hace falta tener Node.js o MySQL instalados, ya que todo corre dentro de los contenedores.

## 5. Instalación y primer arranque

Clonar el repositorio y entrar en la carpeta:

```bash
git clone URL_DEL_REPOSITORIO
cd citypaj
```

Los valores por defecto están en `docker-compose.yml` y en los archivos `.env.example`, así que no es necesario configurar nada la primera vez.

Para levantar el proyecto:

```bash
docker compose up --build
```

La primera vez Docker descarga las imágenes, instala dependencias, compila el backend y el frontend, y ejecuta `database/init.sql` para crear la base de datos. Puede tardar varios minutos.

## 6. URLs de acceso

Una vez los contenedores estén saludables:

```text
Frontend:           http://localhost:3001
Backend:            http://localhost:3002
Health check:       http://localhost:3002/health
```

El health check sirve para comprobar que el backend ha conectado correctamente con MySQL.

## 7. Credenciales de prueba

Para probar los distintos roles he preparado tres usuarios de demostración que se crean automáticamente al arrancar el backend si no existen:

| Rol        | Email                       | Contraseña    |
|------------|-----------------------------|---------------|
| Admin      | admin@citypaj.local         | Admin1234     |
| Moderador  | moderador@citypaj.local     | Moderador1234 |
| Usuario    | usuario@citypaj.local       | Usuario1234   |

## 8. Cómo parar el proyecto

Para detener los contenedores sin perder los datos:

```bash
docker compose down
```

Para borrar también el volumen de MySQL y empezar desde cero:

```bash
docker compose down -v
```

## 9. Cómo reiniciar la base de datos

Si se modifica `database/init.sql` y se quieren aplicar los cambios:

```bash
docker compose down -v
docker compose up --build
```

Esto recrea el volumen y vuelve a cargar el esquema y los datos iniciales.

## 10. Estructura del proyecto

La organización de carpetas refleja las distintas partes del sistema:

```text
citypaj/
├── backend/              # API Express y lógica de negocio
├── database/             # Schema y datos iniciales
│   └── init.sql
├── docker-compose.yml    # Orquestación de contenedores
├── frontend/             # Aplicación Next.js
└── README.md             # Este documento
```

## 11. Decisiones técnicas y aprendizajes

Durante el desarrollo me encontré con varios retos que me hicieron aprender:

- **Conexión del frontend al backend en Docker**: al principio el frontend no conseguía hablar con el backend desde dentro del contenedor. Revisé la configuración de Next.js y las variables de entorno para que el proxy apuntara a `http://backend:3002` dentro de Docker y a `http://localhost:3002` desde el navegador.
- **Filtrado de anuncios por categoría**: diseñé una utilidad para detectar anuncios culturales y excluirlos del listado principal, manteniéndolos en su sección específica.
- **Subida de imágenes**: implementé un endpoint con Multer en el backend para recibir carteles, y serví los archivos estáticos desde la propia aplicación.
- **Moderación y roles**: separé las vistas de administrador, moderador y usuario, y añadí un flujo de aprobación de anuncios antes de que sean visibles.

## 12. Solución de errores frecuentes

### Docker Desktop no responde

Asegúrate de que Docker Desktop está abierto y que el motor está en ejecución antes de lanzar `docker compose up`.

### El backend dice que no se pudo conectar a la base de datos

Es normal la primera vez. MySQL tarda unos segundos en estar listo. El `docker-compose.yml` incluye `depends_on` con `condition: service_healthy`, así que el backend espera y se reinicia si es necesario.

### El frontend no encuentra el backend

Comprueba que los contenedores están en ejecución y que el backend responde en `http://localhost:3002`. Dentro del contenedor el frontend habla con el backend a través de `http://backend:3002`.

### Puerto ocupado

Si otros procesos usan los puertos `3001` o `3002`, Docker no podrá levantar el proyecto. Detén esos procesos o cambia los puertos en `docker-compose.yml` si es imprescindible.

---

**Proyecto desarrollado como Trabajo de Fin de Grado de 2º DAW.**
