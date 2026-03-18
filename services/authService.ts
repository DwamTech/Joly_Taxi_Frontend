import { LoginCredentials, LoginResponse } from "@/models/User";
import { 
  SessionData, 
  AuthState, 
  TokenValidationResult 
} from "@/lib/auth/types";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
).replace(/\/+$/, "");

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // لإرسال واستقبال الـ Cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل تسجيل الدخول");
      }

      // حفظ التوكن في HTTP-only Cookie (يتم من جانب الخادم)
      // وحفظ بيانات الجلسة في localStorage فقط
      this.saveSession(data.token, data.user);
      
      return data;
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "حدث خطأ في الاتصال بالسيرفر");
    }
  }

  /**
   * حفظ بيانات الجلسة في localStorage فقط
   * التوكن يتم تخزينه في HTTP-only Cookie من جانب الخادم
   * Validates: Requirements 1.1, 6.1
   */
  static saveSession(token: string, user: any): void {
    if (typeof window !== "undefined") {
      const sessionData: SessionData = {
        sessionId: this.generateSessionId(),
        userId: user.id,
        role: user.role,
        userName: user.name,
        userEmail: user.email,
        startedAt: new Date(),
        lastActivity: new Date(),
      };

      // حفظ بيانات الجلسة فقط في localStorage (ليس التوكن)
      localStorage.setItem("session_data", JSON.stringify(sessionData));
      
      // حفظ التوكن في cookie عادي مؤقتاً (سيتم نقله لـ HTTP-only من الخادم)
      document.cookie = `auth_token=${token}; path=/; max-age=2592000; SameSite=Strict`;
    }
  }

  /**
   * توليد معرف جلسة فريد
   */
  private static generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * الحصول على بيانات الجلسة من localStorage
   * Validates: Requirement 1.4
   */
  static getSession(): SessionData | null {
    if (typeof window !== "undefined") {
      const sessionStr = localStorage.getItem("session_data");
      if (sessionStr) {
        try {
          return JSON.parse(sessionStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  /**
   * تحديث وقت آخر نشاط في الجلسة
   */
  static updateLastActivity(): void {
    const session = this.getSession();
    if (session) {
      session.lastActivity = new Date();
      localStorage.setItem("session_data", JSON.stringify(session));
    }
  }

  /**
   * الحصول على التوكن من الـ Cookie
   * ملاحظة: في الإنتاج، التوكن سيكون في HTTP-only Cookie ولن يمكن الوصول إليه من JavaScript
   */
  static getToken(): string | null {
    if (typeof window !== "undefined") {
      // محاولة قراءة التوكن من الـ Cookie
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'auth_token') {
          return value;
        }
      }
    }
    return null;
  }

  /**
   * تسجيل الخروج وتنظيف جميع البيانات
   * Validates: Requirement 1.3 - مسح جميع البيانات عند تسجيل الخروج
   */
  static logout(): void {
    if (typeof window !== "undefined") {
      // مسح بيانات الجلسة فقط من localStorage
      localStorage.removeItem("session_data");
      
      // مسح الـ Cookie
      document.cookie = "auth_token=; path=/; max-age=0; SameSite=Strict";
    }
  }

  /**
   * التحقق من حالة المصادقة
   * Validates: Requirement 8.1 - مصدر واحد للحقيقة
   */
  static isAuthenticated(): boolean {
    // التحقق من وجود التوكن والجلسة
    return !!(this.getToken() && this.getSession());
  }

  /**
   * الحصول على حالة المصادقة الكاملة
   * Validates: Requirement 8.1
   */
  static getAuthState(): AuthState {
    const session = this.getSession();
    const hasToken = !!this.getToken();

    return {
      isAuthenticated: hasToken && !!session,
      session: session,
      isLoading: false,
      error: null,
    };
  }

  /**
   * التحقق من صلاحية التوكن مع الخادم
   * Validates: Requirement 2.4
   */
  static async validateToken(): Promise<TokenValidationResult> {
    const token = this.getToken();
    
    if (!token) {
      return {
        isValid: false,
        reason: 'missing',
        message: 'التوكن غير موجود',
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        credentials: 'include', // لإرسال الـ Cookies
      });

      if (response.ok) {
        const session = this.getSession();
        return {
          isValid: true,
          session: session || undefined,
        };
      } else if (response.status === 401) {
        return {
          isValid: false,
          reason: 'expired',
          message: 'انتهت صلاحية الجلسة',
        };
      } else {
        return {
          isValid: false,
          reason: 'invalid',
          message: 'التوكن غير صالح',
        };
      }
    } catch (error) {
      return {
        isValid: false,
        reason: 'network_error',
        message: 'خطأ في الاتصال بالخادم',
      };
    }
  }
}
