import { Router } from 'express';
import { getEventos, createEvento } from '../controllers/eventos';

const router = Router();

router.get('/', getEventos);
router.post('/', createEvento);

export { router as eventosRoutes };
