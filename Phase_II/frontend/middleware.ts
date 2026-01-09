import { NextResponse } from 'next/server';

/**
 * Authentication Middleware
 *
 * NOTE: For this hackathon demo, we use localStorage for JWT storage,
 * which is not accessible in middleware (server-side). Therefore, this
 * middleware is simplified to allow all routes. Authentication checks
 * are handled in client components.
 *
 * For production, consider using httpOnly cookies with a Next.js API route
 * proxy to enable server-side authentication checks in middleware.
 */
export function middleware() {
  // Allow all requests to proceed
  // Authentication checks are handled in client components
  return NextResponse.next();
}

/**
 * Middleware Configuration
 *
 * Matcher excludes:
 * - /api routes (API endpoints)
 * - /_next/static (static files)
 * - /_next/image (image optimization)
 * - /favicon.ico (favicon)
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
