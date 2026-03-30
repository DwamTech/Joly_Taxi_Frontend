"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import { ProfileService } from "@/services/profileService";
import "./AccountSettingsForm.css";

export default function AccountSettingsForm() {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ProfileService.getProfile()
      .then((profile) => {
        setFormData({
          name:  profile.name,
          email: profile.email,
          phone: profile.phone,
          role:  profile.role,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await ProfileService.updateProfile({
        name:  formData.name,
        email: formData.email,
        phone: formData.phone,
      });
      setFormData((prev) => ({ ...prev, ...updated }));
      showToast("تم حفظ معلومات الحساب بنجاح", "success");
    } catch (err: any) {
      showToast(err.message || "فشل حفظ البيانات", "error");
    } finally {
      setSaving(false);
    }
  };

  const [savingPassword, setSavingPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast("كلمة المرور الجديدة غير متطابقة", "error");
      return;
    }
    setSavingPassword(true);
    try {
      await ProfileService.changePassword({
        current_password:          passwords.currentPassword,
        new_password:              passwords.newPassword,
        new_password_confirmation: passwords.confirmPassword,
      });
      showToast("تم تغيير كلمة المرور بنجاح", "success");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      showToast(err.message || "فشل تغيير كلمة المرور", "error");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="account-settings-loading">
        <div className="as-spinner" />
        <span>جاري تحميل البيانات...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-settings-error">⚠️ {error}</div>
    );
  }

  return (
    <div className="account-settings-form">
      {/* معلومات الحساب */}
      <form className="settings-section" onSubmit={handleSaveProfile}>
        <h2 className="section-title">👤 معلومات الحساب</h2>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">الاسم</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              dir="ltr"
            />
          </div>
          <div className="form-group">
            <label className="form-label">رقم الهاتف</label>
            <input
              type="tel"
              name="phone"
              className="form-input phone-input"
              value={formData.phone}
              onChange={handleChange}
              dir="ltr"
            />
          </div>
          <div className="form-group">
            <label className="form-label">الدور</label>
            <input
              type="text"
              className="form-input"
              value={formData.role}
              readOnly
              disabled
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? "جاري الحفظ..." : "💾 حفظ التغييرات"}
          </button>
        </div>
      </form>

      {/* تغيير كلمة المرور */}
      <form className="settings-section" onSubmit={handleChangePassword}>
        <h2 className="section-title">🔒 تغيير كلمة المرور</h2>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">كلمة المرور الحالية</label>
            <input
              type="password"
              className="form-input"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              placeholder="أدخل كلمة المرور الحالية"
            />
          </div>
          <div className="form-group">
            <label className="form-label">كلمة المرور الجديدة</label>
            <input
              type="password"
              className="form-input"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              placeholder="أدخل كلمة المرور الجديدة"
            />
          </div>
          <div className="form-group">
            <label className="form-label">تأكيد كلمة المرور</label>
            <input
              type="password"
              className="form-input"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              placeholder="أعد إدخال كلمة المرور الجديدة"
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={savingPassword}>
            {savingPassword ? "جاري التغيير..." : "🔑 تغيير كلمة المرور"}
          </button>
        </div>
      </form>
    </div>
  );
}
