import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);
router.use(requireRole('admin', 'support_agent', 'customer'));

router.get('/overview', analyticsController.getOverview);
router.get('/sentiment', analyticsController.getSentimentAnalytics);
router.get('/engagement', analyticsController.getEngagementTrends);
router.get('/support', analyticsController.getSupportAnalytics);

export default router;
