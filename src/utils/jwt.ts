// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';
const JWT_EXPIRES_IN = '7d'; // Token valid for 7 days

if (JWT_SECRET === 'fallback-secret-change-me') {
  console.warn('⚠️  WARNING: Using fallback JWT secret. Set JWT_SECRET in .env for production!');
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify and decode a JWT token
 * Returns the payload if valid, null if invalid/expired
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    // Token invalid or expired
    return null;
  }
}