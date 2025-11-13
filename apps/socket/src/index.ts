
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { authenticateSocket } from './middleware/auth';
import { setupCommunityNamespaces } from './namespaces/communities';
import { setupEventHandlers } from './handlers';
import { logger } from './utils/logger';

dotenv.config();

const PORT = process.env.PORT || 4001;
const CORS_ORIGIN = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    credentials: true,
  },
  // Connection settings
  pingTimeout: 60000,
  pingInterval: 25000,
  // Transport settings
  transports: ['websocket', 'polling'],
});

// Apply authentication middleware to all namespaces
io.use(authenticateSocket);

// Setup main event handlers (root namespace)
setupEventHandlers(io);

// Setup dynamic community namespaces
setupCommunityNamespaces(io);

// Log server stats periodically
setInterval(() => {
  const connectedSockets = io.sockets.sockets.size;
  logger.info(`📊 Server stats`, {
    connectedSockets,
    namespaces: Array.from(io._nsps.keys()),
  });
}, 60000); // Every minute

// Start server
httpServer.listen(PORT, () => {
  logger.info(`🚀 Socket.IO server started`, {
    port: PORT,
    corsOrigin: CORS_ORIGIN,
    nodeEnv: process.env.NODE_ENV || 'development',
  });
});

// Graceful shutdown
const shutdown = () => {
  logger.info('⏹️  Shutting down Socket.IO server...');
  
  // Close all connections
  io.close(() => {
    logger.info('✅ All connections closed');
    
    // Close HTTP server
    httpServer.close(() => {
      logger.info('✅ HTTP server closed');
      process.exit(0);
    });
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    logger.error('❌ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  shutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', reason as Error, {
    promise: promise.toString(),
  });
});
