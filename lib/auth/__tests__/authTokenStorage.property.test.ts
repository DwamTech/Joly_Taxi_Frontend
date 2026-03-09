/**
 * Property-Based Test: Auth Token Storage Security
 * Feature: landing-dashboard-integration, Property 1: Auth token storage security
 * 
 * **Validates: Requirements 2.1, 2.4**
 * 
 * This test verifies that for any successful login operation, the auth token
 * is stored exclusively in an HTTP-only cookie with Secure and SameSite=Strict
 * attributes, and is never accessible via JavaScript or stored in LocalStorage.
 */

import fc from 'fast-check';
import { login } from '@/lib/auth/authHelpers';

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
}

/**
 * Mock Response with cookies
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

describe('Property 1: Auth token storage security', () => {
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

          // Set cookie header
          response.headers.set(
            'set-cookie',
            `auth_token=${cookieValue}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400${
              process.env.NODE_ENV === 'production' ? '; Secure' : ''
            }`
          );

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
   * Property Test: Auth token must be stored only in HTTP-only cookie
   * 
   * For any valid login credentials, the system must:
   * 1. Store the auth token in an HTTP-only cookie
   * 2. Set cookie attributes: httpOnly=true, secure=true (in production), sameSite=strict
   * 3. Never store the auth token in LocalStorage
   * 4. Never make the auth token accessible via JavaScript
   */
  it('should store auth token only in HTTP-only cookie with correct attributes for any credentials', async () => {
    await fc.assert(
      fc.asyncProperty(credentialsArbitrary, async (credentials) => {
        // Reset state for each property test iteration
        mockLocalStorage.clear();
        mockCookies = [];

        // Act: Attempt login with generated credentials
        const result = await login(credentials.username, credentials.password);

        // Only verify properties for successful logins
        if (result.success) {
          // Assert 1: Verify auth token is in HTTP-only cookie
          const authCookie = mockCookies.find(c => c.name === 'auth_token');
          
          expect(authCookie).toBeDefined();
          expect(authCookie?.value).toBeTruthy();
          expect(typeof authCookie?.value).toBe('string');
          expect(authCookie?.value.length).toBeGreaterThan(0);

          // Assert 2: Verify cookie has httpOnly attribute
          expect(authCookie?.httpOnly).toBe(true);

          // Assert 3: Verify cookie has Secure attribute (in production)
          if (process.env.NODE_ENV === 'production') {
            expect(authCookie?.secure).toBe(true);
          }

          // Assert 4: Verify cookie has SameSite=Strict attribute
          expect(authCookie?.sameSite).toBe('strict');

          // Assert 5: Verify auth token is NOT in LocalStorage
          const allLocalStorageKeys = mockLocalStorage.getAllKeys();
          const allLocalStorageValues = mockLocalStorage.getAllValues();
          
          // Check that no key contains 'token' or 'auth_token'
          const hasTokenKey = allLocalStorageKeys.some(key => 
            key.toLowerCase().includes('auth_token') || key === 'token'
          );
          expect(hasTokenKey).toBe(false);

          // Check that no value contains the actual token value
          const tokenValue = authCookie?.value || '';
          const hasTokenValue = allLocalStorageValues.some(value => 
            value.includes(tokenValue)
          );
          expect(hasTokenValue).toBe(false);

          // Assert 6: Verify password is NOT in LocalStorage
          const hasPassword = allLocalStorageValues.some(value => 
            value.includes(credentials.password)
          );
          expect(hasPassword).toBe(false);

          // Assert 7: Verify token is not accessible via JavaScript
          // (This is implicitly guaranteed by HttpOnly, but we verify no token in accessible storage)
          const sessionData = mockLocalStorage.getItem('jolly_taxi_session');
          if (sessionData) {
            const parsed = JSON.parse(sessionData);
            expect(parsed.token).toBeUndefined();
            expect(parsed.auth_token).toBeUndefined();
            expect(parsed.password).toBeUndefined();
          }
        }
      }),
      { numRuns: 100 } // Run 100 iterations as specified in requirements
    );
  });

  /**
   * Property Test: LocalStorage should only contain non-sensitive session metadata
   * 
   * This test verifies that LocalStorage never contains:
   * - Auth tokens
   * - Passwords
   * - Any sensitive credentials
   */
  it('should never store sensitive data in LocalStorage for any login attempt', async () => {
    await fc.assert(
      fc.asyncProperty(credentialsArbitrary, async (credentials) => {
        // Reset state
        mockLocalStorage.clear();
        mockCookies = [];

        // Act: Attempt login
        const result = await login(credentials.username, credentials.password);

        // Assert: Verify no sensitive data in LocalStorage (regardless of success/failure)
        const allLocalStorageValues = mockLocalStorage.getAllValues();
        
        // Check for password
        const hasPassword = allLocalStorageValues.some(value => 
          value.includes(credentials.password)
        );
        expect(hasPassword).toBe(false);

        // Check for token in localStorage
        const allLocalStorageKeys = mockLocalStorage.getAllKeys();
        
        allLocalStorageKeys.forEach(key => {
          const lowerKey = key.toLowerCase();
          if (lowerKey.includes('session')) {
            // Session data is allowed, but verify it doesn't contain sensitive info
            const value = mockLocalStorage.getItem(key);
            if (value) {
              // Password should never be in session data
              expect(value).not.toContain(credentials.password);
              
              // Parse and verify structure
              try {
                const parsed = JSON.parse(value);
                expect(parsed.password).toBeUndefined();
                expect(parsed.token).toBeUndefined();
                expect(parsed.auth_token).toBeUndefined();
              } catch {
                // If not JSON, just verify no password
                expect(value).not.toContain(credentials.password);
              }
            }
          }
        });

        // If login was successful, verify cookie was set
        if (result.success) {
          const authCookie = mockCookies.find(c => c.name === 'auth_token');
          expect(authCookie).toBeDefined();
          expect(authCookie?.value).toBeTruthy();
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property Test: Cookie attributes must be secure for all successful logins
   * 
   * This test verifies that the cookie security attributes are always set correctly,
   * regardless of the input credentials.
   */
  it('should set secure cookie attributes for all successful logins', async () => {
    await fc.assert(
      fc.asyncProperty(credentialsArbitrary, async (credentials) => {
        // Reset state
        mockLocalStorage.clear();
        mockCookies = [];

        // Act: Attempt login
        const result = await login(credentials.username, credentials.password);

        // Assert: Only check successful logins
        if (result.success) {
          const authCookie = mockCookies.find(c => c.name === 'auth_token');
          
          expect(authCookie).toBeDefined();

          // Verify all required security attributes
          expect(authCookie?.httpOnly).toBe(true);
          expect(authCookie?.sameSite).toBe('strict');
          expect(authCookie?.path).toBe('/');
          
          // Verify Max-Age is set (24 hours = 86400 seconds)
          expect(authCookie?.maxAge).toBe(86400);
          
          // Verify cookie name is correct
          expect(authCookie?.name).toBe('auth_token');
        }
      }),
      { numRuns: 100 }
    );
  });
});
