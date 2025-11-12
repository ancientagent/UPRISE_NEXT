
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { authenticateSocket } from './middleware/auth';
import { setupCommunityNamespaces } from './namespaces/communities';
import { setupEventHandlers } from './handlers';

dotenv.config();

const PORT = process.env.PORT || 4001;
const CORS_ORIGIN = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    credentials: true,
  },
});

// Apply authentication middleware
io.use(authenticateSocket);

// Setup main event handlers
setupEventHandlers(io);

// Setup dynamic community namespaces
setupCommunityNamespaces(io);

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
});
