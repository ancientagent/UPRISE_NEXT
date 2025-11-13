
// generated-by: DeepAgent on 2025-11-13
/**
 * JWT Token Generator for Socket.IO Testing
 * 
 * Generates valid JWT tokens for smoke testing and integration tests
 */

import jwt from 'jsonwebtoken';
import type { JwtPayload } from '@uprise/types';

const DEFAULT_JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const DEFAULT_EXPIRES_IN = '7d';

export interface TestTokenOptions {
  userId?: string;
  email?: string;
  username?: string;
  expiresIn?: string | number;
  secret?: string;
}

/**
 * Generate a test JWT token
 * 
 * @param options - Token customization options
 * @returns Signed JWT token string
 */
export function generateTestToken(options: TestTokenOptions = {}): string {
  const {
    userId = 'test-user-' + Math.random().toString(36).substring(7),
    email = 'test@uprise.local',
    username = 'testuser',
    expiresIn = DEFAULT_EXPIRES_IN,
    secret = DEFAULT_JWT_SECRET,
  } = options;

  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    sub: userId,
    email,
    username,
  };

  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Generate an expired test token (for negative testing)
 */
export function generateExpiredToken(options: TestTokenOptions = {}): string {
  return generateTestToken({
    ...options,
    expiresIn: -1, // Already expired
  });
}

/**
 * Generate a token with invalid signature (for negative testing)
 */
export function generateInvalidToken(options: TestTokenOptions = {}): string {
  return generateTestToken({
    ...options,
    secret: 'wrong-secret-key',
  });
}

/**
 * Decode a JWT token without verification (for debugging)
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Generate multiple test tokens for different users
 */
export function generateMultipleTestTokens(count: number): Array<{ token: string; user: { userId: string; email: string; username: string } }> {
  return Array.from({ length: count }, (_, i) => {
    const userId = `test-user-${i + 1}`;
    const username = `testuser${i + 1}`;
    const email = `test${i + 1}@uprise.local`;
    
    return {
      token: generateTestToken({ userId, email, username }),
      user: { userId, email, username },
    };
  });
}
