
import { Server, Namespace } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/auth';
import { logger } from '../utils/logger';

interface CommunityMessage {
  content: string;
  type?: 'text' | 'audio' | 'system';
}

interface JoinCommunityData {
  communityId?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

interface LeaveCommunityData {
  communityId?: string;
}

/**
 * Setup dynamic community namespaces
 * Pattern: /community/:communityId
 */
export function setupCommunityNamespaces(io: Server) {
  // Dynamic namespace for communities (e.g., /community/abc-123)
  const communityNamespace = io.of(/^\/community\/[\w-]+$/);

  communityNamespace.on('connection', (socket: AuthenticatedSocket) => {
    const communityId = socket.nsp.name.split('/')[2];
    const { userId, username } = socket.user || {};

    if (!userId || !username) {
      logger.error('Socket connected without user data', undefined, {
        socketId: socket.id,
        namespace: socket.nsp.name,
      });
      socket.disconnect();
      return;
    }

    // Log connection to community namespace
    logger.logConnection(socket.id, userId, username, `community/${communityId}`);

    // Automatically join the community room
    const communityRoom = `community:${communityId}`;
    socket.join(communityRoom);
    logger.logJoinRoom(userId, communityRoom);

    // Notify other members that user joined
    socket.to(communityRoom).emit('user:joined', {
      userId,
      username,
      timestamp: new Date().toISOString(),
    });

    /**
     * Event: join-community
     * Explicit join event (for when user wants to "activate" in a community)
     */
    socket.on('join-community', (data: JoinCommunityData) => {
      logger.logEvent('join-community', socket.id, userId, data);

      // Emit to all members that user is now active
      socket.to(communityRoom).emit('community:member-active', {
        userId,
        username,
        location: data.location,
        timestamp: new Date().toISOString(),
      });

      // Send acknowledgment to the user
      socket.emit('join-community:success', {
        communityId,
        memberCount: communityNamespace.adapter.rooms.get(communityRoom)?.size || 0,
      });
    });

    /**
     * Event: leave-community
     * Explicit leave event
     */
    socket.on('leave-community', (data: LeaveCommunityData) => {
      logger.logEvent('leave-community', socket.id, userId, data);
      logger.logLeaveRoom(userId, communityRoom);

      // Notify others
      socket.to(communityRoom).emit('community:member-inactive', {
        userId,
        username,
        timestamp: new Date().toISOString(),
      });

      // Leave the room
      socket.leave(communityRoom);

      // Send acknowledgment
      socket.emit('leave-community:success', {
        communityId,
      });
    });

    /**
     * Event: community-message
     * Send message to all members in the community
     */
    socket.on('community-message', (data: CommunityMessage) => {
      logger.logEvent('community-message', socket.id, userId, {
        contentLength: data.content?.length,
        type: data.type,
      });

      if (!data.content || data.content.trim().length === 0) {
        socket.emit('error', {
          event: 'community-message',
          message: 'Message content cannot be empty',
        });
        return;
      }

      const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        communityId,
        userId,
        username,
        content: data.content.trim(),
        type: data.type || 'text',
        timestamp: new Date().toISOString(),
      };

      // Broadcast to all members in the community (including sender)
      communityNamespace.to(communityRoom).emit('community-message:new', message);
    });

    /**
     * Event: track-share
     * Share a track with the community
     */
    socket.on('track-share', (data: { trackId: string; message?: string }) => {
      logger.logEvent('track-share', socket.id, userId, data);

      socket.to(communityRoom).emit('track:shared', {
        trackId: data.trackId,
        userId,
        username,
        message: data.message,
        timestamp: new Date().toISOString(),
      });
    });

    /**
     * Event: track-reaction
     * React to a track
     */
    socket.on('track-reaction', (data: { trackId: string; reaction: string }) => {
      logger.logEvent('track-reaction', socket.id, userId, data);

      socket.to(communityRoom).emit('track:reaction', {
        trackId: data.trackId,
        userId,
        username,
        reaction: data.reaction,
        timestamp: new Date().toISOString(),
      });
    });

    /**
     * Event: typing-indicator
     * Typing indicator for community chat
     */
    socket.on('typing:start', () => {
      socket.to(communityRoom).emit('typing:user', {
        userId,
        username,
        typing: true,
      });
    });

    socket.on('typing:stop', () => {
      socket.to(communityRoom).emit('typing:user', {
        userId,
        username,
        typing: false,
      });
    });


    /**
     * Event: disconnect
     * Handle disconnection
     */
    socket.on('disconnect', (reason) => {
      logger.logDisconnection(socket.id, userId, username, reason);

      // Notify others that user left
      socket.to(communityRoom).emit('user:left', {
        userId,
        username,
        reason,
        timestamp: new Date().toISOString(),
      });
    });

    /**
     * Event: error
     * Handle socket errors
     */
    socket.on('error', (error) => {
      logger.logError('Socket error in community namespace', error, {
        socketId: socket.id,
        userId,
        communityId,
      });
    });
  });

  return communityNamespace;
}