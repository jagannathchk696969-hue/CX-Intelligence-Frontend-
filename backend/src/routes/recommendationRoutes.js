import { Router } from 'express';
import * as recommendationController from '../controllers/recommendationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);
router.get('/:customerId', recommendationController.getRecommendationsByCustomer);

export default router;
