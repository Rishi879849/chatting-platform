import { Router } from 'express';
import { getThreads, getThreadById, createThread, addReply, upvoteThread, markSolution } from '../controllers/threadController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { creationLimiter } from '../middleware/rateLimiter.js';
import { createThreadSchema, addReplySchema, solutionSchema } from '../schemas/threadSchemas.js';

const router = Router();

router.get('/', optionalAuth, getThreads);
router.get('/:id', optionalAuth, getThreadById);

// Protected mutation routes
router.post('/', authenticateToken, creationLimiter, validate(createThreadSchema), createThread);
router.post('/:id/replies', authenticateToken, creationLimiter, validate(addReplySchema), addReply);
router.post('/:id/upvote', authenticateToken, upvoteThread);
router.post('/solution', authenticateToken, validate(solutionSchema), markSolution);

export default router;
