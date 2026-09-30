import { Router } from 'express';
import * as knowledgeController from '../controllers/knowledgeController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { createKnowledgeSchema } from '../validators/allValidators.js';

const router = Router();

// Publicly readable by authenticated users or agents
router.get('/', knowledgeController.getKnowledgeArticles);
router.get('/:id', knowledgeController.getKnowledgeArticleById);

// Admin-only management
router.post('/', authenticate, requireRole('admin'), validateRequest(createKnowledgeSchema), knowledgeController.createKnowledgeArticle);
router.put('/:id', authenticate, requireRole('admin'), knowledgeController.updateKnowledgeArticle);
router.delete('/:id', authenticate, requireRole('admin'), knowledgeController.deleteKnowledgeArticle);

export default router;
