// src/types/index.ts

/**
 * Valid task statuses - enforced at compile time AND database level
 */
export type TaskStatus = 'todo' | 'doing' | 'done';

/**
 * User as stored in database
 */
export interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
}

/**
 * Task as stored in database
 */
export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

/**
 * User data in JWT payload (no sensitive info!)
 */
export interface JWTPayload {
  userId: number;
  email: string;
}

/**
 * Request body types for validation
 */
export interface SignupRequest {
  email: string;
  password: string;
  nickname?: string; // Honeypot field - should always be empty
  timestamp?: number; // Anti-bot timing check
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

/**
 * Extend Express Request to include authenticated user
 */
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}