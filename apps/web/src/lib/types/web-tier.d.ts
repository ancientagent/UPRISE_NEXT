
/**
 * Type definitions for web-tier boundary enforcement
 * 
 * These types help enforce the architectural boundary at compile time.
 */

/**
 * Marker type to indicate a value should only be used in API tier
 */
export type ApiOnly<T> = T & { readonly __apiOnly: unique symbol };

/**
 * Marker type to indicate a value is safe for web tier
 */
export type WebSafe<T> = T & { readonly __webSafe: unique symbol };

/**
 * Explicitly forbid Prisma Client in web tier
 */
declare module '@prisma/client' {
  // This will cause TypeScript errors if Prisma Client is imported in web tier
  export const PrismaClient: never;
}

/**
 * Type guard to ensure data comes from API
 */
export interface ApiSourced {
  readonly __source: 'api';
}

/**
 * Utility type to mark data as API-sourced
 */
export type FromApi<T> = T & ApiSourced;

/**
 * Type for web-tier safe operations
 */
export interface WebTierSafe {
  readonly __webTierSafe: true;
}
