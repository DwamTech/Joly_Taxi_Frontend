/**
 * دوال مساعدة للمصادقة
 * تدير تخزين بيانات الجلسة في LocalStorage
 * Validates: Requirements 2.2, 2.5, 11.5
 */

import { SessionData } from './types';

/**
 * مفتاح تخزين بيانات الجلسة في LocalStorage
 */
const SESSION_STORAGE_KEY = 'jolly_taxi_session';

/**
 * حفظ بيانات الجلسة في LocalStorage
 * يحفظ فقط البيانات غير الحساسة (sessionId, timestamps)
 * 
 * @param sessionData - بيانات الجلسة
 */
export function saveSessionToStorage(sessionData: SessionData): void {
  if (typeof window === 'undefined') {
    return; // لا يعمل على جانب الخادم
  }

  try {
    // تحويل التواريخ إلى strings للتخزين
    const storageData = {
      sessionId: sessionData.sessionId,
      userId: sessionData.userId,
      role: sessionData.role,
      startedAt: sessionData.startedAt.toISOString(),
      lastActivity: sessionData.lastActivity.toISOString(),
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.error('Failed to save session to localStorage:', error);
  }
}

/**
 * استرجاع بيانات الجلسة من LocalStorage
 * 
 * @returns بيانات الجلسة أو null إذا لم تكن موجودة
 */
export function getSessionFromStorage(): SessionData | null {
  if (typeof window === 'undefined') {
    return null; // لا يعمل على جانب الخادم
  }

  try {
    const storedData = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!storedData) {
      return null;
    }

    const parsed = JSON.parse(storedData);
    
    // تحويل strings إلى Date objects
    return {
      sessionId: parsed.sessionId,
      userId: parsed.userId,
      role: parsed.role,
      startedAt: new Date(parsed.startedAt),
      lastActivity: new Date(parsed.lastActivity),
    };
  } catch (error) {
    console.error('Failed to get session from localStorage:', error);
    return null;
  }
}

/**
 * مسح جميع بيانات الجلسة من LocalStorage
 */
export function clearSessionFromStorage(): void {
  if (typeof window === 'undefined') {
    return; // لا يعمل على جانب الخادم
  }

  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear session from localStorage:', error);
  }
}

/**
 * تحديث وقت آخر نشاط في بيانات الجلسة
 * 
 * @param sessionData - بيانات الجلسة الحالية
 * @returns بيانات الجلسة المحدثة
 */
export function updateLastActivity(sessionData: SessionData): SessionData {
  const updatedSession = {
    ...sessionData,
    lastActivity: new Date(),
  };

  saveSessionToStorage(updatedSession);
  return updatedSession;
}

/**
 * التحقق من صلاحية الجلسة بناءً على وقت آخر نشاط
 * 
 * @param sessionData - بيانات الجلسة
 * @param maxInactivityMinutes - الحد الأقصى لعدم النشاط بالدقائق (افتراضي: 60)
 * @returns true إذا كانت الجلسة صالحة
 */
export function isSessionValid(
  sessionData: SessionData | null,
  maxInactivityMinutes: number = 60
): boolean {
  if (!sessionData) {
    return false;
  }

  const now = new Date();
  const lastActivity = new Date(sessionData.lastActivity);
  const diffMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60);

  return diffMinutes < maxInactivityMinutes;
}

/**
 * دالة تسجيل الدخول
 * ترسل بيانات الاعتماد إلى الخادم وتحفظ الجلسة
 * 
 * @param username - اسم المستخدم
 * @param password - كلمة المرور
 * @returns بيانات الجلسة أو null في حالة الفشل
 */
export async function login(
  username: string,
  password: string
): Promise<{ success: boolean; session?: SessionData; message?: string }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // إرسال واستقبال الـ cookies
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // تحويل التواريخ من strings إلى Date objects
      const session: SessionData = {
        sessionId: data.sessionId,
        userId: data.userId,
        role: data.role,
        startedAt: new Date(data.startedAt),
        lastActivity: new Date(data.lastActivity || data.startedAt),
      };

      saveSessionToStorage(session);
      return { success: true, session };
    }

    return { success: false, message: data.message || 'فشل تسجيل الدخول' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'فشل الاتصال بالخادم' };
  }
}

/**
 * دالة تسجيل الخروج
 * ترسل طلب تسجيل خروج إلى الخادم وتمسح الجلسة
 */
export async function logout(): Promise<{ success: boolean }> {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // إرسال الـ cookies
    });

    clearSessionFromStorage();

    if (response.ok) {
      return { success: true };
    }

    return { success: false };
  } catch (error) {
    console.error('Logout error:', error);
    // نمسح الجلسة المحلية حتى لو فشل الطلب
    clearSessionFromStorage();
    return { success: false };
  }
}

/**
 * دالة التحقق من صلاحية التوكن
 * ترسل طلب إلى الخادم للتحقق من صلاحية التوكن
 */
export async function validateToken(): Promise<{
  valid: boolean;
  session?: SessionData;
  message?: string;
}> {
  try {
    const response = await fetch('/api/auth/validate', {
      method: 'GET',
      credentials: 'include', // إرسال الـ cookies
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.valid && data.session) {
        // تحويل التواريخ من strings إلى Date objects
        const session: SessionData = {
          sessionId: data.session.sessionId,
          userId: data.session.userId,
          role: data.session.role,
          startedAt: new Date(data.session.startedAt),
          lastActivity: new Date(data.session.lastActivity),
        };

        saveSessionToStorage(session);
        return { valid: true, session };
      }
    }

    // التوكن غير صالح
    clearSessionFromStorage();
    return { valid: false, message: 'انتهت صلاحية الجلسة' };
  } catch (error) {
    console.error('Token validation error:', error);
    return { valid: false, message: 'فشل الاتصال بالخادم' };
  }
}
