/**
 * أنواع TypeScript للمصادقة الآمنة
 * Validates: Requirements 1.1, 6.1, 8.1
 */

/**
 * رمز المصادقة (JWT Token)
 * يتم تخزينه في HTTP-only Cookie للأمان
 */
export interface AuthToken {
  /** قيمة التوكن (JWT) */
  value: string;
  /** تاريخ انتهاء الصلاحية */
  expiresAt: Date;
  /** نوع التوكن (Bearer) */
  type: 'Bearer';
}

/**
 * بيانات الجلسة النشطة
 * يتم تخزينها في localStorage للوصول السريع من جانب العميل
 */
export interface SessionData {
  /** معرف الجلسة الفريد */
  sessionId: string;
  /** معرف المستخدم */
  userId: number;
  /** دور المستخدم (admin, etc.) */
  role: string;
  /** اسم المستخدم */
  userName?: string;
  /** البريد الإلكتروني */
  userEmail?: string;
  /** تاريخ بدء الجلسة */
  startedAt: Date;
  /** تاريخ آخر نشاط */
  lastActivity: Date;
}

/**
 * حالة المصادقة الموحدة
 * مصدر واحد للحقيقة (Single Source of Truth)
 */
export interface AuthState {
  /** حالة المصادقة */
  isAuthenticated: boolean;
  /** بيانات الجلسة (إذا كان مصادقاً) */
  session: SessionData | null;
  /** حالة التحميل */
  isLoading: boolean;
  /** رسالة الخطأ (إن وجدت) */
  error: string | null;
}

/**
 * خيارات تكوين Cookie
 */
export interface CookieOptions {
  /** اسم الـ Cookie */
  name: string;
  /** القيمة */
  value: string;
  /** المدة بالثواني */
  maxAge: number;
  /** المسار */
  path: string;
  /** HTTP-only flag */
  httpOnly: boolean;
  /** Secure flag (HTTPS only) */
  secure: boolean;
  /** SameSite attribute */
  sameSite: 'Strict' | 'Lax' | 'None';
}

/**
 * نتيجة التحقق من التوكن
 */
export interface TokenValidationResult {
  /** هل التوكن صالح */
  isValid: boolean;
  /** بيانات الجلسة (إذا كان صالحاً) */
  session?: SessionData;
  /** سبب الفشل (إذا كان غير صالح) */
  reason?: 'expired' | 'invalid' | 'missing' | 'network_error';
  /** رسالة الخطأ */
  message?: string;
}
