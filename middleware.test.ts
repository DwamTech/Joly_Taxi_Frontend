/**
 * Property-Based Tests for Middleware Route Protection
 * Feature: landing-dashboard-integration
 * Tests authentication and authorization logic using fast-check
 * 
 * @jest-environment node
 */

import { NextRequest, NextResponse } from 'next/server';
import { middleware } from './middleware';
import fc from 'fast-check';
import { jwtVerify } from 'jose';

// Mock jose library
jest.mock('jose', () => ({
  jwtVerify: jest.fn(),
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mocked-token'),
  })),
}));

const mockedJwtVerify = jwtVerify as jest.MockedFunction<typeof jwtVerify>;

// Helper to create a mock NextRequest
function createMockRequest(pathname: string, hasToken: boolean, isValidToken: boolean): NextRequest {
  const url = `http://localhost:3000${pathname}`;
  const request = new NextRequest(url);

  if (hasToken) {
    // Set auth_token cookie
    request.cookies.set('auth_token', isValidToken ? 'valid-token-123' : 'invalid-token');
  }

  return request;
}

// Helper to generate protected route paths
const protectedRouteArbitrary = fc.oneof(
  fc.constant('/app-dash'),
  fc.constant('/app-dash/'),
  fc.constant('/app-dash/settings'),
  fc.constant('/app-dash/users'),
  fc.constant('/app-dash/reports'),
  fc.constant('/app-dash/analytics'),
  fc.string({ minLength: 1, maxLength: 20 }).map(path => `/app-dash/${path}`),
  fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 1, maxLength: 3 })
    .map(segments => `/app-dash/${segments.join('/')}`)
);

describe('Middleware Property-Based Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Property 4: Unauthenticated access redirect', () => {
    /**
     * **Validates: Requirements 3.1, 3.4, 3.5**
     * 
     * For any attempt to access a protected route under "/app-dash/*" 
     * (excluding "/app-dash/login") without a valid auth token, 
     * the middleware must redirect to "/app-dash/login".
     */
    it('should redirect all unauthenticated requests to protected routes to /app-dash/login', async () => {
      await fc.assert(
        fc.asyncProperty(
          protectedRouteArbitrary,
          fc.boolean(), // hasToken
          async (protectedPath, hasToken) => {
            // Skip login page as it's not protected
            fc.pre(protectedPath !== '/app-dash/login');

            // Setup: Mock token validation to fail (unauthenticated)
            mockedJwtVerify.mockRejectedValue(new Error('Invalid token'));

            // Create request without valid token
            const request = createMockRequest(protectedPath, hasToken, false);

            // Execute middleware
            const response = await middleware(request);

            // Verify: Should redirect to login page
            expect(response.status).toBe(307); // Next.js redirect status
            
            const location = response.headers.get('location');
            expect(location).toBeTruthy();
            expect(location).toContain('/app-dash/login');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should redirect requests with missing tokens to /app-dash/login', async () => {
      await fc.assert(
        fc.asyncProperty(
          protectedRouteArbitrary,
          async (protectedPath) => {
            // Skip login page
            fc.pre(protectedPath !== '/app-dash/login');

            // Create request without any token
            const request = createMockRequest(protectedPath, false, false);

            // Execute middleware
            const response = await middleware(request);

            // Verify: Should redirect to login page
            expect(response.status).toBe(307);
            
            const location = response.headers.get('location');
            expect(location).toBeTruthy();
            expect(location).toContain('/app-dash/login');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should redirect requests with expired tokens to /app-dash/login', async () => {
      await fc.assert(
        fc.asyncProperty(
          protectedRouteArbitrary,
          async (protectedPath) => {
            // Skip login page
            fc.pre(protectedPath !== '/app-dash/login');

            // Setup: Mock token validation to fail with expiration error
            mockedJwtVerify.mockRejectedValue(new Error('Token expired'));

            // Create request with expired token
            const request = createMockRequest(protectedPath, true, false);

            // Execute middleware
            const response = await middleware(request);

            // Verify: Should redirect to login page
            expect(response.status).toBe(307);
            
            const location = response.headers.get('location');
            expect(location).toBeTruthy();
            expect(location).toContain('/app-dash/login');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should redirect requests with malformed tokens to /app-dash/login', async () => {
      await fc.assert(
        fc.asyncProperty(
          protectedRouteArbitrary,
          fc.string({ minLength: 1, maxLength: 50 }), // Random malformed token
          async (protectedPath, malformedToken) => {
            // Skip login page
            fc.pre(protectedPath !== '/app-dash/login');

            // Setup: Mock token validation to fail
            mockedJwtVerify.mockRejectedValue(new Error('Malformed token'));

            const url = `http://localhost:3000${protectedPath}`;
            const request = new NextRequest(url);
            request.cookies.set('auth_token', malformedToken);

            // Execute middleware
            const response = await middleware(request);

            // Verify: Should redirect to login page
            expect(response.status).toBe(307);
            
            const location = response.headers.get('location');
            expect(location).toBeTruthy();
            expect(location).toContain('/app-dash/login');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should allow authenticated requests to protected routes', async () => {
      await fc.assert(
        fc.asyncProperty(
          protectedRouteArbitrary,
          async (protectedPath) => {
            // Skip login page
            fc.pre(protectedPath !== '/app-dash/login');

            // Setup: Mock token validation to succeed
            mockedJwtVerify.mockResolvedValue({
              payload: { userId: 1, role: 'admin' },
              protectedHeader: {},
            } as any);

            // Create request with valid token
            const request = createMockRequest(protectedPath, true, true);

            // Execute middleware
            const response = await middleware(request);

            // Verify: Should allow access (not redirect)
            expect(response.status).not.toBe(307);
            expect(response.headers.get('location')).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not redirect public routes regardless of authentication', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.boolean(), // hasToken
          fc.boolean(), // isValidToken
          async (hasToken, isValidToken) => {
            // Setup token validation based on isValidToken
            if (isValidToken) {
              mockedJwtVerify.mockResolvedValue({
                payload: { userId: 1, role: 'admin' },
                protectedHeader: {},
              } as any);
            } else {
              mockedJwtVerify.mockRejectedValue(new Error('Invalid token'));
            }

            // Create request to landing page (public route)
            const request = createMockRequest('/', hasToken, isValidToken);

            // Execute middleware
            const response = await middleware(request);

            // Verify: Should allow access to public route
            expect(response.status).not.toBe(307);
            
            const location = response.headers.get('location');
            // Should not redirect to login
            if (location) {
              expect(location).not.toContain('/app-dash/login');
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
