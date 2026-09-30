import { Router } from 'express';
import * as chatController from '../controllers/chatController.js';
import { authenticate, optionalAuthenticate } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { chatMessageSchema } from '../validators/allValidators.js';

const router = Router();

// Chat message can be sent by authenticated user or guest session
router.post('/message', optionalAuthenticate, validateRequest(chatMessageSchema), chatController.sendMessage);
router.post('/escalate', optionalAuthenticate, chatController.escalate);
router.post('/feedback', optionalAuthenticate, chatController.submitFeedback);

// Protected conversation lists
router.get('/conversations', authenticate, chatController.getConversations);
router.get('/conversations/:id', authenticate, chatController.getConversationById);

export default router;
