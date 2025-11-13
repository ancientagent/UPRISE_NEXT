
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isWebTier, WebTierViolationError } from './lib/web-tier-guard';

/**
 * Next.js Middleware to enforce web-tier boundaries
 * 
 * This middleware runs on every request to verify that no database
 * access is attempted from the web tier.
 */
export function middleware(request: NextRequest) {
  // Verify we're in web tier (this should always be true in middleware)
  if (!isWebTier()) {
    console.warn('⚠️ Middleware running outside web tier context');
  }

  // Check for any suspicious headers or request patterns that might indicate
  // attempts to bypass the API layer
  const suspiciousHeaders = [
    'x-prisma-client',
    'x-database-connection',
    'x-direct-db-access',
  ];

  for (const header of suspiciousHeaders) {
    if (request.headers.has(header)) {
      console.error(
        new WebTierViolationError(
          `Suspicious header detected: ${header}`
        )
      );
      
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'WEB_TIER_VIOLATION',
            message: 'Direct database access is not allowed from web tier',
          },
        },
        { status: 403 }
      );
    }
  }

  // Add security headers to reinforce the boundary
  const response = NextResponse.next();
  response.headers.set('X-Web-Tier-Guard', 'enabled');
  response.headers.set('X-DB-Access', 'forbidden');

  return response;
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
