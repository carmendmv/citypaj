# CityPAJ Portfolio

Portfolio independiente del proyecto CityPAJ, creado para presentar el trabajo de fin de ciclo DAW de forma clara, atractiva y publicable.

## Estructura

```text
portfolio/
  index.html   # Página completa con estilos y contenido embebidos
  README.md    # Este documento
```

La web es estática. No requiere backend, base de datos ni Node.js para visualizarse.

## Ver en local

Abre `index.html` directamente en el navegador o levanta un servidor local:

```bash
cd portfolio
python -m http.server 8080
```

Y visita `http://localhost:8080`.

## Publicar

### GitHub Pages

1. Ve a la configuración del repositorio en GitHub.
2. Activa GitHub Pages seleccionando la carpeta `portfolio/` como fuente o mediante la acción incluida.
3. Accede a la URL que proporcione GitHub.

### Vercel o Netlify (si el usuario decide)

Sube la carpeta `portfolio/` como proyecto estático. Ninguna de estas opciones requiere conexión a MySQL.

## Contenido

- Hero principal con nombre del proyecto y enlaces.
- Sección de problema y solución.
- Funcionalidades reales del proyecto.
- Arquitectura técnica y flujo frontend → backend → BBDD.
- Base de datos demo y health check.
- Modelo social: sin ánimo de lucro y sin pasarela de pago.
- Guía de instalación local con Docker Compose.
- Créditos de la autora y enlace al repositorio.
