import { Router } from 'express';
import { register, login, refreshSession, logout, getMe } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { authenticateToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '../schemas/authSchemas.js';

const router = Router();

// Public routes with brute-force lockout rate limiting
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refreshSession);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticateToken, getMe);

export default router;
