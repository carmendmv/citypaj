import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken,
  verifyEmail,
  updateProfile,
  me,
} from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', auth, me);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.put('/profile', auth, updateProfile);

export { router as authRoutes };
