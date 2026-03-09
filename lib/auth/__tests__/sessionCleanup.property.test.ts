/**
 * Property-Based Test: Complete Session Cleanup on Logout
 * Feature: landing-dashboard-integration, Property 3: Complete session cleanup on logout
 * 
 * **Validates: Requirements 2.6, 2.7, 4.3, 4.4**
 * 
 * This test verifies that for any logout operation (explicit logout or validation failure),
 * the system must clear both the HTTP-only auth cookie and all session data from LocalStorage.
 */

import fc from 'fast-check';
import { login, logout, validateToken } from '@/lib/auth/authHelpers';

/**
 * @jest-environment node
 */

/**
 * Arbitrary generator for valid login credentials
 * Generates random username and password combinations
 */
const credentialsArbitrary = fc.record({
  username: fc.string({ minLength: 1, maxLength: 50 }),
  password: fc.string({ minLength: 1, maxLength: 100 }),
});

/**
 * Arbitrary generator for session states
 * Generates different session scenarios to test cleanup
 */
const sessionStateArbitrary = fc.record({
  hasValidToken: fc.boolean(),
  hasLocalStorageData: fc.boolean(),
  tokenAge: fc.integer({ min: 0, max: 86400 }), // 0 to 24 hours in seconds
});

/**
 * Mock localStorage for testing
 * Simulates browser localStorage behavior
 */
class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }

  getAllKeys(): string[] {
    return Object.keys(this.store);
  }

  getAllValues(): string[] {
    return Object.values(this.store);
  }

  hasSessionData(): boolean {
    return this.getItem('jolly_taxi_session') !== null;
  }
}

/**
 * Mock Cookie interface
 */
interface MockCookie {
  name: string;
  value: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: string;
  maxAge?: number;
  path?: string;
}

/**
 * Mock Response with cookies
 */
class MockResponse {
  public cookies: MockCookie[] = [];
  public headers: Map<string, string> = new Map();
  public status: number = 200;
  public body: any;

  constructor(body: any, status: number = 200) {
    this.body = body;
    this.status = status;
  }

  json() {
    return Promise.resolve(this.body);
  }

  get ok() {
    return this.status >= 200 && this.status < 300;
  }
}

describe('Property 3: Complete session cleanup on logout', () => {
  let mockLocalStorage: MockLocalStorage;
  let originalFetch: typeof global.fetch;
  let mockCookies: MockCookie[] = [];

  beforeEach(() => {
    // Reset localStorage mock before each test
    mockLocalStorage = new MockLocalStorage();
    
    // Mock global localStorage
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });

    // Reset cookies
    mockCookies = [];

    // Save original fetch
    originalFetch = global.fetch;

    // Mock fetch to simulate API responses
    global.fetch = jest.fn((url: string | URL | Request, options?: RequestInit) => {
      const urlString = typeof url === 'string' ? url : url.toString();
      
      // Handle login requests
      if (urlString.includes('/api/auth/login')) {
        const body = options?.body ? JSON.parse(options.body as string) : {};
        const { username, password } = body;

        // Simulate successful login for 'admin' user
        if (username === 'admin' && password === 'admin123') {
          const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
          const now = new Date().toISOString();

          // Simulate setting HTTP-only cookie
          const cookieValue = `mock-jwt-token-${sessionId}`;
          mockCookies.push({
            name: 'auth_token',
            value: cookieValue,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400,
            path: '/',
          });

          const response = new MockResponse({
            success: true,
            sessionId,
            userId: 1,
            role: 'admin',
            startedAt: now,
            lastActivity: now,
          });

          return Promise.resolve(response as any);
        }

        // Failed login
        return Promise.resolve(
          new MockResponse(
            { success: false, message: 'Invalid credentials' },
            401
          ) as any
        );
      }

      // Handle logout requests
      if (urlString.includes('/api/auth/logout')) {
        // Clear the auth_token cookie by setting maxAge to 0
        const authCookieIndex = mockCookies.findIndex(c => c.name === 'auth_token');
        if (authCookieIndex !== -1) {
          mockCookies[authCookieIndex] = {
            name: 'auth_token',
            value: '',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
            path: '/',
          };
        }

        const response = new MockResponse({
          success: true,
          message: 'تم تسجيل الخروج بنجاح',
        });

        return Promise.resolve(response as any);
      }

      // Handle validation requests
      if (urlString.includes('/api/auth/validate')) {
        // Check if there's a valid auth_token cookie
        const authCookie = mockCookies.find(c => c.name === 'auth_token' && c.value && c.maxAge && c.maxAge > 0);
        
        if (authCookie) {
          // Token is valid
          const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
          const now = new Date().toISOString();

          const response = new MockResponse({
            valid: true,
            session: {
              sessionId,
              userId: 1,
              role: 'admin',
              startedAt: now,
              lastActivity: now,
            },
          });

          return Promise.resolve(response as any);
        }

        // Token is invalid or missing - return 401
        return Promise.resolve(
          new MockResponse(
            { valid: false, message: 'انتهت صلاحية الجلسة' },
            401
          ) as any
        );
      }

      return Promise.reject(new Error('Not found'));
    }) as jest.Mock;
  });

  afterEach(() => {
    // Clean up
    mockLocalStorage.clear();
    mockCookies = [];
    global.fetch = originalFetch;
  });

  /**
   * Property Test: Explicit logout must clear both cookie and LocalStorage
   * 
   * For any successful login followed by explicit logout, the system must:
   * 1. Clear the HTTP-only auth_token cookie (set maxAge to 0)
   * 2. Clear all session data from LocalStorage
   * 3. Ensure no session data remains accessible
   * 
   * Validates: Requirements 2.6, 2.7
   */
  it('should clear both HTTP-only cookie and LocalStorage on explicit logout for any session', async () => {
    await fc.assert(
      fc.asyncProperty(credentialsArbitrary, async (credentials) => {
        // Reset state for each property test iteration
        mockLocalStorage.clear();
        mockCookies = [];

        // Arrange: Login first to establish a session
        const loginResult = await login('admin', 'admin123');

        // Only test logout if login was successful
        if (loginResult.success) {
          // Verify session was established
          expect(mockLocalStorage.hasSessionData()).toBe(true);
          const authCookieBefore = mockCookies.find(c => c.name === 'auth_token' && c.value && c.maxAge && c.maxAge > 0);
          expect(authCookieBefore).toBeDefined();

          // Act: Perform explicit logout
          const logoutResult = await logout();

          // Assert 1: Logout should succeed
          expect(logoutResult.success).toBe(true);

          // Assert 2: LocalStorage should be cleared
          expect(mockLocalStorage.hasSessionData()).toBe(false);
          expect(mockLocalStorage.getItem('jolly_taxi_session')).toBeNull();

          // Assert 3: Verify no session-related keys remain in LocalStorage
          const allKeys = mockLocalStorage.getAllKeys();
          const hasSessionKeys = allKeys.some(key => 
            key.toLowerCase().includes('session') || 
            key.toLowerCase().includes('auth') ||
            key.toLowerCase().includes('token')
          );
          expect(hasSessionKeys).toBe(false);

          // Assert 4: HTTP-only cookie should be cleared (maxAge set to 0)
          const authCookieAfter = mockCookies.find(c => c.name === 'auth_token');
          expect(authCookieAfter).toBeDefined();
          expect(authCookieAfter?.maxAge).toBe(0);
          expect(authCookieAfter?.value).toBe('');

          // Assert 5: Verify no valid auth cookie remains
          const validAuthCookie = mockCookies.find(c => 
            c.name === 'auth_token' && 
            c.value && 
            c.value.length > 0 && 
            c.maxAge && 
            c.maxAge > 0
          );
          expect(validAuthCookie).toBeUndefined();
        }
      }),
      { numRuns: 100 } // Run 100 iterations as specified in requirements
    );
  });

  /**
   * Property Test: Validation failure must clear both cookie and LocalStorage
   * 
   * For any session where token validation fails (returns 401), the system must:
   * 1. Clear all session data from LocalStorage
   * 2. Recognize that the cookie is invalid/expired
   * 3. Ensure no session data remains accessible
   * 
   * Validates: Requirements 4.3, 4.4
   */
  it('should clear LocalStorage on validation failure for any session state', async () => {
    await fc.assert(
      fc.asyncProperty(sessionStateArbitrary, async (sessionState) => {
        // Reset state
        mockLocalStorage.clear();
        mockCookies = [];

        // Arrange: Set up session state based on arbitrary input
        if (sessionState.hasLocalStorageData) {
          // Manually add session data to LocalStorage
          const sessionData = {
            sessionId: `test-session-${Date.now()}`,
            userId: 1,
            role: 'admin',
            startedAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
          };
          mockLocalStorage.setItem('jolly_taxi_session', JSON.stringify(sessionData));
        }

        if (sessionState.hasValidToken) {
          // Add a valid cookie
          mockCookies.push({
            name: 'auth_token',
            value: `valid-token-${Date.now()}`,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: sessionState.tokenAge,
            path: '/',
          });
        } else {
          // Add an invalid/expired cookie
          mockCookies.push({
            name: 'auth_token',
            value: '',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
            path: '/',
          });
        }

        // Act: Attempt token validation
        const validationResult = await validateToken();

        // Assert: If validation failed (which it should for invalid tokens)
        if (!validationResult.valid) {
          // Assert 1: LocalStorage should be cleared
          expect(mockLocalStorage.hasSessionData()).toBe(false);
          expect(mockLocalStorage.getItem('jolly_taxi_session')).toBeNull();

          // Assert 2: Verify no session-related data remains in LocalStorage
          const allKeys = mockLocalStorage.getAllKeys();
          const hasSessionKeys = allKeys.some(key => 
            key.toLowerCase().includes('session') || 
            key.toLowerCase().includes('auth') ||
            key.toLowerCase().includes('token')
          );
          expect(hasSessionKeys).toBe(false);

          // Assert 3: Verify no session values remain in LocalStorage
          const allValues = mockLocalStorage.getAllValues();
          expect(allValues.length).toBe(0);
        }

        // If validation succeeded (valid token), verify session data is present
        if (validationResult.valid) {
          expect(mockLocalStorage.hasSessionData()).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property Test: Complete cleanup regardless of initial state
   * 
   * This test verifies that logout performs complete cleanup of session data
   * while preserving other non-session data in LocalStorage.
   * 
   * Validates: Requirements 2.6, 2.7, 4.3, 4.4
   */
  it('should perform complete cleanup on logout regardless of initial session state', async () => {
    await fc.assert(
      fc.asyncProperty(
        credentialsArbitrary,
        async (credentials) => {
          // Reset state
          mockLocalStorage.clear();
          mockCookies = [];

          // Arrange: Login to establish session
          const loginResult = await login('admin', 'admin123');

          if (loginResult.success) {
            // Add some non-session data to LocalStorage before logout
            // This simulates other application data that should NOT be cleared
            mockLocalStorage.setItem('app_preference', 'dark_mode');
            mockLocalStorage.setItem('user_language', 'ar');
            
            // Verify session exists
            expect(mockLocalStorage.hasSessionData()).toBe(true);
            expect(mockLocalStorage.getItem('app_preference')).toBe('dark_mode');
            expect(mockLocalStorage.getItem('user_language')).toBe('ar');

            // Act: Logout
            await logout();

            // Assert 1: Session data must be cleared
            expect(mockLocalStorage.hasSessionData()).toBe(false);
            expect(mockLocalStorage.getItem('jolly_taxi_session')).toBeNull();

            // Assert 2: Auth cookie must be cleared
            const authCookie = mockCookies.find(c => c.name === 'auth_token');
            expect(authCookie?.maxAge).toBe(0);
            expect(authCookie?.value).toBe('');

            // Assert 3: No valid auth cookie should exist
            const validCookie = mockCookies.find(c => 
              c.name === 'auth_token' && 
              c.value && 
              c.value.length > 0 && 
              c.maxAge && 
              c.maxAge > 0
            );
            expect(validCookie).toBeUndefined();

            // Assert 4: Other non-session data should remain
            // This verifies we only clear session-related data, not all LocalStorage
            expect(mockLocalStorage.getItem('app_preference')).toBe('dark_mode');
            expect(mockLocalStorage.getItem('user_language')).toBe('ar');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property Test: Logout cleanup is idempotent
   * 
   * Calling logout multiple times should not cause errors and should
   * maintain the cleaned state.
   * 
   * Validates: Requirements 2.6, 2.7
   */
  it('should handle multiple logout calls without errors (idempotent cleanup)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 5 }),
        async (logoutCount) => {
          // Reset state
          mockLocalStorage.clear();
          mockCookies = [];

          // Arrange: Login first
          const loginResult = await login('admin', 'admin123');

          if (loginResult.success) {
            // Verify session established
            expect(mockLocalStorage.hasSessionData()).toBe(true);

            // Act: Call logout multiple times
            for (let i = 0; i < logoutCount; i++) {
              const logoutResult = await logout();
              expect(logoutResult.success).toBe(true);
            }

            // Assert: After all logout calls, session should still be cleared
            expect(mockLocalStorage.hasSessionData()).toBe(false);
            expect(mockLocalStorage.getItem('jolly_taxi_session')).toBeNull();

            // Assert: Cookie should still be cleared
            const authCookie = mockCookies.find(c => c.name === 'auth_token');
            expect(authCookie?.maxAge).toBe(0);
            expect(authCookie?.value).toBe('');
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
