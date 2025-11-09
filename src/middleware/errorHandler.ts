// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware
 * Catches any unhandled errors and returns a safe response
 * 
 * IMPORTANT: This must be registered LAST in your middleware chain
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('💥 Unhandled error:', err);

  // Don't leak error details to client in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    error: 'Internal server error',
    ...(isDevelopment && { details: err.message }), // Only show details in dev
  });
}