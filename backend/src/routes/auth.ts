import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';
import { 
  register, 
  login, 
  logout, 
  refreshToken, 
  getProfile 
} from '../controllers/auth';

const router = Router();

// Registro
router.post('/register',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('nombre').isLength({ min: 2, max: 100 }).trim().withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('turnstileToken').optional().isString(),
  ]),
  register
);

// Login
router.post('/login',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ]),
  login
);

// Logout
router.post('/logout', logout);

// Refresh token
router.post('/refresh',
  validate([
    body('refresh_token').notEmpty().withMessage('Refresh token es obligatorio'),
  ]),
  refreshToken
);

// Obtener perfil (requiere autenticación)
router.get('/profile', getProfile);

export { router as authRoutes };
