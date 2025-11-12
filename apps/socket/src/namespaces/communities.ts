
import { Server, Socket } from 'socket.io';

interface AuthenticatedSocket extends Socket {
  user?: {
    userId: string;
    email: string;
    username: string;
  };
}

export function setupCommunityNamespaces(io: Server) {
  // Dynamic namespace for communities
  const communityNamespace = io.of(/^\/community\/[\w-]+$/);

  communityNamespace.on('connection', (socket: AuthenticatedSocket) => {
    const communityId = socket.nsp.name.split('/')[2];
    console.log(`User ${socket.user?.username} joined community: ${communityId}`);

    // Join community room
    socket.join(`community:${communityId}`);

    // Notify others in the community
    socket.to(`community:${communityId}`).emit('user:joined', {
      userId: socket.user?.userId,
      username: socket.user?.username,
    });

    // Handle community-specific events
    socket.on('community:message', (data: { content: string }) => {
      const message = {
        id: `msg_${Date.now()}`,
        communityId,
        userId: socket.user?.userId,
        username: socket.user?.username,
        content: data.content,
        timestamp: new Date().toISOString(),
      };

      communityNamespace.to(`community:${communityId}`).emit('community:message:new', message);
    });

    // Handle track reactions
    socket.on('track:react', (data: { trackId: string; reaction: string }) => {
      socket.to(`community:${communityId}`).emit('track:reaction', {
        trackId: data.trackId,
        userId: socket.user?.userId,
        username: socket.user?.username,
        reaction: data.reaction,
      });
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.user?.username} left community: ${communityId}`);
      
      socket.to(`community:${communityId}`).emit('user:left', {
        userId: socket.user?.userId,
        username: socket.user?.username,
      });
    });
  });
}
