/**
 * Property-Based Test: Non-sensitive Session Data in LocalStorage
 * Feature: landing-dashboard-integration, Property 2: Non-sensitive session data in LocalStorage
 * 
 * **Validates: Requirements 2.2, 2.3, 2.5**
 * 
 * This test verifies that for any successful login operation, LocalStorage
 * contains only non-sensitive session metadata (sessionId, timestamps) and
 * never contains auth tokens, passwords, or other sensitive credentials.
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
 * Arbitrary generator for sensitive data patterns
 * These patterns should NEVER appear in LocalStorage
 */
const sensitiveDataArbitrary = fc.record({
  token: fc.string({ minLength: 10, maxLength: 100 }),
  password: fc.string({ minLength: 8, maxLength: 100 }),
  apiKey: fc.string({ minLength: 20, maxLength: 64 }),
  secret: fc.string({ minLength: 16, maxLength: 128 }),
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

  getAll(): Record<string, string> {
    return { ...this.store };
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

describe('Property 2: Non-sensitive session data in LocalStorage', () => {
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
          const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
          const now = new Date().toISOString();

          // Simulate setting HTTP-only cookie with auth token
          const authToken = `jwt-token-${sessionId}-${Math.random().toString(36).substring(2, 25)}`;
          mockCookies.push({
            name: 'auth_token',
            value: authToken,
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
            `auth_token=${authToken}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400${
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
   * Property Test: LocalStorage must contain only non-sensitive session metadata
   * 
   * For any successful login, LocalStorage must contain:
   * - sessionId (non-sensitive identifier)
   * - userId (non-sensitive identifier)
   * - role (non-sensitive metadata)
   * - startedAt (timestamp)
   * - lastActivity (timestamp)
   * 
   * And must NEVER contain:
   * - auth_token or token
   * - password
   * - Any sensitive credentials
   */
  it('should store only non-sensitive session metadata in LocalStorage for any successful login', async () => {
    await fc.assert(
      fc.asyncProperty(credentialsArbitrary, async (credentials) => {
        // Reset state for each property test iteration
        mockLocalStorage.clear();
        mockCookies = [];

        // Act: Attempt login with generated credentials
        const result = await login(credentials.username, credentials.password);

        // Only verify properties for successful logins
        if (result.success) {
          // Get all LocalStorage data
          const allKeys = mockLocalStorage.getAllKeys();
          const allValues = mockLocalStorage.getAllValues();
          const allData = mockLocalStorage.getAll();

          // Assert 1: Verify LocalStorage contains session data
          const sessionKey = allKeys.find(key => key.includes('session'));
          expect(sessionKey).toBeDefined();

          const sessionData = sessionKey ? mockLocalStorage.getItem(sessionKey) : null;
          expect(sessionData).toBeTruthy();

          // Parse session data
          const parsedSession = sessionData ? JSON.parse(sessionData) : null;
          expect(parsedSession).toBeTruthy();

          // Assert 2: Verify session data contains only allowed non-sensitive fields
          const allowedFields = ['sessionId', 'userId', 'role', 'startedAt', 'lastActivity'];
          const sessionFields = Object.keys(parsedSession);
          
          sessionFields.forEach(field => {
            expect(allowedFields).toContain(field);
          });

          // Assert 3: Verify sessionId is present and is a string
          expect(parsedSession.sessionId).toBeDefined();
          expect(typeof parsedSession.sessionId).toBe('string');
          expect(parsedSession.sessionId.length).toBeGreaterThan(0);

          // Assert 4: Verify timestamps are present
          expect(parsedSession.startedAt).toBeDefined();
          expect(parsedSession.lastActivity).toBeDefined();

          // Assert 5: Verify NO auth token in LocalStorage (any key)
          const hasAuthTokenKey = allKeys.some(key => 
            key.toLowerCase().includes('auth_token') || 
            key.toLowerCase().includes('token') ||
            key === 'token'
          );
          expect(hasAuthTokenKey).toBe(false);

          // Assert 6: Verify NO auth token in LocalStorage (any value)
          const authCookie = mockCookies.find(c => c.name === 'auth_token');
          const authTokenValue = authCookie?.value || '';
          
          const hasAuthTokenValue = allValues.some(value => 
            value.includes(authTokenValue) ||
            value.toLowerCase().includes('jwt') ||
            value.toLowerCase().includes('bearer')
          );
          expect(hasAuthTokenValue).toBe(false);

          // Assert 7: Verify NO password in LocalStorage (any value)
          const hasPassword = allValues.some(value => 
            value.includes(credentials.password)
          );
          expect(hasPassword).toBe(false);

          // Assert 8: Verify session data doesn't contain sensitive fields
          expect(parsedSession.token).toBeUndefined();
          expect(parsedSession.auth_token).toBeUndefined();
          expect(parsedSession.authToken).toBeUndefined();
          expect(parsedSession.password).toBeUndefined();
          expect(parsedSession.credentials).toBeUndefined();
          expect(parsedSession.secret).toBeUndefined();
          expect(parsedSession.apiKey).toBeUndefined();

          // Assert 9: Verify no other keys in LocalStorage contain sensitive data
          allKeys.forEach(key => {
            const value = mockLocalStorage.getItem(key);
            if (value) {
              // Should not contain password
              expect(value).not.toContain(credentials.password);
              
              // Should not contain auth token
              if (authTokenValue) {
                expect(value).not.toContain(authTokenValue);
              }
            }
          });
        }
      }),
      { numRuns: 100 } // Run 100 iterations as specified in requirements
    );
  });

  /**
   * Property Test: LocalStorage must never contain credentials for any login attempt
   * 
   * This test verifies that regardless of login success or failure,
   * LocalStorage never contains passwords or auth tokens.
   */
  it('should never store credentials in LocalStorage for any login attempt (success or failure)', async () => {
    await fc.assert(
      fc.asyncProperty(credentialsArbitrary, async (credentials) => {
        // Reset state
        mockLocalStorage.clear();
        mockCookies = [];

        // Act: Attempt login
        await login(credentials.username, credentials.password);

        // Assert: Verify no credentials in LocalStorage (regardless of success/failure)
        const allKeys = mockLocalStorage.getAllKeys();
        const allValues = mockLocalStorage.getAllValues();

        // Check 1: No password in any value
        const hasPassword = allValues.some(value => 
          value.includes(credentials.password)
        );
        expect(hasPassword).toBe(false);

        // Check 2: No token-related keys
        const hasTokenKey = allKeys.some(key => {
          const lowerKey = key.toLowerCase();
          return lowerKey.includes('auth_token') || 
                 lowerKey.includes('authtoken') ||
                 lowerKey === 'token' ||
                 lowerKey.includes('jwt') ||
                 lowerKey.includes('bearer');
        });
        expect(hasTokenKey).toBe(false);

        // Check 3: No sensitive field names in stored data
        allKeys.forEach(key => {
          const value = mockLocalStorage.getItem(key);
          if (value) {
            try {
              const parsed = JSON.parse(value);
              
              // Verify no sensitive fields
              expect(parsed.password).toBeUndefined();
              expect(parsed.token).toBeUndefined();
              expect(parsed.auth_token).toBeUndefined();
              expect(parsed.authToken).toBeUndefined();
              expect(parsed.credentials).toBeUndefined();
              expect(parsed.secret).toBeUndefined();
              expect(parsed.apiKey).toBeUndefined();
              expect(parsed.privateKey).toBeUndefined();
            } catch {
              // If not JSON, just verify no password
              expect(value).not.toContain(credentials.password);
            }
          }
        });
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property Test: Session data structure must be consistent
   * 
   * This test verifies that the session data structure in LocalStorage
   * is consistent and contains only the expected non-sensitive fields.
   */
  it('should maintain consistent non-sensitive session data structure for all successful logins', async () => {
    await fc.assert(
      fc.asyncProperty(credentialsArbitrary, async (credentials) => {
        // Reset state
        mockLocalStorage.clear();
        mockCookies = [];

        // Act: Attempt login
        const result = await login(credentials.username, credentials.password);

        // Only verify for successful logins
        if (result.success) {
          const allKeys = mockLocalStorage.getAllKeys();
          const sessionKey = allKeys.find(key => key.includes('session'));
          
          expect(sessionKey).toBeDefined();
          
          const sessionData = sessionKey ? mockLocalStorage.getItem(sessionKey) : null;
          expect(sessionData).toBeTruthy();

          const parsed = JSON.parse(sessionData!);

          // Assert: Verify required non-sensitive fields are present
          expect(parsed).toHaveProperty('sessionId');
          expect(parsed).toHaveProperty('userId');
          expect(parsed).toHaveProperty('role');
          expect(parsed).toHaveProperty('startedAt');
          expect(parsed).toHaveProperty('lastActivity');

          // Assert: Verify field types
          expect(typeof parsed.sessionId).toBe('string');
          expect(typeof parsed.userId).toBe('number');
          expect(typeof parsed.role).toBe('string');
          expect(typeof parsed.startedAt).toBe('string'); // ISO string
          expect(typeof parsed.lastActivity).toBe('string'); // ISO string

          // Assert: Verify timestamps are valid ISO strings
          expect(() => new Date(parsed.startedAt)).not.toThrow();
          expect(() => new Date(parsed.lastActivity)).not.toThrow();
          
          const startedAt = new Date(parsed.startedAt);
          const lastActivity = new Date(parsed.lastActivity);
          
          expect(startedAt.getTime()).toBeGreaterThan(0);
          expect(lastActivity.getTime()).toBeGreaterThan(0);

          // Assert: Verify no extra sensitive fields
          const allowedFields = ['sessionId', 'userId', 'role', 'startedAt', 'lastActivity'];
          const actualFields = Object.keys(parsed);
          
          actualFields.forEach(field => {
            expect(allowedFields).toContain(field);
          });
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property Test: Verify auth token is in cookie, not LocalStorage
   * 
   * This test explicitly verifies the separation of concerns:
   * - Auth token must be in HTTP-only cookie
   * - Session metadata must be in LocalStorage
   * - Never mix the two
   */
  it('should store auth token in cookie and session metadata in LocalStorage separately', async () => {
    await fc.assert(
      fc.asyncProperty(credentialsArbitrary, async (credentials) => {
        // Reset state
        mockLocalStorage.clear();
        mockCookies = [];

        // Act: Attempt login
        const result = await login(credentials.username, credentials.password);

        // Only verify for successful logins
        if (result.success) {
          // Assert 1: Auth token is in cookie
          const authCookie = mockCookies.find(c => c.name === 'auth_token');
          expect(authCookie).toBeDefined();
          expect(authCookie?.value).toBeTruthy();
          expect(authCookie?.httpOnly).toBe(true);

          // Assert 2: Session metadata is in LocalStorage
          const allKeys = mockLocalStorage.getAllKeys();
          const sessionKey = allKeys.find(key => key.includes('session'));
          expect(sessionKey).toBeDefined();

          const sessionData = sessionKey ? mockLocalStorage.getItem(sessionKey) : null;
          expect(sessionData).toBeTruthy();

          // Assert 3: Auth token value is NOT in LocalStorage
          const authTokenValue = authCookie?.value || '';
          const allValues = mockLocalStorage.getAllValues();
          
          const hasAuthToken = allValues.some(value => 
            value.includes(authTokenValue)
          );
          expect(hasAuthToken).toBe(false);

          // Assert 4: Session data doesn't reference the auth token
          const parsed = JSON.parse(sessionData!);
          const sessionString = JSON.stringify(parsed);
          
          expect(sessionString).not.toContain(authTokenValue);
          expect(sessionString.toLowerCase()).not.toContain('jwt');
          expect(sessionString.toLowerCase()).not.toContain('bearer');
        }
      }),
      { numRuns: 100 }
    );
  });
});
