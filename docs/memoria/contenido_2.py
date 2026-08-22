# -*- coding: utf-8 -*-
SECCIONES_2 = [
('doc3', 1, '3. Documento de Análisis y Diseño', []),
('3.1', 2, '3.1. Análisis y diseño de la arquitectura de la aplicación', [
    'La arquitectura de CityPAJ sigue un patrón de tres capas correctamente diferenciadas: presentación, lógica de negocio y persistencia. Esta separación permite distribuir responsabilidades y facilita la revisión del código.',
    'La capa de presentación está implementada con Next.js 14. Next.js proporciona enrutamiento basado en archivos, renderizado del lado del servidor y la posibilidad de crear API internas de proxy. El frontend consume el backend principal a través de rutas API de Next.js para evitar problemas de CORS en entorno local.',
    'La capa de lógica de negocio está implementada con Express. Los controladores reciben las peticiones, aplican validaciones, consultan la base de datos y devuelven respuestas JSON. Los middlewares gestionan autenticación, rate limiting y CORS.',
    'La capa de persistencia utiliza MySQL 8.0. El esquema se carga mediante database/init.sql al iniciar el contenedor. La conexión se realiza con el driver mysql2 y un pool de conexiones para mejorar el rendimiento.',
    'La comunicación sigue el flujo: usuario -> navegador -> frontend (puerto 3001) -> backend (puerto 3002) -> MySQL (puerto 3306). Dentro de Docker, el frontend se comunica con el backend a través de la URL interna http://backend:3002, mientras que el navegador usa http://localhost:3002.',
    'La arquitectura lógica se apoya en una API REST. Los endpoints responden a los métodos HTTP GET, POST, PUT, DELETE y PATCH. Cada recurso tiene un controlador asociado que separa la lógica de las rutas.'
]),
('3.2', 2, '3.2. Tecnologías y herramientas utilizadas', [
    'Las tecnologías se han seleccionado en función de las competencias trabajadas en el ciclo y de la disponibilidad en el entorno académico.',
    ('tabla', ['Tecnología', 'Versión', 'Uso', 'Justificación'], [
        ['Next.js', '14.x', 'Framework frontend', 'SSR, enrutamiento y componentes React.'],
        ['React', '18.x', 'Biblioteca de interfaz', 'Componentes reutilizables.'],
        ['TypeScript', '5.2.x', 'Tipado estático', 'Reduce errores.'],
        ['Tailwind CSS', '3.3.x', 'Estilos', 'Maquetación rápida y consistente.'],
        ['Node.js', '>=20', 'Entorno backend', 'Ejecución de Express.'],
        ['Express', '4.18.x', 'API REST', 'Middlewares y controladores.'],
        ['MySQL', '8.0', 'Base de datos', 'Persistencia relacional.'],
        ['mysql2', '3.22.x', 'Driver MySQL', 'Conexión y consultas.'],
        ['bcryptjs', '2.4.x', 'Hash de contraseñas', 'Seguridad de autenticación.'],
        ['jsonwebtoken', '9.0.x', 'JWT', 'Gestión de sesiones.'],
        ['Zod', '3.22.x', 'Validación', 'Esquemas de formularios.'],
        ['Docker', '26.x compatible', 'Contenedores', 'Ejecución local.'],
        ['Docker Compose', '2.x', 'Orquestación', 'Levantar servicios.'],
        ['Git', '2.x', 'Control de versiones', 'Historial y ramas.'],
        ['GitHub', '-', 'Repositorio remoto', 'Almacenamiento y revisión.'],
        ['npm', '9.x', 'Gestor de paquetes', 'Dependencias.'],
        ['multer', '1.4.x', 'Subida de archivos', 'Carteles e imágenes.'],
        ['axios', '1.5.x', 'Peticiones HTTP', 'Comunicación frontend.'],
        ['lucide-react', '0.562.x', 'Iconos', 'Interfaz visual.'],
        ['helmet', '7.0.x', 'Seguridad HTTP', 'Cabeceras de seguridad.'],
        ['express-rate-limit', '7.1.x', 'Rate limiting', 'Protección de rutas.']
    ])
]),
('3.3', 2, '3.3. Arquitectura de componentes', [
    'La arquitectura de componentes se divide en tres capas principales, cada una con responsabilidades claras.',
    ('tabla', ['Capa', 'Tecnología', 'Responsabilidad'], [
        ['Presentación', 'Next.js y React', 'Renderizar páginas, manejar navegación y capturar eventos de usuario.'],
        ['Aplicación', 'Express', 'Definir endpoints, autenticación, validación y lógica de negocio.'],
        ['Datos', 'MySQL', 'Almacenar usuarios, anuncios, comunidad, sugerencias y resto de entidades.'],
        ['Infraestructura', 'Docker', 'Levantar servicios y configurar red interna.']
    ]),
    'El frontend se organiza en carpetas app, components, hooks, context y lib. La carpeta app contiene las páginas de Next.js. Los componentes se dividen por área: anuncios, comunidad, admin, ui y layout. Los hooks encapsulan el acceso a datos y los contextos gestionan el estado global, como la autenticación.',
    'El backend se organiza en controllers, routes, middleware, config, utils, services y types. Los controladores implementan la lógica de cada recurso. Las rutas exponen los endpoints. Los middlewares protegen rutas y aplican validaciones. La configuración centraliza variables de entorno y conexión a base de datos.',
    'La separación de responsabilidades permite modificar el frontend sin afectar al backend y viceversa. asimismo facilita la realización de pruebas unitarias de cada capa.'
]),
('3.4', 2, '3.4. Modelado de datos', []),
('3.4.1', 3, '3.4.1. Datos de entrada', [
    'Los datos de entrada del sistema provienen de las interacciones de los usuarios con los formularios y los paneles. Se pueden clasificar en varios grupos.',
    'Datos de registro: correo electrónico, nombre y contraseña. Estos datos se validan en frontend y backend antes de almacenarse.',
    'Datos de anuncios: título, descripción, categoría, subcategoría, comunidad autónoma, provincia, modalidad, contacto, precio y cartel. El sistema permite adjuntar una imagen de cartel.',
    'Datos de comunidad: título, contenido, provincia, tema e IP del creador. La publicación puede ser anónima o con nombre.',
    'Datos de sugerencias: asunto, descripción, categoría y prioridad. No requieren usuario registrado.',
    'Datos de propuestas: título, descripción, comunidad autónoma y contenido. Los usuarios pueden apoyar una propuesta.',
    'Datos de administración: tareas, agenda, comunicaciones, plantillas y logs de actividad. Estos datos se gestionan desde el panel admin.',
    'Datos de autenticación: credenciales de inicio de sesión. El backend verifica la contraseña y emite un token JWT.'
]),
('3.4.2', 3, '3.4.2. Datos de salida', [
    'Los datos de salida son las respuestas que el sistema devuelve a los usuarios. Incluyen páginas HTML generadas por Next.js y respuestas JSON de la API.',
    'Respuestas de anuncios: listados paginados, detalles completos, resultados de búsqueda y filtros aplicados.',
    'Respuestas de autenticación: token JWT, datos del usuario y roles.',
    'Respuestas de administración: tablas de usuarios, anuncios, reportes, tareas y estadísticas.',
    'Respuestas de error: mensajes descriptivos con códigos HTTP adecuados y, en algunos casos, información de depuración.',
    'Respuestas de salud: el endpoint /health devuelve el estado de conexión con MySQL, la base de datos activa, el tiempo de actividad y la versión.'
]),
('3.4.3', 3, '3.4.3. Datos almacenados', [
    'La base de datos citypaj almacena toda la información del sistema. El esquema se define en el archivo database/init.sql.',
    'Entre las entidades principales se encuentran usuarios, anuncios, comunidad_publicaciones, comunidad_comentarios, comunidad_likes, sugerencias, propuestas, propuestas_apoyos, recursos, eventos, reportes_anuncios, anuncios_guardados, mensajes_staff, admin_tareas, agenda_notas, plantillas_comunicacion, comunicaciones_institucionales y admin_activity_logs.',
    'asimismo se almacenan catálogos de comunidades y provincias para el filtrado territorial.',
    'Los datos de demostración incluyen usuarios con roles admin, moderador y usuario, junto con anuncios de prueba, eventos culturales y publicaciones de comunidad.'
]),
('3.4.4', 3, '3.4.4. Modelo entidad-relación', [
    'El modelo entidad-relación se construye a partir de las tablas presentes en database/init.sql.',
    'La entidad usuarios es central. De ella dependen anuncios, comunidad_publicaciones, comunidad_comentarios, anuncios_guardados, reportes_anuncios, propuestas, mensajes_staff, admin_tareas y admin_activity_logs.',
    'La entidad anuncios se relaciona con anuncios_guardados, reportes_anuncios y comunidad_publicaciones de forma indirecta a través de filtros y categorías.',
    'La entidad comunidad_publicaciones se relaciona con comunidad_comentarios y comunidad_likes.',
    'La entidad propuestas se relaciona con propuestas_apoyos.',
    'Las entidades comunidades y provincias actúan como catálogos territoriales vinculados a anuncios, propuestas, eventos y comunidad.',
    'El diagrama correspondiente se incluye en el anexo como Figura 3.'
]),
('3.4.5', 3, '3.4.5. Modelo relacional', [
    'A continuación se presenta una tabla resumen de las tablas principales, sus campos y relaciones lógicas.',
    ('tabla', ['Tabla', 'Finalidad', 'Campos principales', 'Relaciones'], [
        ['usuarios', 'Cuentas de usuario y roles', 'id, email, password_hash, nombre, rol, creado, actualizado', 'anuncios, comunidad, mensajes'],
        ['anuncios', 'Publicaciones principales', 'id, usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, estado_moderacion', 'favoritos, reportes'],
        ['anuncios_guardados', 'Favoritos de usuarios', 'id, usuario_id, anuncio_id', 'usuarios, anuncios'],
        ['comunidad_publicaciones', 'Publicaciones locales', 'id, usuario_id, titulo, contenido, provincia, tema, estado_moderacion', 'comentarios, likes'],
        ['comunidad_comentarios', 'Comentarios en publicaciones', 'id, publicacion_id, usuario_id, contenido, visible', 'publicaciones'],
        ['comunidad_likes', 'Me gusta en publicaciones', 'id, tipo, objeto_id, ip', 'publicaciones/comentarios'],
        ['sugerencias', 'Sugerencias de usuarios', 'id, asunto, descripcion, categoria, prioridad', '-'],
        ['propuestas', 'Propuestas ciudadanas', 'id, usuario_id, titulo, descripcion, comunidad_id', 'propuestas_apoyos'],
        ['propuestas_apoyos', 'Apoyos a propuestas', 'id, propuesta_id, usuario_id', 'propuestas'],
        ['recursos', 'Recursos juveniles', 'id, titulo, descripcion, categoria, url', '-'],
        ['eventos', 'Eventos culturales', 'id, titulo, descripcion, fecha, provincia', '-'],
        ['reportes_anuncios', 'Reportes de anuncios', 'id, anuncio_id, motivo, usuario_id', 'anuncios'],
        ['mensajes_staff', 'Mensajes internos', 'id, remitente_id, destinatario_id, asunto, cuerpo', 'usuarios'],
        ['admin_tareas', 'Tareas del panel admin', 'id, titulo, descripcion, estado, asignado_a', 'usuarios'],
        ['agenda_notas', 'Notas de agenda', 'id, titulo, cuerpo, fecha, usuario_id', 'usuarios'],
        ['plantillas_comunicacion', 'Plantillas de mensajes', 'id, nombre, tipo, asunto, cuerpo', 'comunicaciones'],
        ['comunicaciones_institucionales', 'Comunicaciones a entidades', 'id, plantilla_id, asunto, cuerpo, estado', 'plantillas'],
        ['admin_activity_logs', 'Logs de actividad', 'id, usuario_id, accion, entidad, detalles, ip', 'usuarios'],
        ['comunidades', 'Catálogo de CCAA', 'id, nombre', 'provincias'],
        ['provincias', 'Catálogo de provincias', 'id, comunidad_id, nombre', 'comunidades']
    ])
]),
('3.4.6', 3, '3.4.6. Script de base de datos', [
    'El script database/init.sql contiene la definición del esquema y los datos iniciales. Al arrancar el contenedor mysql, el volumen monta init.sql en /docker-entrypoint-initdb.d/, ejecutándose automáticamente.',
    'El script realiza las siguientes operaciones: selecciona la base de datos citypaj, elimina las tablas si existen, crea la estructura con tipos de datos, claves primarias e índices, inserta datos de comunidades, provincias, usuarios, anuncios, publicaciones, comentarios, sugerencias, propuestas, recursos, eventos y logs de demostración.',
    'El esquema utiliza claves foráneas en algunas tablas, como comunidad_comentarios hacia comunidad_publicaciones y usuarios. Otras relaciones son lógicas, gestionadas desde los controladores.',
    'El script no debe ejecutarse manualmente salvo para reiniciar la base de datos. Para ello se recomienda docker compose down -v seguido de docker compose up --build.'
]),
('3.5', 2, '3.5. Análisis y diseño del sistema funcional', []),
('3.5.1', 3, '3.5.1. Actores del sistema', [
    'Los actores son los perfiles que interactúan con el sistema.',
    ('tabla', ['Actor', 'Descripción', 'Funciones principales'], [
        ['Visitante', 'Usuario no autenticado', 'Consultar anuncios, recursos, cultura y eventos; buscar por categoría y territorio.'],
        ['Usuario registrado', 'Cuenta con rol usuario', 'Publicar anuncios, guardar favoritos, enviar sugerencias, comentar en comunidad.'],
        ['Moderador', 'Cuenta con rol moderador', 'Revisar anuncios pendientes, gestionar reportes, moderar contenido.'],
        ['Administrador', 'Cuenta con rol admin', 'Gestionar usuarios, anuncios, tareas, comunicaciones, agenda y estadísticas.']
    ])
]),
('3.5.2', 3, '3.5.2. Casos de uso', [
    'Los casos de uso describen las acciones principales que cada actor puede realizar.',
    ('tabla', ['ID', 'Caso de uso', 'Actor', 'Descripción', 'Resultado esperado'], [
        ['CU-01', 'Registro', 'Visitante', 'Crear cuenta con email y contraseña.', 'Cuenta almacenada.'],
        ['CU-02', 'Login', 'Usuario', 'Iniciar sesión.', 'Token JWT y redirección.'],
        ['CU-03', 'Publicar anuncio', 'Usuario', 'Rellenar formulario de anuncio.', 'Anuncio en estado pending.'],
        ['CU-04', 'Buscar anuncios', 'Visitante', 'Aplicar filtros.', 'Listado filtrado.'],
        ['CU-05', 'Guardar favorito', 'Usuario', 'Pulsar en favorito.', 'Anuncio en guardados.'],
        ['CU-06', 'Reportar anuncio', 'Usuario', 'Enviar motivo.', 'Reporte registrado.'],
        ['CU-07', 'Enviar sugerencia', 'Usuario', 'Rellenar buzón.', 'Sugerencia registrada.'],
        ['CU-08', 'Apoyar propuesta', 'Usuario', 'Pulsar apoyo.', 'Registro de apoyo.'],
        ['CU-09', 'Moderar anuncio', 'Moderador', 'Revisar y decidir.', 'Anuncio aprobado o rechazado.'],
        ['CU-10', 'Gestionar usuarios', 'Administrador', 'Crear, editar o eliminar.', 'Usuario actualizado.'],
        ['CU-11', 'Crear tarea', 'Administrador', 'Añadir tarea a otro usuario.', 'Tarea registrada.'],
        ['CU-12', 'Enviar comunicación', 'Administrador', 'Usar plantilla.', 'Comunicación en borrador.']
    ])
]),
('3.5.3', 3, '3.5.3. Flujo general de la aplicación', [
    'El flujo general es el siguiente. El usuario accede al frontend a través del navegador. Si la acción requiere datos, el frontend realiza una petición al backend. El backend recibe la petición, aplica middleware de autenticación si es necesario, ejecuta consultas en MySQL y devuelve un JSON.',
    'Para publicar un anuncio, el usuario rellena el formulario y adjunta una imagen opcional. El frontend envía los datos al backend, que los valida y los almacena con estado pending. El moderador puede revisar el anuncio y cambiar el estado a approved o rejected.',
    'Para consultar anuncios, el backend aplica filtros de categoría, comunidad y provincia, pagina los resultados y devuelve el listado al frontend.',
    'La autenticación mediante JWT permite proteger rutas y diferenciar roles. El token se envía en la cabecera Authorization.'
]),
('3.5.4', 3, '3.5.4. Seguridad lógica', [
    'La seguridad lógica se implementa en varios niveles.',
    'Autenticación: el registro almacena la contraseña cifrada con bcrypt. El login verifica el hash y emite un token JWT.',
    'Autorización: los tokens incluyen el id y el rol. Los middlewares de autenticación rechazan peticiones sin token o con token inválido. Los middlewares de roles permiten restringir acceso a administradores o moderadores.',
    'Validación: Zod valida los esquemas de formularios en el frontend y express-validator valida los datos en el backend.',
    'Protección HTTP: helmet añade cabeceras de seguridad. express-rate-limit limita las peticiones para evitar abuso. CORS se configura con los orígenes permitidos.',
    'Prevención de inyección SQL: las consultas a MySQL usan parámetros con el pool de mysql2, evitando concatenación de cadenas.',
    'Registro de actividad: la tabla admin_activity_logs almacena acciones relevantes junto con la IP para auditoría.'
]),
('3.6', 2, '3.6. Análisis y diseño de la interfaz de usuario', []),
('3.6.1', 3, '3.6.1. Criterios de diseño', [
    'El diseño busca claridad, simplicidad y coherencia. Se ha utilizado Tailwind CSS para definir una paleta de colores, tipografías y espaciados consistentes.',
    'La navegación es horizontal y se adapta a móvil mediante un menú colapsable. Los enlaces principales ofrecen acceso a anuncios, cultura, comunidad, sugerencias y propuestas.',
    'Los formularios utilizan etiquetas claras, mensajes de error bajo los campos y botones descriptivos. Los estados de carga y error se muestran mediante componentes de retroalimentación.',
    'Se evita el uso de emojis y elementos decorativos innecesarios. La paleta se centra en colores sobrios con acentos en los enlaces y botones de acción.'
]),
('3.6.2', 3, '3.6.2. Pantallas representativas', [
    'A continuación se describen las pantallas principales.',
    ('tabla', ['Pantalla', 'Usuario', 'Objetivo', 'Elementos principales'], [
        ['Home', 'Todos', 'Consultar anuncios generales.', 'Listado, filtros, buscador.'],
        ['Detalle de anuncio', 'Todos', 'Ver información completa.', 'Título, descripción, contacto, reporte.'],
        ['Publicar anuncio', 'Usuario', 'Crear anuncio.', 'Formulario, adjunto, selects de territorio.'],
        ['Comunidad', 'Todos', 'Ver publicaciones por provincia.', 'Publicaciones, comentarios, likes.'],
        ['Sugerencias', 'Todos', 'Enviar sugerencias.', 'Formulario y listado.'],
        ['Propuestas', 'Todos', 'Consultar propuestas.', 'Tarjetas y botón de apoyo.'],
        ['Cultura y eventos', 'Todos', 'Ver actividades culturales.', 'Listado y filtros.'],
        ['Recursos', 'Todos', 'Consultar recursos.', 'Listado por categoría.'],
        ['Login', 'Visitante', 'Acceder al sistema.', 'Email, contraseña.'],
        ['Registro', 'Visitante', 'Crear cuenta.', 'Formulario de registro.'],
        ['Panel admin', 'Admin', 'Gestionar el sistema.', 'Dashboard, menús de módulos.'],
        ['Panel moderador', 'Moderador', 'Revisar contenido.', 'Reportes, anuncios pendientes.']
    ]),
    'Las capturas de pantalla no se han insertado en esta versión. Se recomienda añadirlas manualmente en una revisión posterior, con pie de figura correspondiente.'
]),
('3.6.3', 3, '3.6.3. Diseño responsive', [
    'El diseño responsive se implementa mediante clases de Tailwind CSS. Se utiliza un enfoque mobile-first, de modo que las pantallas pequeñas reciben la disposición base y las superiores aprovechan el espacio adicional.',
    'El menú de navegación se convierte en un botón de hamburguesa en móvil. Las grillas de anuncios pasan de una columna en móvil a tres o cuatro en escritorio. Los formularios ocupan el ancho completo en móvil y se limitan a un contenedor centrado en escritorio.',
    'Las tablas del panel admin se adaptan con desplazamiento horizontal o mostrando columnas reducidas. Los modales y notificaciones se centran y escalan según el tamaño de pantalla.'
]),
]
