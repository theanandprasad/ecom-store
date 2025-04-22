import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from './middlewares/auth-middleware';

// Define the API routes that should be protected by authentication
const PROTECTED_ROUTES = ['/api'];

// Define routes that should be public (not requiring authentication)
const PUBLIC_ROUTES = ['/api/docs', '/swagger.json', '/api-spec.json'];

/**
 * Middleware function that runs before API routes
 * @param request - The incoming request
 * @returns NextResponse or undefined to continue
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip authentication for public routes
  if (isPublicRoute(pathname)) {
    return undefined;
  }
  
  // Check if the route is an API route that should be protected
  if (isProtectedRoute(pathname)) {
    // Apply authentication middleware
    return await authMiddleware(request);
  }
  
  // Continue to the API route handler
  return undefined;
}

/**
 * Check if a route should be protected by authentication
 * @param pathname - The route pathname
 * @returns True if the route should be protected
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Check if a route is public (doesn't require authentication)
 * @param pathname - The route pathname
 * @returns True if the route is public
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route));
}

/**
 * Configure which routes should be processed by this middleware
 */
export const config = {
  matcher: ['/api/:path*'],
}; 