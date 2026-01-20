import { Router } from 'express';

const router = Router();

// Cola de moderación
router.get('/cola', (_req, res) => {
  // TODO: Implementar cola real
  res.json({
    success: true,
    data: [],
    meta: {
      total: 0,
      pagina: 1,
      limite: 20,
    },
  });
});

export { router as moderacionRoutes };
