import { Router, Request, Response } from 'express';
import { getComunidades, getProvincias, getComunidadById, getComunidadByNombre, validarTerritorio } from '@/lib/territorios';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: getComunidades().map(c => ({
      id: c.id,
      nombre: c.nombre,
      tipo: c.tipo,
      provincias: c.provincias
    }))
  });
});

router.get('/comunidades', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: getComunidades().map(c => ({
      id: c.id,
      nombre: c.nombre,
      tipo: c.tipo
    }))
  });
});

router.get('/provincias', (req: Request, res: Response) => {
  const { comunidad } = req.query;
  if (typeof comunidad !== 'string' || !comunidad) {
    res.status(400).json({ success: false, error: 'Debes indicar una comunidad autónoma' });
    return;
  }

  const comunidadEncontrada = getComunidadById(comunidad) || getComunidadByNombre(comunidad);
  if (!comunidadEncontrada) {
    res.status(404).json({ success: false, error: 'Comunidad autónoma no encontrada' });
    return;
  }

  res.json({
    success: true,
    data: {
      comunidad: comunidadEncontrada.nombre,
      provincias: getProvincias(comunidadEncontrada.id)
    }
  });
});

router.get('/validar', (req: Request, res: Response) => {
  const { comunidad, provincia } = req.query;
  const resultado = validarTerritorio(
    typeof comunidad === 'string' ? comunidad : undefined,
    typeof provincia === 'string' ? provincia : undefined
  );
  res.json({ success: true, data: resultado });
});

export default router;
