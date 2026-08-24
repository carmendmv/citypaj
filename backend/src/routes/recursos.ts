import { Router } from 'express';
import { getRecursos, createRecurso } from '../controllers/recursos';

const router = Router();

router.get('/', getRecursos);
router.post('/', createRecurso);

export { router as recursosRoutes };
