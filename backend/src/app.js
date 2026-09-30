import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env.js';
import { apiRateLimiter } from './middleware/rateLimitMiddleware.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';
import apiRouter from './routes/index.js';

const app = express();

// Security Headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, mobile, or curl requests without origin header
    if (!origin) return callback(null, true);
    // Allow any Render or Vercel deployed domains, localhost, or configured frontendUrl
    if (
      origin.includes('onrender.com') ||
      origin.includes('vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      (config.frontendUrl && config.frontendUrl !== '*' && origin === config.frontendUrl)
    ) {
      return callback(null, true);
    }
    // Fallback permissive for hackathon live judging
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// HTTP Request Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting on API endpoints
app.use('/api', apiRateLimiter);

// Mount Master API Router
app.use('/api', apiRouter);

// Catch-all 404 and Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
