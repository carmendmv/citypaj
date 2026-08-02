# CityPAJ
## Plataforma web juvenil territorial para anuncios, recursos y participación ciudadana

**Proyecto de fin de ciclo**  
Ciclo Formativo de Grado Superior en **Desarrollo de Aplicaciones Web**  
Módulo: **Proyecto de Desarrollo de Aplicaciones Web**  
Curso académico: **2025/2026**

**Alumna:** Carmen de Miguel Velázquez  
**Tutor/a:** [Nombre del tutor/a]  
**Centro:** [Nombre del centro educativo]  
**Fecha de entrega:** [Fecha]

---

# ÍNDICE GENERAL

1. Documento 1. Descripción del proyecto
   1.1 Contexto del proyecto
      1.1.1 Ámbito y entorno
      1.1.2 Análisis de la realidad
      1.1.3 Solución y justificación
      1.1.4 Destinatarios
   1.2 Objetivos
   1.3 Project Objective
   1.4 Marco legal

2. Documento 2. Acuerdo del proyecto
   2.1 Requisitos funcionales
   2.2 Requisitos no funcionales
   2.3 Definición de tareas
   2.4 Metodología
   2.5 Planificación temporal
   2.6 Presupuesto
   2.7 Licencia
   2.8 Análisis de riesgos

3. Documento 3. Análisis y diseño
   3.1 Arquitectura de la aplicación
   3.2 Modelado de datos
   3.3 Análisis funcional
   3.4 Diseño de interfaz de usuario

4. Documento 4. Implementación e implantación
   4.1 Implementación
   4.2 Instalación y configuración
   4.3 Pruebas
   4.4 Manual de usuario
   4.5 Ayuda integrada

5. Documento 5. Cierre
   5.1 Diario de bitácora
   5.2 Temporalización y desviación
   5.3 Resultados, conclusiones y mejoras

6. Bibliografía

7. Anexos

---

# ÍNDICE DE TABLAS

Tabla 1. Problemas detectados y solución propuesta en CityPAJ  
Tabla 2. Roles de usuario en CityPAJ  
Tabla 3. Objetivos específicos  
Tabla 4. Requisitos funcionales  
Tabla 5. Requisitos no funcionales  
Tabla 6. Desglose de tareas  
Tabla 7. Planificación por semanas  
Tabla 8. Presupuesto del proyecto  
Tabla 9. Análisis de riesgos  
Tabla 10. Tecnologías del proyecto  
Tabla 11. Entidades de la base de datos  
Tabla 12. Endpoints principales de la API  
Tabla 13. Pruebas funcionales  

---

# ÍNDICE DE ILUSTRACIONES

Ilustración 1. Arquitectura general de CityPAJ  
Ilustración 2. Árbol de carpetas del proyecto  
Ilustración 3. Diagrama entidad-relación  
Ilustración 4. Diagrama de casos de uso  
Ilustración 5. Diagrama de secuencia de inicio de sesión  
Ilustración 6. Diagrama de secuencia de publicación de anuncio  
Ilustración 7. Diagrama de estados de un anuncio  
Ilustración 8. Mockup de la pantalla de inicio  
Ilustración 9. Mockup del listado de anuncios  
Ilustración 10. Captura de pantalla del panel de moderación  

---

# Documento 1. Descripción del proyecto

## 1.1 Contexto del proyecto

CityPAJ es una plataforma web juvenil y territorial pensada para concentrar en un único espacio digital los anuncios, recursos y canales de participación ciudadana dirigidos a personas jóvenes. El nombre responde a la idea de una ciudad pensada para y desde la juventud: "City" hace referencia al entorno territorial y "PAJ" a Publicaciones y Actividades Juveniles.

En la actualidad, una persona joven que busca empleo, formación, vivienda, ocio o ayudas en su localidad o provincia se encuentra con una información muy dispersa. Los carteles, los grupos de redes sociales, las webs institucionales y los portales privados conviven de forma desordenada. Esta dispersión dificulta la búsqueda, reduce la confianza en los anuncios y deja fuera a quienes no dominan determinados canales digitales.

CityPAJ nace como respuesta a esta situación. La plataforma centraliza la publicación y consulta de anuncios juveniles, añade filtros por categoría y territorio, permite la interacción entre usuarios a través de la comunidad y recoge propuestas y sugerencias ciudadanas. Además, incluye un panel de moderación para garantizar la calidad de los contenidos publicados.

### 1.1.1 Ámbito y entorno

El entorno de CityPAJ es doble: social y digital.

Desde el punto de vista social, el destinatario principal es el colectivo juvenil de entre 16 y 35 años, aunque la plataforma puede ser útil para cualquier persona interesada en recursos y oportunidades locales. También pueden beneficiarse de CityPAJ entidades como ayuntamientos, áreas de juventud, asociaciones, centros educativos y empresas locales, ya que disponen de un canal directo para difundir ofertas y recibir propuestas.

Desde el punto de vista digital, CityPAJ se concibe como una aplicación web accesible desde cualquier dispositivo con conexión a internet. El enfoque territorial se materializa en la división por comunidad autónoma y provincia, de modo que el usuario encuentra contenido cercano y relevante.

La importancia de un proyecto como CityPAJ radica en tres factores principales:

- Ordena la información existente en un solo espacio.
- Facilita la participación juvenil y la comunicación con las administraciones.
- Ofrece una experiencia moderna y adaptada a los hábitos de uso actuales.

### 1.1.2 Análisis de la realidad

La situación detectada parte de una observación directa del entorno: los jóvenes no disponen de un único punto de consulta para las oportunidades de su zona. La información se distribuye de forma irregular entre portales de empleo, webs municipales, grupos de redes sociales, tablones físicos y aplicaciones específicas que, en muchos casos, no están pensadas para un uso local.

Las principales dificultades identificadas son las siguientes:

- Información dispersa: cada tipo de recurso o anuncio se encuentra en un lugar distinto, lo que obliga al usuario a consultar múltiples fuentes.
- Webs institucionales poco atractivas: muchas páginas oficiales presentan información de forma rígida, con navegación poco intuitiva y diseños desactualizados para el público joven.
- Redes sociales desordenadas: los grupos de Facebook, WhatsApp o Telegram pueden contener anuncios, pero no permiten filtrar, buscar ni moderar con facilidad.
- Dificultad para encontrar anuncios locales fiables: la ausencia de validación y moderación genera desconfianza.
- Falta de canales juveniles de participación: las propuestas y sugerencias no suelen recogerse de forma estructurada.
- Necesidad de filtros por categoría y territorio: los usuarios valoran poder acotar la búsqueda a su provincia o ciudad.

**Tabla 1. Problemas detectados y solución propuesta en CityPAJ**

| Problema detectado | Consecuencia para el usuario | Solución planteada en CityPAJ |
|---|---|---|
| Información juvenil dispersa en múltiples sitios | El usuario pierde tiempo y no encuentra todo lo que necesita | Plataforma centralizada con anuncios, recursos, comunidad y buzón de sugerencias |
| Interfaces poco atractivas | El joven no se siente identificado y abandona la web | Diseño moderno, joven, responsive y basado en listados claros |
| Anuncios sin moderación | Desconfianza y presencia de contenido inadecuado | Panel de moderación con estados y filtro automático de palabras inapropiadas |
| Falta de filtros territoriales | El usuario ve contenido irrelevante | Filtros por comunidad autónoma y provincia |
| Dificultad para proponer mejoras | La participación ciudadana queda bloqueada | Buzón de sugerencias y propuestas ciudadanas |
| Canales informales difíciles de consultar | Se pierden oportunidades importantes | Buscador, categorías, favoritos y reportes |

La anterior tabla resume el análisis realizado. CityPAJ plantea una solución integral para cada uno de los problemas identificados, con el objetivo de mejorar tanto la experiencia de usuario como la calidad de la información publicada.

### 1.1.3 Solución y justificación

CityPAJ propone una plataforma web que integra en un único sitio las funciones más demandadas por los jóvenes a la hora de buscar y compartir oportunidades locales.

Las funcionalidades principales son las siguientes:

- **Búsqueda y consulta de anuncios**: el usuario puede explorar anuncios por categoría, provincia, comunidad autónoma y texto libre.
- **Registro e inicio de sesión**: el sistema identifica a los usuarios y permite personalizar la experiencia.
- **Publicación de anuncios**: los usuarios registrados pueden crear anuncios con título, descripción, categoría, territorio y contacto.
- **Favoritos**: los usuarios pueden guardar los anuncios de su interés para consultarlos después.
- **Reportes**: cualquier usuario puede reportar contenido inapropiado, lo que activa el proceso de revisión.
- **Comunidad**: espacio de publicaciones y comentarios entre usuarios, organizado por provincia.
- **Buzón de sugerencias o necesidades**: permite enviar propuestas o necesidades ciudadanas, también anónimamente.
- **Propuestas ciudadanas**: recogida de ideas con posibilidad de apoyo por parte de otros usuarios.
- **Recursos y eventos**: directorio de ayudas, recursos juveniles y eventos.
- **Panel de moderación**: los moderadores y administradores revisan, aprueban, rechazan o marcan contenido.
- **Filtro automático de palabras inapropiadas**: cuando un anuncio contiene términos incluidos en una lista de palabras prohibidas, el sistema lo marca como "flagged" para revisión humana, sin rechazarlo automáticamente.

La justificación de la solución se apoya en su viabilidad técnica para el desarrollo de una aplicación web completa del ciclo DAW: usa tecnologías actuales, separa frontend y backend, gestiona autenticación, base de datos relacional y despliegue. Además, el proyecto responde a una necesidad real y observable, lo que facilita la justificación pedagógica y social.

### 1.1.4 Destinatarios

CityPAJ contempla varios perfiles de usuario, cada uno con funcionalidades y niveles de acceso distintos.

**Tabla 2. Roles de usuario en CityPAJ**

| Rol | Descripción | Funcionalidades principales | Nivel de acceso |
|---|---|---|---|
| Visitante | Usuario no registrado que accede a la plataforma | Consultar anuncios, ver detalle, buscar, filtrar, acceder a recursos y eventos | Público |
| Usuario registrado | Persona con cuenta en la plataforma | Publicar anuncios, guardar favoritos, reportar, comentar en comunidad, enviar sugerencias, ver perfil | Registrado |
| Moderador | Usuario con permisos de revisión | Acceder al panel de moderación, aprobar/rechazar/marcar anuncios, leer reportes, gestionar sugerencias | Moderación |
| Administrador | Superusuario del sistema | Toda la funcionalidad de moderador más gestión de usuarios, contenido y configuración | Administración |

La definición de roles permite separar responsabilidades y mantener la integridad del contenido publicado. El visitante puede informarse, el usuario registrado puede participar, el moderador puede validar y el administrador puede gestionar el conjunto del sistema.

## 1.2 Objetivos

### Objetivo general

El objetivo del proyecto es desarrollar una aplicación web multiplataforma denominada CityPAJ, orientada a la consulta, publicación y gestión de anuncios, recursos y espacios de participación juvenil dentro de un ámbito territorial concreto.

### Objetivos específicos

**Tabla 3. Objetivos específicos**

| Código | Objetivo |
|---|---|
| OE-01 | Permitir el registro e inicio de sesión de usuarios con roles diferenciados |
| OE-02 | Facilitar la consulta de anuncios con filtros por categoría y territorio |
| OE-03 | Permitir la publicación de anuncios juveniles por parte de usuarios registrados |
| OE-04 | Gestionar favoritos y reportes de contenido |
| OE-05 | Ofrecer un espacio de comunidad para publicaciones y comentarios |
| OE-06 | Recoger sugerencias y propuestas ciudadanas de forma estructurada |
| OE-07 | Mostrar recursos y eventos relevantes para el público joven |
| OE-08 | Implementar un panel de moderación con estados y filtros automáticos |
| OE-09 | Garantizar una interfaz responsive, moderna y accesible |
| OE-10 | Separar frontend, backend y base de datos siguiendo una arquitectura en capas |
| OE-11 | Documentar e implementar el despliegue con Docker |

## 1.3 Project Objective

The aim of CityPAJ is to develop a full-stack web application for young people to discover, publish and manage local announcements, resources and civic participation spaces. The platform allows users to register, log in, browse content by category and territory, post advertisements, save favourites, report content, participate in a community, send suggestions and access a moderation panel. The project uses a three-layer architecture with a Next.js frontend, an Express and TypeScript backend, and a MySQL relational database.

## 1.4 Marco legal

El desarrollo de CityPAJ implica el tratamiento de datos personales de usuarios (correo electrónico, nombre, provincia, dirección IP en contenido anónimo, publicaciones, comentarios, etc.). Por ello, el proyecto debe respetar la normativa vigente en materia de protección de datos y propiedad intelectual.

### Protección de datos personales

El Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica de Protección de Datos Personales y Garantía de los Derechos Digitales (LOPDGDD) establecen que cualquier aplicación que recoja datos personales debe cumplir con los siguientes principios:

- **Licitud, lealtad y transparencia**: los datos se recogen con consentimiento del usuario y se informa de su uso.
- **Limitación de la finalidad**: los datos se utilizan únicamente para los fines previstos (registro, publicación, moderación).
- **Minimización de datos**: solo se recogen los datos estrictamente necesarios.
- **Exactitud**: el usuario puede rectificar su información desde el perfil.
- **Limitación del plazo de conservación**: los datos se conservan mientras la cuenta esté activa.
- **Integridad y confidencialidad**: las contraseñas se almacenan con hash bcrypt y las comunicaciones se protegen mediante HTTPS en producción.

### Uso de cookies y privacidad

En CityPAJ se utilizan cookies técnicas necesarias para la gestión de sesión. No se emplean cookies de terceros ni de publicidad. La inclusión de un banner de cookies queda prevista como mejora futura si se amplía el uso de cookies analíticas.

### Propiedad intelectual

El código fuente del proyecto es original y se distribuye bajo una licencia libre. Las imágenes, iconos y tipografías utilizadas provienen de librerías con licencias compatibles, como Heroicons, Lucide y Tailwind CSS. No se incluyen materiales protegidos sin autorización.

### Moderación y responsabilidad de contenidos

CityPAJ no publica automáticamente los anuncios sin revisión. Cualquier contenido marcado por el filtro automático o reportado por un usuario pasa a estado "flagged" o "pending" hasta que un moderador humano lo aprueba o rechaza. Esta medida reduce la probabilidad de contenidos inapropiados y alinea el proyecto con las buenas prácticas de moderación de plataformas participativas.

### Términos de uso

El proyecto contempla la inclusión de una página de términos de uso y una política de privacidad. En la versión actual se han creado las rutas `/terminos` y `/privacidad` para alojar dicho contenido.

# Documento 2. Acuerdo del proyecto

## 2.1 Requisitos funcionales

A continuación se recogen los requisitos funcionales de CityPAJ. Cada requisito se identifica con un código, se describe brevemente y se indica su prioridad y estado actual en el proyecto.

**Tabla 4. Requisitos funcionales**

| Código | Requisito | Descripción | Prioridad | Estado |
|---|---|---|---|---|
| RF-01 | Registro de usuarios | El sistema permite crear una cuenta con email, nombre y contraseña | Alta | Implementado |
| RF-02 | Inicio de sesión | El sistema autentica al usuario mediante email y contraseña, generando tokens JWT | Alta | Implementado |
| RF-03 | Cierre de sesión | El sistema permite cerrar la sesión del usuario | Media | Implementado |
| RF-04 | Consulta de anuncios | El usuario puede ver el listado de anuncios publicados | Alta | Implementado |
| RF-05 | Filtrado por categoría | El sistema permite filtrar anuncios por categoría (empleo, formación, ocio, etc.) | Alta | Implementado |
| RF-06 | Filtrado por territorio | El sistema permite filtrar por comunidad autónoma y provincia | Alta | Implementado |
| RF-07 | Detalle de anuncio | El sistema muestra la información completa de un anuncio | Alta | Implementado |
| RF-08 | Publicación de anuncios | El usuario registrado puede crear un anuncio con título, descripción, categoría y territorio | Alta | Implementado |
| RF-09 | Guardar favoritos | El usuario registrado puede añadir anuncios a favoritos | Media | Implementado |
| RF-10 | Eliminar favoritos | El usuario puede quitar anuncios de su lista de favoritos | Media | Implementado |
| RF-11 | Reportar anuncios | El usuario puede reportar contenido inapropiado | Media | Implementado |
| RF-12 | Enviar sugerencias | El usuario puede enviar propuestas o necesidades ciudadanas | Alta | Implementado |
| RF-13 | Crear propuestas ciudadanas | El usuario puede publicar propuestas y recibir apoyos | Baja | Implementado |
| RF-14 | Consultar recursos | El sistema muestra un directorio de recursos y ayudas | Media | Implementado |
| RF-15 | Consultar eventos | El sistema muestra eventos juveniles relevantes | Baja | Implementado |
| RF-16 | Acceso a comunidad | El usuario puede ver publicaciones de la comunidad | Alta | Implementado |
| RF-17 | Crear publicaciones de comunidad | El usuario registrado puede publicar y comentar en comunidad | Alta | Implementado |
| RF-18 | Acceso al panel de moderación | Los moderadores acceden a un panel exclusivo | Alta | Implementado |
| RF-19 | Login de moderadores | El sistema permite el acceso de moderadores con rol específico | Alta | Implementado |
| RF-20 | Moderar contenido | El moderador puede aprobar, rechazar o marcar contenido | Alta | Implementado |
| RF-21 | Estados vacíos | El sistema muestra mensajes cuando no hay resultados | Media | Implementado |
| RF-22 | Errores controlados | El sistema informa al usuario cuando se produce un error | Alta | Implementado |
| RF-23 | Navegación responsive | La interfaz se adapta a dispositivos móviles | Alta | Implementado |
| RF-24 | Conexión frontend-backend-base de datos | El frontend consume datos del backend, que consulta MySQL | Alta | Implementado |
| RF-25 | Carga de datos reales | El sistema importa y muestra datos reales de anuncios desde MySQL | Alta | Implementado |

## 2.2 Requisitos no funcionales

**Tabla 5. Requisitos no funcionales**

| Código | Requisito | Descripción | Estado |
|---|---|---|---|
| RNF-01 | Usabilidad | La interfaz es intuitiva y no requiere formación previa | Cumplido |
| RNF-02 | Accesibilidad | La aplicación sigue criterios básicos de accesibilidad (contraste, etiquetas, navegación) | Cumplido parcialmente |
| RNF-03 | Rendimiento | Las consultas principales responden en menos de dos segundos en condiciones normales | Cumplido |
| RNF-04 | Seguridad | Contraseñas hasheadas, autenticación JWT, validación de entradas y moderación de contenido | Cumplido |
| RNF-05 | Mantenibilidad | Código modular, separado en capas y documentado | Cumplido |
| RNF-06 | Escalabilidad | Arquitectura desacoplada que permite ampliar módulos | Cumplido parcialmente |
| RNF-07 | Responsive | La interfaz funciona correctamente en escritorio, tablet y móvil | Cumplido |
| RNF-08 | Compatibilidad | Compatible con navegadores modernos basados en Chromium, Firefox y Safari | Cumplido |
| RNF-09 | Integridad de datos | Uso de transacciones SQL y validaciones para evitar datos inconsistentes | Cumplido |
| RNF-10 | Modularidad | Frontend y backend organizados en componentes, controladores y rutas | Cumplido |
| RNF-11 | Disponibilidad | El sistema puede levantarse con Docker y mantenerse en ejecución | Cumplido |
| RNF-12 | Claridad visual | Diseño limpio, juvenil y sin distracciones | Cumplido |
| RNF-13 | Experiencia de usuario | Flujos cortos, mensajes claros y retroalimentación inmediata | Cumplido |
| RNF-14 | Separación frontend/backend | Comunicación mediante API REST, sin acoplamiento directo | Cumplido |
| RNF-15 | Documentación | README y memoria técnicas que explican instalación, uso y despliegue | Cumplido |

## 2.3 Definición de tareas

El proyecto se ha estructurado en tareas y subtareas, agrupadas por fases. A continuación se presenta el desglose principal.

**Tabla 6. Desglose de tareas**

| Código | Nombre | Descripción | Horas estimadas | Entregable asociado |
|---|---|---|---|---|
| T-01 | Análisis inicial | Estudio de necesidades, usuarios y competencia | 15 | Documento de análisis |
| T-02 | Definición de requisitos | Elaboración del acuerdo y casos de uso | 12 | RF y RNF |
| T-03 | Diseño UX/UI | Creación de mockups y guía de estilos | 20 | Prototipos Figma |
| T-04 | Diseño de base de datos | Modelado entidad-relación y creación de tablas | 15 | Esquema SQL |
| T-05 | Configuración del entorno | Instalación de dependencias y estructura de carpetas | 8 | Repositorio base |
| T-06 | Backend: autenticación | Registro, login, JWT y roles | 20 | API de auth |
| T-07 | Backend: anuncios | CRUD de anuncios, filtros y moderación | 25 | Endpoints de anuncios |
| T-08 | Backend: comunidad y sugerencias | Publicaciones, comentarios, sugerencias | 18 | Endpoints de comunidad |
| T-09 | Frontend: home y listado | Página principal, búsqueda y filtros | 20 | Páginas home y anuncios |
| T-10 | Frontend: publicar y detalle | Formularios y vistas de detalle | 18 | Páginas publicar y [id] |
| T-11 | Frontend: comunidad y buzón | Interfaces de comunidad, sugerencias y propuestas | 20 | Páginas adicionales |
| T-12 | Panel de moderación | Login de moderador, dashboard, estados y reportes | 22 | Panel admin |
| T-13 | Pruebas funcionales | Verificación de registro, login, publicación y filtros | 12 | Informe de pruebas |
| T-14 | Pruebas de despliegue | Docker, build y conexión base de datos | 10 | Docker configurado |
| T-15 | Documentación y memoria | Redacción de README, guías y memoria final | 25 | Documentación |

El total estimado asciende a aproximadamente 260 horas, incluyendo las tareas de documentación y correcciones finales.

## 2.4 Metodología

El desarrollo de CityPAJ ha seguido una metodología mixta, adaptada a las necesidades de un proyecto de fin de ciclo. La fase inicial se ha realizado de forma secuencial: análisis, requisitos, diseño de base de datos y diseño de interfaces. Esta primera parte sigue un enfoque en cascada porque requiere una planificación clara antes de empezar a programar.

Una vez concluida la fase de diseño, el desarrollo se ha abordado de forma iterativa. Cada iteración o sprint se ha centrado en un módulo concreto: autenticación, anuncios, comunidad, sugerencias, moderación, etc. Al finalizar cada módulo se han realizado pruebas de integración para detectar errores antes de continuar.

La metodología se completa con una revisión continua del código, el uso de control de versiones con Git y la documentación progresiva de avances. De esta forma, el proyecto gana estabilidad sin perder flexibilidad.

## 2.5 Planificación temporal

**Tabla 7. Planificación por semanas**

| Semana | Tareas principales | Entregable |
|---|---|---|
| 1 | Análisis del entorno, usuarios y requisitos | Acuerdo del proyecto |
| 2 | Diseño UX/UI y prototipos Figma | Mockups y guía de estilos |
| 3 | Diseño de base de datos y arquitectura | Esquema SQL y diagrama ER |
| 4 | Backend: autenticación y estructura API | Módulo de auth funcional |
| 5 | Backend: anuncios y filtros | Endpoints de anuncios |
| 6 | Frontend: home, listado y publicar | Páginas principales |
| 7 | Frontend: comunidad, sugerencias y propuestas | Páginas secundarias |
| 8 | Panel de moderación y filtros | Panel admin |
| 9 | Pruebas, Docker y documentación | Memoria y despliegue |
| 10 | Correcciones, limpieza y presentación | Repositorio final |

**Ilustración 11. Diagrama de Gantt**

[Insertar aquí el diagrama de Gantt con las fases y semanas.]

*Fuente: elaboración propia.*

## 2.6 Presupuesto

**Tabla 8. Presupuesto del proyecto**

| Concepto | Horas/Unidades | Precio unitario (€) | Subtotal (€) |
|---|---|---|---|
| Análisis funcional | 27 | 25 | 675 |
| Diseño UX/UI | 20 | 25 | 500 |
| Diseño de base de datos | 15 | 25 | 375 |
| Desarrollo backend | 63 | 30 | 1.890 |
| Desarrollo frontend | 78 | 30 | 2.340 |
| Panel de moderación | 22 | 30 | 660 |
| Pruebas y calidad | 22 | 25 | 550 |
| Documentación y memoria | 25 | 20 | 500 |
| Gestión de proyecto | 10 | 30 | 300 |
| Licencias y herramientas | 1 proyecto | 0 | 0 |
| Infraestructura (demo) | 1 proyecto | 0 | 0 |
| **Total** | | | **7.790** |

El presupuesto se ha calculado sobre la base de un desarrollador junior con una media de 25 a 30 euros por hora. Las licencias y herramientas utilizadas son de código abierto o disponen de capa gratuita, por lo que no generan coste adicional en la versión de desarrollo.

**Ilustración 12. Gráfico de reparto de costes**

[Insertar aquí gráfico circular o de barras del presupuesto.]

*Fuente: elaboración propia.*

## 2.7 Licencia

CityPAJ es un proyecto desarrollado con finalidad académica. El código fuente se distribuye bajo la licencia MIT, lo que permite su uso, modificación y distribución, siempre que se incluya la correspondiente atribución de autoría y la mención de la licencia. Esta elección responde a la naturaleza educativa del TFG y facilita la futura reutilización o mejora del proyecto sin restricciones excesivas.

## 2.8 Análisis de riesgos

**Tabla 9. Análisis de riesgos**

| Riesgo | Probabilidad | Impacto | Medida preventiva | Plan de contingencia |
|---|---|---|---|---|
| Fallo en la conexión frontend-backend | Media | Alto | Probar endpoints con Postman/curl desde el inicio | Revisar CORS, URL de conexión y variables de entorno |
| Errores de tipado en TypeScript | Alta | Medio | Ejecutar `tsc --noEmit` con frecuencia | Corregir tipos y añadir guards cuando sea necesario |
| Pérdida de datos durante pruebas | Baja | Alto | Realizar backups del dump y usar seed controlado | Restaurar desde el volcado SQL original |
| Rendimiento deficiente en búsquedas | Media | Medio | Usar índices en tablas consultadas frecuentemente | Optimizar consultas o añadir caché con Redis |
| Contenido inapropiado no controlado | Media | Alto | Implementar moderación con filtro automático | Revisión humana desde el panel de moderación |
| Despliegue fallido en Docker | Baja | Alto | Probar el build en local antes de subir | Revisar puertos, variables y volúmenes |
| Falta de tiempo para documentación | Media | Medio | Asignar franjas semanales a la memoria | Priorizar apartados obligatorios y completar anexos |

### DAFO

**Debilidades:**
- El equipo de desarrollo es unitario, lo que limita la especialización.
- El presupuesto no incluye infraestructura real de producción.
- Algunas funcionalidades avanzadas quedan pendientes.

**Amenazas:**
- Cambios en las tecnologías utilizadas.
- Competencia de plataformas ya consolidadas.
- Dificultad para mantener una comunidad activa sin recursos.

**Fortalezas:**
- Código modular y bien estructurado.
- Stack tecnológico actual y demandado.
- Funcionalidades completas: autenticación, anuncios, comunidad, moderación.
- Despliegue documentado con Docker.

**Oportunidades:**
- Integración futura con administraciones locales.
- Ampliación a app móvil progresiva (PWA).
- Posibilidad de recibir financiación para juventud o proyectos ciudadanos.

# Documento 3. Análisis y diseño

## 3.1 Arquitectura de la aplicación

CityPAJ sigue una arquitectura de tres capas clásica en aplicaciones web modernas: presentación, lógica de negocio y persistencia. Esta separación facilita el mantenimiento, permite escalar cada capa de forma independiente y acerca el proyecto a las buenas prácticas del desarrollo profesional.

El flujo de datos funciona de la siguiente manera. El usuario interactúa con el navegador, donde se ejecuta el frontend desarrollado en Next.js. El frontend realiza peticiones HTTP a la API REST del backend, implementado con Node.js y Express. El backend recibe la petición, valida los datos, ejecuta la lógica de negocio y, cuando es necesario, consulta o modifica la base de datos MySQL. Finalmente, el backend devuelve la respuesta en formato JSON, que el frontend utiliza para actualizar la interfaz.

**Ilustración 1. Arquitectura general de CityPAJ**

[Insertar diagrama con: navegador → frontend (Next.js, puerto 3001) → backend (Express, puerto 3002) → MySQL (puerto 3306), y viceversa.]

*Fuente: elaboración propia.*

El diagrama muestra los tres componentes principales conectados mediante protocolos HTTP y conexiones TCP. El navegador nunca accede directamente a la base de datos; toda la comunicación con MySQL pasa por el backend. De esta forma se protege la información y se centraliza la lógica.

### 3.1.1 Tecnologías y herramientas

**Tabla 10. Tecnologías del proyecto**

| Tecnología | Uso en el proyecto | Justificación |
|---|---|---|
| HTML / JSX | Estructura de las páginas web | Estándar base del desarrollo web |
| CSS / Tailwind CSS | Estilos y diseño responsive | Permite un desarrollo rápido y una interfaz coherente |
| JavaScript / TypeScript | Lenguaje de programación principal | Tipado estático que reduce errores y mejora el mantenimiento |
| React | Biblioteca para construir la interfaz de usuario | Componentes reutilizables y gestión eficiente del estado |
| Next.js 14 | Framework React con App Router | Renderizado del lado del servidor, rutas y optimización |
| Node.js | Entorno de ejecución del backend | Asíncrono, rápido y ampliamente usado en el sector |
| Express | Framework web para Node.js | Ligero, flexible y con gran comunidad |
| MySQL / MariaDB | Sistema de gestión de bases de datos relacional | Robusto, conocido y compatible con el stack elegido |
| mysql2 | Cliente de MySQL para Node.js | Soporte de promesas y rendimiento optimizado |
| bcryptjs | Hash de contraseñas | Seguridad en el almacenamiento de credenciales |
| jsonwebtoken | Gestión de tokens JWT | Autenticación stateless y escalable |
| Knex (opcional) | Query builder para SQL | Facilita consultas y migraciones |
| Git / GitHub | Control de versiones | Seguimiento de cambios y trabajo colaborativo |
| Figma | Diseño de interfaces y prototipos | Mockups visuales previos a la implementación |
| Visual Studio Code | Entorno de desarrollo | Editor con soporte completo para TypeScript y React |
| Docker / Docker Compose | Contenerización y despliegue | Empaquetado del proyecto para producción |
| Postman / curl | Pruebas de API | Verificación de endpoints y conexiones |

Cada tecnología se ha elegido por su madurez, documentación disponible y adecuación a las necesidades del proyecto. El stack responde a una arquitectura full-stack JavaScript/TypeScript, lo que permite compartir conocimientos y mantener coherencia entre frontend y backend.

### 3.1.2 Arquitectura de componentes

El código del proyecto se organiza en tres grandes bloques: frontend, backend y base de datos. A continuación se describe el árbol de carpetas y la responsabilidad de cada una.

**Ilustración 2. Árbol de carpetas del proyecto**

```
citypaj/
├── backend/
│   ├── src/
│   │   ├── config/        # Configuración de base de datos, variables y logger
│   │   ├── controllers/   # Lógica de negocio (auth, anuncios, comunidad...)
│   │   ├── middleware/    # Autenticación, validación y control de errores
│   │   ├── migrations/    # Scripts SQL para crear y evolucionar la base de datos
│   │   ├── models/        # Tipos y estructuras de datos
│   │   ├── routes/        # Definición de endpoints de la API
│   │   ├── scripts/       # Utilidades de base de datos (init-db.js, seed-demo.js)
│   │   └── index.ts       # Punto de entrada del servidor
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── database/
│   ├── schema.sql
│   ├── schema-mysql.sql
│   ├── seed.sql
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── app/           # Rutas del App Router de Next.js
│   │   ├── components/    # Componentes React reutilizables
│   │   │   ├── layout     # Header, Footer
│   │   │   ├── ui         # Botones, tarjetas, formularios
│   │   │   └── ...
│   │   ├── lib/           # Utilidades, conexión a API, datos
│   │   └── hooks/         # Hooks personalizados
│   ├── public/            # Assets estáticos
│   ├── Dockerfile
│   ├── package.json
│   └── next.config.js
├── docker-compose.yml
├── citypaj_dump.sql
├── MEMORIA_CityPAJ.md
└── README.md
```

*Fuente: elaboración propia.*

En el **frontend**, el directorio `app/` contiene las páginas gestionadas por el App Router de Next.js. Cada carpeta representa una ruta de la aplicación. El directorio `components/` agrupa los componentes React reutilizables, como el `Header`, el `Footer`, los formularios o las tarjetas de anuncios. El directorio `lib/` incluye funciones auxiliares, como las llamadas a la API y la gestión de provincias.

En el **backend**, `controllers/` contiene las funciones que responden a cada endpoint, `routes/` define las URL y métodos HTTP disponibles, `middleware/` valida la autenticación y los roles, y `migrations/` aloja los scripts SQL que crean las tablas. El archivo `index.ts` inicia el servidor Express y configura los middlewares comunes.

## 3.2 Modelado de datos

La base de datos de CityPAJ almacena toda la información persistente de la aplicación: usuarios, anuncios, favoritos, reportes, sugerencias, publicaciones y comentarios de comunidad, propuestas, recursos, eventos y los registros de moderación. El modelo relacional permite mantener la integridad de los datos mediante claves primarias, claves foráneas y restricciones.

### 3.2.1 Datos de entrada, salida y almacenados

- **Datos de entrada**: proceden de los formularios de la aplicación (registro, login, publicación, sugerencia, reporte, etc.). El backend valida estos datos antes de almacenarlos.
- **Datos de salida**: son las respuestas JSON que el backend devuelve al frontend, como listados de anuncios, detalles de un anuncio o el perfil del usuario.
- **Datos almacenados**: residen en la base de datos MySQL y persisten entre sesiones.

### 3.2.2 Entidades principales

**Tabla 11. Entidades de la base de datos**

| Entidad | Finalidad | Campos principales | Relación con otras tablas |
|---|---|---|---|
| `usuarios` | Almacenar cuentas de usuario | id, email, nombre, password_hash, rol, verificado, provincia | 1:N con anuncios, favoritos, reportes, sugerencias, comunidad |
| `anuncios` | Guardar los anuncios publicados | id, usuario_id, titulo, descripcion, categoria, provincia, estado_moderacion, visible, precio, creado_at | N:1 con usuarios; 1:N con anuncio_imagenes, reportes |
| `favoritos` | Relación usuario-anuncio guardado | id, usuario_id, anuncio_id | N:1 con usuarios y anuncios |
| `reportes_anuncios` | Contenido reportado | id, anuncio_id, usuario_id, motivo, estado, creado_at | N:1 con anuncios y usuarios |
| `sugerencias` | Propuestas ciudadanas | id, nombre, email, categoria, prioridad, contenido, estado, creado_at | Relación directa con el sistema |
| `comunidad_publicaciones` | Publicaciones en la comunidad | id, usuario_id, titulo, contenido, provincia, tema, estado_moderacion | N:1 con usuarios; 1:N con comunidad_comentarios |
| `comunidad_comentarios` | Comentarios a publicaciones | id, publicacion_id, usuario_id, contenido, estado_moderacion | N:1 con publicaciones y usuarios |
| `propuestas` | Ideas ciudadanas con apoyo | id, usuario_id, titulo, descripcion, categoria, apoyos | N:1 con usuarios |
| `recursos` | Directorio de recursos y ayudas | id, titulo, descripcion, categoria, comunidad_autonoma, url | Tabla informativa |
| `eventos` | Eventos juveniles | id, titulo, descripcion, fecha, ubicacion, categoria | Tabla informativa |
| `moderacion_logs` | Registro de acciones de moderación | id, anuncio_id, moderador_id, estado_anterior, estado_nuevo, notas | N:1 con anuncios y usuarios |

La tabla anterior no pretende ser exhaustiva, pero recoge las entidades más relevantes. El modelo sigue el principio de normalización, evitando la redundancia de datos y garantizando la integridad referencial.

### 3.2.3 Modelo entidad-relación y modelo relacional

**Ilustración 3. Diagrama entidad-relación de CityPAJ**

[Insertar diagrama ER con usuarios, anuncios, favoritos, reportes, sugerencias, comunidad_publicaciones, comunidad_comentarios, propuestas, recursos, eventos y moderacion_logs.]

*Fuente: elaboración propia.*

El diagrama ER representa las entidades, sus atributos principales y las relaciones entre ellas. Un usuario puede publicar muchos anuncios, pero cada anuncio pertenece a un único usuario. Del mismo modo, un anuncio puede tener muchos reportes, pero cada reporte se refiere a un único anuncio. Esta lógica se aplica también a la comunidad: una publicación puede tener múltiples comentarios.

**Ilustración 4. Modelo relacional de CityPAJ**

[Insertar esquema relacional con tablas, claves primarias (PK) y claves foráneas (FK).]

*Fuente: elaboración propia.*

El paso del modelo ER al modelo relacional se realiza de la siguiente forma:

- Cada entidad se convierte en una tabla.
- Los atributos identificadores se convierten en claves primarias.
- Las relaciones 1:N se implementan mediante claves foráneas en la tabla del lado N.
- Las relaciones N:M, si las hubiera, generan tablas intermedias. En CityPAJ, la relación entre usuarios y anuncios guardados como favoritos se resuelve con la tabla `favoritos`, que actúa como tabla de unión.

### 3.2.4 Script SQL

La base de datos se crea a partir de los scripts ubicados en `backend/migrations/`. Estos archivos definen las tablas, los índices y las restricciones necesarias. El orden de ejecución es importante, ya que algunas tablas dependen de otras.

El orden de las migraciones es el siguiente:

1. `002_create_mvp_tables.sql` – crea las tablas principales del sistema.
2. `001_comunidad_mejoras.sql` y `002_comunidad_anonimo.sql` – añaden mejoras y soporte para publicaciones anónimas.
3. `003_add_precio_anuncios.sql` – añade el campo de precio a los anuncios.
4. `003_comunidad_demo.sql` – datos iniciales de comunidad.
5. `004_add_rol_to_usuarios.sql` – añade la columna de rol.
6. `005_create_moderacion_logs.sql` – crea la tabla de logs de moderación.

El archivo `citypaj_dump.sql` contiene un volcado completo de la base de datos con datos reales, que se puede restaurar para disponer de contenido de prueba en desarrollo o producción.

## 3.3 Análisis funcional

El análisis funcional describe cómo los actores interactúan con el sistema y cómo se producen las operaciones más importantes. Se utiliza el lenguaje de modelado UML para representar los casos de uso, las secuencias de interacción, las actividades y los estados.

### 3.3.1 Actores del sistema

**Tabla 12. Actores de CityPAJ**

| Actor | Descripción |
|---|---|
| Visitante | Usuario que navega por la web sin identificarse |
| Usuario registrado | Persona con cuenta y sesión iniciada |
| Moderador | Usuario con permisos de revisión de contenido |
| Administrador | Usuario con control total del sistema |
| Sistema | Conjunto de procesos automáticos, como el filtro de palabras inapropiadas |

### 3.3.2 Diagrama de casos de uso

**Ilustración 5. Diagrama de casos de uso de CityPAJ**

[Insertar diagrama UML con los cuatro actores y los casos de uso agrupados: anuncios, comunidad, sugerencias, moderación.]

*Fuente: elaboración propia.*

Los casos de uso principales son:

- El visitante puede consultar anuncios, filtrar por categoría y provincia, ver recursos y eventos, y registrarse.
- El usuario registrado puede iniciar sesión, publicar anuncios, guardar favoritos, reportar contenido, participar en la comunidad y enviar sugerencias.
- El moderador puede acceder al panel, revisar anuncios pendientes o reportados, aprobar, rechazar o marcar contenido, y leer el buzón.
- El administrador gestiona usuarios y contenido, y accede a todas las funciones de moderación.

### 3.3.3 Diagrama de secuencia de inicio de sesión

**Ilustración 6. Diagrama de secuencia de login**

[Insertar diagrama UML con: Usuario → Frontend → Backend → Base de datos, mostrando validación de credenciales y devolución de tokens.]

*Fuente: elaboración propia.*

El proceso de inicio de sesión sigue los siguientes pasos:

1. El usuario introduce su email y contraseña en el formulario del frontend.
2. El frontend envía una petición POST a `/api/auth/login`.
3. El backend recibe los datos, busca al usuario en la base de datos y compara el hash de la contraseña con `bcryptjs`.
4. Si las credenciales son correctas, el backend genera un token JWT de acceso y otro de refresco.
5. El frontend almacena los tokens y redirige al usuario a la página principal.
6. En las peticiones siguientes, el frontend incluye el token JWT en la cabecera `Authorization`.

### 3.3.4 Diagrama de secuencia de publicación de anuncio

**Ilustración 7. Diagrama de secuencia de publicación de anuncio**

[Insertar diagrama UML con: Usuario → Frontend → Backend → Base de datos, mostrando validación, filtro automático e inserción.]

*Fuente: elaboración propia.*

El flujo de publicación de un anuncio es el siguiente:

1. El usuario registrado rellena el formulario de publicación.
2. El frontend envía la información a `/api/anuncios`.
3. El backend valida los campos y obtiene los identificadores de provincia y comunidad autónoma.
4. El backend ejecuta el filtro automático de palabras inapropiadas sobre el título y la descripción.
5. Según el resultado del filtro, el anuncio se guarda con estado `approved` o `flagged`.
6. El backend devuelve el anuncio creado al frontend, que muestra el resultado al usuario.

### 3.3.5 Diagrama de estados de un anuncio

**Ilustración 8. Diagrama de estados de un anuncio**

[Insertar diagrama con los estados `pending`, `approved`, `rejected` y `flagged`, y las transiciones entre ellos.]

*Fuente: elaboración propia.*

Un anuncio puede encontrarse en los siguientes estados:

- **pending**: acaba de publicarse y aún no ha sido revisado.
- **flagged**: el filtro automático ha detectado palabras inapropiadas y lo ha marcado para revisión humana.
- **approved**: un moderador ha aprobado el anuncio y es visible públicamente.
- **rejected**: un moderador ha rechazado el anuncio y no se muestra al público. Solo un moderador humano puede aplicar este estado.

### 3.3.6 Diagrama de actividad de búsqueda y filtrado

**Ilustración 9. Diagrama de actividad de búsqueda**

[Insertar diagrama de actividad con: el usuario introduce filtros, el backend construye la consulta SQL, ejecuta la búsqueda y devuelve resultados.]

*Fuente: elaboración propia.*

Cuando el usuario selecciona una categoría o provincia, el frontend envía los parámetros al backend. El backend construye una consulta SQL con `WHERE` dinámico, aplica los filtros, ordena los resultados y devuelve el listado paginado. Si no hay resultados, el frontend muestra un mensaje de estado vacío.

## 3.4 Diseño de interfaz de usuario

El diseño de CityPAJ busca transmitir una imagen joven, fresca, urbana y cercana. La estética se basa en una paleta de colores moderna, tipografías claras y una organización basada en listados que facilita la exploración. La interfaz es responsive, lo que garantiza una experiencia adecuada tanto en escritorio como en móvil.

### 3.4.1 Principios de diseño

Los principios que guían el diseño son:

- **Claridad**: cada pantalla tiene un objetivo claro y una jerarquía visual definida.
- **Juventud**: colores vivos, ilustraciones y lenguaje cercano.
- **Territorialidad**: los filtros por provincia y comunidad autónoma están siempre accesibles.
- **Simplicidad**: se evita la sobrecarga visual. No se recurre a cards grandes ni a efectos innecesarios.
- **Accesibilidad básica**: contraste suficiente, etiquetas en formularios y navegación por teclado parcial.

### 3.4.2 Mockups y prototipos

A continuación se describen los mockups principales. En el anexo se incluyen capturas de Figma y de la aplicación final.

**Ilustración 10. Mockup de la pantalla de inicio**

[Insertar captura de Figma: Home con hero, búsqueda y últimos anuncios.]

*Fuente: elaboración propia.*

La pantalla de inicio presenta un mensaje de bienvenida, un buscador destacado y una selección de anuncios recientes. Desde aquí, el usuario puede acceder al listado completo, filtrar por categoría o iniciar sesión.

**Ilustración 11. Mockup del listado de anuncios**

[Insertar captura de Figma: Listado vertical con título, categoría, provincia y precio.]

*Fuente: elaboración propia.*

El listado de anuncios muestra cada resultado de forma compacta, con información esencial. Los filtros se sitúan en la parte superior para permitir refinar la búsqueda sin perder el contexto.

**Ilustración 12. Mockup del detalle de anuncio**

[Insertar captura de Figma: Vista de detalle con descripción, datos de contacto, botón de favorito y reporte.]

*Fuente: elaboración propia.*

La pantalla de detalle ofrece toda la información del anuncio. Si el usuario está registrado, puede guardarlo en favoritos o reportarlo.

**Ilustración 13. Mockup del login y del registro**

[Insertar captura de Figma: Formularios de acceso y registro.]

*Fuente: elaboración propia.*

Los formularios de acceso y registro mantienen un diseño sencillo. Incluyen validaciones visuales, mensajes de error y la opción de recuperar la contraseña.

**Ilustración 14. Mockup del panel de moderación**

[Insertar captura de Figma: Tabla de anuncios pendientes con selector de estado y notas.]

*Fuente: elaboración propia.*

El panel de moderación está pensado para un uso eficiente. Los moderadores ven el listado de anuncios pendientes o reportados, pueden cambiar el estado y añadir notas internas.

### 3.4.3 Decisiones de diseño

**Tabla 13. Decisiones de diseño de la interfaz**

| Decisión de diseño | Motivo | Beneficio para el usuario |
|---|---|---|
| Listado vertical de anuncios | Facilita el scroll y la comparación rápida | Encuentra información con un vistazo |
| Filtros siempre visibles | Reduce el número de pasos para acotar la búsqueda | Ahorra tiempo y mejora la usabilidad |
| Diseño sin cards grandes | Evita distracciones y carga visual | Interfaz más limpia y rápida |
| Hero con ilustración SVG | Transmite identidad juvenil sin imágenes pesadas | Carga rápida y estética coherente |
| Panel de moderación separado | Diferencia claramente los roles | Los moderadores trabajan sin interferir en la web pública |

# Documento 4. Implementación e implantación

## 4.1 Implementación

El desarrollo de CityPAJ se ha dividido en módulos independientes que responden a las funcionalidades descritas en el acuerdo del proyecto. Cada módulo agrupa un conjunto de controladores, rutas y componentes de frontend. A continuación se explican los más relevantes.

### 4.1.1 Módulo de autenticación

El módulo de autenticación gestiona el registro, el inicio de sesión, el cierre de sesión y la identificación del usuario en las peticiones posteriores.

Archivos principales:

- `backend/src/controllers/auth-simple.ts`: contiene las funciones de `register` y `login`.
- `backend/src/routes/auth.ts`: define las rutas `/api/auth/register`, `/api/auth/login`, `/api/auth/logout` y `/api/auth/me`.
- `backend/src/middleware/auth.ts`: valida el token JWT en las peticiones protegidas.
- `frontend/src/app/acceder/page.tsx`: interfaz de acceso y registro.
- `frontend/src/lib/auth.ts` o similar: gestión de tokens en el cliente.

Proceso:

1. En el registro, el backend valida el email, la contraseña y el nombre, genera un hash con `bcryptjs` y guarda el usuario en la tabla `usuarios`.
2. En el login, busca el usuario por email, compara el hash y, si es correcto, genera dos tokens JWT: uno de acceso y otro de refresco.
3. Los tokens se devuelven al frontend, que los almacena y los incluye en las cabeceras de las peticiones protegidas.
4. El middleware `auth` verifica el token en cada endpoint que requiera autenticación.

### 4.1.2 Módulo de anuncios

Este módulo es el núcleo de la aplicación. Gestiona la creación, consulta, edición, eliminación, filtrado y moderación de anuncios.

Archivos principales:

- `backend/src/controllers/anuncios-mysql.ts`: lógica de negocio de anuncios.
- `backend/src/routes/anuncios.ts`: endpoints REST de anuncios.
- `frontend/src/app/anuncios/page.tsx`: listado y filtros.
- `frontend/src/app/anuncios/[id]/page.tsx`: detalle de anuncio.
- `frontend/src/app/publicar/page.tsx`: formulario de publicación.
- `frontend/src/app/mis-anuncios/page.tsx`: anuncios del usuario.

Funciones destacadas:

- `getAnuncios`: obtiene anuncios con filtros por categoría, provincia, comunidad, texto y paginación.
- `createAnuncio`: valida e inserta un anuncio, aplicando el filtro automático de palabras inapropiadas.
- `moderarAnuncioIA`: aplica el filtro automático a un anuncio existente y cambia su estado.
- `updateAnuncio` y `deleteAnuncio`: permiten modificar o eliminar anuncios propios o por parte de moderadores.

El filtro automático se encuentra en la función `moderarConFiltro` (anteriormente `moderarConIA`). Esta función recibe el título y la descripción del anuncio, busca términos incluidos en una lista de palabras inapropiadas y devuelve si el contenido es aprobado o marcado para revisión humana.

### 4.1.3 Módulo de comunidad

El módulo de comunidad permite crear publicaciones temáticas y añadir comentarios, organizados por provincia.

Archivos principales:

- `backend/src/controllers/comunidad.ts`.
- `backend/src/routes/comunidad.ts`.
- `frontend/src/app/comunidad/page.tsx` y `frontend/src/app/comunidad/[provincia]/page.tsx`.
- `frontend/src/app/comunidad/crear/page.tsx`.

El sistema permite publicaciones anónimas, registrando una dirección IP y un nombre opcional. Esta funcionalidad facilita la participación sin obligar al registro, aunque el moderador puede revisar el contenido.

### 4.1.4 Módulo de sugerencias y propuestas

El módulo de sugerencias recoge necesidades ciudadanas a través del buzón. El módulo de propuestas permite publicar ideas que otros usuarios pueden apoyar.

Archivos principales:

- `backend/src/controllers/sugerencias.ts` y `backend/src/controllers/propuestas.ts`.
- `backend/src/routes/sugerencias.ts` y `backend/src/routes/propuestas.ts`.
- `frontend/src/app/buzon-sugerencias/page.tsx`.
- `frontend/src/app/propuestas/page.tsx`.

El buzón acepta sugerencias con nombre, email, categoría, prioridad y contenido. Algunos campos pueden omitirse si la sugerencia es anónima.

### 4.1.5 Módulo de recursos y eventos

Estos módulos ofrecen directorios de ayudas y eventos. Funcionan como tablas informativas consultadas por el frontend.

Archivos principales:

- `backend/src/controllers/recursos.ts` y `backend/src/controllers/eventos.ts`.
- `backend/src/routes/recursos.ts` y `backend/src/routes/eventos.ts`.
- `frontend/src/app/recursos/page.tsx` y `frontend/src/app/eventos/page.tsx`.

### 4.1.6 Módulo de moderación

El panel de moderación permite a los usuarios con rol `moderador` o `admin` revisar contenido. Incluye anuncios, publicaciones de comunidad, comentarios y sugerencias.

Archivos principales:

- `backend/src/controllers/moderacion.ts` y `backend/src/controllers/admin-anuncios.ts`.
- `backend/src/routes/moderacion.ts` y `backend/src/routes/admin.ts`.
- `frontend/src/app/moderador/login/page.tsx`.
- `frontend/src/app/admin/anuncios/page.tsx` y otras rutas del panel.

Funciones destacadas:

- Listado de contenido con filtros por estado.
- Cambio de estado `approved`, `rejected` o `flagged`.
- Resolución de reportes.
- Registro de acciones en `moderacion_logs`.

### 4.1.7 Tabla de endpoints principales

**Tabla 14. Endpoints principales de la API**

| Método | Endpoint | Descripción | Protegido |
|---|---|---|---|
| POST | `/api/auth/register` | Registro de nuevo usuario | No |
| POST | `/api/auth/login` | Inicio de sesión | No |
| GET | `/api/auth/me` | Datos del usuario actual | Sí |
| GET | `/api/anuncios` | Listado de anuncios con filtros | No |
| GET | `/api/anuncios/:id` | Detalle de un anuncio | No |
| POST | `/api/anuncios` | Crear anuncio | Sí |
| PUT | `/api/anuncios/:id` | Actualizar anuncio | Sí |
| DELETE | `/api/anuncios/:id` | Eliminar anuncio | Sí |
| POST | `/api/anuncios/:id/guardar` | Guardar anuncio en favoritos | Sí |
| POST | `/api/anuncios/:id/reportar` | Reportar un anuncio | Sí |
| POST | `/api/anuncios/:id/moderar-ia` | Aplicar filtro automático | Sí (moderador) |
| POST | `/api/sugerencias` | Enviar sugerencia | No / Sí |
| GET | `/api/comunidad` | Listado de publicaciones | No |
| POST | `/api/comunidad` | Crear publicación | Sí / anónimo |
| GET | `/api/recursos` | Listado de recursos | No |
| GET | `/api/eventos` | Listado de eventos | No |
| GET | `/api/admin/anuncios` | Anuncios para moderación | Sí (moderador) |
| GET | `/health` | Comprobación de salud del backend | No |

### 4.1.8 Estructura de archivos frontend y backend

**Tabla 15. Archivos principales del backend**

| Archivo | Responsabilidad |
|---|---|
| `backend/src/index.ts` | Punto de entrada del servidor Express |
| `backend/src/routes/*.ts` | Definición de endpoints por módulo |
| `backend/src/controllers/*.ts` | Lógica de cada endpoint |
| `backend/src/middleware/auth.ts` | Verificación de JWT y roles |
| `backend/src/db.ts` | Conexión a MySQL |
| `backend/src/migrations/*.sql` | Scripts de creación de tablas |

**Tabla 16. Archivos principales del frontend**

| Archivo / Directorio | Responsabilidad |
|---|---|
| `frontend/src/app/page.tsx` | Página de inicio |
| `frontend/src/app/anuncios/page.tsx` | Listado y filtros |
| `frontend/src/app/publicar/page.tsx` | Formulario de publicación |
| `frontend/src/app/acceder/page.tsx` | Login y registro |
| `frontend/src/components/layout/Header.tsx` | Cabecera con navegación y búsqueda |
| `frontend/src/components/layout/Footer.tsx` | Pie de página |
| `frontend/src/lib/api.ts` o similar | Llamadas a la API |

## 4.2 Instalación y configuración

### 4.2.1 Requisitos previos

Para poner en marcha CityPAJ en local se necesita:

- Node.js 18 o superior.
- npm 9 o superior.
- MySQL 8.0 o MariaDB 10.x.
- Git.

### 4.2.2 Instalación local

```bash
# 1. Clonar el repositorio
git clone https://github.com/carmendmv/anuncios-juvenil.git
cd anuncios-juvenil

# 2. Instalar dependencias del backend y del frontend
cd backend && npm install
cd ../frontend && npm install
cd ..

# 3. Crear la base de datos en MySQL
#    Desde el cliente de MySQL:
#    CREATE DATABASE citypaj;

# 4. Configurar las variables de entorno del backend
cp backend/.env.example backend/.env
#    Editar backend/.env con los datos de conexión a MySQL.

# 5. Ejecutar migraciones y semillas
npm run db:init

# 6. Iniciar backend y frontend
npm run dev
```

### 4.2.3 Instalación con Docker

El `docker-compose.yml` del proyecto permite levantar toda la aplicación en contenedores:

```bash
docker compose up --build -d
```

Este comando crea tres contenedores:

- `citypaj-mysql`: base de datos MySQL 8.0.
- `citypaj-backend`: API Express en el puerto 3002.
- `citypaj-frontend`: Next.js en el puerto 3001.

El volumen `citypaj_mysql_data` persiste los datos de MySQL. El volcado `citypaj_dump.sql` se carga automáticamente la primera vez que se inicia el contenedor.

**Ilustración 15. Diagrama de implantación con Docker**

[Insertar diagrama con host, contenedores y red interna.]

*Fuente: elaboración propia.*

## 4.3 Pruebas

### 4.3.1 Plan de pruebas

Las pruebas se han diseñado para verificar que cada funcionalidad cumple con los requisitos establecidos. Se han realizado pruebas manuales con la aplicación en ejecución y comprobaciones de API con `curl` y Postman.

### 4.3.2 Pruebas funcionales

**Tabla 17. Pruebas funcionales**

| Código | RF asociado | Precondición | Entrada | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|---|
| P-01 | RF-01 | Base de datos disponible | Email, nombre y contraseña válidos | Usuario creado y almacenado | Usuario creado | OK |
| P-02 | RF-02 | Usuario registrado | Email y contraseña correctos | Tokens JWT devueltos | Tokens recibidos | OK |
| P-03 | RF-04 | Anuncios en base de datos | Acceder a `/anuncios` | Listado mostrado | Listado mostrado | OK |
| P-04 | RF-05 | Anuncios de distintas categorías | Filtro por categoría | Solo anuncios de esa categoría | Filtrado correcto | OK |
| P-05 | RF-06 | Anuncios de distintas provincias | Filtro por provincia | Solo anuncios de esa provincia | Filtrado correcto | OK |
| P-06 | RF-08 | Usuario logueado | Datos de publicación | Anuncio creado | Anuncio creado | OK |
| P-07 | RF-09 | Usuario logueado, anuncio existente | Click en guardar favorito | Anuncio guardado | Guardado correctamente | OK |
| P-08 | RF-11 | Anuncio visible | Motivo del reporte | Reporte registrado | Reporte registrado | OK |
| P-09 | RF-18 | Moderador logueado | Acceso a `/admin/anuncios` | Panel cargado | Panel cargado | OK |
| P-10 | RF-20 | Anuncio en estado `flagged` | Cambio a `approved` | Estado actualizado | Estado actualizado | OK |
| P-11 | RF-22 | Formulario con datos inválidos | Campos vacíos | Mensaje de error | Error mostrado | OK |
| P-12 | RF-23 | Dispositivo móvil y escritorio | Navegación por la web | Interfaz adaptada | Interfaz adaptada | OK |
| P-13 | RF-25 | Volcado `citypaj_dump.sql` cargado | Cargar página de anuncios | Datos reales mostrados | Datos reales mostrados | OK |

### 4.3.3 Pruebas de rendimiento y seguridad básicas

- **Rendimiento**: el listado de anuncios responde en menos de dos segundos en condiciones normales.
- **Seguridad**: las contraseñas se almacenan con `bcryptjs`. La API rechaza peticiones sin token cuando se requiere autenticación. Los tokens JWT tienen una caducidad controlada.
- **Validación de formularios**: el frontend y el backend validan los campos obligatorios y el formato del email.
- **Protección contra inyección SQL**: las consultas utilizan consultas preparadas o parámetros, evitando la concatenación directa de valores.

## 4.4 Manual de usuario

### 4.4.1 Descripción general del sistema

CityPAJ es una plataforma web que permite a los jóvenes consultar y publicar anuncios, descubrir recursos locales, participar en la comunidad y enviar propuestas. El acceso público permite navegar por anuncios y recursos, mientras que el acceso registrado permite publicar, guardar favoritos y participar en la comunidad.

### 4.4.2 Registro e inicio de sesión

1. Acceder a `/acceder`.
2. Rellenar el formulario de registro con email, nombre y contraseña.
3. Confirmar el registro e iniciar sesión con las mismas credenciales.
4. Una vez autenticado, aparecerán las opciones de perfil, favoritos, mis anuncios y publicar.

### 4.4.3 Búsqueda y filtrado

1. Desde la página de inicio o `/anuncios`, introducir un término de búsqueda.
2. Seleccionar una categoría en el selector correspondiente.
3. Seleccionar una comunidad autónoma y, si se desea, una provincia.
4. El listado se actualiza automáticamente con los anuncios que coincidan.

### 4.4.4 Publicar un anuncio

1. Pulsar el botón "Publicar anuncio".
2. Rellenar título, descripción, categoría, provincia, precio y datos de contacto.
3. Enviar el formulario.
4. El sistema aplica el filtro automático y muestra el resultado.

### 4.4.5 Favoritos, reportes y sugerencias

1. En el detalle de un anuncio, pulsar el icono de corazón para guardarlo.
2. Para reportar, pulsar el botón de reporte y seleccionar un motivo.
3. Para enviar una sugerencia, acceder a `/buzon-sugerencias` y rellenar el formulario.

### 4.4.6 Acceso como moderador

1. Acceder a `/moderador/login`.
2. Introducir las credenciales de moderador.
3. Desde `/admin/anuncios`, revisar los anuncios pendientes o reportados.
4. Cambiar el estado y guardar la acción.

## 4.5 Ayuda integrada

En la versión actual, la ayuda se proporciona a través de mensajes informativos, estados vacíos y textos explicativos en formularios. También se han creado las páginas `/terminos` y `/privacidad` con la información legal básica.

Como mejora futura, se propone añadir un apartado de preguntas frecuentes (FAQ) y tooltips contextuales en los formularios más complejos.

# Documento 5. Cierre

## 5.1 Diario de bitácora

La bitácora recoge las tareas realizadas por semanas, los problemas encontrados, las soluciones aplicadas y las horas aproximadas dedicadas.

**Tabla 18. Bitácora semanal**

| Semana | Tareas realizadas | Problemas encontrados | Soluciones aplicadas | Evidencias / commits | Horas |
|---|---|---|---|---|---|
| 1 | Análisis del proyecto, definición de requisitos, primeros mockups | Dificultad para acotar el alcance | Se priorizaron los módulos de anuncios, auth y moderación | Análisis en documento y Figma | 20 |
| 2 | Diseño de base de datos y modelo relacional | Confusión entre tablas de comunidad y anuncios | Se separaron claramente entidades y relaciones | Migraciones iniciales | 18 |
| 3 | Backend: autenticación con JWT | Errores de tipado en TypeScript | Uso de `any` temporal y posterior tipado correcto | `auth-simple.ts` funcional | 22 |
| 4 | Backend: CRUD de anuncios y filtros | Conexión intermitente con MySQL | Configuración del pool de conexiones y variables de entorno | `anuncios-mysql.ts` | 24 |
| 5 | Frontend: home, listado y publicar | Cors entre frontend y backend | Ajuste de cabeceras CORS y variables `NEXT_PUBLIC_API_URL` | Páginas home y anuncios | 26 |
| 6 | Frontend: detalle, favoritos y comunidad | Rutas dinámicas de Next.js | Uso correcto de App Router con `[id]` y `[provincia]` | `anuncios/[id]`, `comunidad` | 24 |
| 7 | Panel de moderación y reportes | Estados de moderación no se reflejaban | Corrección de consultas SQL y actualización de `estado_moderacion` | `admin/anuncios` | 22 |
| 8 | Comunidad, sugerencias y propuestas | Publicaciones anónimas | Registro de IP y nombre opcional | `comunidad/crear` | 20 |
| 9 | Docker, limpieza y README | Dockerfile con puerto incorrecto | Corrección del puerto del backend a 3002 y del docker-compose | `ajuste de Docker para despliegue` | 18 |
| 10 | Memoria, pruebas finales, presentación | Extensión de la memoria | Creación de `MEMORIA_CityPAJ.md` | `memoria final` | 26 |

Total aproximado de horas dedicadas: 240.

## 5.2 Temporalización y desviación

**Tabla 19. Comparación de horas previstas y reales**

| Tarea | Horas previstas | Horas reales | Desviación | Causa | Aprendizaje |
|---|---|---|---|---|---|
| Análisis y requisitos | 15 | 20 | +5 | Requisitos ampliados con Docker | Planificar con mayor margen |
| Diseño de base de datos | 15 | 18 | +3 | Ajustes en relaciones | Mejorar modelado previo |
| Backend | 63 | 70 | +7 | Problemas de conexión con MySQL | Pruebas tempranas de conexión |
| Frontend | 78 | 82 | +4 | Ajustes de diseño responsive | Priorizar componentes reutilizables |
| Panel de moderación | 22 | 24 | +2 | Lógica de estados más compleja | Documentar diagrama de estados |
| Docker y despliegue | 10 | 18 | +8 | Correcciones de Dockerfile y volcado | Probar Docker desde el inicio |
| Memoria | 25 | 26 | +1 | Extensión superior a la prevista | Reutilizar contenido del README |

La desviación total es de aproximadamente 30 horas, principalmente concentrada en el backend y el despliegue. Estos apartados han requerido más tiempo del esperado debido a la necesidad de depurar conexiones y adaptar el proyecto a Docker.

**Ilustración 16. Gráfico de horas previstas frente a horas reales**

[Insertar gráfico de barras comparativo.]

*Fuente: elaboración propia.*

## 5.3 Resultados obtenidos y conclusiones

### 5.3.1 Funcionalidades conseguidas

Al finalizar el proyecto se han implementado correctamente las siguientes funcionalidades:

- Registro e inicio de sesión de usuarios con JWT.
- Consulta de anuncios con filtros por categoría, comunidad autónoma, provincia y texto.
- Publicación de anuncios con validación y filtro automático.
- Sistema de favoritos y reportes.
- Comunidad con publicaciones y comentarios, incluyendo publicaciones anónimas.
- Buzón de sugerencias y propuestas ciudadanas.
- Directorio de recursos y eventos.
- Panel de moderación con control de estados.
- Diseño responsive y moderno.
- Despliegue con Docker y carga automática de datos reales.

### 5.3.2 Conocimientos adquiridos

Durante el desarrollo de CityPAJ se han consolidado los siguientes conocimientos:

- Arquitectura full-stack con Next.js y Express.
- Autenticación basada en JWT y gestión de roles.
- Diseño y consulta de bases de datos relacionales con MySQL.
- Comunicación frontend-backend mediante API REST.
- Uso de TypeScript para tipado estático en frontend y backend.
- Contenerización con Docker y Docker Compose.
- Control de versiones con Git y publicación en GitHub.

### 5.3.3 Dificultades y resolución

Las principales dificultades han sido:

- **Conexión entre frontend y backend**: se resolvió ajustando las variables de entorno y las cabeceras CORS.
- **Conexión a MySQL**: se resolvió centralizando la configuración del pool y verificando credenciales.
- **Moderación de estados**: se resolvió con un diagrama de estados claro y consultas SQL controladas.
- **Docker**: se resolvió corrigiendo puertos y asegurando que el volcado `citypaj_dump.sql` se monta correctamente.

### 5.3.4 Mejoras futuras

A pesar de que el proyecto cumple con los objetivos planteados, existen líneas de mejora que pueden abordarse en el futuro:

- Panel institucional completo para administraciones.
- Estadísticas avanzadas de uso y moderación.
- Sistema de notificaciones por email.
- Verificación de recursos y entidades.
- Mapa territorial con geolocalización de anuncios.
- Accesibilidad avanzada (navegación completa por teclado, lectores de pantalla).
- Tests automatizados más completos (Jest, Playwright, Cypress).
- Ampliación a PWA para uso desde dispositivos móviles.
- Internacionalización a otros idiomas.

# Bibliografía

A continuación se recogen las principales fuentes consultadas durante el desarrollo del proyecto. Las fechas de consulta corresponden al periodo de realización del trabajo, entre septiembre de 2025 y julio de 2026.

- **Documentación oficial de React**. Fecha de consulta: [indicar fecha]. Recuperado de https://react.dev
- **Documentación oficial de Next.js**. Fecha de consulta: [indicar fecha]. Recuperado de https://nextjs.org/docs
- **Documentación oficial de Node.js**. Fecha de consulta: [indicar fecha]. Recuperado de https://nodejs.org/en/docs
- **Documentación oficial de Express**. Fecha de consulta: [indicar fecha]. Recuperado de https://expressjs.com
- **Documentación oficial de MySQL**. Fecha de consulta: [indicar fecha]. Recuperado de https://dev.mysql.com/doc
- **Documentación oficial de TypeScript**. Fecha de consulta: [indicar fecha]. Recuperado de https://www.typescriptlang.org/docs
- **Documentación oficial de Tailwind CSS**. Fecha de consulta: [indicar fecha]. Recuperado de https://tailwindcss.com/docs
- **Documentación oficial de Figma**. Fecha de consulta: [indicar fecha]. Recuperado de https://help.figma.com
- **Reglamento General de Protección de Datos (RGPD)**. Fecha de consulta: [indicar fecha]. Recuperado de https://gdpr-info.eu
- **Ley Orgánica 3/2018, de Protección de Datos Personales y Garantía de los Derechos Digitales (LOPDGDD)**. Fecha de consulta: [indicar fecha]. Recuperado de https://www.boe.es/eli/es/lo/2018/12/05/3/con
- **Documentación oficial de Docker**. Fecha de consulta: [indicar fecha]. Recuperado de https://docs.docker.com
- **Documentación oficial de Lucide**. Fecha de consulta: [indicar fecha]. Recuperado de https://lucide.dev
- **Mozilla Developer Network (MDN)**. Fecha de consulta: [indicar fecha]. Recuperado de https://developer.mozilla.org

# Anexos

## Anexo I. Scripts SQL

Los scripts de creación de tablas se encuentran en el directorio `backend/migrations/`. El volcado completo de datos se encuentra en `citypaj_dump.sql`.

Ejemplo de fragmento del script `002_create_mvp_tables.sql`:

```sql
CREATE TABLE IF NOT EXISTS anuncios (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  usuario_id VARCHAR(36) NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  categoria ENUM('ocio','servicios','formacion','empleo','comunidad','transporte','vivienda','salud','tecnologia','otros') NOT NULL,
  comunidad_id INT NOT NULL,
  provincia_id INT NOT NULL,
  estado_moderacion ENUM('pending','approved','rejected','flagged') DEFAULT 'pending',
  visible TINYINT(1) DEFAULT 1,
  creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Anexo II. Capturas de Figma

[Insertar capturas de los mockups elaborados en Figma: home, listado, detalle, login, panel de moderación.]

*Fuente: elaboración propia.*

## Anexo III. Capturas de la aplicación

[Insertar capturas de pantalla de la aplicación funcionando: home, listado, publicar, perfil, panel de moderación, vista móvil.]

*Fuente: elaboración propia.*

## Anexo IV. Capturas de consola

[Insertar capturas de comandos de arranque, `docker compose`, `git log` y/o resultados de `npx tsc --noEmit`.]

*Fuente: elaboración propia.*

## Anexo V. Fragmentos de código relevantes

[Insertar fragmentos de código relevantes, como el controlador de autenticación, el filtro de anuncios o la conexión a la base de datos.]

*Fuente: elaboración propia.*

## Anexo VI. Repositorio GitHub

- URL del repositorio: https://github.com/carmendmv/anuncios-juvenil.git
- Rama principal: `main`
- Último commit relevante: `3e8e4ad` (instrucciones de despliegue con Docker y datos reales)

## Anexo VII. Credenciales demo

Las siguientes credenciales se generan mediante el script `backend/scripts/seed-demo.js` y están pensadas para entornos de desarrollo o demostración.

| Rol | Email | Contraseña |
|---|---|---|
| Usuario | usuario@citypaj.demo | demo123 |
| Moderador | moderador@citypaj.demo | demo123 |
| Administrador | admin@citypaj.demo | demo123 |

Estas credenciales no deben utilizarse en producción.

## Anexo VIII. Tabla completa de pruebas

[Insertar tabla ampliada con todas las pruebas realizadas, incluyendo acceso denegado, responsive, error 404 y filtros avanzados.]

*Fuente: elaboración propia.*
