import { Router } from 'express';
import { getContenidoModeracion, moderarContenido } from '../controllers/moderacion';

const router = Router();

router.get('/', getContenidoModeracion);
router.post('/:id/moderate', moderarContenido);

export { router as moderacionRoutes };
