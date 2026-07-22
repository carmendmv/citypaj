import { Router } from 'express';
import {
  getPropuestas,
  getPropuestaById,
  createPropuesta,
  apoyarPropuesta
} from '../controllers/propuestas';

const router = Router();

router.get('/', getPropuestas);
router.get('/:id', getPropuestaById);
router.post('/', createPropuesta);
router.post('/:id/apoyar', apoyarPropuesta);

export { router as propuestasRoutes };
