import { Router } from 'express';
import { verifyCollegeEmail, toggleIdentityMode } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { verifyCollegeSchema } from '../schemas/authSchemas.js';

const router = Router();

router.post('/verify-college', authenticateToken, validate(verifyCollegeSchema), verifyCollegeEmail);
router.post('/toggle-identity', authenticateToken, toggleIdentityMode);

export default router;
