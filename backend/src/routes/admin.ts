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

const router = Router();

// GET /api/admin/anuncios - listado filtrado y paginado para el panel de moderación
router.get('/anuncios', auth, requireRole(['admin', 'moderador']), getAdminAnuncios);

// Comunidad
router.get('/comunidad', auth, requireRole(['admin', 'moderador']), getAdminPublicaciones);
router.get('/comunidad/respuestas', auth, requireRole(['admin', 'moderador']), getAdminRespuestas);
router.get('/comunidad/reportes', auth, requireRole(['admin', 'moderador']), getAdminReportes);
router.patch('/comunidad/publicaciones/:id/estado', auth, requireRole(['admin', 'moderador']), updatePublicacionEstado);
router.patch('/comunidad/respuestas/:id/estado', auth, requireRole(['admin', 'moderador']), updateRespuestaEstado);
router.patch('/comunidad/reportes/:id/revisar', auth, requireRole(['admin', 'moderador']), revisarReporte);

export { router as adminRoutes };
