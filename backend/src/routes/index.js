import { Router } from 'express';
import authRoutes from './authRoutes.js';
import customerRoutes from './customerRoutes.js';
import chatRoutes from './chatRoutes.js';
import aiRoutes from './aiRoutes.js';
import ticketRoutes from './ticketRoutes.js';
import knowledgeRoutes from './knowledgeRoutes.js';
import recommendationRoutes from './recommendationRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/customers', customerRoutes);
apiRouter.use('/chat', chatRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/tickets', ticketRoutes);
apiRouter.use('/knowledge', knowledgeRoutes);
apiRouter.use('/recommendations', recommendationRoutes);
apiRouter.use('/analytics', analyticsRoutes);

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CX Intelligence API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default apiRouter;
