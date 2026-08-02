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
} from '../controllers/admin-mensajes';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

// Resumen del panel
router.get('/resumen', auth, requireRole(['admin', 'moderador']), getAdminResumen);

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
router.get('/mensajes', auth, requireRole(['admin', 'moderador']), listarMensajes);
router.get('/mensajes/no-leidos', auth, requireRole(['admin', 'moderador']), contarNoLeidos);
router.post('/mensajes', auth, requireRole(['admin', 'moderador']), enviarMensaje);
router.get('/mensajes/staff', auth, requireRole(['admin', 'moderador']), listarStaff);
router.get('/mensajes/:id', auth, requireRole(['admin', 'moderador']), verMensaje);
router.patch('/mensajes/:id/leido', auth, requireRole(['admin', 'moderador']), marcarLeido);
router.delete('/mensajes/:id', auth, requireRole(['admin', 'moderador']), eliminarMensaje);
router.post('/mensajes/:id/adjuntos', auth, requireRole(['admin', 'moderador']), upload.single('archivo'), subirAdjunto);
router.get('/mensajes/adjuntos/:adjuntoId/descargar', auth, requireRole(['admin', 'moderador']), descargarAdjunto);

router.get('/logs', auth, requireRole(['admin']), getAdminLogs);
router.get('/estadisticas', auth, requireRole(['admin']), getEstadisticasGenerales);
router.get('/territorios', auth, requireRole(['admin']), getTerritorios);
router.get('/necesidades', auth, requireRole(['admin']), getNecesidadesJuveniles);

export { router as adminRoutes };
