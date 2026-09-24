import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';
const router = express.Router();
router.use(requireAuth);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
export default router;