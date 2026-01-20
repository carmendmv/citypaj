import { Router } from 'express';

const router = Router();

// Perfil de usuario
router.get('/perfil', (_req, res) => {
  // TODO: Implementar perfil real
  res.json({
    success: true,
    data: {
      id: '1',
      email: 'test@citypaj.es',
      nombre: 'Usuario Test',
    },
  });
});

export { router as usuariosRoutes };
