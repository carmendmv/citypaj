import { Router, Request, Response } from 'express';
import { getComunidadById, getComunidadByNombre } from '@/lib/territorios';

const router = Router();

router.get('/:comunidad', (req: Request, res: Response) => {
  const comunidad = getComunidadById(req.params.comunidad) || getComunidadByNombre(req.params.comunidad);
  if (!comunidad) {
    res.status(404).json({ success: false, error: 'Comunidad autónoma no encontrada' });
    return;
  }
  res.json({
    success: true,
    data: {
      comunidad: comunidad.nombre,
      provincias: comunidad.provincias.map(p => p.nombre)
    }
  });
});

export default router;
