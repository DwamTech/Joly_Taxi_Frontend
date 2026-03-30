"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/authService";
import "./LoginForm.css";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { email: "", password: "", general: "" };

    if (!email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "كلمة المرور مطلوبة";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({ email: "", password: "", general: "" });

    try {
      const response = await AuthService.login({ email, password });
      console.log("Login successful:", response);

      // الانتظار قليلاً للتأكد من حفظ البيانات
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 100);
    } catch (error: any) {
      setIsLoading(false);
      const raw   = (error.message || "").toLowerCase();
      const status = error.status ?? 0;

      let emailErr = "";
      let passwordErr = "";
      let generalErr = "";

      if (status === 401 || status === 422 ||
          raw.includes("invalid credentials") ||
          raw.includes("these credentials do not match") ||
          raw.includes("بيانات غير صحيحة")
      ) {
        generalErr = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      } else if (raw.includes("email")) {
        emailErr = "البريد الإلكتروني غير صحيح أو غير مسجل";
      } else if (raw.includes("password") || raw.includes("كلمة المرور")) {
        passwordErr = "كلمة المرور غير صحيحة";
      } else if (raw.includes("validation") || raw.includes("required") || raw.includes("مطلوب")) {
        generalErr = "يرجى التحقق من البريد الإلكتروني وكلمة المرور";
      } else if (status === 403 || raw.includes("غير مصرح") || raw.includes("unauthorized")) {
        generalErr = "غير مصرح لك بالدخول إلى لوحة التحكم";
      } else if (status === 429) {
        generalErr = "محاولات كثيرة، يرجى الانتظار قليلاً ثم المحاولة مجدداً";
      } else if (status >= 500 || raw.includes("server")) {
        generalErr = "حدث خطأ في الخادم، يرجى المحاولة لاحقاً";
      } else if (raw.includes("network") || raw.includes("fetch") || raw.includes("اتصال")) {
        generalErr = "تعذر الاتصال بالخادم، تحقق من الإنترنت وحاول مجدداً";
      } else {
        generalErr = "حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مجدداً";
      }

      setErrors({ email: emailErr, password: passwordErr, general: generalErr });
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="login-title">تسجيل الدخول</h2>

      {errors.general && (
        <div className="error-message-general">{errors.general}</div>
      )}

      <div className="form-group">
        <label htmlFor="email">البريد الإلكتروني</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? "input-error" : ""}
          placeholder="أدخل البريد الإلكتروني"
          disabled={isLoading}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">كلمة المرور</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={errors.password ? "input-error" : ""}
          placeholder="أدخل كلمة المرور"
          disabled={isLoading}
        />
        {errors.password && <span className="error-message">{errors.password}</span>}
      </div>

      <button type="submit" className="login-button" disabled={isLoading}>
        {isLoading ? "جاري تسجيل الدخول..." : "دخول"}
      </button>
    </form>
  );
}
