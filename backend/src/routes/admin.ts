import { Router } from 'express';
import multer from 'multer';
import { auth, requireRole } from '../middleware/auth';
import { getAdminAnuncios } from '../controllers/admin-anuncios';
import {
  getAdminPublicaciones,
  getAdminRespuestas,
  updatePublicacionEstado,
  updateRespuestaEstado,
  getAdminReportes,
  revisarReporte
} from '../controllers/admin-comunidad';
import { getAdminResumen } from '../controllers/admin-resumen';
import { getAdminLogs } from '../controllers/admin-logs';
import { getEstadisticasGenerales, getTerritorios, getNecesidadesJuveniles } from '../controllers/admin-estadisticas';
import { getAdminUsuarios, getAdminUsuarioById, updateRolUsuario, updateEstadoUsuario, createModerador } from '../controllers/admin-usuarios';
import {
  listarMensajes,
  contarNoLeidos,
  enviarMensaje,
  marcarLeido,
  eliminarMensaje,
  listarStaff,
  verMensaje,
  subirAdjunto,
  descargarAdjunto,
  responderMensaje,
  archivarMensaje,
} from '../controllers/admin-mensajes';
import { buscarDestinatarios } from '../controllers/admin-destinatarios';
import { getNecesidades, getAccionesDashboard } from '../controllers/admin-resumen';
import {
  listarContactos,
  getContacto,
  crearContacto,
  actualizarContacto,
  verificarContacto,
  eliminarContacto,
} from '../controllers/admin-contactos';
import {
  listarPlantillas,
  getPlantilla,
  crearPlantilla,
  actualizarPlantilla,
  eliminarPlantilla,
  generarBorrador,
} from '../controllers/admin-plantillas';
import {
  listarComunicaciones,
  getComunicacion,
  crearComunicacion,
  actualizarComunicacion,
  marcarEnviado,
  exportarComunicacion,
  eliminarComunicacion,
  agregarEntidades as agregarEntidadesComunicacion,
} from '../controllers/admin-comunicaciones';
import {
  listarTareas,
  getTarea,
  crearTarea,
  actualizarTarea,
  cambiarEstadoTarea,
  eliminarTarea,
} from '../controllers/admin-tareas';
import {
  listarNotas,
  getNota,
  crearNota,
  actualizarNota,
  eliminarNota,
} from '../controllers/admin-agenda';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

const router = Router();

// Resumen del panel
router.get('/resumen', auth, requireRole(['admin', 'moderador']), getAdminResumen);
router.get('/dashboard', auth, requireRole(['admin', 'moderador']), getAccionesDashboard);
router.get('/necesidades', auth, requireRole(['admin', 'moderador']), getNecesidades);

// GET /api/admin/anuncios - listado filtrado y paginado para el panel de moderación
router.get('/anuncios', auth, requireRole(['admin', 'moderador']), getAdminAnuncios);

// Comunidad
router.get('/comunidad', auth, requireRole(['admin', 'moderador']), getAdminPublicaciones);
router.get('/comunidad/respuestas', auth, requireRole(['admin', 'moderador']), getAdminRespuestas);
router.get('/comunidad/reportes', auth, requireRole(['admin', 'moderador']), getAdminReportes);
router.patch('/comunidad/publicaciones/:id/estado', auth, requireRole(['admin', 'moderador']), updatePublicacionEstado);
router.patch('/comunidad/respuestas/:id/estado', auth, requireRole(['admin', 'moderador']), updateRespuestaEstado);
router.patch('/comunidad/reportes/:id/revisar', auth, requireRole(['admin', 'moderador']), revisarReporte);

// Usuarios y moderadores (solo administradores)
router.get('/usuarios', auth, requireRole(['admin']), getAdminUsuarios);
router.get('/usuarios/:id', auth, requireRole(['admin']), getAdminUsuarioById);
router.patch('/usuarios/:id/rol', auth, requireRole(['admin']), updateRolUsuario);
router.patch('/usuarios/:id/estado', auth, requireRole(['admin']), updateEstadoUsuario);
router.get('/moderadores', auth, requireRole(['admin']), getAdminUsuarios);
router.post('/moderadores', auth, requireRole(['admin']), createModerador);

// Mensajería interna entre staff
router.get('/destinatarios/buscar', auth, requireRole(['admin', 'moderador']), buscarDestinatarios);

router.get('/mensajes', auth, requireRole(['admin', 'moderador']), listarMensajes);
router.get('/mensajes/no-leidos', auth, requireRole(['admin', 'moderador']), contarNoLeidos);
router.post('/mensajes', auth, requireRole(['admin', 'moderador']), enviarMensaje);
router.get('/mensajes/staff', auth, requireRole(['admin', 'moderador']), listarStaff);
router.get('/mensajes/:id', auth, requireRole(['admin', 'moderador']), verMensaje);
router.post('/mensajes/:id/responder', auth, requireRole(['admin', 'moderador']), responderMensaje);
router.patch('/mensajes/:id/leido', auth, requireRole(['admin', 'moderador']), marcarLeido);
router.patch('/mensajes/:id/archivar', auth, requireRole(['admin', 'moderador']), archivarMensaje);
router.delete('/mensajes/:id', auth, requireRole(['admin', 'moderador']), eliminarMensaje);
router.post('/mensajes/:id/adjuntos', auth, requireRole(['admin', 'moderador']), upload.single('archivo'), subirAdjunto);
router.get('/mensajes/adjuntos/:adjuntoId/descargar', auth, requireRole(['admin', 'moderador']), descargarAdjunto);

router.get('/logs', auth, requireRole(['admin']), getAdminLogs);
router.get('/estadisticas', auth, requireRole(['admin']), getEstadisticasGenerales);
router.get('/territorios', auth, requireRole(['admin']), getTerritorios);
router.get('/necesidades-juveniles', auth, requireRole(['admin']), getNecesidadesJuveniles);

// Contactos institucionales
router.get('/contactos-institucionales', auth, requireRole(['admin']), listarContactos);
router.get('/contactos-institucionales/:id', auth, requireRole(['admin']), getContacto);
router.post('/contactos-institucionales', auth, requireRole(['admin']), crearContacto);
router.put('/contactos-institucionales/:id', auth, requireRole(['admin']), actualizarContacto);
router.patch('/contactos-institucionales/:id/verificar', auth, requireRole(['admin']), verificarContacto);
router.delete('/contactos-institucionales/:id', auth, requireRole(['admin']), eliminarContacto);

// Plantillas de comunicación (lectura también para moderadores)
router.get('/plantillas', auth, requireRole(['admin', 'moderador']), listarPlantillas);
router.get('/plantillas/:id', auth, requireRole(['admin', 'moderador']), getPlantilla);
router.post('/plantillas', auth, requireRole(['admin']), crearPlantilla);
router.post('/plantillas/:id/generar-borrador', auth, requireRole(['admin', 'moderador']), generarBorrador);
router.put('/plantillas/:id', auth, requireRole(['admin']), actualizarPlantilla);
router.delete('/plantillas/:id', auth, requireRole(['admin']), eliminarPlantilla);

// Comunicaciones institucionales
router.get('/comunicaciones', auth, requireRole(['admin']), listarComunicaciones);
router.get('/comunicaciones/:id', auth, requireRole(['admin']), getComunicacion);
router.post('/comunicaciones', auth, requireRole(['admin']), crearComunicacion);
router.put('/comunicaciones/:id', auth, requireRole(['admin']), actualizarComunicacion);
router.patch('/comunicaciones/:id/enviado', auth, requireRole(['admin']), marcarEnviado);
router.delete('/comunicaciones/:id', auth, requireRole(['admin']), eliminarComunicacion);
router.get('/comunicaciones/:id/exportar', auth, requireRole(['admin']), exportarComunicacion);
router.post('/comunicaciones/:id/entidades', auth, requireRole(['admin']), agregarEntidadesComunicacion);

// Tareas de seguimiento
router.get('/tareas', auth, requireRole(['admin', 'moderador']), listarTareas);
router.get('/tareas/:id', auth, requireRole(['admin', 'moderador']), getTarea);
router.post('/tareas', auth, requireRole(['admin']), crearTarea);
router.put('/tareas/:id', auth, requireRole(['admin']), actualizarTarea);
router.patch('/tareas/:id/estado', auth, requireRole(['admin', 'moderador']), cambiarEstadoTarea);
router.delete('/tareas/:id', auth, requireRole(['admin']), eliminarTarea);

// Agenda compartida (admin y moderador)
router.get('/agenda', auth, requireRole(['admin', 'moderador']), listarNotas);
router.get('/agenda/:id', auth, requireRole(['admin', 'moderador']), getNota);
router.post('/agenda', auth, requireRole(['admin', 'moderador']), crearNota);
router.put('/agenda/:id', auth, requireRole(['admin', 'moderador']), actualizarNota);
router.delete('/agenda/:id', auth, requireRole(['admin', 'moderador']), eliminarNota);

export { router as adminRoutes };
