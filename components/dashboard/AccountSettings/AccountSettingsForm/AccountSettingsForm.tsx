"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import "./AccountSettingsForm.css";

export default function AccountSettingsForm() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "أحمد محمد",
    email: "admin@jolytaxi.com",
    phone: "+966 50 123 4567",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("تم حفظ معلومات الحساب بنجاح", "success");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      showToast("كلمة المرور الجديدة غير متطابقة", "error");
      return;
    }

    showToast("تم تغيير كلمة المرور بنجاح", "success");
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

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
            />
          </div>
          <div className="form-group">
            <label className="form-label">رقم الهاتف</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-save">
            💾 حفظ التغييرات
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
              name="currentPassword"
              className="form-input"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="أدخل كلمة المرور الحالية"
            />
          </div>
          <div className="form-group">
            <label className="form-label">كلمة المرور الجديدة</label>
            <input
              type="password"
              name="newPassword"
              className="form-input"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="أدخل كلمة المرور الجديدة"
            />
          </div>
          <div className="form-group">
            <label className="form-label">تأكيد كلمة المرور</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="أعد إدخال كلمة المرور الجديدة"
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-save">
            🔑 تغيير كلمة المرور
          </button>
        </div>
      </form>
    </div>
  );
}
