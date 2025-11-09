// src/routes/authRoutes.ts
import { Router, Request, Response } from 'express';
import { DatabaseService } from '../db/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { isValidEmail, isValidPassword } from '../utils/validation';
import { signupRateLimiter, loginRateLimiter } from '../utils/rateLimiter';
import { tightSignupGuard } from '../middleware/tightSignupGuard';
import { SignupRequest, LoginRequest } from '../types';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
  '/register',
  signupRateLimiter,      // Rate limit: 3 attempts per 24 hours
  tightSignupGuard,       // Anti-bot protection
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body as SignupRequest;

      // ========== VALIDATION ==========
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      if (!isValidEmail(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
      }

      if (!isValidPassword(password)) {
        res.status(400).json({ 
          error: 'Password must be at least 8 characters' 
        });
        return;
      }

      // ========== CHECK IF USER EXISTS ==========
      const existingUser = DatabaseService.getUserByEmail(email);
      
      if (existingUser) {
        res.status(409).json({ error: 'Email already registered' });
        return;
      }

      // ========== CREATE USER ==========
      const passwordHash = await hashPassword(password);
      const userId = DatabaseService.createUser(email, passwordHash);

      console.log(`✅ New user registered: ${email} (ID: ${userId})`);

      res.status(201).json({
        message: 'User created successfully',
        userId,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post(
  '/login',
  loginRateLimiter,       // Rate limit: 10 attempts per 15 minutes
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body as LoginRequest;

      // ========== VALIDATION ==========
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      // ========== FIND USER ==========
      const user = DatabaseService.getUserByEmail(email);

      if (!user) {
        // Don't tell them if email exists or not (security)
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // ========== VERIFY PASSWORD ==========
      const isPasswordValid = await comparePassword(password, user.password_hash);

      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // ========== GENERATE TOKEN ==========
      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      console.log(`✅ User logged in: ${email}`);

      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

export default router;