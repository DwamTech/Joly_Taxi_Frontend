/**
 * Next.js Middleware for Route Protection
 * Validates JWT tokens from HTTP-only cookies and manages access control
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 7.3
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Secret key for JWT verification (must match the one used in login route)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

/**
 * Middleware function that intercepts requests to protected routes
 * Validates authentication tokens and redirects users appropriately
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth token from HTTP-only cookie
  const token = request.cookies.get('auth_token')?.value;
  
  // Define route patterns
  const isLoginPage = pathname === '/app-dash/login';
  const isProtectedRoute = pathname.startsWith('/app-dash') && !isLoginPage;
  const isPublicRoute = pathname === '/' || isLoginPage;
  
  // Validate token if present
  let isValidToken = false;
  if (token) {
    try {
      // Verify JWT token using jose library
      // Validates: Requirement 3.3
      await jwtVerify(token, JWT_SECRET);
      isValidToken = true;
    } catch (error) {
      // Token is invalid or expired
      console.error('Token validation failed:', error);
      isValidToken = false;
    }
  }
  
  // Handle protected routes (/app-dash/*)
  // Validates: Requirements 3.1, 3.4, 3.5
  if (isProtectedRoute) {
    if (!token || !isValidToken) {
      // Redirect unauthenticated users to login page
      console.log(`Redirecting unauthenticated user from ${pathname} to /app-dash/login`);
      return NextResponse.redirect(new URL('/app-dash/login', request.url));
    }
    
    // Allow access to protected route
    return NextResponse.next();
  }
  
  // Handle login page
  // Validates: Requirement 3.2
  if (isLoginPage) {
    if (token && isValidToken) {
      // Redirect authenticated users away from login page to dashboard
      console.log('Redirecting authenticated user from login to /app-dash');
      return NextResponse.redirect(new URL('/app-dash', request.url));
    }
    
    // Allow unauthenticated users to access login page
    return NextResponse.next();
  }
  
  // Allow access to public routes (landing page, etc.)
  // Validates: Requirement 3.6
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Default: allow access
  return NextResponse.next();
}

/**
 * Middleware configuration
 * Specifies which routes should be processed by the middleware
 * Validates: Requirement 7.3
 */
export const config = {
  matcher: [
    // Protected dashboard routes (excluding login)
    '/app-dash/:path*',
    // Public routes (for admin bar detection)
    '/',
  ],
};
