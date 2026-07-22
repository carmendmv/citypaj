import { Router } from 'express';
import {
  getPublicaciones,
  getPublicacionById,
  createPublicacion,
  createComentario,
  reportarPublicacion,
  getComunidadesProvincias
} from '../controllers/comunidad';

const router = Router();

router.get('/provincias', getComunidadesProvincias);
router.get('/', getPublicaciones);
router.get('/:provincia', getPublicaciones);
router.post('/', createPublicacion);
router.get('/publicacion/:id', getPublicacionById);
router.post('/publicacion/:id/comentarios', createComentario);
router.post('/publicacion/:id/reportar', reportarPublicacion);

export { router as comunidadRoutes };
