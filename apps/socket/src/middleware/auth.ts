
import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '@uprise/types';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

interface AuthenticatedSocket extends Socket {
  user?: {
    userId: string;
    email: string;
    username: string;
  };
}

export async function authenticateSocket(
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
) {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    socket.user = {
      userId: decoded.sub,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (error) {
    next(new Error('Invalid authentication token'));
  }
}
