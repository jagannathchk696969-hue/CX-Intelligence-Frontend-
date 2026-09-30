import { logger } from '../utils/logger.js';
import { sendError } from '../utils/responseHelper.js';
import { config } from '../config/env.js';

export const notFoundHandler = (req, res, next) => {
  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

export const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled Application Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : (config.nodeEnv === 'production' ? 'An unexpected server error occurred.' : err.message);

  return sendError(
    res,
    message,
    statusCode,
    config.nodeEnv === 'development' ? { stack: err.stack } : null
  );
};
