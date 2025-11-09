// src/db/database.ts
import Database from 'better-sqlite3';
import path from 'path';
import { User, Task, TaskStatus } from '../types';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dbPath = process.env.DB_FILE || './data/chamomile.db';
const db = new Database(dbPath);

// Enable foreign keys (CRITICAL for CASCADE deletion)
db.pragma('foreign_keys = ON');

console.log(`📦 Database connected: ${path.resolve(dbPath)}`);

/**
 * Type-safe database operations
 */
export const DatabaseService = {
  // ==================== USER OPERATIONS ====================
  
  createUser(email: string, passwordHash: string): number {
    const stmt = db.prepare(`
      INSERT INTO users (email, password_hash)
      VALUES (?, ?)
    `);
    const result = stmt.run(email, passwordHash);
    return result.lastInsertRowid as number;
  },

  getUserByEmail(email: string): User | undefined {
    const stmt = db.prepare(`
      SELECT * FROM users WHERE email = ?
    `);
    return stmt.get(email) as User | undefined;
  },

  getUserById(id: number): User | undefined {
    const stmt = db.prepare(`
      SELECT * FROM users WHERE id = ?
    `);
    return stmt.get(id) as User | undefined;
  },

  // ==================== TASK OPERATIONS ====================

  getAllTasksForUser(userId: number): Task[] {
    const stmt = db.prepare(`
      SELECT * FROM tasks 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `);
    return stmt.all(userId) as Task[];
  },

  getTaskById(taskId: number, userId: number): Task | undefined {
    const stmt = db.prepare(`
      SELECT * FROM tasks 
      WHERE id = ? AND user_id = ?
    `);
    return stmt.get(taskId, userId) as Task | undefined;
  },

  createTask(userId: number, title: string, description?: string): Task {
    const stmt = db.prepare(`
      INSERT INTO tasks (user_id, title, description, status)
      VALUES (?, ?, ?, 'todo')
    `);
    const result = stmt.run(userId, title, description || null);
    
    // Return the created task
    return this.getTaskById(result.lastInsertRowid as number, userId)!;
  },

  updateTask(
    taskId: number, 
    userId: number, 
    updates: { title?: string; description?: string; status?: TaskStatus }
  ): Task | null {
    // Build dynamic update query (only update provided fields)
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.status !== undefined) {
      fields.push('status = ?');
      values.push(updates.status);
    }

    if (fields.length === 0) {
      // No updates provided, just return current task
      return this.getTaskById(taskId, userId) || null;
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');

    const stmt = db.prepare(`
      UPDATE tasks 
      SET ${fields.join(', ')}
      WHERE id = ? AND user_id = ?
    `);

    values.push(taskId, userId);
    stmt.run(...values);

    return this.getTaskById(taskId, userId) || null;
  },

  deleteTask(taskId: number, userId: number): boolean {
    const stmt = db.prepare(`
      DELETE FROM tasks 
      WHERE id = ? AND user_id = ?
    `);
    const result = stmt.run(taskId, userId);
    return result.changes > 0;
  },
};

export default db;