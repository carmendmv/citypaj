import { Router } from 'express';
import { optionalAuth } from '../middleware/auth';
import {
  getTemas,
  getProvincias,
  getPublicaciones,
  getPublicacionById,
  createPublicacion,
  createRespuesta,
  likePublicacion,
  unlikePublicacion,
  likeRespuesta,
  unlikeRespuesta,
  reportarPublicacion,
  reportarRespuesta
} from '../controllers/comunidad';

const router = Router();

// Datos auxiliares
router.get('/temas', getTemas);
router.get('/provincias', getProvincias);

// Publicaciones públicas
router.get('/publicacion/:id', optionalAuth, getPublicacionById);
router.get('/provincia/:provincia', getPublicaciones);
router.get('/', getPublicaciones);

// Acciones con autenticación opcional
router.post('/', optionalAuth, createPublicacion);
router.post('/publicaciones/:id/respuestas', optionalAuth, createRespuesta);
router.post('/publicaciones/:id/like', optionalAuth, likePublicacion);
router.delete('/publicaciones/:id/like', optionalAuth, unlikePublicacion);
router.post('/publicaciones/:id/reportar', optionalAuth, reportarPublicacion);
router.post('/respuestas/:id/like', optionalAuth, likeRespuesta);
router.delete('/respuestas/:id/like', optionalAuth, unlikeRespuesta);
router.post('/respuestas/:id/reportar', optionalAuth, reportarRespuesta);

export { router as comunidadRoutes };
