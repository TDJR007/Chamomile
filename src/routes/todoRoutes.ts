// src/routes/todoRoutes.ts
import { Router, Request, Response } from 'express';
import { DatabaseService } from '../db/database';
import { authMiddleware } from '../middleware/authMiddleware';
import { apiRateLimiter } from '../utils/rateLimiter';
import { 
  sanitizeTaskTitle, 
  sanitizeTaskDescription 
} from '../utils/validation';
import { CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '../types';

const router = Router();

// All routes in this file require authentication
router.use(authMiddleware);
router.use(apiRateLimiter); // 100 requests per 15 minutes

/**
 * GET /api/todos
 * Get all tasks for the authenticated user
 */
router.get('/', (req: Request, res: Response): void => {
  try {
    const userId = req.user!.userId; // authMiddleware guarantees this exists
    
    const tasks = DatabaseService.getAllTasksForUser(userId);
    
    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

/**
 * POST /api/todos
 * Create a new task
 */
router.post('/', (req: Request, res: Response): void => {
  try {
    const userId = req.user!.userId;
    const { title, description } = req.body as CreateTaskRequest;

    // ========== VALIDATION ==========
    if (!title || title.trim().length === 0) {
      res.status(400).json({ error: 'Task title is required' });
      return;
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeTaskTitle(title);
    const sanitizedDescription = description 
      ? sanitizeTaskDescription(description) 
      : undefined;

    // ========== CREATE TASK ==========
    const newTask = DatabaseService.createTask(
      userId,
      sanitizedTitle,
      sanitizedDescription
    );

    console.log(`✅ Task created: "${sanitizedTitle}" (User: ${userId})`);

    res.status(201).json({ task: newTask });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

/**
 * PUT /api/todos/:id
 * Update a task (title, description, or status)
 */
router.put('/:id', (req: Request, res: Response): void => {
  try {
    const userId = req.user!.userId;
    const taskId = parseInt(req.params.id, 10);
    const updates = req.body as UpdateTaskRequest;

    // ========== VALIDATION ==========
    if (isNaN(taskId)) {
      res.status(400).json({ error: 'Invalid task ID' });
      return;
    }

    // Validate status if provided
    const validStatuses: TaskStatus[] = ['todo', 'doing', 'done'];
    if (updates.status && !validStatuses.includes(updates.status)) {
      res.status(400).json({ 
        error: 'Invalid status. Must be: todo, doing, or done' 
      });
      return;
    }

    // ========== CHECK TASK EXISTS & BELONGS TO USER ==========
    const existingTask = DatabaseService.getTaskById(taskId, userId);
    
    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // ========== SANITIZE & UPDATE ==========
    const sanitizedUpdates: UpdateTaskRequest = {};
    
    if (updates.title !== undefined) {
      sanitizedUpdates.title = sanitizeTaskTitle(updates.title);
    }
    if (updates.description !== undefined) {
      sanitizedUpdates.description = sanitizeTaskDescription(updates.description);
    }
    if (updates.status !== undefined) {
      sanitizedUpdates.status = updates.status;
    }

    const updatedTask = DatabaseService.updateTask(
      taskId,
      userId,
      sanitizedUpdates
    );

    console.log(`✅ Task updated: ID ${taskId} (User: ${userId})`);

    res.status(200).json({ task: updatedTask });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

/**
 * DELETE /api/todos/:id
 * Delete a task
 */
router.delete('/:id', (req: Request, res: Response): void => {
  try {
    const userId = req.user!.userId;
    const taskId = parseInt(req.params.id, 10);

    // ========== VALIDATION ==========
    if (isNaN(taskId)) {
      res.status(400).json({ error: 'Invalid task ID' });
      return;
    }

    // ========== DELETE TASK ==========
    const deleted = DatabaseService.deleteTask(taskId, userId);

    if (!deleted) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    console.log(`✅ Task deleted: ID ${taskId} (User: ${userId})`);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;