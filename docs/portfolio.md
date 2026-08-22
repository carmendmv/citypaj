# Portfolio de CityPAJ

## Objetivo

Crear una web pública, atractiva y auto-contenida que presente CityPAJ como proyecto final del Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web.

## Ubicación

La web del portfolio se encuentra en:

```text
portfolio/index.html
```

## Tecnología

- HTML5 semántico.
- CSS embebido en el propio `index.html`.
- Diseño responsive con media queries.
- Sin dependencias externas obligatorias (fuentes Google Fonts para estética).
- Sin backend, sin base de datos, sin login.

## Estructura de la página

1. **Hero principal**: nombre, frase del proyecto y botones de acción.
2. **Problema**: dispersión de información juvenil.
3. **Solución**: funcionalidades y módulos de CityPAJ.
4. **Arquitectura técnica**: flujo Usuario → Next.js → Express → MySQL.
5. **Funcionalidades y capturas**: descripción de los apartados principales.
6. **Base de datos demo**: datos ficticios, conexión segura y health check.
7. **Modelo social**: sin ánimo de lucro y sin pasarela de pago.
8. **Instalación**: comandos de Docker Compose.
9. **Autora**: Carmen de Miguel Velázquez.
10. **Enlaces**: repositorio y memoria.

## Publicación

### Opción 1: GitHub Pages

Configurar Pages apuntando a la carpeta `portfolio/` o desplegar con la acción `deploy-portfolio.yml` si se añade.

### Opción 2: Servidor estático

Subir la carpeta `portfolio/` a cualquier servidor web.

## Relación con el proyecto

El portfolio es independiente de la aplicación principal. Sirve para difusión y evaluación académica. La aplicación real sigue levantándose con `docker compose up --build` y conecta a la base de datos demo de `database/init/`.
