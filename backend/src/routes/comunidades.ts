import { Router } from 'express';
import { getComunidades, getComunidadById, getCategorias, getEstadisticas } from '../controllers/comunidades';

const router = Router();

// GET /api/comunidades - Obtener todas las comunidades autónomas
router.get('/', getComunidades);

// GET /api/comunidades/:id - Obtener comunidad por ID
router.get('/:id', getComunidadById);

// GET /api/comunidades/categorias - Obtener categorías disponibles
router.get('/categorias/list', getCategorias);

// GET /api/comunidades/estadisticas - Obtener estadísticas de la plataforma
router.get('/estadisticas/general', getEstadisticas);

export default router;
