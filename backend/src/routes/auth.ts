import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';

const router = Router();

// Registro
router.post('/register',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('nombre').isLength({ min: 2, max: 100 }).trim(),
  ]),
  async (_req, res) => {
    // TODO: Implementar registro real
    res.json({
      success: true,
      message: 'Usuario registrado correctamente',
    });
  }
);

// Login
router.post('/login',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ]),
  async (req, res) => {
    // TODO: Implementar login real
    res.json({
      success: true,
      data: {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        usuario: {
          id: '1',
          email: req.body.email,
          nombre: 'Usuario Test',
        },
      },
    });
  }
);

// Logout
router.post('/logout', (_req, res) => {
  res.json({
    success: true,
    message: 'Sesión cerrada correctamente',
  });
});

export { router as authRoutes };
