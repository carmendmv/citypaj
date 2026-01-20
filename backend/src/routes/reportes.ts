import { Router } from 'express';

const router = Router();

// Crear reporte
router.post('/', (_req, res) => {
  // TODO: Implementar reporte real
  res.json({
    success: true,
    message: 'Reporte creado correctamente',
  });
});

export { router as reportesRoutes };
