import { Router } from 'express';
import { login, register, logout, forgotPassword, resetPassword, refreshToken } from '../controllers/auth-simple';

const router = Router();

// Login
router.post('/login', login);

// Register
router.post('/register', register);

// Logout
router.post('/logout', logout);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password', resetPassword);

// Refresh token
router.post('/refresh', refreshToken);

export { router as authRoutes };
