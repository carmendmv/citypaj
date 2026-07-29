import { Router } from 'express';
import { auth, requireRole } from '../middleware/auth';
import { getAdminAnuncios } from '../controllers/admin-anuncios';

const router = Router();

// GET /api/admin/anuncios - listado filtrado y paginado para el panel de moderación
router.get('/anuncios', auth, requireRole(['admin', 'moderador']), getAdminAnuncios);

export { router as adminRoutes };
