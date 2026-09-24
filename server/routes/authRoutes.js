import express from 'express';
import { register, login, adminLogin, logout, forgotPassword, resetPassword } from '../controllers/authController.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/admin-login', authLimiter, validate(loginSchema), adminLogin);
router.post('/logout', authLimiter, logout);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);

export default router;