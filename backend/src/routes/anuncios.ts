import { Router } from 'express';
import { optionalAuth } from '../middleware/auth';
import {
  getAnuncios,
  getAnuncioById,
  createAnuncio,
  updateAnuncio,
  deleteAnuncio,
  guardarAnuncio,
  eliminarGuardado,
  reportarAnuncio,
  getAnunciosModeracion,
  getReportesAnuncio,
  moderarAnuncio,
  moderarAnuncioIA
} from '../controllers/anuncios-mysql';

const router = Router();

// Get all anuncios with pagination
router.get('/', getAnuncios);

// Get anuncios pending moderation/reported
router.get('/moderacion', getAnunciosModeracion);

// Get anuncio by ID
router.get('/:id', getAnuncioById);

// Create new anuncio
router.post('/', optionalAuth, createAnuncio);

// Update anuncio
router.put('/:id', updateAnuncio);

// Get reports for an ad
router.get('/:id/reportes', getReportesAnuncio);

// Moderate ad
router.post('/:id/moderar', moderarAnuncio);

// Moderate ad with IA
router.post('/:id/moderar-ia', moderarAnuncioIA);

// Delete anuncio
router.delete('/:id', deleteAnuncio);

// Guardar favorito
router.post('/:id/guardar', guardarAnuncio);

// Eliminar favorito
router.delete('/:id/guardar', eliminarGuardado);

// Reportar anuncio
router.post('/:id/reportar', reportarAnuncio);

export { router as anunciosRoutes };
