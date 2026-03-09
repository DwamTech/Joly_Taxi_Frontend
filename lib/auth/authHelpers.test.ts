/**
 * اختبارات الدوال المساعدة للمصادقة
 * Tests for authentication helper functions
 */

import {
  saveSessionToStorage,
  getSessionFromStorage,
  clearSessionFromStorage,
  updateLastActivity,
  isSessionValid,
} from './authHelpers';
import { SessionData } from './types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('authHelpers', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('saveSessionToStorage', () => {
    it('should save session data to localStorage', () => {
      const sessionData: SessionData = {
        sessionId: 'test-session-123',
        userId: 1,
        role: 'admin',
        startedAt: new Date('2024-01-01T10:00:00Z'),
        lastActivity: new Date('2024-01-01T10:30:00Z'),
      };

      saveSessionToStorage(sessionData);

      const stored = localStorage.getItem('jolly_taxi_session');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.sessionId).toBe('test-session-123');
      expect(parsed.userId).toBe(1);
      expect(parsed.role).toBe('admin');
      expect(parsed.startedAt).toBe('2024-01-01T10:00:00.000Z');
      expect(parsed.lastActivity).toBe('2024-01-01T10:30:00.000Z');
    });

    it('should not store sensitive data like passwords', () => {
      const sessionData: SessionData = {
        sessionId: 'test-session-123',
        userId: 1,
        role: 'admin',
        startedAt: new Date(),
        lastActivity: new Date(),
      };

      saveSessionToStorage(sessionData);

      const stored = localStorage.getItem('jolly_taxi_session');
      const parsed = JSON.parse(stored!);

      // Verify no password or token fields
      expect(parsed).not.toHaveProperty('password');
      expect(parsed).not.toHaveProperty('token');
      expect(parsed).not.toHaveProperty('authToken');
    });
  });

  describe('getSessionFromStorage', () => {
    it('should retrieve session data from localStorage', () => {
      const sessionData = {
        sessionId: 'test-session-123',
        userId: 1,
        role: 'admin',
        startedAt: '2024-01-01T10:00:00.000Z',
        lastActivity: '2024-01-01T10:30:00.000Z',
      };

      localStorage.setItem('jolly_taxi_session', JSON.stringify(sessionData));

      const retrieved = getSessionFromStorage();

      expect(retrieved).not.toBeNull();
      expect(retrieved?.sessionId).toBe('test-session-123');
      expect(retrieved?.userId).toBe(1);
      expect(retrieved?.role).toBe('admin');
      expect(retrieved?.startedAt).toBeInstanceOf(Date);
      expect(retrieved?.lastActivity).toBeInstanceOf(Date);
    });

    it('should return null if no session exists', () => {
      const retrieved = getSessionFromStorage();
      expect(retrieved).toBeNull();
    });

    it('should return null if stored data is invalid JSON', () => {
      localStorage.setItem('jolly_taxi_session', 'invalid-json');
      const retrieved = getSessionFromStorage();
      expect(retrieved).toBeNull();
    });
  });

  describe('clearSessionFromStorage', () => {
    it('should remove session data from localStorage', () => {
      const sessionData = {
        sessionId: 'test-session-123',
        userId: 1,
        role: 'admin',
        startedAt: '2024-01-01T10:00:00.000Z',
        lastActivity: '2024-01-01T10:30:00.000Z',
      };

      localStorage.setItem('jolly_taxi_session', JSON.stringify(sessionData));
      expect(localStorage.getItem('jolly_taxi_session')).not.toBeNull();

      clearSessionFromStorage();

      expect(localStorage.getItem('jolly_taxi_session')).toBeNull();
    });
  });

  describe('updateLastActivity', () => {
    it('should update lastActivity timestamp', () => {
      const sessionData: SessionData = {
        sessionId: 'test-session-123',
        userId: 1,
        role: 'admin',
        startedAt: new Date('2024-01-01T10:00:00Z'),
        lastActivity: new Date('2024-01-01T10:30:00Z'),
      };

      const beforeUpdate = sessionData.lastActivity.getTime();
      
      // Wait a bit to ensure time difference
      jest.useFakeTimers();
      jest.advanceTimersByTime(1000);

      const updated = updateLastActivity(sessionData);

      expect(updated.lastActivity.getTime()).toBeGreaterThan(beforeUpdate);
      expect(updated.sessionId).toBe(sessionData.sessionId);
      expect(updated.userId).toBe(sessionData.userId);

      jest.useRealTimers();
    });

    it('should save updated session to localStorage', () => {
      const sessionData: SessionData = {
        sessionId: 'test-session-123',
        userId: 1,
        role: 'admin',
        startedAt: new Date('2024-01-01T10:00:00Z'),
        lastActivity: new Date('2024-01-01T10:30:00Z'),
      };

      updateLastActivity(sessionData);

      const stored = localStorage.getItem('jolly_taxi_session');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.sessionId).toBe('test-session-123');
    });
  });

  describe('isSessionValid', () => {
    it('should return true for recent activity', () => {
      const sessionData: SessionData = {
        sessionId: 'test-session-123',
        userId: 1,
        role: 'admin',
        startedAt: new Date(),
        lastActivity: new Date(), // Current time
      };

      expect(isSessionValid(sessionData)).toBe(true);
    });

    it('should return false for expired session', () => {
      const sessionData: SessionData = {
        sessionId: 'test-session-123',
        userId: 1,
        role: 'admin',
        startedAt: new Date(),
        lastActivity: new Date(Date.now() - 61 * 60 * 1000), // 61 minutes ago
      };

      expect(isSessionValid(sessionData, 60)).toBe(false);
    });

    it('should return false for null session', () => {
      expect(isSessionValid(null)).toBe(false);
    });

    it('should respect custom maxInactivityMinutes', () => {
      const sessionData: SessionData = {
        sessionId: 'test-session-123',
        userId: 1,
        role: 'admin',
        startedAt: new Date(),
        lastActivity: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
      };

      expect(isSessionValid(sessionData, 30)).toBe(true);
      expect(isSessionValid(sessionData, 20)).toBe(false);
    });
  });
});
