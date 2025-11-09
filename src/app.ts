// src/app.ts
import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { initializeSchema } from './db/schemaInit';

/**
 * Create and configure Express application
 */
export function createApp(): Application {
  const app = express();

  // ========== INITIALIZE DATABASE ==========
  initializeSchema();

  // ========== MIDDLEWARE ==========
  
  // Enable CORS for frontend requests
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? false // In production, configure specific origins
      : '*',  // In development, allow all origins
    credentials: true,
  }));

  // Parse JSON request bodies
  app.use(express.json());

  // Parse URL-encoded request bodies
  app.use(express.urlencoded({ extended: true }));

  // ========== SERVE STATIC FRONTEND ==========
  app.use(express.static(path.join(__dirname, '../public')));

  // ========== API ROUTES ==========
  app.use('/api', routes);

  // ========== HEALTH CHECK ==========
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString() 
    });
  });

  // ========== CATCH-ALL: SERVE FRONTEND ==========
  // Any route not matching /api/* serves the frontend
  app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  // ========== ERROR HANDLER (MUST BE LAST) ==========
  app.use(errorHandler);

  return app;
}