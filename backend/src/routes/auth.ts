import { Router } from 'express';
import { auth } from '../middleware/auth';
import { login, register, logout, forgotPassword, resetPassword, refreshToken, updateProfile, me } from '../controllers/auth-simple';

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

// Current user
router.get('/me', auth, me);

// Update profile
router.put('/profile', auth, updateProfile);

export { router as authRoutes };
