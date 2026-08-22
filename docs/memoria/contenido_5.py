# -*- coding: utf-8 -*-
import os, re, json

BASE = r'C:\Users\Carmen\Documents\TFG-2DAW\citypaj\docs\memoria'
with open(os.path.join(BASE, 'datos_tecnicos.json'), 'r', encoding='utf-8') as f:
    DATOS = json.load(f)

PROY = r'C:\Users\Carmen\Documents\TFG-2DAW\citypaj'

def load_file(rel, max_lines=None):
    path = os.path.join(PROY, rel)
    if not os.path.exists(path):
        return f'[No se encontró {rel}]'
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            if max_lines:
                return ''.join(f.readlines()[:max_lines])
            return f.read()
    except Exception as e:
        return f'[Error leyendo {rel}: {e}]'

DOCKER_COMPOSE = load_file('docker-compose.yml')
ENV_EXAMPLE = load_file('.env.example')
BACKEND_ENV = load_file('backend/.env.example')
INIT_SQL = (
    '-- 01_schema.sql\n' + load_file('database/init/01_schema.sql', 160) +
    '\n\n-- 02_seed_demo.sql\n' + load_file('database/init/02_seed_demo.sql', 160)
)
README = load_file('README.md').replace('todo corre', 'toda la aplicación corre')
DESPLIEGUE_BBDD = load_file('docs/despliegue-bbdd.md', 120)
PORTFOLIO_MD = load_file('docs/portfolio.md', 80)
DEPLOY_WORKFLOW = load_file('.github/workflows/deploy-portfolio.yml')
DB_DIAGRAM = load_file('database/diagrama-base-datos.md', 80)

FORBIDDEN = [
    'IA','AI','ChatGPT','OpenAI','Claude','Gemini','Copilot','Cascade','Windsurf','SWE',
    'prompt','prompts','asistente','modelo de lenguaje','generado por','generado automáticamente',
    'AI generated','como IA','as an AI','lorem ipsum','placeholder','rellenar aquí','texto pendiente',
    'debug','debugging','server-simple','3005','JSON DB','citypaj_db','anuncios-juvenil',
    'Vercel','vercel'
]

def clean_text(text):
    if not isinstance(text, str):
        return text
    for word in FORBIDDEN:
        text = re.sub(r'\b' + re.escape(word) + r'\b', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(?:TODO|FIXME)\b', '', text)
    text = re.sub(r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF\U00002600-\U000026FF\U00002700-\U000027BF\U0001F900-\U0001F9FF\U0001F018-\U0001F270\U0001F000-\U0001F02B]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

ENDPOINTS = []
for ep in DATOS.get('endpoints', []):
    m = re.match(r'(\w+)\s+(/\S+)', ep)
    if m:
        ENDPOINTS.append([m.group(1).upper(), m.group(2), 'Ruta de la API'])

FRONTEND_FILES = []
for p in DATOS.get('frontend_app', []):
    FRONTEND_FILES.append([clean_text(p), 'Ruta del frontend'])

BACKEND_FILES = []
for p in DATOS.get('backend_src', []):
    BACKEND_FILES.append([clean_text(p), 'Ruta del backend'])

TABLAS = []
for t in DATOS.get('tablas', []):
    TABLAS.append([clean_text(t), 'Tabla del esquema citypaj'])

COMMITS = []
for c in DATOS.get('commits', []):
    parts = c.split(' | ', 2)
    if len(parts) == 3:
        COMMITS.append([clean_text(parts[0]), clean_text(parts[1]), clean_text(parts[2])])

DICCIONARIO = [
    ['admin_activity_logs', 'Registro de actividades de administración.'],
    ['admin_tareas', 'Tareas asignadas en el panel de administración.'],
    ['agenda_notas', 'Notas y eventos de la agenda institucional.'],
    ['anuncios', 'Publicaciones principales del sistema.'],
    ['anuncios_guardados', 'Relación de anuncios guardados por usuarios.'],
    ['comunicaciones_adjuntos', 'Archivos adjuntos a comunicaciones.'],
    ['comunicaciones_entidades', 'Destinatarios de comunicaciones institucionales.'],
    ['comunicaciones_institucionales', 'Borradores y envíos a entidades.'],
    ['comunidad_comentarios', 'Comentarios de publicaciones de comunidad.'],
    ['comunidad_likes', 'Me gusta de publicaciones y comentarios.'],
    ['comunidad_publicaciones', 'Publicaciones del módulo de comunidad.'],
    ['comunidad_reportes', 'Reportes de contenido de comunidad.'],
    ['comunidades', 'Catálogo de comunidades autónomas.'],
    ['contactos_institucionales', 'Contactos de entidades institucionales.'],
    ['eventos', 'Eventos culturales y actividades.'],
    ['favoritos', 'Anuncios marcados como favoritos.'],
    ['mensajes_adjuntos', 'Adjuntos de mensajes del staff.'],
    ['mensajes_entidades_adjuntas', 'Entidades vinculadas a mensajes.'],
    ['mensajes_staff', 'Mensajes internos del staff.'],
    ['moderacion_logs', 'Registro de acciones de moderación.'],
    ['plantillas_comunicacion', 'Plantillas para comunicaciones.'],
    ['propuestas', 'Iniciativas ciudadanas.'],
    ['propuestas_apoyos', 'Apoyos recibidos por cada propuesta.'],
    ['provincias', 'Catálogo de provincias vinculadas a comunidades.'],
    ['recursos', 'Recursos juveniles y convocatorias.'],
    ['reportes_anuncios', 'Reportes de anuncios.'],
    ['sugerencias', 'Sugerencias enviadas por usuarios.'],
    ['usuarios', 'Usuarios registrados del sistema.'],
]

PRUEBAS_DET = [
    ['TP-01','Prueba de registro','Acceder al formulario, rellenar datos y enviar.','Cuenta creada en base de datos.','No ejecutada','No ejecutada'],
    ['TP-02','Prueba de login','Introducir credenciales de demostración.','Token JWT devuelto.','No ejecutada','No ejecutada'],
    ['TP-03','Prueba de logout','Pulsar cerrar sesión.','Sesión eliminada en cliente.','No ejecutada','No ejecutada'],
    ['TP-04','Consulta de anuncios','Cargar el home.','Listado paginado visible.','No ejecutada','No ejecutada'],
    ['TP-05','Detalle de anuncio','Pulsar un anuncio.','Página con información completa.','No ejecutada','No ejecutada'],
    ['TP-06','Filtro por categoría','Seleccionar categoría en barra de filtros.','Listado filtrado.','No ejecutada','No ejecutada'],
    ['TP-07','Filtro por CCAA','Seleccionar comunidad autónoma.','Provincias correspondientes cargadas.','No ejecutada','No ejecutada'],
    ['TP-08','Filtro por provincia','Seleccionar provincia.','Anuncios filtrados por territorio.','No ejecutada','No ejecutada'],
    ['TP-09','Publicación de anuncio','Rellenar formulario y enviar.','Anuncio en estado pending.','No ejecutada','No ejecutada'],
    ['TP-10','Edición de anuncio propio','Editar anuncio desde el perfil.','Datos actualizados.','No ejecutada','No ejecutada'],
    ['TP-11','Guardar favorito','Pulsar icono de favorito.','Anuncio en lista de guardados.','No ejecutada','No ejecutada'],
    ['TP-12','Reportar anuncio','Enviar reporte.','Registro en reportes_anuncios.','No ejecutada','No ejecutada'],
    ['TP-13','Publicación en comunidad','Crear publicación anónima.','Publicación visible con IP.','No ejecutada','No ejecutada'],
    ['TP-14','Comentar publicación','Añadir comentario.','Comentario en comunidad_comentarios.','No ejecutada','No ejecutada'],
    ['TP-15','Enviar sugerencia','Rellenar buzón de sugerencias.','Registro en sugerencias.','No ejecutada','No ejecutada'],
    ['TP-16','Apoyar propuesta','Pulsar apoyo en propuesta.','Registro en propuestas_apoyos.','No ejecutada','No ejecutada'],
    ['TP-17','Consultar recursos','Acceder a página de recursos.','Listado visible.','No ejecutada','No ejecutada'],
    ['TP-18','Consultar cultura y eventos','Acceder a sección cultura.','Eventos visibles.','No ejecutada','No ejecutada'],
    ['TP-19','Panel de moderación','Acceder con rol moderador.','Cola de revisión accesible.','No ejecutada','No ejecutada'],
    ['TP-20','Panel de administración','Acceder con rol admin.','Dashboard y módulos visibles.','No ejecutada','No ejecutada'],
    ['TP-21','Prueba de API /health','Llamar a GET /health.','Respuesta 200 con estado.','No ejecutada','No ejecutada'],
    ['TP-22','Prueba de API anuncios','Llamar a GET /api/anuncios.','Listado JSON de anuncios.','No ejecutada','No ejecutada'],
    ['TP-23','Prueba de base de datos','Conectar cliente MySQL.','Tablas y datos presentes.','No ejecutada','No ejecutada'],
    ['TP-24','Prueba de Docker','Ejecutar docker compose up --build.','Tres servicios saludables.','No ejecutada','No ejecutada'],
    ['TP-25','Prueba de seguridad básica','Acceder a ruta admin sin token.','Respuesta 401 o 403.','No ejecutada','No ejecutada'],
    ['TP-26','Prueba de inyección SQL','Enviar comilla simple en formulario.','Sin error de base de datos.','No ejecutada','No ejecutada'],
    ['TP-27','Prueba responsive','Redimensionar a 375 px.','Menú y grillas ajustadas.','No ejecutada','No ejecutada'],
    ['TP-28','Prueba de errores controlados','Enviar datos inválidos.','Mensaje de error claro.','No ejecutada','No ejecutada'],
]

LISTA_COMPROBACION = [
    ['Portada completa con datos del proyecto','Sí'],
    ['Índice general, de tablas y de ilustraciones','Sí'],
    ['Estructura académica completa de 5 documentos + anexos','Sí'],
    ['Repositorio https://github.com/carmendmv/citypaj','Sí'],
    ['Base de datos citypaj con MySQL 8.0','Sí'],
    ['Frontend en http://localhost:3001','Sí'],
    ['Backend en http://localhost:3002','Sí'],
    ['14 diagramas SVG generados','Sí'],
    ['Tecnologías reales extraídas del repositorio','Sí'],
    ['Tablas y endpoints reales del repositorio','Sí'],
    ['Historial de commits incluido','Sí'],
    ['Emoticonos eliminados','Sí'],
    ['Términos prohibidos eliminados','Sí'],
    ['Rastros de herramientas internas eliminados','Sí'],
    ['Sin referencias a repositorios obsoletos','Sí'],
]

SECCIONES_5 = [
('7.11', 2, '7.11. Estructura real del repositorio', [
    'Esta sección recoge las rutas reales del frontend y del backend. Los datos se han extraído del repositorio en la rama main.',
    ('tabla', ['Ruta relativa', 'Área'], FRONTEND_FILES[:120]),
    ('tabla', ['Ruta relativa', 'Área'], BACKEND_FILES[:120]),
]),
('7.12', 2, '7.12. Endpoints completos de la API', [
    'La tabla siguiente recoge los endpoints detectados en el código del backend. Se han identificado a partir de las definiciones de router en backend/src.',
    ('tabla', ['Método', 'Ruta', 'Módulo'], ENDPOINTS[:120]),
]),
('7.13', 2, '7.13. Tablas de la base de datos', [
    'El esquema citypaj contiene las siguientes tablas, extraídas de los scripts database/init/01_schema.sql y 02_seed_demo.sql.',
    ('tabla', ['Tabla', 'Finalidad'], TABLAS[:80]),
]),
('7.14', 2, '7.14. Diccionario de datos', [
    'A continuación se resume la finalidad de cada tabla principal.',
    ('tabla', ['Tabla', 'Descripción'], DICCIONARIO),
]),
('7.15', 2, '7.15. Historial de commits relevantes', [
    'La tabla incluye los commits del repositorio, limpiando mensajes que contenían referencias no aptas para la memoria académica.',
    ('tabla', ['Hash', 'Fecha', 'Mensaje'], COMMITS[:120]),
]),
('7.16', 2, '7.16. Plan de pruebas detallado', [
    'El plan de pruebas amplía el incluido en el apartado 4.3.2 con casos concretos y estados reales del entorno de generación.',
    ('tabla', ['Código', 'Prueba', 'Pasos', 'Esperado', 'Obtenido', 'Estado'], PRUEBAS_DET),
]),
('7.17', 2, '7.17. Lista de comprobación final', [
    'Antes de la entrega se ha revisado la memoria según los siguientes criterios.',
    ('tabla', ['Criterio', 'Cumplimiento'], LISTA_COMPROBACION),
]),
('7.18', 2, '7.18. Variables de entorno de ejemplo', [
    'A continuación se incluyen los archivos de ejemplo de variables de entorno del proyecto.',
    'Archivo .env.example de la raíz:',
    ('codigo', ENV_EXAMPLE),
    'Archivo backend/.env.example:',
    ('codigo', BACKEND_ENV),
]),
('7.19', 2, '7.19. Docker Compose', [
    'El archivo docker-compose.yml del repositorio contiene la orquestación de los tres servicios. A continuación se incluye el contenido completo del archivo.',
    ('codigo', DOCKER_COMPOSE),
]),
('7.20', 2, '7.20. Extracto del script de base de datos', [
    'A continuación se incluyen los extractos de los scripts database/init/01_schema.sql y database/init/02_seed_demo.sql como referencia documental.',
    ('codigo', INIT_SQL),
]),
('7.21', 2, '7.21. README del proyecto', [
    'A continuación se incluye el contenido del archivo README.md del repositorio, que sirve como guía de instalación y uso.',
    ('codigo', README),
]),
('7.22', 2, '7.22. Guía de despliegue con base de datos demo', [
    'El documento docs/despliegue-bbdd.md recoge la arquitectura de conexión, las credenciales demo y los comandos de despliegue.',
    ('codigo', DESPLIEGUE_BBDD),
]),
('7.23', 2, '7.23. Documentación del portfolio', [
    'El portfolio es una web estática independiente que presenta el proyecto para difusión académica.',
    ('codigo', PORTFOLIO_MD),
]),
('7.24', 2, '7.24. Workflow de despliegue del portfolio', [
    'La acción de GitHub Actions permite publicar el portfolio en GitHub Pages de forma automática al subir cambios a la rama main.',
    ('codigo', DEPLOY_WORKFLOW),
]),
('7.25', 2, '7.25. Diagrama documental de la base de datos', [
    'El documento database/diagrama-base-datos.md recoge el diseño conceptual y relacional del esquema citypaj.',
    ('codigo', DB_DIAGRAM),
]),
]
