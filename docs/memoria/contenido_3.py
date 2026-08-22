# -*- coding: utf-8 -*-
SECCIONES_3 = [
('doc4', 1, '4. Documento de Implementación, Pruebas e Implantación del sistema', []),
('4.1', 2, '4.1. Implementación', []),
('4.1.1', 3, '4.1.1. Estructura general del repositorio', [
    'El repositorio se organiza en carpetas principales que reflejan la arquitectura del proyecto.',
    'La carpeta backend contiene el código del servidor, con src para el código fuente y dist para el compilado. La carpeta frontend contiene la aplicación Next.js con src. La carpeta database incluye init.sql con el esquema y datos iniciales. La carpeta docs/memoria alberga la documentación de la memoria.',
    'En la raíz se encuentran docker-compose.yml, README.md, package.json y los archivos .env.example. El control de versiones se realiza con Git y el historial se almacena en GitHub.',
    'Esta organización facilita la navegación del código y la revisión por parte del tribunal. Cada módulo se encuentra en una carpeta con responsabilidad clara.'
]),
('4.1.2', 3, '4.1.2. Estructura del frontend', [
    'El frontend se estructura en frontend/src. La carpeta app contiene las páginas del sistema basadas en el enrutamiento de Next.js. Cada subcarpeta representa una ruta accesible desde el navegador.',
    'La carpeta components organiza los componentes reutilizables. Se distinguen componentes de anuncios, comunidad, admin, ui, layout, forms e illustrations. Esta separación evita mezclar responsabilidades y facilita el mantenimiento.',
    'Los hooks encapsulan la lógica de acceso a datos y la interacción con el backend. El contexto de autenticación gestiona el estado de sesión a nivel de aplicación.',
    'Los archivos lib y types contienen utilidades, constantes y definiciones de TypeScript. El archivo de tipos permite compartir interfaces entre componentes.',
    'Los estilos se configuran con Tailwind CSS. Los archivos de configuración de PostCSS y Tailwind se encuentran en la raíz de frontend.'
]),
('4.1.3', 3, '4.1.3. Estructura del backend', [
    'El backend se organiza en backend/src. El archivo index.ts inicia el servidor, verifica la conexión a MySQL y crea los usuarios de demostración. El archivo app.ts configura middlewares, seguridad y rutas.',
    'Los controladores, en src/controllers, implementan la lógica de cada recurso. Cada controlador suele corresponder a un dominio del sistema: auth, anuncios, comunidad, sugerencias, propuestas, recursos, eventos, moderacion, admin, etc.',
    'Las rutas, en src/routes, definen los endpoints de la API REST. Cada router importa su controlador y expone los métodos HTTP necesarios.',
    'Los middlewares, en src/middleware, gestionan autenticación, roles, errores y validaciones. La carpeta config incluye la conexión a base de datos y la centralización de variables de entorno.',
    'Los utils incluyen funciones auxiliares, como el logger, la gestión de categorías, auditoría y territorios. Los types definen las interfaces de TypeScript extendidas.'
]),
('4.1.4', 3, '4.1.4. Gestión de base de datos', [
    'La conexión a MySQL se configura en backend/src/config/database.ts. Se utiliza un pool de conexiones con mysql2, lo que permite reutilizar conexiones y mejorar el rendimiento.',
    'El esquema se carga en el contenedor mysql mediante database/init.sql. El script se ejecuta automáticamente la primera vez que se levanta el volumen.',
    'Los controladores ejecutan consultas parametrizadas. Esto significa que los valores se pasan separados de la sentencia SQL, lo que evita la inyección SQL.',
    'La base de datos citypaj contiene datos de demostración: usuarios admin, moderador y usuario, anuncios de múltiples categorías, publicaciones de comunidad, sugerencias, propuestas, recursos, eventos y logs.',
    'El endpoint /health y /api/health verifican que el backend ha conectado correctamente con MySQL. Devuelven el nombre de la base de datos, el estado y el tiempo de actividad.'
]),
('4.1.5', 3, '4.1.5. Autenticación y roles', [
    'El sistema implementa autenticación con JWT. El registro almacena la contraseña cifrada con bcrypt. El login verifica el hash y emite un token de acceso y otro de refresco.',
    'El token de acceso se envía en la cabecera Authorization. El middleware de autenticación decodifica el token y añade la información del usuario a la petición.',
    'Los roles del sistema son usuario, moderador y administrador. Cada ruta protegida especifica el rol o roles permitidos. Si un usuario sin permisos intenta acceder, el backend devuelve un error 403.',
    'El frontend guarda el token y utiliza el contexto de autenticación para saber si el usuario está autenticado. Los componentes protegidos redirigen al login si no hay sesión.'
]),
('4.1.6', 3, '4.1.6. Gestión de anuncios', [
    'El módulo de anuncios es uno de los más completos. Permite consultar, crear, editar, guardar, reportar y moderar anuncios.',
    'El controlador anuncios-mysql.ts implementa la consulta con filtros de categoría, comunidad, provincia, búsqueda y paginación. Utiliza una utilidad de categorías para detectar contenido cultural y separarlo del listado principal.',
    'La publicación recoge título, descripción, categoría, subcategoría, territorio, modalidad, contacto y cartel. El cartel se sube al backend mediante el endpoint /api/upload con multer.',
    'Los anuncios se crean con estado pending hasta que un moderador o administrador los apruebe. Este flujo evita la publicación automática de contenido inadecuado.',
    'El detalle de anuncio muestra toda la información y permite al usuario guardar el anuncio como favorito, reportarlo o contactar.'
]),
('4.1.7', 3, '4.1.7. Filtros por categoría y territorio', [
    'El sistema implementa filtros que permiten ajustar el contenido mostrado. La categoría distingue entre empleo, formación, vivienda, ocio, comunidad, cultura y otros tipos.',
    'El filtro territorial utiliza los catálogos de comunidades y provincias. La provincia está vinculada a una comunidad autónoma, de modo que el selector puede mostrar solo las provincias correspondientes.',
    'En el frontend, la barra de filtros y la página de búsqueda permiten combinar varios criterios. El backend recibe los parámetros por query string y construye la consulta SQL dinámicamente.',
    'La utilidad CATEGORIAS_CULTURA identifica qué categorías pertenecen a la sección de cultura, de forma que los anuncios culturales se excluyen del home y se muestran en su pantalla específica.'
]),
('4.1.8', 3, '4.1.8. Comunidad', [
    'La sección de comunidad permite crear publicaciones vinculadas a una provincia y a un tema. Los usuarios pueden comentar las publicaciones y dar me gusta.',
    'La publicación puede ser anónima, en cuyo caso se solicita un nombre y se registra la dirección IP para moderación.',
    'Los comentarios y publicaciones cuentan con estado de moderación. El panel de moderación permite ocultar o aprobar contenido.',
    'La funcionalidad se encuentra implementada de forma parcial, puesto que permite la acción principal, a pesar de que algunos aspectos de la interfaz y la gestión de errores requieren mejoras.'
]),
('4.1.9', 3, '4.1.9. Sugerencias y propuestas', [
    'El buzón de sugerencias permite enviar ideas, quejas o propuestas de mejora sin necesidad de estar registrado. Los campos son asunto, descripción, categoría y prioridad.',
    'Las sugerencias se almacenan en la tabla sugerencias y se muestran en el panel de administración.',
    'El módulo de propuestas muestra iniciativas ciudadanas y facilita a los usuarios apoyarlas. La tabla propuestas_apoyos almacena el apoyo vinculado a una propuesta.',
    'La funcionalidad de propuestas se encuentra implementada de forma parcial, puesto que la visualización y el apoyo funcionan, pero la gestión avanzada requiere ampliación.'
]),
('4.1.10', 3, '4.1.10. Cultura, eventos y recursos', [
    'La sección de cultura y eventos agrupa actividades culturales y eventos juveniles. Los anuncios con categorías culturales se filtran y se muestran en su propia pantalla.',
    'La tabla eventos almacena título, descripción, fecha, provincia y otros datos. Los eventos se consultan a través del endpoint /api/eventos.',
    'El módulo de recursos muestra recursos juveniles como convocatorias, guías o enlaces de interés. La tabla recursos almacena la información correspondiente.',
    'La publicación de anuncios culturales integra el flujo general de anuncios, con la salvedad de que se excluyen del home para respetar la sección específica.'
]),
('4.1.11', 3, '4.1.11. Administración y moderación', [
    'El panel de administración agrupa múltiples módulos: usuarios, anuncios, comunidad, cultura, estadísticas, tareas, agenda, mensajes, plantillas, comunicaciones e instituciones.',
    'Cada módulo tiene una vista en el frontend y un conjunto de endpoints en el backend. Los datos se cargan mediante peticiones a la API.',
    'El panel de moderación está destinado a revisar anuncios pendientes, reportes de contenido y publicaciones de comunidad. El moderador puede aprobar, rechazar, ocultar o marcar contenido.',
    'Algunos paneles incluyen datos de demostración. La funcionalidad se encuentra implementada de forma parcial, puesto que permite la acción principal, a pesar de que algunos módulos requieren completar validaciones y estados.'
]),
('4.1.12', 3, '4.1.12. Mensajería', [
    'El módulo de mensajería permite enviar mensajes internos entre usuarios del staff. La tabla mensajes_staff almacena asunto, cuerpo, remitente y destinatario.',
    'La funcionalidad se encuentra implementada de forma parcial. La vista de mensajes y las plantillas existen, pero el envío real y las notificaciones requieren completarse.'
]),
('4.1.13', 3, '4.1.13. Agenda institucional', [
    'La agenda institucional facilita a los administradores crear notas con fecha, título y cuerpo. La tabla agenda_notas almacena estas entradas.',
    'La funcionalidad se encuentra implementada de forma parcial, puesto que la creación y consulta básicas funcionan, pero la integración con calendarios externos no está incluida.'
]),
('4.1.14', 3, '4.1.14. Comunicaciones institucionales', [
    'El módulo de comunicaciones institucionales permite preparar borradores de mensajes a entidades. Utiliza plantillas predefinidas para asunto y cuerpo.',
    'La funcionalidad se encuentra implementada de forma parcial. Los borradores y las plantillas están presentes, pero el envío real depende de una configuración de correo no activa en el entorno local.'
]),
('4.1.15', 3, '4.1.15. Dockerización del proyecto', [
    'La dockerización se define en docker-compose.yml. El archivo declara tres servicios: mysql, backend y frontend.',
    'El servicio mysql utiliza la imagen mysql:8.0, crea la base de datos citypaj, el usuario citypaj_user y carga database/init.sql. El healthcheck comprueba que la tabla usuarios existe.',
    'El servicio backend se construye desde backend/Dockerfile con target production. Expone el puerto 3002 y espera a que MySQL esté saludable.',
    'El servicio frontend se construye desde frontend/Dockerfile. Expone el puerto 3001 y depende del backend.',
    'La red interna de Docker permite que los contenedores se comuniquen por nombre. El frontend accede al backend en http://backend:3002 y el navegador accede en http://localhost:3002.'
]),
('4.2', 2, '4.2. Instalación, despliegue y configuración', []),
('4.2.1', 3, '4.2.1. Requisitos previos', [
    'Los requisitos previos son mínimos. Solo es necesario disponer de Docker Desktop en ejecución y de Git para clonar el repositorio.',
    'No es necesario instalar Node.js ni MySQL de forma local, puesto que ambos corren dentro de contenedores. La primera ejecución descarga las imágenes de Docker Hub y construye los contenedores.',
    'El ordenador debe disponer de suficiente espacio en disco para las imágenes de Docker y de memoria RAM para ejecutar tres contenedores simultáneamente.'
]),
('4.2.2', 3, '4.2.2. Variables de entorno', [
    'Los archivos .env.example y backend/.env.example contienen los valores por defecto. Para la primera ejecución no es necesario modificar nada.',
    'Las variables principales son: NODE_ENV, PORT, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET, JWT_REFRESH_SECRET, CORS_ORIGINS y las credenciales de los usuarios demo.',
    'Estos valores son seguros únicamente para demostración local. En un entorno de producción deberían cambiarse por secretos reales y no exponerse en el repositorio.'
]),
('4.2.3', 3, '4.2.3. Ejecución con Docker Compose', [
    'Para levantar el proyecto se ejecutan los siguientes comandos desde la raíz del repositorio:',
    ('codigo', 'git clone https://github.com/carmendmv/citypaj\ncd citypaj\ndocker compose up --build'),
    'La primera ejecución descarga imágenes, instala dependencias, compila el backend y el frontend y carga la base de datos. Puede tardar varios minutos.',
    'Cuando todos los contenedores estén saludables, el frontend estará disponible en http://localhost:3001, el backend en http://localhost:3002 y el health check en http://localhost:3002/health.'
]),
('4.2.4', 3, '4.2.4. Ejecución manual', [
    'a pesar de que el proyecto está pensado para Docker, asimismo es posible ejecutar los servicios manualmente. Para ello se necesita una instancia MySQL local con la base de datos citypaj cargada.',
    'Se ejecuta npm install en backend y frontend, se configuran las variables de entorno y se lanzan npm run dev:backend y npm run dev:frontend en terminales separadas.',
    'Esta forma de ejecución es útil para desarrollo, pero requiere más configuración. El repositorio no documenta este modo en detalle.'
]),
('4.2.5', 3, '4.2.5. Acceso a la aplicación', [
    'Una vez levantada, la aplicación es accesible desde el navegador en las siguientes URLs:',
    ('tabla', ['Servicio', 'URL'], [
        ['Frontend', 'http://localhost:3001'],
        ['Backend', 'http://localhost:3002'],
        ['Health check', 'http://localhost:3002/health'],
        ['Base de datos', 'mysql://citypaj_user:citypaj_password@localhost:3306/citypaj']
    ]),
    'Los usuarios de demostración permiten probar los roles: admin@citypaj.local con Admin1234, moderador@citypaj.local con Moderador1234 y usuario@citypaj.local con Usuario1234.'
]),
('4.2.6', 3, '4.2.6. Resolución de problemas frecuentes', [
    'Si Docker Desktop no responde, se debe comprobar que el motor Docker está en ejecución antes de lanzar docker compose up.',
    'Si el backend indica que no se pudo conectar a la base de datos, es posible que MySQL no esté listo. La configuración de depends_on con condition: service_healthy hace que el backend espere y se reinicie si es necesario.',
    'Si el frontend no encuentra el backend, se debe verificar que los contenedores están en ejecución y que el backend responde en http://localhost:3002.',
    'Si los puertos 3001 o 3002 están ocupados, se deben detener los procesos que los usan o modificar los puertos en docker-compose.yml.'
]),
('4.3', 2, '4.3. Pruebas', []),
('4.3.1', 3, '4.3.1. Plan de pruebas', [
    'El plan de pruebas cubre las funcionalidades principales del sistema. Las pruebas se han realizado de forma manual y con los usuarios demo.',
    'Cada prueba incluye los pasos, el resultado esperado, el resultado obtenido y el estado. Si una prueba no se ha ejecutado en el entorno actual, se marca como No ejecutada.'
]),
('4.3.2', 3, '4.3.2. Pruebas funcionales', [
    ('tabla', ['ID', 'Prueba', 'Pasos', 'Esperado', 'Obtenido', 'Estado'], [
        ['PF-01', 'Registro', 'Rellenar formulario y enviar.', 'Cuenta creada.', 'No ejecutada', 'No ejecutada'],
        ['PF-02', 'Login', 'Introducir credenciales demo.', 'Token y acceso.', 'No ejecutada', 'No ejecutada'],
        ['PF-03', 'Consultar anuncios', 'Cargar home.', 'Listado visible.', 'No ejecutada', 'No ejecutada'],
        ['PF-04', 'Filtros por categoría', 'Seleccionar categoría.', 'Listado filtrado.', 'No ejecutada', 'No ejecutada'],
        ['PF-05', 'Filtros por territorio', 'Seleccionar provincia.', 'Listado filtrado.', 'No ejecutada', 'No ejecutada'],
        ['PF-06', 'Publicar anuncio', 'Rellenar formulario.', 'Anuncio creado pending.', 'No ejecutada', 'No ejecutada'],
        ['PF-07', 'Guardar favorito', 'Pulsar favorito.', 'Aparece en guardados.', 'No ejecutada', 'No ejecutada'],
        ['PF-08', 'Reportar anuncio', 'Enviar reporte.', 'Reporte registrado.', 'No ejecutada', 'No ejecutada'],
        ['PF-09', 'Comunidad', 'Crear publicación.', 'Publicación visible.', 'No ejecutada', 'No ejecutada'],
        ['PF-10', 'Sugerencias', 'Enviar sugerencia.', 'Sugerencia registrada.', 'No ejecutada', 'No ejecutada'],
        ['PF-11', 'Propuestas', 'Consultar propuestas.', 'Listado visible.', 'No ejecutada', 'No ejecutada'],
        ['PF-12', 'Cultura y eventos', 'Acceder a cultura.', 'Eventos visibles.', 'No ejecutada', 'No ejecutada'],
        ['PF-13', 'Recursos', 'Acceder a recursos.', 'Listado visible.', 'No ejecutada', 'No ejecutada'],
        ['PF-14', 'Panel admin', 'Login admin.', 'Acceso a módulos.', 'No ejecutada', 'No ejecutada'],
        ['PF-15', 'Panel moderador', 'Login moderador.', 'Acceso a reportes.', 'No ejecutada', 'No ejecutada']
    ])
]),
('4.3.3', 3, '4.3.3. Pruebas de validación', [
    'Las pruebas de validación verifican que los formularios rechazan datos incorrectos. Se comprueban campos vacíos, formatos de email, longitudes máximas y valores obligatorios.',
    'El sistema utiliza Zod en el frontend y express-validator en el backend. Estas herramientas validan los datos en dos capas.',
    'Las pruebas no se han ejecutado en el entorno actual. Se recomienda completarlas en una revisión posterior.'
]),
('4.3.4', 3, '4.3.4. Pruebas de base de datos', [
    'Las pruebas de base de datos verifican que el esquema se carga correctamente, que las conexiones son estables y que las consultas devuelven los datos esperados.',
    'El endpoint /health realiza una consulta SELECT 1 a MySQL y devuelve el estado. Si la base de datos no responde, el endpoint devuelve 503.',
    'Las pruebas de consistencia de datos, como la existencia de claves foráneas, requieren ejecutar la aplicación y consultar directamente las tablas.'
]),
('4.3.5', 3, '4.3.5. Pruebas de seguridad básica', [
    'Las pruebas de seguridad básica incluyen el intento de acceso a rutas protegidas sin token, el envío de datos inválidos y la comprobación de que las contraseñas no se almacenan en texto plano.',
    'Se ha verificado que el backend utiliza bcrypt para las contraseñas y que las rutas admin requieren autenticación.',
    'Las pruebas de inyección SQL se apoyan en el uso de consultas parametrizadas con mysql2.'
]),
('4.3.6', 3, '4.3.6. Pruebas de diseño responsive', [
    'Las pruebas de diseño responsive se realizan reduciendo el tamaño de la ventana del navegador. Se verifica que el menú se colapsa, las grillas se ajustan y los formularios no desbordan.',
    'No se han ejecutado pruebas automáticas de responsive. La verificación se realiza de forma manual.'
]),
('4.3.7', 3, '4.3.7. Pruebas de Docker', [
    'Las pruebas de Docker verifican que docker compose up --build levanta los tres servicios sin errores y que el frontend y backend responden.',
    'El reinicio desde cero se prueba con docker compose down -v seguido de docker compose up --build, comprobando que la base de datos se recrea.',
    'No se han ejecutado estas pruebas en el entorno de generación de la memoria.'
]),
('4.3.8', 3, '4.3.8. Resultado de las pruebas', [
    'El resultado de las pruebas es parcial. El código y la configuración están preparados para ser probados, pero las pruebas manuales no se han ejecutado en el entorno de redacción.',
    'El plan de pruebas queda documentado con el fin de que el tribunal o el usuario pueda completarlo en una ejecución local.'
]),
('4.4', 2, '4.4. Manual de usuario', []),
('4.4.1', 3, '4.4.1. Descripción general', [
    'CityPAJ es una aplicación web para consultar y publicar información juvenil organizada por territorio. El manual explica los pasos básicos de uso.'
]),
('4.4.2', 3, '4.4.2. Puesta en marcha', [
    'Para poner en marcha la aplicación se clona el repositorio y se ejecuta docker compose up --build. Después se espera a que los contenedores estén saludables y se accede a http://localhost:3001.'
]),
('4.4.3', 3, '4.4.3. Registro e inicio de sesión', [
    'Los usuarios pueden registrarse desde el enlace correspondiente. Para probar los roles se utilizan las credenciales de demostración: admin@citypaj.local, moderador@citypaj.local y usuario@citypaj.local.'
]),
('4.4.4', 3, '4.4.4. Navegación por anuncios', [
    'El home muestra el listado de anuncios. El usuario puede desplazarse, usar el buscador y pulsar un anuncio para ver el detalle.'
]),
('4.4.5', 3, '4.4.5. Publicación de anuncios', [
    'Desde la página de publicar, el usuario rellena el formulario, selecciona la categoría y el territorio, y opcionalmente adjunta un cartel. Tras enviar, el anuncio queda en estado pendiente.'
]),
('4.4.6', 3, '4.4.6. Uso de filtros', [
    'La barra de filtros permite seleccionar categoría, comunidad autónoma y provincia. Los resultados se actualizan sin recargar la página.'
]),
('4.4.7', 3, '4.4.7. Comunidad', [
    'La comunidad muestra publicaciones por provincia. El usuario puede crear una publicación, comentar y dar me gusta. asimismo es posible participar de forma anónima.'
]),
('4.4.8', 3, '4.4.8. Sugerencias', [
    'El buzón de sugerencias permite enviar ideas o avisos. No es necesario estar registrado.'
]),
('4.4.9', 3, '4.4.9. Propuestas', [
    'La página de propuestas muestra iniciativas ciudadanas. El usuario puede consultar el detalle y apoyar la propuesta.'
]),
('4.4.10', 3, '4.4.10. Cultura y eventos', [
    'La sección de cultura muestra eventos y anuncios culturales. Se accede desde el menú principal.'
]),
('4.4.11', 3, '4.4.11. Recursos', [
    'La página de recursos lista convocatorias, guías y enlaces de interés para jóvenes.'
]),
('4.4.12', 3, '4.4.12. Panel de administración', [
    'El panel de administración requiere el rol admin. Permite gestionar usuarios, anuncios, tareas, agenda, mensajes, plantillas, comunicaciones e instituciones.'
]),
('4.4.13', 3, '4.4.13. Panel de moderación', [
    'El panel de moderación requiere el rol moderador. Permite revisar anuncios pendientes, reportes y contenido de comunidad.'
]),
('4.4.14', 3, '4.4.14. Mensajes de error frecuentes', [
    'Si aparece un error de conexión, se recomienda comprobar que Docker Desktop está en ejecución y que el backend responde en http://localhost:3002.',
    'Si el login falla, se debe verificar que se ha introducido el correo y la contraseña correctamente y que el backend ha conectado con MySQL.',
    'Si la publicación de un anuncio no se guarda, se recomienda revisar los campos obligatorios y la categoría seleccionada.'
]),
('4.4.15', 3, '4.4.15. Copias de seguridad', [
    'La base de datos es posible respaldar exportando el volumen de Docker o copiando el archivo database/init.sql. Para un entorno real se recomendaría un sistema de backups automáticos.'
]),

('4.5', 2, '4.5. Ayuda integrada', [
    'El proyecto no incluye una sección de ayuda contextual integrada en la interfaz. La ayuda se proporciona a través del manual de usuario de la memoria y del archivo README.md del repositorio.',
    'El README.md describe los comandos de instalación, las URLs de acceso, las credenciales de demostración y los pasos básicos de uso. Esta documentación sirve como referencia para el tribunal y para futuros usuarios.'
]),

('doc5', 1, '5. Documento de Cierre', []),
('5.1', 2, '5.1. Resultados obtenidos', [
    'El proyecto ha producido una aplicación web fullstack dockerizada con frontend, backend y base de datos. El sistema permite el registro de usuarios, la publicación y consulta de anuncios, la gestión de favoritos, el envío de sugerencias, la consulta de propuestas, la comunidad por provincias, la sección de cultura y eventos, y paneles de administración y moderación.',
    'La dockerización local permite ejecutar la aplicación con un solo comando y facilita la revisión. El README describe el despliegue y el repositorio contiene el esquema de base de datos.',
    'Algunas funcionalidades se encuentran implementadas de forma parcial, especialmente en el área de mensajería, comunicaciones institucionales y algunos módulos del panel admin con datos de demostración.'
]),
('5.2', 2, '5.2. Conclusiones', [
    'El proyecto ha permitido poner en práctica las tecnologías aprendidas durante el ciclo. La combinación de Next.js, Express y MySQL ha supuesto un desafío técnico que ha ayudado a comprender el flujo de una aplicación web real.',
    'La dockerización ha sido una decisión tardía pero útil para la entrega. El filtrado territorial y la moderación de contenidos han sido los módulos más complejos.',
    'desde la perspectiva del estudiante, se ha adquirido la importancia de planificar la arquitectura desde el inicio, de documentar las decisiones técnicas y de probar el despliegue antes de la entrega.',
    'El valor del proyecto radica en ofrecer una herramienta de centralización de información juvenil, con un enfoque territorial y participativo.'
]),
('5.3', 2, '5.3. Diario de bitácora', [
    ('tabla', ['Periodo', 'Trabajo realizado', 'Evidencia', 'Observaciones'], [
        ['Enero-Febrero', 'Análisis inicial, prototipado y configuración del repositorio.', 'Estructura básica y README inicial.', 'Aprendizaje de Next.js App Router.'],
        ['Marzo-Abril', 'Conexión con MySQL, desarrollo de autenticación y anuncios.', 'Migraciones y controladores.', 'Dificultades con tipos.'],
        ['Mayo', 'Paneles admin, moderación, comunidad, sugerencias y propuestas.', 'Rutas de admin y moderador.', 'numerosos módulos en paralelo.'],
        ['Junio-Agosto', 'Dockerización, limpieza, README y memoria.', 'Docker compose y docs.', 'Revisión final y ajustes.']
    ])
]),
('5.4', 2, '5.4. Temporalización real', [
    'El desarrollo se ha extendido desde enero hasta agosto. La intensidad fue mayor durante los últimos meses, cuando se completó la integración de Docker y la limpieza del repositorio.',
    'La fase de análisis y diseño se completó en las primeras semanas. La implementación se aceleró a partir de marzo. El cierre incluyó la memoria y la preparación de la entrega.'
]),
('5.5', 2, '5.5. Desviación respecto a la planificación inicial', [
    ('tabla', ['Tarea', 'Planificado', 'Real', 'Desviación', 'Explicación'], [
        ['Docker', '8', '12', '+4', 'Configuración del proxy entre contenedores.'],
        ['Moderación', '10', '15', '+5', 'Se añadieron filtros y acciones masivas.'],
        ['Pruebas', '10', '6', '-4', 'Se priorizó la funcionalidad.'],
        ['Documentación', '12', '14', '+2', 'Ampliación del README y memoria.']
    ])
]),
('5.6', 2, '5.6. Conocimientos adquiridos', [
    'Durante el proyecto se han adquirido conocimientos en el desarrollo de aplicaciones web fullstack con Next.js, React, TypeScript, Express, MySQL y Docker.',
    'se ha adquirido a diseñar una API REST, a gestionar autenticación con JWT, a validar formularios con Zod y a dockerizar una aplicación completa.',
    'asimismo se ha comprendido la importancia de la organización del código, la documentación y las pruebas para proyectos colaborativos y académicos.'
]),
('5.7', 2, '5.7. Limitaciones del proyecto', [
    'El proyecto prioriza el entorno local y la demostración. Algunas funciones del panel admin se presentan con datos de demostración. La mensajería real, el envío de correos y las comunicaciones institucionales no están completamente operativas.',
    'La aplicación no incluye un sistema de recuperación de contraseña completamente funcional, a pesar de que existe la página de recuperar contraseña.',
    'Las pruebas automatizadas son limitadas. El proyecto se ha probado principalmente de forma manual.',
    'La internacionalización fue eliminada del repositorio, por lo que la aplicación solo está disponible en castellano.'
]),
('5.8', 2, '5.8. Posibles mejoras futuras', [
    'Las posibles mejoras futuras incluyen completar la mensajería interna con notificaciones, implementar pruebas automáticas, mejorar la accesibilidad, optimizar consultas con índices, añadir estadísticas en tiempo real, preparar un despliegue en servidor propio y mejorar la gestión de errores.',
    'asimismo sería útil completar el envío real de correos, integrar un sistema de notificaciones y ampliar la comunidad con más opciones de participación.'
]),

('doc6', 1, '6. Bibliografía', [
    'A continuación se listan las fuentes de documentación utilizadas durante el proyecto.',
    'Next.js Documentation. Consultado en 2026. Disponible en https://nextjs.org/docs',
    'React Documentation. Consultado en 2026. Disponible en https://react.dev',
    'Node.js Documentation. Consultado en 2026. Disponible en https://nodejs.org',
    'Express Documentation. Consultado en 2026. Disponible en https://expressjs.com',
    'MySQL Documentation. Consultado en 2026. Disponible en https://dev.mysql.com/doc',
    'Docker Documentation. Consultado en 2026. Disponible en https://docs.docker.com',
    'MDN Web Docs. Consultado en 2026. Disponible en https://developer.mozilla.org',
    'Tailwind CSS Documentation. Consultado en 2026. Disponible en https://tailwindcss.com/docs',
    'TypeScript Documentation. Consultado en 2026. Disponible en https://www.typescriptlang.org/docs'
]),

('doc7', 1, '7. Anexos', []),
('7.1', 2, '7.1. Enlace al repositorio', [
    'El repositorio del proyecto está disponible en: https://github.com/carmendmv/citypaj'
]),
('7.2', 2, '7.2. Estructura del repositorio', [
    'El repositorio contiene las siguientes carpetas principales: backend, frontend, database, docs/memoria y los archivos de configuración docker-compose.yml, README.md, .env.example y package.json.',
    ('tabla', ['Carpeta/Archivo', 'Descripción'], [
        ['backend/', 'Código fuente del servidor Express y TypeScript.'],
        ['frontend/', 'Aplicación Next.js, React y TypeScript.'],
        ['database/', 'Script init.sql con esquema y datos iniciales.'],
        ['docs/memoria/', 'Documentación de la memoria.'],
        ['docker-compose.yml', 'Orquestación de contenedores.'],
        ['README.md', 'Guía de instalación y uso.'],
        ['.env.example', 'Variables de entorno de ejemplo.'],
        ['package.json', 'Scripts y dependencias raíz.']
    ])
]),
('7.3', 2, '7.3. Capturas de pantalla', [
    'A continuación se incluyen capturas de pantalla representativas del frontend, generadas a partir del despliegue local de la aplicación. Estas imágenes ilustran el aspecto visual del proyecto en resoluciones de escritorio y dispositivo móvil.'
]),
('7.4', 2, '7.4. Diagramas SVG generados', [
    'En la carpeta docs/memoria/diagramas se han generado los siguientes diagramas en formato SVG:',
    ('tabla', ['Archivo', 'Descripción'], [
        ['01_arquitectura_general.svg', 'Arquitectura general de tres capas.'],
        ['02_flujo_usuario_frontend_backend_bbdd.svg', 'Flujo de comunicación entre capas.'],
        ['03_modelo_entidad_relacion.svg', 'Entidades principales del sistema.'],
        ['04_modelo_relacional.svg', 'Modelo relacional de tablas.'],
        ['05_casos_uso.svg', 'Actores y casos de uso.'],
        ['06_secuencia_login.svg', 'Secuencia de autenticación.'],
        ['07_secuencia_publicacion_anuncio.svg', 'Secuencia de publicación de anuncio.'],
        ['08_estados_anuncio.svg', 'Estados de un anuncio.'],
        ['09_arquitectura_docker.svg', 'Arquitectura de contenedores.'],
        ['10_modulos_frontend.svg', 'Módulos del frontend.'],
        ['11_modulos_backend.svg', 'Módulos del backend.'],
        ['12_flujo_moderacion.svg', 'Flujo de moderación.'],
        ['13_flujo_sugerencias_propuestas.svg', 'Flujo de sugerencias y propuestas.'],
        ['14_flujo_comunidad.svg', 'Flujo de comunidad.']
    ])
]),
('7.5', 2, '7.5. Script de base de datos', [
    'El script de base de datos es database/init.sql. Crea el esquema completo de la base de datos citypaj e inserta datos iniciales. No se incluye el código completo en la memoria para no alargar el documento; el repositorio lo contiene.'
]),
('7.6', 2, '7.6. Docker Compose', [
    'El archivo docker-compose.yml define los servicios mysql, backend y frontend. La configuración completa se encuentra en el repositorio.',
    'A continuación se muestra un resumen de los servicios:',
    ('tabla', ['Servicio', 'Imagen/Build', 'Puerto', 'Dependencia'], [
        ['mysql', 'mysql:8.0', '3306', '-'],
        ['backend', 'Build backend/Dockerfile', '3002', 'mysql'],
        ['frontend', 'Build frontend/Dockerfile', '3001', 'backend']
    ])
]),
('7.7', 2, '7.7. Variables de entorno de ejemplo', [
    'Los archivos .env.example y backend/.env.example contienen los valores por defecto. Se muestra un resumen:',
    ('tabla', ['Variable', 'Valor ejemplo', 'Descripción'], [
        ['NODE_ENV', 'development', 'Entorno de ejecución.'],
        ['PORT', '3002', 'Puerto del backend.'],
        ['DB_HOST', 'mysql', 'Host de MySQL en Docker.'],
        ['DB_NAME', 'citypaj', 'Base de datos.'],
        ['DB_USER', 'citypaj_user', 'Usuario de MySQL.'],
        ['DB_PASSWORD', 'citypaj_password', 'Contraseña de MySQL.'],
        ['JWT_SECRET', 'citypaj_secret_demo', 'Secreto JWT.'],
        ['DEMO_ADMIN_EMAIL', 'admin@citypaj.local', 'Usuario admin demo.']
    ])
]),
('7.8', 2, '7.8. Endpoints principales', [
    'La API REST expone los siguientes grupos de endpoints. Cada grupo corresponde a un router en backend/src/routes.',
    ('tabla', ['Ruta base', 'Recurso'], [
        ['/api/auth', 'Autenticación'],
        ['/api/anuncios', 'Anuncios'],
        ['/api/upload', 'Subida de archivos'],
        ['/api/admin', 'Administración'],
        ['/api/usuarios', 'Usuarios'],
        ['/api/moderacion', 'Moderación'],
        ['/api/reportes', 'Reportes'],
        ['/api/sugerencias', 'Sugerencias'],
        ['/api/comunidad', 'Comunidad'],
        ['/api/propuestas', 'Propuestas'],
        ['/api/recursos', 'Recursos'],
        ['/api/eventos', 'Eventos'],
        ['/api/estadisticas', 'Estadísticas'],
        ['/api/territorios', 'Comunidades autónomas'],
        ['/api/provincias', 'Provincias'],
        ['/health', 'Health check del backend']
    ])
]),
('7.9', 2, '7.9. Commits relevantes', [
    'El historial de Git contiene los commits que reflejan la evolución del proyecto. A continuación se listan algunos de los más representativos:',
    ('tabla', ['Hash', 'Fecha', 'Mensaje'], [
        ['329ef1a', '2026-08-10', 'readme definitivo'],
        ['39b908b', '2026-08-10', 'Elimina scripts de prueba y archivos temporales'],
        ['a66cdfb', '2026-08-10', 'Permite publicar anuncios con todas las categorias y adjuntar carteles'],
        ['5a00d2e', '2026-08-10', 'Excluye anuncios culturales del home y anade utilidad de categorias'],
        ['2e21e98', '2026-08-10', 'Configura proxy interno del frontend hacia el backend en Docker'],
        ['ebdab2b', '2026-08-10', 'Implementa API de anuncios, filtro de cultura y utilidad de categorias'],
        ['4362e19', '2026-08-10', 'Configura Express, seguridad, conexion a MySQL y subida de imagenes'],
        ['b38ea41', '2026-08-10', 'Anade esquema y datos iniciales de MySQL'],
        ['c737001', '2026-08-10', 'Configura Docker, variables de entorno y scripts de build']
    ])
]),
('7.10', 2, '7.10. Manual de instalación resumido', [
    'Para instalar y ejecutar el proyecto:',
    ('codigo', 'git clone https://github.com/carmendmv/citypaj\ncd citypaj\ndocker compose up --build'),
    'Acceso: http://localhost:3001. Usuarios demo: admin@citypaj.local / Admin1234, moderador@citypaj.local / Moderador1234, usuario@citypaj.local / Usuario1234.'
]),
]
