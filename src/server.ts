// src/server.ts
import dotenv from 'dotenv';
import { createApp } from './app';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Create and start server
const app = createApp();

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║                                        ║
  ║   🍵 CHAMOMILE SERVER RUNNING          ║
  ║                                        ║
  ║   Port:        ${PORT}                      ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}       ║
  ║   Health:      http://localhost:${PORT}/health  ║
  ║                                        ║
  ╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});