import { Router } from 'express';
import { getReportes, getReporteById, updateReporte } from '../controllers/reportes';

const router = Router();

router.get('/', getReportes);
router.get('/:id', getReporteById);
router.put('/:id', updateReporte);

export { router as reportesRoutes };
