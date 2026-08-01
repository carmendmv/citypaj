import { Router } from 'express';
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
import { getAdminUsuarios, getAdminUsuarioById, updateRolUsuario } from '../controllers/admin-usuarios';
import {
  listarMensajes,
  contarNoLeidos,
  enviarMensaje,
  marcarLeido,
  eliminarMensaje,
  listarStaff,
} from '../controllers/admin-mensajes';

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

// Usuarios (solo administradores)
router.get('/usuarios', auth, requireRole(['admin']), getAdminUsuarios);
router.get('/usuarios/:id', auth, requireRole(['admin']), getAdminUsuarioById);
router.patch('/usuarios/:id/rol', auth, requireRole(['admin']), updateRolUsuario);

// Mensajería interna entre staff
router.get('/mensajes', auth, requireRole(['admin', 'moderador']), listarMensajes);
router.get('/mensajes/no-leidos', auth, requireRole(['admin', 'moderador']), contarNoLeidos);
router.post('/mensajes', auth, requireRole(['admin', 'moderador']), enviarMensaje);
router.get('/mensajes/staff', auth, requireRole(['admin', 'moderador']), listarStaff);
router.patch('/mensajes/:id/leido', auth, requireRole(['admin', 'moderador']), marcarLeido);
router.delete('/mensajes/:id', auth, requireRole(['admin', 'moderador']), eliminarMensaje);

export { router as adminRoutes };
