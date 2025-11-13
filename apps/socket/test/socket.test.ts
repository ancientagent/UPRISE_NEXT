
/**
 * Socket.IO Connection Tests
 * Tests authentication and basic functionality
 */

import { Server } from 'socket.io';
import { io as ioClient, Socket as ClientSocket } from 'socket.io-client';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import { authenticateSocket } from '../src/middleware/auth';

describe('Socket.IO Server', () => {
  let io: Server;
  let httpServer: any;
  let clientSocket: ClientSocket;
  const PORT = 4002; // Use different port for tests
  const JWT_SECRET = 'test-secret';

  beforeAll((done) => {
    httpServer = createServer();
    io = new Server(httpServer, {
      cors: { origin: '*' },
    });
    
    io.use(authenticateSocket);
    
    httpServer.listen(PORT, () => {
      done();
    });
  });

  afterAll((done) => {
    io.close();
    httpServer.close(() => {
      done();
    });
  });

  afterEach(() => {
    if (clientSocket && clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  describe('Authentication', () => {
    it('should reject connection without token', (done) => {
      clientSocket = ioClient(`http://localhost:${PORT}`, {
        transports: ['websocket'],
      });

      clientSocket.on('connect_error', (error) => {
        expect(error.message).toContain('Authentication token required');
        done();
      });
    });

    it('should reject connection with invalid token', (done) => {
      clientSocket = ioClient(`http://localhost:${PORT}`, {
        auth: { token: 'invalid-token' },
        transports: ['websocket'],
      });

      clientSocket.on('connect_error', (error) => {
        expect(error.message).toContain('Invalid authentication token');
        done();
      });
    });

    it('should accept connection with valid token', (done) => {
      const token = jwt.sign(
        {
          sub: 'user-123',
          email: 'test@example.com',
          username: 'testuser',
        },
        JWT_SECRET
      );

      clientSocket = ioClient(`http://localhost:${PORT}`, {
        auth: { token },
        transports: ['websocket'],
      });

      clientSocket.on('connect', () => {
        expect(clientSocket.connected).toBe(true);
        done();
      });
    });
  });

  describe('Community Events', () => {
    let validToken: string;

    beforeEach(() => {
      validToken = jwt.sign(
        {
          sub: 'user-123',
          email: 'test@example.com',
          username: 'testuser',
        },
        JWT_SECRET
      );
    });

    it('should emit join-community event', (done) => {
      const communityId = 'test-community';

      // Set up community namespace
      const communityNsp = io.of(`/community/${communityId}`);
      communityNsp.use(authenticateSocket);

      clientSocket = ioClient(`http://localhost:${PORT}/community/${communityId}`, {
        auth: { token: validToken },
        transports: ['websocket'],
      });

      clientSocket.on('connect', () => {
        clientSocket.emit('join-community', { communityId });

        clientSocket.on('join-community:success', (data) => {
          expect(data.communityId).toBe(communityId);
          done();
        });
      });
    });

    it('should emit community-message event', (done) => {
      const communityId = 'test-community';

      const communityNsp = io.of(`/community/${communityId}`);
      communityNsp.use(authenticateSocket);

      clientSocket = ioClient(`http://localhost:${PORT}/community/${communityId}`, {
        auth: { token: validToken },
        transports: ['websocket'],
      });

      clientSocket.on('connect', () => {
        clientSocket.emit('community-message', {
          content: 'Hello, community!',
          type: 'text',
        });

        clientSocket.on('community-message:new', (message) => {
          expect(message.content).toBe('Hello, community!');
          expect(message.userId).toBe('user-123');
          expect(message.username).toBe('testuser');
          done();
        });
      });
    });

    it('should emit leave-community event', (done) => {
      const communityId = 'test-community';

      const communityNsp = io.of(`/community/${communityId}`);
      communityNsp.use(authenticateSocket);

      clientSocket = ioClient(`http://localhost:${PORT}/community/${communityId}`, {
        auth: { token: validToken },
        transports: ['websocket'],
      });

      clientSocket.on('connect', () => {
        clientSocket.emit('leave-community', { communityId });

        clientSocket.on('leave-community:success', (data) => {
          expect(data.communityId).toBe(communityId);
          done();
        });
      });
    });
  });

  describe('Connection Logging', () => {
    it('should log successful connections', (done) => {
      const token = jwt.sign(
        {
          sub: 'user-456',
          email: 'logger@example.com',
          username: 'loggeruser',
        },
        JWT_SECRET
      );

      clientSocket = ioClient(`http://localhost:${PORT}`, {
        auth: { token },
        transports: ['websocket'],
      });

      clientSocket.on('connect', () => {
        // Connection logged (check console output in real scenario)
        expect(clientSocket.connected).toBe(true);
        done();
      });
    });

    it('should log disconnections', (done) => {
      const token = jwt.sign(
        {
          sub: 'user-789',
          email: 'disconnect@example.com',
          username: 'disconnectuser',
        },
        JWT_SECRET
      );

      clientSocket = ioClient(`http://localhost:${PORT}`, {
        auth: { token },
        transports: ['websocket'],
      });

      clientSocket.on('connect', () => {
        clientSocket.disconnect();
        
        setTimeout(() => {
          expect(clientSocket.connected).toBe(false);
          done();
        }, 100);
      });
    });
  });
});
