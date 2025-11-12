
import { Server, Socket } from 'socket.io';

interface AuthenticatedSocket extends Socket {
  user?: {
    userId: string;
    email: string;
    username: string;
  };
}

export function setupEventHandlers(io: Server) {
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.user?.username} (${socket.id})`);

    // Join user's personal room
    socket.join(`user:${socket.user?.userId}`);

    // Handle presence updates
    socket.on('presence:update', (data: { status: string }) => {
      io.emit('presence:changed', {
        userId: socket.user?.userId,
        username: socket.user?.username,
        status: data.status,
      });
    });

    // Handle typing indicators
    socket.on('typing:start', (data: { roomId: string }) => {
      socket.to(data.roomId).emit('typing:user', {
        userId: socket.user?.userId,
        username: socket.user?.username,
        typing: true,
      });
    });

    socket.on('typing:stop', (data: { roomId: string }) => {
      socket.to(data.roomId).emit('typing:user', {
        userId: socket.user?.userId,
        username: socket.user?.username,
        typing: false,
      });
    });

    // Handle chat messages
    socket.on('message:send', (data: { roomId: string; content: string }) => {
      const message = {
        id: `msg_${Date.now()}`,
        userId: socket.user?.userId,
        username: socket.user?.username,
        content: data.content,
        timestamp: new Date().toISOString(),
      };

      io.to(data.roomId).emit('message:new', message);
    });

    // Handle track playback sync
    socket.on('track:play', (data: { trackId: string; communityId: string; position: number }) => {
      socket.to(`community:${data.communityId}`).emit('track:playing', {
        trackId: data.trackId,
        userId: socket.user?.userId,
        username: socket.user?.username,
        position: data.position,
      });
    });

    socket.on('track:pause', (data: { trackId: string; communityId: string; position: number }) => {
      socket.to(`community:${data.communityId}`).emit('track:paused', {
        trackId: data.trackId,
        userId: socket.user?.userId,
        position: data.position,
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user?.username} (${socket.id})`);
      
      io.emit('presence:changed', {
        userId: socket.user?.userId,
        username: socket.user?.username,
        status: 'offline',
      });
    });
  });
}
