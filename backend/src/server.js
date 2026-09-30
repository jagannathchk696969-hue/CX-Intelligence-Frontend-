import app from './app.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

const PORT = config.port || 5000;

const server = app.listen(PORT, () => {
  logger.info(`=======================================================`);
  logger.info(`CX Intelligence API server running on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`AI Model: ${config.ai.modelName} (Mock Mode: ${config.ai.mockMode ? 'Active' : 'Live Gemini'})`);
  logger.info(`Frontend Origin: ${config.frontendUrl}`);
  logger.info(`=======================================================`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server process terminated.');
  });
});

export default server;
