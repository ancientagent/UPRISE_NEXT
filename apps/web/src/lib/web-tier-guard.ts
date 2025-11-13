
/**
 * Web-Tier Contract Guard
 * 
 * This module enforces the architectural boundary between the web tier and data tier.
 * The web application MUST NOT access the database directly - all data access must go through the API.
 * 
 * This guard provides runtime protection against accidental database access attempts.
 */

export class WebTierViolationError extends Error {
  constructor(message: string) {
    super(`🚨 WEB-TIER BOUNDARY VIOLATION: ${message}`);
    this.name = 'WebTierViolationError';
    
    // Ensure the error is very visible
    console.error(`
╔═══════════════════════════════════════════════════════════════════╗
║                  WEB-TIER BOUNDARY VIOLATION                      ║
╠═══════════════════════════════════════════════════════════════════╣
║ ${message.padEnd(65)} ║
║                                                                   ║
║ The web application tier CANNOT access the database directly.    ║
║ All data operations must go through the API layer.                ║
╚═══════════════════════════════════════════════════════════════════╝
    `);
  }
}

/**
 * Guard function that checks if code is running in the web tier
 */
export function isWebTier(): boolean {
  return typeof window !== 'undefined' || process.env.NEXT_RUNTIME === 'edge';
}

/**
 * Guard that prevents execution if called from web tier
 */
export function assertNotWebTier(context: string): void {
  if (isWebTier()) {
    throw new WebTierViolationError(
      `${context} cannot be called from web tier. Use API endpoints instead.`
    );
  }
}

/**
 * Decorator to mark functions as API-only
 */
export function ApiOnly() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      assertNotWebTier(`${target.constructor.name}.${propertyKey}`);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Guard for Prisma Client instantiation
 */
export function guardPrismaClient(): void {
  if (isWebTier()) {
    throw new WebTierViolationError(
      'Attempted to instantiate Prisma Client in web tier. Database access is forbidden from the web application.'
    );
  }
}

/**
 * Guard for any database connection attempt
 */
export function guardDatabaseAccess(operation: string): void {
  if (isWebTier()) {
    throw new WebTierViolationError(
      `Attempted database operation "${operation}" from web tier. Use API endpoints instead.`
    );
  }
}

// Install global guards if in web tier
if (isWebTier()) {
  // Monitor for any Prisma Client imports
  const originalRequire = typeof require !== 'undefined' ? require : undefined;
  
  if (originalRequire && typeof originalRequire === 'function') {
    const Module = originalRequire('module');
    const originalLoad = Module._load;

    Module._load = function (request: string, parent: any) {
      if (request.includes('@prisma/client')) {
        throw new WebTierViolationError(
          'Attempted to import @prisma/client in web tier. Database access is forbidden.'
        );
      }
      return originalLoad.apply(this, arguments);
    };
  }
}

export default {
  isWebTier,
  assertNotWebTier,
  guardPrismaClient,
  guardDatabaseAccess,
  WebTierViolationError,
  ApiOnly,
};
