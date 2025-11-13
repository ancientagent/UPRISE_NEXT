
import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/auth';
import { logger } from '../utils/logger';

/**
 * Setup main event handlers for root namespace
 */
export function setupEventHandlers(io: Server) {
  io.on('connection', (socket: AuthenticatedSocket) => {
    const { userId, username } = socket.user || {};

    if (!userId || !username) {
      logger.error('Socket connected without user data', undefined, {
        socketId: socket.id,
      });
      socket.disconnect();
      return;
    }

    // Log connection
    logger.logConnection(socket.id, userId, username);

    // Join user's personal room for direct messages
    const userRoom = `user:${userId}`;
    socket.join(userRoom);
    logger.logJoinRoom(userId, userRoom);

    /**
     * Event: presence:update
     * Update user's online status
     */
    socket.on('presence:update', (data: { status: 'online' | 'away' | 'busy' | 'offline' }) => {
      logger.logEvent('presence:update', socket.id, userId, data);

      io.emit('presence:changed', {
        userId,
        username,
        status: data.status,
        timestamp: new Date().toISOString(),
      });
    });

    /**
     * Event: direct-message
     * Send direct message to another user
     */
    socket.on('direct-message', (data: { recipientId: string; content: string }) => {
      logger.logEvent('direct-message', socket.id, userId, {
        recipientId: data.recipientId,
      });

      const message = {
        id: `dm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderId: userId,
        senderUsername: username,
        recipientId: data.recipientId,
        content: data.content,
        timestamp: new Date().toISOString(),
      };

      // Send to recipient
      io.to(`user:${data.recipientId}`).emit('direct-message:new', message);

      // Send confirmation to sender
      socket.emit('direct-message:sent', message);
    });

    /**
     * Event: notification-read
     * Mark notification as read
     */
    socket.on('notification-read', (data: { notificationId: string }) => {
      logger.logEvent('notification-read', socket.id, userId, data);
      
      // You could broadcast this to sync across user's devices
      io.to(userRoom).emit('notification:updated', {
        notificationId: data.notificationId,
        read: true,
      });
    });

    /**
     * Event: ping
     * Health check / keep-alive
     */
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });

    /**
     * Event: disconnect
     * Handle disconnection from root namespace
     */
    socket.on('disconnect', (reason) => {
      logger.logDisconnection(socket.id, userId, username, reason);

      // Update presence to offline
      io.emit('presence:changed', {
        userId,
        username,
        status: 'offline',
        timestamp: new Date().toISOString(),
      });
    });

    /**
     * Event: error
     * Handle socket errors
     */
    socket.on('error', (error) => {
      logger.logError('Socket error in root namespace', error, {
        socketId: socket.id,
        userId,
      });
    });
  });
}
