
/**
 * Socket.IO Logger Utility
 * Provides structured logging for connection events and errors
 */

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

interface LogContext {
  socketId?: string;
  userId?: string;
  username?: string;
  namespace?: string;
  event?: string;
  [key: string]: any;
}

class SocketLogger {
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = this.formatTimestamp();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level}] ${message}${contextStr}`;
  }

  info(message: string, context?: LogContext): void {
    console.log(this.formatMessage(LogLevel.INFO, message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = error
      ? { ...context, error: error.message, stack: error.stack }
      : context;
    console.error(this.formatMessage(LogLevel.ERROR, message, errorContext));
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  // Connection logging helpers
  logConnection(socketId: string, userId: string, username: string, namespace?: string): void {
    this.info('🔌 Socket connected', {
      socketId,
      userId,
      username,
      namespace: namespace || 'root',
    });
  }

  logDisconnection(socketId: string, userId: string, username: string, reason?: string): void {
    this.info('🔌 Socket disconnected', {
      socketId,
      userId,
      username,
      reason,
    });
  }

  logEvent(event: string, socketId: string, userId: string, data?: any): void {
    this.debug(`📡 Event: ${event}`, {
      event,
      socketId,
      userId,
      data: data ? JSON.stringify(data).substring(0, 200) : undefined,
    });
  }

  logError(message: string, error: Error, context?: LogContext): void {
    this.error(`❌ ${message}`, error, context);
  }

  logAuthSuccess(userId: string, username: string): void {
    this.info('✅ Authentication successful', { userId, username });
  }

  logAuthFailure(socketId: string, reason: string): void {
    this.warn('🚫 Authentication failed', { socketId, reason });
  }

  logJoinRoom(userId: string, room: string): void {
    this.info('🏠 User joined room', { userId, room });
  }

  logLeaveRoom(userId: string, room: string): void {
    this.info('🏠 User left room', { userId, room });
  }
}

export const logger = new SocketLogger();
