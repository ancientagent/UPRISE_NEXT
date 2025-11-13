
import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '@uprise/types';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export interface AuthenticatedSocket extends Socket {
  user?: {
    userId: string;
    email: string;
    username: string;
  };
}

/**
 * JWT Authentication Middleware for Socket.IO
 * 
 * Validates JWT token from handshake auth and attaches user data to socket
 * Logs all authentication attempts (success and failure)
 */
export async function authenticateSocket(
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
) {
  try {
    // Extract token from handshake auth or query params
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      logger.logAuthFailure(socket.id, 'No token provided');
      return next(new Error('Authentication token required'));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Attach user data to socket
    socket.user = {
      userId: decoded.sub,
      email: decoded.email,
      username: decoded.username,
    };

    // Log successful authentication
    logger.logAuthSuccess(decoded.sub, decoded.username);

    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid token';
    logger.logAuthFailure(socket.id, errorMessage);
    next(new Error('Invalid authentication token'));
  }
}

/**
 * Verify socket is authenticated
 */
export function requireAuth(socket: AuthenticatedSocket): boolean {
  if (!socket.user) {
    logger.warn('Unauthenticated socket attempted action', {
      socketId: socket.id,
    });
    return false;
  }
  return true;
}
