import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../validators/userValidator.js';

const router = express.Router();
router.use(requireAuth);
router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileSchema), updateProfile);
export default router;