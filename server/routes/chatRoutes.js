import { Router } from 'express';
import { getMessages, sendMessage, upvoteMessage, createChannel } from '../controllers/chatController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { creationLimiter } from '../middleware/rateLimiter.js';
import { createMessageSchema, createChannelSchema } from '../schemas/chatSchemas.js';

const router = Router();

router.get('/messages', optionalAuth, getMessages);
router.post('/messages', authenticateToken, creationLimiter, validate(createMessageSchema), sendMessage);
router.post('/messages/:id/upvote', authenticateToken, upvoteMessage);
router.post('/channels', authenticateToken, validate(createChannelSchema), createChannel);

export default router;
