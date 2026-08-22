# -*- coding: utf-8 -*-
from docx.shared import Cm, Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

SECCIONES_1 = [
('portada', None, 'Portada', [
    'CityPAJ', 'Memoria del Proyecto', 'Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web',
    'Módulo de Proyecto', 'CPIFP Los Enlaces', 'Curso 2025/2026',
    'Alumna: Carmen de Miguel Velázquez', 'Fecha de entrega: 14/08/2026'
]),

('indice', 1, 'Índice general', []),
('indice_tablas', 1, 'Índice de tablas', []),
('indice_figuras', 1, 'Índice de ilustraciones', []),

('doc1', 1, '1. Documento Descripción del proyecto', []),
('1.1', 2, '1.1. Contexto del proyecto', [
    'CityPAJ nace dentro del módulo de Proyecto del ciclo de Desarrollo de Aplicaciones Web del CPIFP Los Enlaces. El proyecto responde a la necesidad de construir una aplicación web completa que sirva de demostración de las competencias adquiridas durante el ciclo.',
    'El entorno actual de la información juvenil presenta una alta dispersión: los jóvenes consultan anuncios, convocatorias, ofertas de empleo, recursos culturales y avisos comunitarios en múltiples fuentes. Esta fragmentación dificulta la búsqueda eficiente y la participación activa.',
    'La propuesta de CityPAJ consiste en una plataforma centralizada en la que la información se organiza por territorio, categoría y tipo de contenido. El sistema permite la publicación, consulta y moderación de anuncios, propuestas, sugerencias y recursos, con acceso diferenciado según el rol de usuario.'
]),
('1.1.1', 3, '1.1.1. Ámbito y entorno', [
    'El ámbito del proyecto es el desarrollo de software para entornos web. consiste en una aplicación de uso local mediante Docker Compose, pensada para ser revisada por el tribunal académico sin depender de despliegues externos.',
    'El entorno tecnológico elegido refleja las tecnologías trabajadas en el ciclo: frontend con Next.js, React y TypeScript; backend con Node.js y Express; y base de datos relacional con MySQL. La dockerización asegura que cualquier revisador pueda levantar el sistema con un solo comando.',
    'La aplicación no requiere conexión a servicios de terceros para funcionar de forma básica. Todas las dependencias principales están contenidas en el repositorio o descargables mediante npm y Docker Hub.'
]),
('1.1.2', 3, '1.1.2. Análisis de la realidad', [
    'La realidad que motiva el proyecto es la dificultad de acceso a la información juvenil relevante por territorio. En la práctica, un usuario interesado en empleo, formación o vivienda juvenil debe consultar portales institucionales, redes sociales, grupos de mensajería o tablones físicos, lo que genera pérdida de oportunidades.',
    'adicionalmente, la separación entre anuncios, propuestas, sugerencias, cultura y recursos no siempre es clara en los portales existentes. CityPAJ aborda esta confusión definiendo secciones con propósito diferenciado y filtros por comunidad autónoma y provincia.',
    'La participación juvenil asimismo se observa limitada cuando los canales no permiten aportar propuestas o sugerencias de forma sencilla. El proyecto incluye un buzón de sugerencias y un apartado de propuestas para fomentar esa participación.'
]),
('1.1.3', 3, '1.1.3. Solución y justificación de la solución propuesta', [
    'La solución propuesta es una aplicación web fullstack con arquitectura en tres capas. El frontend consume la API REST del backend, que a su vez persiste la información en una base de datos MySQL.',
    'La organización por comunidades autónomas y provincias permite que el usuario consulte solo la información territorialmente relevante. Los filtros por categoría permiten separar anuncios generales de cultura, eventos, recursos y propuestas.',
    'La justificación técnica recae en el dominio de tecnologías estudiadas y en la facilidad de entrega. Docker Compose reduce los problemas de configuración local y hace el proyecto más reproducible. La separación frontend/backend facilita el mantenimiento y la evolución futura.'
]),
('1.1.4', 3, '1.1.4. Destinatarios', [
    'Los destinatarios principales son los jóvenes que buscan oportunidades de empleo, formación, vivienda, ocio o servicios en su comunidad.',
    'Entidades e instituciones juveniles asimismo son destinatarias, puesto que pueden publicar recursos, convocatorias o actividades y mantener contacto con el público objetivo.',
    'Los moderadores son responsables de supervisar los contenidos publicados y resolver reportes de los usuarios.',
    'Los administradores gestionan usuarios, categorías, tareas, comunicaciones y acceso al sistema.'
]),
('1.2', 2, '1.2. Objetivo del proyecto', [
    'El objetivo del proyecto es desarrollar una aplicación web que permita centralizar información juvenil organizada por territorio, facilitando la consulta y publicación de anuncios, recursos, propuestas, sugerencias y actividad comunitaria.',
    'El sistema se dirige a jóvenes, entidades y administraciones que necesitan un punto de acceso unificado a información juvenil. El problema que resuelve es la dispersión de anuncios y recursos en múltiples canales sin posibilidad de filtrado territorial.',
    'Entre los módulos incluidos se encuentran autenticación de usuarios, publicación de anuncios con moderación, comunidad por provincias, buzón de sugerencias, propuestas, cultura y eventos, panel de administración, panel de moderación y mensajería interna.',
    'A nivel técnico, el proyecto aporta una arquitectura separada en frontend y backend, tipado estático con TypeScript, validación de datos, control de roles y dockerización local.',
    'A nivel social, el proyecto aporta una herramienta orientada a mejorar el acceso y la participación juvenil, con controles de moderación para mantener la calidad de la información.'
]),
('1.3', 2, '1.3. Project Objective', [
    'The aim of this project is to develop a web application that gathers youth information organised by territory. It allows users to consult and publish announcements, resources, proposals, suggestions and community activities.',
    'The system is divided into a Next.js frontend, an Express backend and a MySQL database. It supports user roles, content moderation and a local Docker deployment.',
    'The project offers a useful tool for young people, organisations and administrations to centralise youth information and improve participation.'
]),
('1.4', 2, '1.4. Marco legal', [
    'El proyecto maneja datos personales mínimos, como dirección de correo electrónico, contraseña cifrada e, en algunos casos, dirección IP. Si el sistema se desplegara en un entorno real, debería cumplir el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales.',
    'La contraseña se almacena cifrada con bcrypt, lo que reduce el riesgo de exposición en caso de acceso no autorizado a la base de datos. El uso de tokens JWT permite gestionar sesiones sin enviar la contraseña en cada petición.',
    'El sistema separa roles de usuario, de forma que solo los administradores y moderadores acceden a funciones de gestión. La moderación de contenidos constituye una medida de control de calidad y legalidad.',
    'La licencia declarada en el archivo package.json del repositorio es MIT. Sin embargo, el proyecto se entrega con finalidad académica para su revisión dentro del módulo de Proyecto. La reutilización o publicación fuera de este contexto queda sujeta a la autorización de la autora.'
]),

('doc2', 1, '2. Documento de Acuerdo del proyecto', []),
('2.1', 2, '2.1. Requisitos funcionales', [
    'A continuación se listan los requisitos funcionales identificados en el repositorio. Cada requisito incluye el actor principal, el estado observado y una prueba asociada.',
    ('tabla', ['ID', 'Requisito funcional', 'Descripción', 'Actor principal', 'Estado', 'Prueba asociada'], [
        ['RF-01', 'Registro de usuarios', 'Permite crear una cuenta con correo, nombre y contraseña.', 'Visitante', 'Cumplido', 'POST /api/auth/register'],
        ['RF-02', 'Inicio de sesión', 'Permite autenticarse mediante correo y contraseña.', 'Usuario', 'Cumplido', 'POST /api/auth/login'],
        ['RF-03', 'Cierre de sesión', 'Permite cerrar la sesión activa.', 'Usuario', 'Cumplido', 'POST /api/auth/logout'],
        ['RF-04', 'Gestión de sesión', 'Renovación y control del token JWT.', 'Usuario', 'Cumplido', 'POST /api/auth/refresh'],
        ['RF-05', 'Consulta de anuncios', 'Listado paginado y búsqueda de anuncios.', 'Visitante', 'Cumplido', 'Carga del home'],
        ['RF-06', 'Filtrado por categoría', 'Filtro por tipo como empleo, formación, vivienda, cultura.', 'Usuario', 'Cumplido', 'GET /api/anuncios?categoria='],
        ['RF-07', 'Filtrado por territorio', 'Filtro por comunidad autónoma y provincia.', 'Usuario', 'Cumplido', 'GET /api/anuncios?comunidad=&provincia='],
        ['RF-08', 'Publicación de anuncios', 'Formulario de publicación con adjuntos.', 'Usuario', 'Cumplido', 'POST /api/anuncios'],
        ['RF-09', 'Edición de anuncios propios', 'Permite modificar anuncios del usuario.', 'Usuario', 'Parcial', 'PUT /api/anuncios/:id'],
        ['RF-10', 'Detalle de anuncio', 'Visualización completa de un anuncio.', 'Usuario', 'Cumplido', 'GET /api/anuncios/:id'],
        ['RF-11', 'Gestión de favoritos', 'Guardar y consultar anuncios favoritos.', 'Usuario', 'Cumplido', 'POST /api/anuncios/guardar'],
        ['RF-12', 'Reporte de anuncios', 'Enviar reporte por contenido inadecuado.', 'Usuario', 'Cumplido', 'POST /api/anuncios/:id/reportes'],
        ['RF-13', 'Comunidad por provincias', 'Publicaciones locales y comentarios.', 'Usuario', 'Parcial', 'GET /api/comunidad'],
        ['RF-14', 'Publicación en comunidad', 'Permite crear publicaciones territoriales.', 'Usuario', 'Parcial', 'POST /api/comunidad'],
        ['RF-15', 'Envío de sugerencias', 'Buzón para sugerencias juveniles.', 'Usuario', 'Cumplido', 'POST /api/sugerencias'],
        ['RF-16', 'Consulta de propuestas', 'Visualización de propuestas ciudadanas.', 'Usuario', 'Cumplido', 'GET /api/propuestas'],
        ['RF-17', 'Apoyo a propuestas', 'Registro de apoyos a propuestas.', 'Usuario', 'Parcial', 'POST /api/propuestas/:id/apoyos'],
        ['RF-18', 'Consulta de recursos', 'Listado de recursos juveniles.', 'Usuario', 'Parcial', 'GET /api/recursos'],
        ['RF-19', 'Consulta de cultura y eventos', 'Eventos culturales y actividades.', 'Usuario', 'Cumplido', 'GET /api/eventos'],
        ['RF-20', 'Panel de administración', 'Gestión de usuarios, anuncios, tareas y estadísticas.', 'Admin', 'Parcial', 'GET /api/admin'],
        ['RF-21', 'Gestión de usuarios', 'Alta, baja y modificación de usuarios.', 'Admin', 'Parcial', 'CRUD /api/admin/usuarios'],
        ['RF-22', 'Gestión de anuncios', 'Revisión masiva y edición de anuncios.', 'Admin', 'Parcial', 'GET/POST /api/admin/anuncios'],
        ['RF-23', 'Panel de moderación', 'Revisión de reportes y publicaciones pendientes.', 'Moderador', 'Parcial', 'GET /api/moderacion'],
        ['RF-24', 'Revisión de reportes', 'Acciones sobre reportes de contenido.', 'Moderador', 'Parcial', 'GET /api/moderacion/reportes'],
        ['RF-25', 'Mensajería interna', 'Envío de mensajes entre usuarios del staff.', 'Admin/Moderador', 'Parcial', 'GET/POST /api/admin/mensajes'],
        ['RF-26', 'Agenda institucional', 'Notas y fechas para administración.', 'Admin', 'Parcial', 'GET /api/admin/agenda'],
        ['RF-27', 'Comunicaciones institucionales', 'Borradores de comunicaciones con entidades.', 'Admin', 'Parcial', 'GET /api/admin/comunicaciones'],
        ['RF-28', 'Plantillas de comunicación', 'Gestión de plantillas para mensajes.', 'Admin', 'Parcial', 'GET /api/admin/plantillas'],
        ['RF-29', 'Dockerización y ejecución local', 'Levantar la aplicación con Docker Compose.', 'Sistema', 'Cumplido', 'docker compose up --build'],
        ['RF-30', 'Health check del backend', 'Endpoint de comprobación de salud.', 'Sistema', 'Cumplido', 'GET /health']
    ])
]),
('2.2', 2, '2.2. Requisitos no funcionales', [
    'Los requisitos no funcionales definen las cualidades que debe cumplir el sistema.',
    ('tabla', ['ID', 'Requisito', 'Descripción', 'Justificación', 'Estado'], [
        ['RNF-01', 'Usabilidad', 'Interfaz clara y navegación por secciones.', 'Reduce curva de aprendizaje.', 'Cumplido'],
        ['RNF-02', 'Accesibilidad básica', 'Contraste, etiquetas y estructura semántica.', 'Mejora legibilidad.', 'Parcial'],
        ['RNF-03', 'Diseño responsive', 'Adaptación a móvil y escritorio.', 'Uso en distintos dispositivos.', 'Cumplido'],
        ['RNF-04', 'Seguridad en autenticación', 'Contraseñas cifradas con bcrypt y JWT.', 'Protege cuentas.', 'Cumplido'],
        ['RNF-05', 'Validación de datos', 'Esquemas con Zod y validaciones de formulario.', 'Reduce datos erróneos.', 'Cumplido'],
        ['RNF-06', 'Mantenibilidad', 'Código modular en capas.', 'Facilita correcciones.', 'Cumplido'],
        ['RNF-07', 'Separación frontend/backend', 'Arquitectura cliente-servidor.', 'Claridad y escalabilidad.', 'Cumplido'],
        ['RNF-08', 'Persistencia en MySQL', 'Base de datos relacional con esquema.', 'Almacenamiento estructurado.', 'Cumplido'],
        ['RNF-09', 'Portabilidad con Docker', 'Contenedores para toda la pila.', 'Ejecución sin instalaciones.', 'Cumplido'],
        ['RNF-10', 'Rendimiento suficiente', 'Respuestas aceptables para entorno académico.', 'Uso en tribunal.', 'Parcial'],
        ['RNF-11', 'Compatibilidad', 'Navegadores modernos.', 'Uso generalizado.', 'Cumplido'],
        ['RNF-12', 'Claridad visual', 'Diseño con Tailwind CSS.', 'Consistencia visual.', 'Cumplido'],
        ['RNF-13', 'Protección básica de datos', 'Tratamiento mínimo y roles.', 'Cumplimiento básico.', 'Cumplido'],
        ['RNF-14', 'Escalabilidad futura', 'Arquitectura modular.', 'Permite ampliaciones.', 'Parcial'],
        ['RNF-15', 'Documentación de instalación', 'README y memoria.', 'Facilita la entrega.', 'Cumplido'],
        ['RNF-16', 'Control de errores', 'Manejo centralizado de errores.', 'Mejora robustez.', 'Parcial'],
        ['RNF-17', 'Organización del código', 'Carpetas por responsabilidad.', 'Mantenimiento.', 'Cumplido'],
        ['RNF-18', 'Reutilización de componentes', 'Componentes reutilizables en frontend.', 'Eficiencia.', 'Parcial'],
        ['RNF-19', 'Consistencia de interfaz', 'Paleta y componentes comunes.', 'Experiencia unificada.', 'Cumplido'],
        ['RNF-20', 'Facilidad de revisión', 'Docker y README claros.', 'Evaluación del tribunal.', 'Cumplido']
    ])
]),
('2.3', 2, '2.3. Historias de usuario', [
    'Las historias de usuario definen las interacciones de cada perfil con el sistema.',
    ('tabla', ['ID', 'Historia de usuario', 'Criterios de aceptación', 'Requisitos'], [
        ['HU-01', 'Como visitante, quiero ver anuncios, para conocer oportunidades juveniles.', 'El home muestra listado de anuncios.', 'RF-05'],
        ['HU-02', 'Como visitante, quiero filtrar por categoría, para encontrar contenido relevante.', 'Filtros de categoría funcionan.', 'RF-06'],
        ['HU-03', 'Como usuario, quiero registrarme, para publicar contenido.', 'Registro con datos válidos crea cuenta.', 'RF-01'],
        ['HU-04', 'Como usuario, quiero iniciar sesión, para acceder a mi perfil.', 'Login devuelve token y redirige.', 'RF-02'],
        ['HU-05', 'Como usuario, quiero publicar un anuncio, para compartir una oportunidad.', 'El formulario valida y guarda.', 'RF-08'],
        ['HU-06', 'Como usuario, quiero filtrar por provincia, para ver anuncios cercanos.', 'Selector de provincia aplica filtro.', 'RF-07'],
        ['HU-07', 'Como usuario, quiero guardar favoritos, para consultarlos después.', 'El anuncio aparece en guardados.', 'RF-11'],
        ['HU-08', 'Como usuario, quiero reportar contenido, para mantener la calidad.', 'Se envía reporte con motivo.', 'RF-12'],
        ['HU-09', 'Como usuario, quiero enviar sugerencias, para proponer mejoras.', 'El buzón almacena la sugerencia.', 'RF-15'],
        ['HU-10', 'Como usuario, quiero consultar propuestas, para apoyar ideas.', 'Página de propuestas accesible.', 'RF-16'],
        ['HU-11', 'Como usuario, quiero consultar cultura y eventos, para conocer actividades.', 'Sección cultura funcional.', 'RF-19'],
        ['HU-12', 'Como moderador, quiero revisar anuncios pendientes, para aprobar o rechazar.', 'Panel muestra pendientes.', 'RF-23'],
        ['HU-13', 'Como moderador, quiero gestionar reportes, para resolver incidencias.', 'Listado de reportes con acciones.', 'RF-24'],
        ['HU-14', 'Como administrador, quiero gestionar usuarios, para controlar el acceso.', 'CRUD de usuarios.', 'RF-21'],
        ['HU-15', 'Como administrador, quiero ver estadísticas, para entender el uso.', 'Dashboard con métricas.', 'RF-20']
    ])
]),
('2.4', 2, '2.4. Definición de tareas', [
    'El proyecto se descompone en tareas organizadas por fases.',
    ('tabla', ['ID', 'Fase', 'Tarea', 'Descripción', 'Estimadas', 'Reales', 'Resultado'], [
        ['T-01', 'Análisis inicial', 'Definir alcance y requisitos', 'Estudio de la idea y funcionalidades básicas.', '12', '15', 'Completado'],
        ['T-02', 'Diseño funcional', 'Diseñar casos de uso', 'Identificación de actores y flujos.', '10', '10', 'Completado'],
        ['T-03', 'Diseño BD', 'Modelar entidades', 'Esquema relacional en MySQL.', '12', '14', 'Completado'],
        ['T-04', 'Diseño UI', 'Prototipar pantallas', 'Bocetos de páginas principales.', '10', '8', 'Completado'],
        ['T-05', 'Configuración', 'Preparar repositorio', 'Inicialización y estructura de carpetas.', '6', '8', 'Completado'],
        ['T-06', 'Frontend', 'Desarrollar páginas', 'Implementación de rutas y componentes.', '40', '48', 'Completado'],
        ['T-07', 'Backend', 'Desarrollar API', 'Controladores, rutas y middleware.', '40', '45', 'Completado'],
        ['T-08', 'Base de datos', 'Conectar y poblar', 'Conexión mysql2 y datos demo.', '10', '12', 'Completado'],
        ['T-09', 'Autenticación', 'Login y roles', 'Registro, login y tokens JWT.', '10', '12', 'Completado'],
        ['T-10', 'Anuncios', 'Publicación y consulta', 'CRUD y filtros de anuncios.', '18', '22', 'Completado'],
        ['T-11', 'Filtros', 'Filtros territoriales', 'Comunidades y provincias.', '8', '10', 'Completado'],
        ['T-12', 'Comunidad', 'Publicaciones y comentarios', 'Foros por provincia.', '12', '10', 'Parcial'],
        ['T-13', 'Sugerencias', 'Buzón', 'Envío y listado de sugerencias.', '6', '6', 'Completado'],
        ['T-14', 'Propuestas', 'Propuestas y apoyos', 'Visualización y apoyo.', '8', '7', 'Parcial'],
        ['T-15', 'Cultura y eventos', 'Sección cultural', 'Eventos y actividades.', '10', '10', 'Completado'],
        ['T-16', 'Administración', 'Panel admin', 'Módulos de gestión.', '20', '24', 'Parcial'],
        ['T-17', 'Moderación', 'Panel moderador', 'Revisión y reportes.', '12', '14', 'Parcial'],
        ['T-18', 'Mensajería', 'Mensajes staff', 'Vista de mensajes.', '10', '8', 'Parcial'],
        ['T-19', 'Docker', 'Dockerización', 'Contenedores y Compose.', '8', '12', 'Completado'],
        ['T-20', 'Pruebas', 'Pruebas funcionales', 'Validación manual y con usuarios demo.', '10', '6', 'Parcial'],
        ['T-21', 'Documentación', 'README y memoria', 'Redacción de documentos.', '12', '14', 'Completado'],
        ['T-22', 'Cierre', 'Revisión final', 'Limpieza y entrega.', '6', '8', 'En curso']
    ])
]),
('2.5', 2, '2.5. Metodología', [
    'El proyecto utiliza una metodología mixta, puesto que combina una fase inicial de análisis y diseño con una implementación incremental. Esta forma de trabajo resulta adecuada para un proyecto académico, dado que permite definir primero una base funcional y después ampliar o corregir módulos según las necesidades detectadas durante el desarrollo.',
    'La fase de análisis inicial permitió identificar los requisitos básicos y la arquitectura. La fase de diseño definió el esquema de base de datos, las pantallas principales y la estructura de carpetas.',
    'El desarrollo incremental se organizó en bloques: autenticación, anuncios, filtros, comunidad, sugerencias, propuestas, cultura, administración, moderación y Docker. Cada bloque se probó de forma manual antes de pasar al siguiente.',
    'La revisión por entregas consistió en realizar commits con funcionalidades concretas. El historial de Git refleja esta evolución, con mensajes que describen el trabajo realizado en cada iteración.',
    'La corrección de errores se realizó de forma progresiva. Cuando un módulo presentaba problemas, se detenía el avance, se depuraba y se continuaba. Este enfoque evitó acumular fallos de difícil resolución.',
    'La documentación final se redactó una vez estabilizada la aplicación. El README contiene las instrucciones de instalación y la memoria describe el proyecto completo.'
]),
('2.6', 2, '2.6. Planificación temporal', [
    'La planificación se organiza en fases con horas previstas y reales.',
    ('tabla', ['Fase', 'Previsto', 'Real', 'Desviación', 'Motivo'], [
        ['Análisis inicial', '12', '15', '+3', 'Ajustes de alcance.'],
        ['Diseño', '22', '24', '+2', 'Refinamiento de BD y UI.'],
        ['Configuración', '6', '8', '+2', 'Problemas iniciales con Docker.'],
        ['Frontend', '40', '48', '+8', 'Ajustes de componentes.'],
        ['Backend', '40', '45', '+5', 'Validaciones y tipado.'],
        ['Base de datos', '10', '12', '+2', 'Inserción de datos demo.'],
        ['Docker', '8', '12', '+4', 'Configuración del proxy.'],
        ['Pruebas', '10', '6', '-4', 'Tiempo reducido por documentación.'],
        ['Documentación', '12', '14', '+2', 'Ampliación del README y memoria.']
    ]),
    'La desviación más importante se produjo en el frontend y en la dockerización. El ajuste del proxy entre frontend y backend en Docker requirió varias iteraciones. La planificación final se ha adaptado a estos retrasos sin perder los objetivos principales.'
]),
('2.7', 2, '2.7. Presupuesto', [
    'El presupuesto es académico y no contempla costes reales de contratación. Las horas corresponden al trabajo de la alumna y los costes de software son cero al emplear herramientas libres o gratuitas.',
    ('tabla', ['Concepto', 'Horas', 'Coste unitario', 'Total', 'Observación'], [
        ['Análisis', '15', '0', '0', 'Trabajo propio'],
        ['Diseño funcional', '12', '0', '0', 'Trabajo propio'],
        ['Diseño BD', '14', '0', '0', 'Trabajo propio'],
        ['Diseño UI', '8', '0', '0', 'Trabajo propio'],
        ['Implementación frontend', '48', '0', '0', 'Trabajo propio'],
        ['Implementación backend', '45', '0', '0', 'Trabajo propio'],
        ['Integración BD', '12', '0', '0', 'Trabajo propio'],
        ['Pruebas', '6', '0', '0', 'Trabajo propio'],
        ['Docker', '12', '0', '0', 'Trabajo propio'],
        ['Documentación', '14', '0', '0', 'Trabajo propio'],
        ['Memoria', '10', '0', '0', 'Trabajo propio'],
        ['Herramientas software', '-', '-', '0', 'Next.js, Node, MySQL, Docker libres'],
        ['Despliegue local', '-', '-', '0', 'Docker Desktop']
    ]),
    'Las herramientas utilizadas son de libre disposición: Node.js, npm, Next.js, React, TypeScript, Express, MySQL, Docker y Docker Compose. No se han contratado servicios externos ni licencias de pago. El coste total del presupuesto para el entorno académico es, por tanto, cero.'
]),
('2.8', 2, '2.8. Licencia o condiciones de distribución', [
    'El archivo package.json del repositorio declara una licencia MIT. Sin embargo, el proyecto se entrega con finalidad académica para su revisión dentro del módulo de Proyecto.',
    'La reutilización o publicación fuera de este contexto queda sujeta a la autorización de la autora. El tribunal puede consultar el código y ejecutar la aplicación para evaluación, pero no está autorizado a redistribuir el proyecto sin consentimiento.'
]),
('2.9', 2, '2.9. Análisis de riesgos', [
    'El análisis de riesgos identifica posibles problemas y las medidas para mitigarlos.',
    ('tabla', ['ID', 'Riesgo', 'Probabilidad', 'Impacto', 'Medida preventiva', 'Medida correctiva'], [
        ['R-01', 'Retraso en implementación', 'Media', 'Alta', 'Planificación con márgenes.', 'Reducir alcance si es necesario.'],
        ['R-02', 'Errores de conexión con MySQL', 'Media', 'Media', 'Uso de Docker y healthchecks.', 'Revisar variables de entorno.'],
        ['R-03', 'Problemas con Docker', 'Media', 'Media', 'Pruebas previas.', 'Documentar soluciones en README.'],
        ['R-04', 'Problemas de autenticación', 'Baja', 'Alta', 'Pruebas con usuarios demo.', 'Revisar tokens y roles.'],
        ['R-05', 'Pérdida de datos', 'Baja', 'Media', 'Copias en SQL y Git.', 'Restaurar desde init.sql.'],
        ['R-06', 'Validaciones incompletas', 'Media', 'Media', 'Uso de Zod y express-validator.', 'Añadir validaciones.'],
        ['R-07', 'Problemas responsive', 'Baja', 'Media', 'Diseño mobile-first.', 'Ajustar estilos.'],
        ['R-08', 'Incompatibilidad de versiones', 'Baja', 'Baja', 'Fijar versiones.', 'Actualizar package.json.'],
        ['R-09', 'Errores en despliegue local', 'Media', 'Media', 'Docker Compose documentado.', 'Revisar logs.'],
        ['R-10', 'Alcance excesivo', 'Media', 'Alta', 'Priorizar módulos.', 'Marcar funciones como parciales.'],
        ['R-11', 'Falta de tiempo para documentación', 'Media', 'Media', 'Documentar durante el desarrollo.', 'Priorizar secciones.'],
        ['R-12', 'Errores en rutas API', 'Baja', 'Alta', 'Pruebas de endpoints.', 'Revisar controladores.'],
        ['R-13', 'Errores en permisos de usuario', 'Baja', 'Alta', 'Middleware de roles.', 'Revisar protecciones.'],
        ['R-14', 'Consistencia territorial', 'Media', 'Media', 'Datos de comunidades y provincias.', 'Corregir seeds.']
    ]),
    ('2.10', 2, '2.10. Modelo de viabilidad social y ausencia de pasarela de pago', [
        'He planteado CityPAJ como una aplicación con fines sociales, no como un negocio. La idea no es vender nada ni cobrar a los usuarios, sino ofrecer una plataforma donde la juventud pueda consultar anuncios, eventos, recursos y propuestas organizados por territorio.',
        'Durante el diseño pensé en añadir una pasarela de pago, pero al final la descarté porque no encajaba con el propósito del proyecto. No hay productos, suscripciones ni compras dentro de la aplicación, por lo que integrar un TPV solo habría complicado el desarrollo sin aportar nada real. Además, así no tengo que manejar datos bancarios de ningún usuario.',
        'Mi enfoque de viabilidad se basa en el impacto social: si la aplicación es útil, fácil de usar y llega a jóvenes, entidades y ayuntamientos, el proyecto ya cumple su objetivo. Para mantenerlo en el tiempo, he considerado fuentes como colaboraciones institucionales, subvenciones para proyectos juveniles o digitales, y el apoyo de centros educativos que puedan usarlo como proyecto de referencia.',
        ('tabla', ['Aspecto', 'Decisión aplicada', 'Justificación'], [
            ['Finalidad del proyecto', 'Social y sin ánimo de lucro', 'Se centra en el acceso a información juvenil y la participación.'],
            ['Venta de productos', 'No se contempla', 'CityPAJ no es una tienda online.'],
            ['Pagos online', 'No se incorporan', 'No hay compras ni suscripciones en el flujo principal.'],
            ['Datos bancarios', 'No se tratan', 'Se reduce el riesgo y la complejidad legal.'],
            ['Complejidad técnica', 'Se evita integrar un TPV', 'Permite centrarme en la funcionalidad social.'],
            ['Viabilidad', 'Sostenibilidad institucional', 'El mantenimiento puede apoyarse en entidades públicas o educativas.']
        ]),
        ('tabla', ['Fuente de sostenibilidad', 'Aplicación en CityPAJ', 'Observación'], [
            ['Apoyo institucional', 'Colaboración con áreas de juventud', 'Coherente con el objetivo del proyecto.'],
            ['Subvenciones públicas', 'Proyectos juveniles o digitales', 'No implica cobro al usuario.'],
            ['Centros educativos', 'Uso formativo o demostrativo', 'Facilita el mantenimiento académico.'],
            ['Asociaciones juveniles', 'Difusión y validación de necesidades', 'Refuerza la participación.'],
            ['Servidor de bajo coste', 'Infraestructura ajustada', 'Reduce los gastos recurrentes.'],
            ['Software libre', 'Tecnologías abiertas', 'Disminuye la dependencia económica.']
        ])
    ])
]),
]
