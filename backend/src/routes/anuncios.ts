import { Router } from 'express';
import { auth, optionalAuth, requireRole } from '../middleware/auth';
import {
  getAnuncios,
  getAnuncioById,
  getAnunciosGuardados,
  createAnuncio,
  updateAnuncio,
  deleteAnuncio,
  guardarAnuncio,
  eliminarGuardado,
  reportarAnuncio,
  getAnunciosModeracion,
  getReportesAnuncio,
  moderarAnuncio,
  moderarAnunciosBulk,
  moderarAnuncioIA,
  getMisAnuncios
} from '../controllers/anuncios-mysql';

const router = Router();

// Get all anuncios with pagination
router.get('/', getAnuncios);

// Get anuncios pending moderation/reported
router.get('/moderacion', auth, requireRole(['admin', 'moderador']), getAnunciosModeracion);

// Get anuncios del usuario autenticado
router.get('/mis-anuncios', auth, getMisAnuncios);

// Get anuncios guardados por IDs
router.post('/guardados', getAnunciosGuardados);

// Get anuncio by ID
router.get('/:id', getAnuncioById);

// Create new anuncio
router.post('/', optionalAuth, createAnuncio);

// Update anuncio
router.put('/:id', auth, updateAnuncio);

// Get reports for an ad
router.get('/:id/reportes', auth, requireRole(['admin', 'moderador']), getReportesAnuncio);

// Moderate ad
router.post('/:id/moderar', auth, requireRole(['admin', 'moderador']), moderarAnuncio);

// Moderate multiple ads in bulk
router.post('/moderar-bulk', auth, requireRole(['admin', 'moderador']), moderarAnunciosBulk);

// Moderate ad with IA
router.post('/:id/moderar-ia', auth, requireRole(['admin', 'moderador']), moderarAnuncioIA);

// Delete anuncio
router.delete('/:id', auth, deleteAnuncio);

// Guardar favorito
router.post('/:id/guardar', guardarAnuncio);

// Eliminar favorito
router.delete('/:id/guardar', eliminarGuardado);

// Reportar anuncio
router.post('/:id/reportar', reportarAnuncio);

export { router as anunciosRoutes };
