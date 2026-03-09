"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import "./SettingsForm.css";

export default function SettingsForm() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email) {
      showToast("يرجى إدخال البريد الإلكتروني", "error");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast("البريد الإلكتروني غير صحيح", "error");
      return false;
    }

    if (!formData.oldPassword) {
      showToast("يرجى إدخال كلمة المرور القديمة", "error");
      return false;
    }

    if (!formData.newPassword) {
      showToast("يرجى إدخال كلمة المرور الجديدة", "error");
      return false;
    }

    if (formData.newPassword.length < 6) {
      showToast("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل", "error");
      return false;
    }

    if (formData.newPassword === formData.oldPassword) {
      showToast("كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة", "error");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showToast("كلمة المرور الجديدة وتأكيدها غير متطابقين", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      showToast("تم تحديث الإعدادات بنجاح", "success");
      setFormData({
        email: formData.email,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="settings-form-container">
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-section">
          <h2 className="section-title">
            <span>📧</span>
            معلومات الحساب
          </h2>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="example@domain.com"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">
            <span>🔒</span>
            تغيير كلمة المرور
          </h2>
          
          <div className="form-group">
            <label htmlFor="oldPassword" className="form-label">
              كلمة المرور القديمة
            </label>
            <div className="password-input-wrapper">
              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="أدخل كلمة المرور القديمة"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowOldPassword(!showOldPassword)}
                title={showOldPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showOldPassword ? "🚫" : "🔒"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              كلمة المرور الجديدة
            </label>
            <div className="password-input-wrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="أدخل كلمة المرور الجديدة"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowNewPassword(!showNewPassword)}
                title={showNewPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showNewPassword ? "🚫" : "🔒"}
              </button>
            </div>
            <span className="form-hint">
              يجب أن تكون كلمة المرور 6 أحرف على الأقل
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              تأكيد كلمة المرور الجديدة
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="أعد إدخال كلمة المرور الجديدة"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showConfirmPassword ? "🚫" : "🔒"}
              </button>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </form>
    </div>
  );
}
