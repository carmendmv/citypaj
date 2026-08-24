import { Router } from 'express';
import { auth, requireRole } from '../middleware/auth';
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

// Update sugerencia (status) - admin / moderador
router.put('/:id', auth, requireRole(['admin', 'moderador']), updateSugerencia);

// Delete sugerencia - admin / moderador
router.delete('/:id', auth, requireRole(['admin', 'moderador']), deleteSugerencia);

export default router;
