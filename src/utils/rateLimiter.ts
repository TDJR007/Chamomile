// src/utils/rateLimiter.ts
import rateLimit from 'express-rate-limit';

/**
 * Aggressive rate limiter for signup (anti-bot protection)
 * Max 3 attempts per IP per 24 hours
 */
export const signupRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // 3 requests max
  message: {
    error: 'Too many signup attempts. Please try again later.',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

/**
 * Standard rate limiter for login
 * Max 10 attempts per IP per 15 minutes
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    error: 'Too many login attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General API rate limiter for protected routes
 * Max 150 requests per IP per 15 minutes (generous for normal use)
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150,
  message: {
    error: 'Too many requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});