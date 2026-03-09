'use client';

/**
 * سياق المصادقة (Authentication Context)
 * يوفر مصدراً واحداً للحقيقة لحالة المصادقة في التطبيق
 * Validates: Requirements 2.2, 2.5, 11.1, 11.2, 11.5
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthState, SessionData } from './types';
import { 
  getSessionFromStorage, 
  saveSessionToStorage, 
  clearSessionFromStorage,
  updateLastActivity 
} from './authHelpers';

/**
 * قيمة سياق المصادقة
 * تحتوي على الحالة والدوال المساعدة
 */
export interface AuthContextValue extends AuthState {
  /** دالة تسجيل الدخول */
  login: (sessionData: SessionData) => void;
  /** دالة تسجيل الخروج */
  logout: () => void;
  /** دالة التحقق من صلاحية التوكن */
  validateToken: () => Promise<boolean>;
  /** دالة تحديث آخر نشاط */
  updateActivity: () => void;
  /** دالة تحديث حالة المصادقة */
  setAuthState: (state: Partial<AuthState>) => void;
}

/**
 * سياق المصادقة
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * خصائص مزود سياق المصادقة
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * مزود سياق المصادقة
 * يوفر حالة المصادقة لجميع المكونات الفرعية
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthStateInternal] = useState<AuthState>({
    isAuthenticated: false,
    session: null,
    isLoading: true,
    error: null,
  });

  /**
   * تحديث حالة المصادقة
   */
  const setAuthState = useCallback((state: Partial<AuthState>) => {
    setAuthStateInternal((prev) => ({ ...prev, ...state }));
  }, []);

  /**
   * تحميل الجلسة من LocalStorage عند بدء التطبيق
   */
  useEffect(() => {
    const session = getSessionFromStorage();
    if (session) {
      setAuthState({
        isAuthenticated: true,
        session,
        isLoading: false,
      });
    } else {
      setAuthState({
        isAuthenticated: false,
        session: null,
        isLoading: false,
      });
    }
  }, [setAuthState]);

  /**
   * دالة تسجيل الدخول
   * تحفظ بيانات الجلسة في LocalStorage
   */
  const login = useCallback((sessionData: SessionData) => {
    saveSessionToStorage(sessionData);
    setAuthState({
      isAuthenticated: true,
      session: sessionData,
      error: null,
    });
  }, [setAuthState]);

  /**
   * دالة تسجيل الخروج
   * تمسح جميع بيانات الجلسة من LocalStorage
   */
  const logout = useCallback(() => {
    clearSessionFromStorage();
    setAuthState({
      isAuthenticated: false,
      session: null,
      error: null,
    });
  }, [setAuthState]);

  /**
   * دالة التحقق من صلاحية التوكن
   * ترسل طلب API إلى الخادم للتحقق
   */
  const validateToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/validate', {
        method: 'GET',
        credentials: 'include', // إرسال الـ cookies
      });

      if (response.ok) {
        const data = await response.json();
        if (data.valid && data.session) {
          // تحديث بيانات الجلسة
          saveSessionToStorage(data.session);
          setAuthState({
            isAuthenticated: true,
            session: data.session,
            error: null,
          });
          return true;
        }
      }

      // التوكن غير صالح
      logout();
      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      setAuthState({
        error: 'فشل الاتصال بالخادم',
      });
      return false;
    }
  }, [logout, setAuthState]);

  /**
   * دالة تحديث آخر نشاط
   * تحدث وقت آخر نشاط في LocalStorage
   */
  const updateActivity = useCallback(() => {
    if (authState.session) {
      const updatedSession = updateLastActivity(authState.session);
      setAuthState({
        session: updatedSession,
      });
    }
  }, [authState.session, setAuthState]);

  const value: AuthContextValue = {
    ...authState,
    login,
    logout,
    validateToken,
    updateActivity,
    setAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook للوصول إلى سياق المصادقة
 * يجب استخدامه داخل AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
