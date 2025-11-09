// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './authRoutes';
import todoRoutes from './todoRoutes';

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);

export default router;