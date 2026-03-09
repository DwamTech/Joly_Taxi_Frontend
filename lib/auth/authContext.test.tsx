/**
 * اختبارات سياق المصادقة
 * Tests for authentication context
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './authContext';
import { SessionData } from './types';
import * as authHelpers from './authHelpers';

// Mock the auth helpers
jest.mock('./authHelpers');

const mockedAuthHelpers = authHelpers as jest.Mocked<typeof authHelpers>;

// Test component that uses the auth context
function TestComponent() {
  const auth = useAuth();

  return (
    <div>
      <div data-testid="isAuthenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="isLoading">{auth.isLoading.toString()}</div>
      <div data-testid="sessionId">{auth.session?.sessionId || 'null'}</div>
      <button onClick={() => auth.login(mockSessionData)}>Login</button>
      <button onClick={() => auth.logout()}>Logout</button>
      <button onClick={() => auth.updateActivity()}>Update Activity</button>
    </div>
  );
}

const mockSessionData: SessionData = {
  sessionId: 'test-session-123',
  userId: 1,
  role: 'admin',
  startedAt: new Date('2024-01-01T10:00:00Z'),
  lastActivity: new Date('2024-01-01T10:30:00Z'),
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuthHelpers.getSessionFromStorage.mockReturnValue(null);
    mockedAuthHelpers.saveSessionToStorage.mockImplementation(() => {});
    mockedAuthHelpers.clearSessionFromStorage.mockImplementation(() => {});
    mockedAuthHelpers.updateLastActivity.mockReturnValue(mockSessionData);
  });

  describe('AuthProvider', () => {
    it('should provide auth context to children', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('isAuthenticated')).toBeInTheDocument();
      expect(screen.getByTestId('isLoading')).toBeInTheDocument();
    });

    it('should initialize with unauthenticated state when no session exists', async () => {
      mockedAuthHelpers.getSessionFromStorage.mockReturnValue(null);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
        expect(screen.getByTestId('sessionId')).toHaveTextContent('null');
      });
    });

    it('should initialize with authenticated state when session exists', async () => {
      mockedAuthHelpers.getSessionFromStorage.mockReturnValue(mockSessionData);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
        expect(screen.getByTestId('sessionId')).toHaveTextContent('test-session-123');
      });
    });
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('login function', () => {
    it('should update auth state and save session to storage', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      });

      act(() => {
        screen.getByText('Login').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
        expect(screen.getByTestId('sessionId')).toHaveTextContent('test-session-123');
      });

      expect(mockedAuthHelpers.saveSessionToStorage).toHaveBeenCalledWith(mockSessionData);
    });
  });

  describe('logout function', () => {
    it('should clear auth state and remove session from storage', async () => {
      mockedAuthHelpers.getSessionFromStorage.mockReturnValue(mockSessionData);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      });

      act(() => {
        screen.getByText('Logout').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
        expect(screen.getByTestId('sessionId')).toHaveTextContent('null');
      });

      expect(mockedAuthHelpers.clearSessionFromStorage).toHaveBeenCalled();
    });
  });

  describe('validateToken function', () => {
    it('should validate token and update state on success', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              valid: true,
              session: mockSessionData,
            }),
        })
      ) as jest.Mock;

      const TestValidateComponent = () => {
        const auth = useAuth();
        const [result, setResult] = React.useState<boolean | null>(null);

        return (
          <div>
            <div data-testid="isAuthenticated">{auth.isAuthenticated.toString()}</div>
            <div data-testid="result">{result !== null ? result.toString() : 'null'}</div>
            <button
              onClick={async () => {
                const valid = await auth.validateToken();
                setResult(valid);
              }}
            >
              Validate
            </button>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestValidateComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      });

      act(() => {
        screen.getByText('Validate').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('true');
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      });

      expect(mockedAuthHelpers.saveSessionToStorage).toHaveBeenCalled();
    });

    it('should logout on validation failure', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
        })
      ) as jest.Mock;

      mockedAuthHelpers.getSessionFromStorage.mockReturnValue(mockSessionData);

      const TestValidateComponent = () => {
        const auth = useAuth();
        const [result, setResult] = React.useState<boolean | null>(null);

        return (
          <div>
            <div data-testid="isAuthenticated">{auth.isAuthenticated.toString()}</div>
            <div data-testid="result">{result !== null ? result.toString() : 'null'}</div>
            <button
              onClick={async () => {
                const valid = await auth.validateToken();
                setResult(valid);
              }}
            >
              Validate
            </button>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestValidateComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      });

      act(() => {
        screen.getByText('Validate').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('false');
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      });

      expect(mockedAuthHelpers.clearSessionFromStorage).toHaveBeenCalled();
    });
  });

  describe('updateActivity function', () => {
    it('should update last activity timestamp', async () => {
      mockedAuthHelpers.getSessionFromStorage.mockReturnValue(mockSessionData);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      });

      act(() => {
        screen.getByText('Update Activity').click();
      });

      await waitFor(() => {
        expect(mockedAuthHelpers.updateLastActivity).toHaveBeenCalledWith(mockSessionData);
      });
    });

    it('should not update activity when not authenticated', async () => {
      mockedAuthHelpers.getSessionFromStorage.mockReturnValue(null);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      });

      act(() => {
        screen.getByText('Update Activity').click();
      });

      await waitFor(() => {
        expect(mockedAuthHelpers.updateLastActivity).not.toHaveBeenCalled();
      });
    });
  });
});
