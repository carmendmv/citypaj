# -*- coding: utf-8 -*-
SECCIONES_4 = [
('extra', 1, 'Anexos técnicos adicionales', []),
('E.1', 2, 'E.1. Descripción técnica del frontend', [
    'El frontend de CityPAJ se construye con Next.js 14 en su modelo de App Router. Este modelo permite organizar las páginas en carpetas bajo frontend/src/app, donde cada carpeta representa una ruta y el archivo page.tsx define el contenido.',
    'Next.js ofrece renderizado del lado del servidor y generación estática. En este proyecto, las páginas se renderizan de forma dinámica en el servidor del contenedor, lo que permite acceder a variables de entorno y realizar peticiones al backend antes de servir el HTML.',
    'La gestión de estado se realiza mediante Zustand para preferencias globales y React Context para la autenticación. Zustand es una biblioteca ligera que evita la verbosidad de Redux mientras mantiene un estado centralizado.',
    'Los hooks personalizados encapsulan la lógica de acceso a la API. Por ejemplo, los hooks de anuncios gestionan la carga de listados, filtros y paginación. Los hooks de comunidad gestionan la consulta de publicaciones y comentarios.',
    'Los formularios utilizan react-hook-form y Zod. React-hook-form controla el estado de los campos y reduce renderizados innecesarios. Zod valida los esquemas con tipos seguros.',
    'La interfaz se compone de componentes reutilizables agrupados por área. Los componentes de ui incluyen botones, tarjetas, modales y barras de progreso. Los componentes de anuncios incluyen AnuncioList, AnuncioCard y FiltroAvanzado.',
    'Tailwind CSS se configura en frontend/tailwind.config.js. Las clases utilitarias permiten definir estilos directamente en los componentes sin necesidad de hojas de estilo separadas para cada elemento.',
    'La paleta de colores se define mediante variables CSS y clases de Tailwind. Se priorizan colores sobrios con acentos en naranja para acciones principales y gris para fondos.',
    'El diseño responsive se implementa con las clases de Tailwind para breakpoints. El menú se colapsa en móvil, las grillas pasan a una sola columna y los formularios ocupan el ancho disponible.',
    'Las imágenes se sirven mediante el componente Image de Next.js y el endpoint /uploads del backend. Los carteles de anuncios se almacenan en el directorio uploads del contenedor backend.'
]),
('E.2', 2, 'E.2. Descripción técnica del backend', [
    'El backend se implementa con Express y TypeScript. El archivo src/index.ts inicia el servidor, espera a MySQL y crea los usuarios de demostración. El archivo src/app.ts configura middlewares y rutas.',
    'Express utiliza middlewares para procesar las peticiones en cadena. Los middlewares de seguridad se ejecutan primero, seguidos de parseo de JSON, rate limiting y autenticación. Cada ruta añade su propio middleware de validación.',
    'La conexión a base de datos se centraliza en src/config/database.ts. Se crea un pool de conexiones con mysql2. El pool permite reutilizar conexiones y gestiona el acceso concurrente de múltiples peticiones.',
    'Los controladores se organizan por dominio. El controlador anuncios-mysql.ts implementa la consulta con filtros dinámicos. El controlador auth.ts gestiona registro, login y tokens. El controlador admin-usuarios.ts gestiona los usuarios desde el panel admin.',
    'Los routers se definen en src/routes. Cada router importa sus controladores y expone los endpoints. La separación entre routers y controladores mantiene el archivo de rutas limpio.',
    'La validación de datos se realiza en dos capas. Zod valida los esquemas en el frontend. En el backend, express-validator comprueba los datos recibidos antes de pasarlos al controlador.',
    'El manejo de errores se centraliza en src/middleware/errorHandler.ts. El middleware captura errores, registra el stack en desarrollo y devuelve mensajes seguros al cliente.',
    'El logger utiliza Winston. Los mensajes se escriben en consola y en el archivo de logs. El middleware de Morgan registra las peticiones HTTP con detalles de método, ruta y estado.',
    'La seguridad se refuerza con Helmet, que añade cabeceras como X-Content-Type-Options y X-Frame-Options. CORS se restringe a los orígenes definidos en la configuración.',
    'El rate limiting limita las peticiones generales y, de forma más estricta, los endpoints de autenticación. Esto evita ataques de fuerza bruta y reduce la carga del servidor.'
]),
('E.3', 2, 'E.3. Descripción técnica de la base de datos', [
    'La base de datos MySQL se define en el archivo database/init.sql. El script crea la base de datos citypaj, las tablas, los índices, las claves foráneas y los datos iniciales.',
    'El esquema utiliza el motor InnoDB para todas las tablas. InnoDB soporta transacciones, claves foráneas y bloqueos a nivel de fila, lo que mejora la integridad y concurrencia.',
    'Las tablas de contenido comparten campos comunes como creado_at y actualizado_at, con valores por defecto current_timestamp. Esto permite ordenar y auditar los registros.',
    'La tabla anuncios incluye índices sobre categoría, comunidad_id, provincia_id, estado_moderacion y visible. Estos índices aceleran las consultas más frecuentes del home y del panel de moderación.',
    'La tabla anuncios asimismo utiliza un índice FULLTEXT sobre título y descripción para búsquedas por texto libre. El motor MySQL permite realizar búsquedas con MATCH AGAINST cuando el índice está configurado.',
    'Los identificadores de usuario son UUID de 36 caracteres. Esto evita la enumeración de usuarios y facilita la generación de claves desde el backend sin depender del autoincremento.',
    'Las claves foráneas se definen en comunidad_comentarios, propuestas_apoyos y otras tablas de relación. Algunas relaciones son lógicas, gestionadas desde los controladores mediante consultas JOIN.',
    'El script de inserción inicial incluye datos de demostración. Los datos se generaron con nombres y textos que simulan contenido real, lo que facilita las pruebas manuales.',
    'El volumen de Docker persiste los datos de MySQL entre reinicios. Para reiniciar desde cero se utiliza docker compose down -v, lo que elimina el volumen y fuerza la recarga de init.sql.',
    'Las consultas del backend utilizan parámetros. Cada valor se envía separado de la sentencia SQL, lo que previene la inyección SQL sin necesidad de escapar manualmente las cadenas.'
]),
('E.4', 2, 'E.4. Descripción técnica de la autenticación', [
    'El flujo de autenticación comienza con el registro. El usuario introduce correo, nombre y contraseña. El backend cifra la contraseña con bcrypt y almacena el hash en la tabla usuarios.',
    'bcrypt utiliza un factor de coste que ralentiza el cálculo del hash. En este proyecto se utiliza un factor de 10. A mayor factor, mayor seguridad, pero asimismo mayor tiempo de respuesta.',
    'El login recibe el correo y la contraseña en texto. El backend busca el usuario, obtiene el hash almacenado y compara la contraseña con bcrypt.compare. Si coinciden, se genera un token JWT.',
    'El token JWT incluye el id del usuario y el rol. Se firma con el secreto configurado en JWT_SECRET. El token tiene un tiempo de expiración, después del cual el frontend debe usar el token de refresco.',
    'El token de refresco permite obtener un nuevo token de acceso sin volver a introducir la contraseña. El backend almacena o valida el refresh según la implementación.',
    'El frontend almacena el token, generalmente en memoria o localStorage, y lo envía en la cabecera Authorization con el prefijo Bearer. El middleware de autenticación decodifica el token y añade req.user.',
    'Las rutas protegidas consultan req.user. Si el rol no coincide con el requerido, el middleware devuelve 403. Esto asegura que solo administradores y moderadores accedan a paneles de gestión.',
    'El cierre de sesión invalida el token en el cliente. En un entorno de producción se podría mantener una lista de tokens revocados en el servidor.',
    'La generación de usuarios demo se realiza en src/index.ts al arrancar. Si los usuarios no existen, se crean con sus respectivos roles. Esto facilita la revisión sin necesidad de registro previo.'
]),
('E.5', 2, 'E.5. Descripción técnica del módulo de anuncios', [
    'El módulo de anuncios es el núcleo funcional de CityPAJ. facilita a los usuarios publicar oportunidades y a los visitantes consultarlas con filtros.',
    'La publicación recoge los campos del formulario y opcionalmente un cartel. El frontend realiza una petición POST a /api/anuncios con el JSON de datos. El backend valida y almacena el anuncio con estado pending.',
    'El controlador anuncios-mysql.ts construye la consulta SQL de forma dinámica. Aplica filtros de categoría, comunidad, provincia, búsqueda y paginación. La búsqueda utiliza LIKE o FULLTEXT según el campo.',
    'El listado del home excluye los anuncios culturales. La utilidad CATEGORIAS_CULTURA define qué categorías se consideran cultura. Esta separación permite mantener una sección específica de cultura y eventos.',
    'El detalle de anuncio muestra la información completa. Si el usuario está autenticado, puede guardar el anuncio como favorito, reportarlo o contactar con el creador.',
    'La moderación de anuncios permite aprobar, rechazar o marcar contenido. El moderador puede añadir un motivo de rechazo. El anuncio pasa a estado approved o rejected.',
    'La edición de anuncios permite modificar los datos del anuncio propio. El controlador verifica que el usuario que edita es el creador o un administrador.',
    'Los anuncios se paginan en el backend. El frontend recibe el total de páginas y el listado correspondiente. La navegación de paginación se implementa con componentes de UI.',
    'La subida de carteles se realiza con Multer. El archivo se guarda en el directorio uploads con un nombre único. La URL del cartel se almacena en el campo cartel_url de la tabla anuncios.'
]),
('E.6', 2, 'E.6. Descripción técnica del módulo de comunidad', [
    'El módulo de comunidad permite publicar contenido relacionado con una provincia. Las publicaciones se organizan por provincia y tema, lo que facilita la participación territorial.',
    'Un usuario puede crear una publicación anónima. En ese caso, el sistema solicita un nombre y registra la dirección IP. La IP se utiliza únicamente para moderación.',
    'Los comentarios están vinculados a una publicación. La tabla comunidad_comentarios almacena el contenido, el usuario, si es anónimo, la IP y el estado de moderación.',
    'El sistema de likes permite marcar publicaciones y comentarios. La tabla comunidad_likes utiliza un índice único sobre tipo, objeto_id e IP para evitar likes duplicados.',
    'La moderación de comunidad permite ocultar o aprobar publicaciones y comentarios. El moderador accede al panel y aplica la acción correspondiente.',
    'El frontend muestra las publicaciones de una provincia seleccionada. El usuario puede cambiar de provincia y ver el contenido asociado.',
    'La funcionalidad se encuentra implementada de forma parcial. La creación y consulta básica funcionan, pero la gestión avanzada de likes y reportes requiere completarse.'
]),
('E.7', 2, 'E.7. Descripción técnica del módulo de sugerencias y propuestas', [
    'El buzón de sugerencias recoge propuestas de mejora, quejas o ideas de los usuarios. No requiere autenticación, lo que reduce la barrera de participación.',
    'Las sugerencias se almacenan en la tabla sugerencias con campos de asunto, descripción, categoría y prioridad. Los administradores pueden consultarlas desde el panel.',
    'El módulo de propuestas muestra iniciativas ciudadanas. Cada propuesta incluye título, descripción y comunidad. Los usuarios pueden apoyar una propuesta.',
    'La tabla propuestas_apoyos registra el apoyo vinculado a un usuario y una propuesta. Esto permite contar el número de apoyos de cada propuesta.',
    'El frontend muestra las propuestas en una página. Cada propuesta indica el número de apoyos recibidos y ofrece un botón para añadir el propio.',
    'Ambos módulos se consultan a través de la API. El backend valida los datos y devuelve el listado. La gestión desde el panel admin permite marcar sugerencias como resueltas.'
]),
('E.8', 2, 'E.8. Descripción técnica de cultura, eventos y recursos', [
    'La sección de cultura y eventos centraliza actividades como conciertos, talleres y encuentros. Los eventos se almacenan en la tabla eventos con fecha, provincia y descripción.',
    'Los anuncios culturales se filtran mediante la utilidad CATEGORIAS_CULTURA. Estas categorías se excluyen del home general para mantener la sección cultural separada.',
    'La página de cultura consulta los eventos y anuncios culturales mediante el endpoint /api/eventos y /api/anuncios?categoria=cultura. El frontend muestra tarjetas con la información.',
    'El módulo de recursos lista convocatorias, guías y enlaces de interés. La tabla recursos almacena título, descripción, categoría y URL.',
    'Los recursos se muestran en una página con filtros por categoría. El usuario puede pulsar un recurso para abrir la URL externa o ver el detalle.',
    'La publicación de eventos y recursos utiliza el mismo flujo general de anuncios. La categoría distingue el tipo de contenido y determina en qué sección aparece.'
]),
('E.9', 2, 'E.9. Descripción técnica de administración y moderación', [
    'El panel de administración agrupa módulos de gestión. Cada módulo tiene una vista en frontend/src/app/admin y un conjunto de endpoints en /api/admin.',
    'El módulo de usuarios permite crear, editar y desactivar cuentas. El controlador admin-usuarios.ts implementa las operaciones sobre la tabla usuarios.',
    'El módulo de anuncios permite revisar, aprobar y rechazar anuncios en masa. El controlador admin-anuncios.ts implementa filtros y acciones masivas.',
    'El módulo de tareas permite asignar tareas a usuarios. La tabla admin_tareas almacena título, descripción, estado, prioridad y responsable.',
    'La agenda institucional permite anotar fechas relevantes. La tabla agenda_notas almacena título, cuerpo, fecha y color.',
    'La mensajería interna permite redactar mensajes entre usuarios del staff. La tabla mensajes_staff almacena asunto, cuerpo, remitente y destinatario.',
    'Las comunicaciones institucionales permiten preparar borradores de correos a entidades. Se utilizan plantillas de comunicación para rellenar asunto y cuerpo.',
    'El panel de moderación está enfocado a reportes y contenido pendiente. El moderador puede aprobar, rechazar, ocultar o marcar publicaciones y anuncios.',
    'Algunos paneles incluyen datos de demostración. La funcionalidad se encuentra implementada de forma parcial, con vistas funcionales pero envíos reales pendientes.'
]),
('E.10', 2, 'E.10. Descripción técnica de Docker', [
    'La dockerización se define en docker-compose.yml. El archivo declara tres servicios: mysql, backend y frontend. Cada servicio se construye desde su respectivo Dockerfile.',
    'El servicio mysql utiliza la imagen oficial mysql:8.0. Se configura la base de datos citypaj, el usuario citypaj_user y la contraseña. El volumen monta la carpeta database/init, que contiene 01_schema.sql y 02_seed_demo.sql, para su ejecución inicial.',
    'El healthcheck de mysql ejecuta una consulta SELECT 1 FROM usuarios LIMIT 1. Esto garantiza que la base de datos ha cargado el esquema antes de que el backend intente conectarse.',
    'El servicio backend depende de mysql con la condición service_healthy. Docker Compose espera a que el contenedor mysql pase el healthcheck antes de iniciar el backend.',
    'El backend escucha en todas las interfaces con bind 0.0.0.0. Esto permite que otros contenedores y el host accedan al puerto 3002.',
    'El servicio frontend se construye con el Dockerfile del frontend. El build compila la aplicación Next.js y el comando npm start arranca el servidor en el puerto 3001.',
    'La red interna de Docker permite resolver el nombre del servicio backend como http://backend:3002. El frontend utiliza esta URL interna para las peticiones del servidor.',
    'Las variables de entorno se inyectan en los contenedores. El backend recibe las credenciales de MySQL, los secretos JWT y las URLs de CORS. El frontend recibe la URL pública de la API.',
    'El reinicio de la base de datos se realiza con docker compose down -v seguido de docker compose up --build. Esto elimina el volumen y recarga el esquema y los datos iniciales.'
]),
('E.11', 2, 'E.11. Consideraciones de seguridad', [
    'El proyecto aplica varias medidas de seguridad básicas. La contraseña se cifra con bcrypt. Los tokens JWT protegen las sesiones. Las rutas se restringen por rol.',
    'Helmet añade cabeceras HTTP que mitigan ataques comunes como clickjacking y XSS. La configuración permite inline styles para Tailwind CSS.',
    'CORS se restringe al origen del frontend. En entorno de desarrollo se permite http://localhost:3001. En producción se debería configurar el dominio real.',
    'Rate limiting limita las peticiones generales y las de autenticación. Esto reduce el riesgo de fuerza bruta y de consumo excesivo de recursos.',
    'La validación de datos con Zod y express-validator evita el almacenamiento de datos incorrectos. asimismo ayuda a prevenir ciertos tipos de ataques de entrada.',
    'Las consultas a MySQL utilizan parámetros. El driver mysql2 separa la sentencia SQL de los valores, lo que previene la inyección SQL.',
    'El registro de actividad en admin_activity_logs permite auditar acciones relevantes. Cada entrada incluye la acción, la entidad afectada, detalles e IP del usuario.',
    'En un despliegue real se deberían utilizar secretos fuertes, HTTPS, backups automáticos y políticas de contraseñas más estrictas. El entorno académico mantiene valores demo para facilitar la revisión.'
]),
('E.12', 2, 'E.12. Consideraciones de rendimiento', [
    'El rendimiento del sistema es suficiente para el entorno académico. La base de datos utiliza índices en los campos más consultados. El backend utiliza un pool de conexiones.',
    'La consulta de anuncios aplica filtros en el backend, reduciendo la cantidad de datos transferidos. La paginación limita el número de resultados por página.',
    'El frontend utiliza Next.js para renderizado eficiente. Los componentes se actualizan solo cuando cambian sus props o estado.',
    'La carga de imágenes se realiza de forma asíncrona. Los carteles se sirven desde el directorio uploads, evitando la carga de la base de datos con datos binarios.',
    'El rate limiting no solo mejora la seguridad, sino que asimismo protege el rendimiento ante picos de peticiones.',
    'Para mejorar el rendimiento futuro se podrían añadir caché con Redis, índices adicionales y consultas optimizadas para los paneles de administración.',
    'El contenedor de frontend se construye en la imagen. Esto aumenta el tiempo de build, pero reduce el tiempo de arranque posterior. El backend asimismo compila a dist antes de servir.'
]),
('E.13', 2, 'E.13. Revisión de decisiones técnicas', [
    'La decisión de utilizar MySQL frente a PostgreSQL o MongoDB se basó en el aprendizaje del ciclo. MySQL es una base de datos relacional madura y correctamente documentada.',
    'Next.js se eligió dado que permite aprender SSR, enrutamiento moderno y componentes React en un solo proyecto. La curva de aprendizaje es mayor que la de React puro, pero ofrece más herramientas.',
    'TypeScript se utilizó en frontend y backend. El tipado estático ayudó a detectar errores durante el desarrollo, a pesar de que asimismo añadió complejidad inicial.',
    'Tailwind CSS permitió maquetar rápido sin escribir hojas de estilo extensas. La consistencia visual se mantuvo mediante clases compartidas.',
    'La dockerización se añadió en definitiva del proyecto. a pesar de que requirió ajustes, facilitó la entrega al tribunal y evitó problemas de versiones.',
    'La autenticación con JWT es adecuada para el alcance del proyecto. En un entorno real se debería añadir refresh tokens rotativos y revocación en el servidor.',
    'La decisión de excluir anuncios culturales del home surgió al observar que la sección de cultura requería un tratamiento diferenciado. La utilidad CATEGORIAS_CULTURA permite mantener la separación.'
]),
('E.14', 2, 'E.14. Pruebas y validación', [
    'El plan de pruebas se documenta en el apartado 4.3. a pesar de que no se ejecutaron de forma automatizada, el código está preparado para pruebas manuales con los usuarios demo.',
    'La validación de formularios se prueba introduciendo datos incorrectos. El frontend muestra mensajes de error y el backend rechaza la petición.',
    'La autenticación se prueba con los tres usuarios demo. Cada uno debe acceder a las funciones permitidas según su rol.',
    'El despliegue con Docker se prueba ejecutando docker compose up --build y accediendo a las URLs. El health check confirma que el backend conecta con MySQL.',
    'La respuesta de la API se prueba con herramientas como el navegador, Postman o curl. Se pueden realizar peticiones GET, POST, PUT y DELETE a los endpoints.',
    'El diseño responsive se prueba redimensionando el navegador. Se verifica que el menú, las tarjetas y los formularios se adaptan correctamente.',
    'La carga de datos se prueba revisando que los anuncios, eventos, sugerencias y propuestas aparecen en el frontend.'
]),
('E.15', 2, 'E.15. Mantenimiento futuro', [
    'El mantenimiento del proyecto requiere mantener las dependencias actualizadas. npm permite actualizar paquetes con npm update, a pesar de que debe probarse antes de entregar.',
    'El esquema de base de datos es posible ampliar añadiendo nuevas tablas o columnas. Cada cambio requiere reiniciar el volumen de MySQL o aplicar una migración.',
    'Los logs del backend se almacenan en el directorio logs. Se recomienda revisarlos periódicamente para detectar errores o intentos de acceso no autorizados.',
    'La documentación debe actualizarse si se añaden nuevos endpoints o cambian las variables de entorno. El README es el punto de entrada para nuevos revisores.',
    'El control de versiones con Git permite revertir cambios y mantener un historial. Se recomienda usar ramas para nuevas funcionalidades.',
    'Las copias de seguridad de la base de datos se pueden realizar exportando el volumen o el script init.sql. En un entorno real se debería automatizar este proceso.'
]),
('E.16', 2, 'E.16. Portfolio del proyecto', [
    'He creado un portfolio estático aparte de la aplicación, en la carpeta portfolio/index.html, para poder mostrar el proyecto sin depender del backend ni de la base de datos.',
    'He incluido secciones con la presentación del problema, la solución que propone CityPAJ, las funcionalidades principales, la arquitectura técnica, los datos de demo, el modelo social y una guía de instalación.',
    'El portfolio está pensado para difundir el trabajo en un entorno académico. Puede publicarse en GitHub Pages o en cualquier servidor estático. No incluye datos reales ni credenciales.',
    'He querido diferenciar claramente la aplicación CityPAJ, que se despliega con Docker Compose y MySQL, del portfolio, que solo es una página informativa de presentación.'
]),
]
