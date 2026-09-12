
// Jest setup file for API tests

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';

// Integration tests must hit the same database as the Prisma CLI and runtime:
// shell DATABASE_URL wins, then apps/api/.env, then the legacy fallback.
if (!process.env.DATABASE_URL) {
  const envPath = join(__dirname, '..', '.env');
  if (existsSync(envPath)) {
    const match = readFileSync(envPath, 'utf8').match(/^DATABASE_URL="?([^"\r\n]+?)"?\s*$/m);
    if (match) process.env.DATABASE_URL = match[1];
  }
}
process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://uprise:uprise_dev_password@localhost:5432/uprise_dev';

// Mock console to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
