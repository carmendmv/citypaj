# Informe final: despliegue de base de datos demo, memoria y portfolio

## Resumen

Se han realizado las modificaciones necesarias para preparar CityPAJ para el despliegue con una base de datos MySQL demo, actualizar la memoria académica con el modelo social y ausencia de pasarela de pago, y crear un portfolio web independiente.

## 1. Conexión de la base de datos al despliegue

### Archivos añadidos o modificados

- `database/init/01_schema.sql`: esquema MySQL 8.0 con tablas del proyecto.
- `database/init/02_seed_demo.sql`: datos ficticios de usuarios, anuncios, imágenes y favoritos.
- `docker-compose.yml`: el volumen de MySQL ahora monta la carpeta `database/init/` en `docker-entrypoint-initdb.d` para ejecutar `01_schema.sql` y `02_seed_demo.sql` en orden.
- `docker-compose.prod.yml`: configuración adicional con `NODE_ENV=production` y red explícita.
- `backend/src/app.ts`: añadido el endpoint `GET /api/demo/status` que devuelve el estado de la base de datos demo, número de anuncios y usuarios.
- `backend/src/app.ts`: el endpoint `GET /health` ya existía y sigue devolviendo el estado de conexión MySQL.

### Arquitectura de conexión

```text
Usuario
  ↓
Frontend Next.js (http://localhost:3001)
  ↓
Backend Express (http://localhost:3002)
  ↓
MySQL 8.0 (citypaj)
```

El frontend nunca se conecta directamente a MySQL. Utiliza `NEXT_PUBLIC_API_URL` y el proxy interno de Next.js para hablar con el backend. El backend es el único que contiene credenciales y ejecuta consultas sobre el pool `mysql2`.

### Datos demo

El backend crea tres usuarios de demostración al arrancar con `bcrypt` si no existen:

| Rol       | Email                       | Contraseña    |
|-----------|-----------------------------|---------------|
| Admin     | admin@citypaj.local         | Admin1234     |
| Moderador | moderador@citypaj.local     | Moderador1234 |
| Usuario   | usuario@citypaj.local       | Usuario1234   |

## 2. Documentación del despliegue

- `docs/despliegue-bbdd.md`: guía completa del despliegue Docker, arquitectura, credenciales, endpoints de verificación y reinicio de la base de datos.
- `README.md`: actualizado con la ruta `database/init/`, el endpoint `/api/demo/status` y el flujo de despliegue.

## 3. Ajuste de la memoria académica

### Cambios en fuentes

- `docs/memoria/contenido_1.py`: añadida la sección `2.10. Modelo de viabilidad social y ausencia de pasarela de pago` con redacción en primera persona, explicando las decisiones desde el punto de vista del desarrollo.
- `docs/memoria/contenido_4.py`: actualizado `E.10` para reflejar `database/init/01_schema.sql` y `02_seed_demo.sql`, y añadido `E.16. Portfolio del proyecto` como anexo con tono personal.

### Documento generado

- `docs/memoria/Memoria_Final_CityPAJ_Carmen_de_Miguel_Velazquez.docx` regenerado con las nuevas secciones.
- Páginas aproximadas: 57.

### Mensaje clave en la memoria

- CityPAJ es un proyecto de finalidad social, sin ánimo de lucro.
- No se integra pasarela de pago, TPV ni gestión de datos bancarios.
- La viabilidad se basa en sostenibilidad institucional, software libre, servidores de bajo coste y colaboración con entidades juveniles y educativas.

## 4. Portfolio web

### Archivos creados

- `portfolio/index.html`: página completa, responsive, con estilos embebidos.
- `portfolio/README.md`: instrucciones de visualización y publicación.
- `docs/portfolio.md`: documentación del portfolio, secciones y opciones de publicación.
- `.github/workflows/deploy-portfolio.yml`: flujo de GitHub Actions para desplegar el portfolio automáticamente a GitHub Pages.

### Contenido del portfolio

- Hero con nombre del proyecto y enlaces.
- Sección de problema y solución.
- Funcionalidades reales del sistema.
- Arquitectura técnica con flujo Usuario → Next.js → Express → MySQL.
- Base de datos demo con health check.
- Modelo social: sin ánimo de lucro y sin pasarela de pago.
- Guía de instalación con Docker Compose.
- Autora y enlace al repositorio.

## 5. Limpieza de trazas internas

- No se han introducido placeholders, credenciales reales ni terminología propietaria externa en los archivos creados.
- Los datos de demo son ficticios y las contraseñas demo son explícitamente marcadas como inseguras para producción.
- Se mantiene la lista de términos prohibidos en `contenido_5.py` y `generar_final.py` para la limpieza del documento Word.

## 6. Verificación

### Comandos realizados

- Generación de la memoria: `python docs/memoria/generar_final.py` completado correctamente.
- No se ha ejecutado `docker compose up --build` ni se ha comprobado en vivo el despliegue completo, ya que el entorno actual no permite Docker Desktop. Los comandos y configuración están preparados para ejecutarse directamente en el equipo del usuario.

### Comandos de verificación recomendados

```bash
docker compose up --build
# En otra terminal
curl http://localhost:3002/health
curl http://localhost:3002/api/demo/status
# Abrir http://localhost:3001 en el navegador
```

Para el portfolio:

```bash
cd portfolio
python -m http.server 8080
# Abrir http://localhost:8080
```

## 7. Entregables finales

- `database/init/01_schema.sql`
- `database/init/02_seed_demo.sql`
- `docker-compose.yml`
- `docker-compose.prod.yml`
- `backend/src/app.ts` (con `/api/demo/status`)
- `docs/despliegue-bbdd.md`
- `README.md`
- `docs/memoria/contenido_1.py` y `contenido_4.py` actualizados
- `docs/memoria/Memoria_Final_CityPAJ_Carmen_de_Miguel_Velazquez.docx` (regenerado)
- `portfolio/index.html`
- `portfolio/README.md`
- `docs/portfolio.md`
- `.github/workflows/deploy-portfolio.yml`
- `docs/INFORME_DESPLIEGUE_BBDD_PORTFOLIO.md`

## 8. Notas finales

- La base de datos, el backend y el frontend están preparados para ejecutarse con `docker compose up --build`.
- El portfolio es un sitio estático y publicable a GitHub Pages con la acción incluida.
- La memoria académica incluye el modelo social y la justificación de la ausencia de pasarela de pago.
