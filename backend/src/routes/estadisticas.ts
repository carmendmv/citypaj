import { Router } from 'express';
import { getEstadisticasHome, getEstadisticasProvincia } from '../controllers/estadisticas';

const router = Router();

router.get('/home', getEstadisticasHome);
router.get('/provincia/:provincia', getEstadisticasProvincia);

export { router as estadisticasRoutes };
