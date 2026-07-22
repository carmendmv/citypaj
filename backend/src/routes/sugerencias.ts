import { Router } from 'express';
import {
  getSugerencias,
  createSugerencia,
  getSugerenciaById,
  updateSugerencia,
  deleteSugerencia,
  getEstadisticasSugerencias
} from '../controllers/sugerencias';

const router = Router();

// Get all sugerencias with filters
router.get('/', getSugerencias);

// Create new sugerencia
router.post('/', createSugerencia);

// Get estadisticas
router.get('/estadisticas', getEstadisticasSugerencias);

// Get sugerencia by ID
router.get('/:id', getSugerenciaById);

// Update sugerencia (status)
router.put('/:id', updateSugerencia);

// Delete sugerencia
router.delete('/:id', deleteSugerencia);

export default router;
