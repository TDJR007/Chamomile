// src/middleware/tightSignupGuard.ts
import { Request, Response, NextFunction } from 'express';
import { SignupRequest } from '../types';

/**
 * Silent anti-bot protection for signup
 * 
 * Protection layers:
 * 1. Honeypot field (nickname) - should be empty
 * 2. Timestamp validation - prevents instant form submits
 * 3. Generic error messages - no hints for attackers
 */
export function tightSignupGuard(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const body = req.body as SignupRequest;

  // ========== HONEYPOT CHECK ==========
  // If 'nickname' field is filled, it's a bot (humans don't see this field)
  if (body.nickname && body.nickname.trim().length > 0) {
    console.warn('🤖 Bot detected: honeypot field filled');
    
    // Don't tell them why it failed - just generic message
    res.status(429).json({ 
      error: 'Unable to process signup. Please try again later.' 
    });
    return;
  }

  // ========== TIMESTAMP CHECK ==========
  // Prevent instant form submissions (bots are fast, humans take time)
  if (body.timestamp) {
    const submittedTime = body.timestamp;
    const currentTime = Date.now();
    const timeDiff = currentTime - submittedTime;

    // If form was submitted in less than 2 seconds, likely a bot
    const MIN_FILL_TIME = 2000; // 2 seconds
    
    if (timeDiff < MIN_FILL_TIME) {
      console.warn(`🤖 Bot detected: form filled too fast (${timeDiff}ms)`);
      
      res.status(429).json({ 
        error: 'Unable to process signup. Please try again later.' 
      });
      return;
    }

    // If timestamp is in the future or more than 10 minutes old, suspicious
    const MAX_FILL_TIME = 10 * 60 * 1000; // 10 minutes
    
    if (timeDiff < 0 || timeDiff > MAX_FILL_TIME) {
      console.warn(`🤖 Bot detected: invalid timestamp (${timeDiff}ms)`);
      
      res.status(429).json({ 
        error: 'Unable to process signup. Please try again later.' 
      });
      return;
    }
  }

  // All checks passed - let the request through
  next();
}