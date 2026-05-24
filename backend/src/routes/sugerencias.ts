import { Router } from 'express';
import {
  createSugerencia,
  getSugerencias,
  getEstadisticasSugerencias,
  updateSugerencia
} from '../controllers/sugerencias';

const router = Router();

// Crear nueva sugerencia
router.post('/', createSugerencia);

// Obtener todas las sugerencias con filtros
router.get('/', getSugerencias);

// Obtener estadísticas de sugerencias
router.get('/estadisticas', getEstadisticasSugerencias);

// Actualizar estado de una sugerencia
router.put('/:id', updateSugerencia);

export default router;
