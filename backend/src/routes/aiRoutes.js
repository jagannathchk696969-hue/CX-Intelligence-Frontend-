import { Router } from 'express';
import * as aiController from '../controllers/aiController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/sentiment', aiController.analyzeSentiment);
router.get('/analysis/:messageId', authenticate, aiController.getAnalysisByMessageId);

export default router;
