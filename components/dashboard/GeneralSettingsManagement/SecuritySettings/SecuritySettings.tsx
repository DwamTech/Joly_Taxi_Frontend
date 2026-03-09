"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import "./SecuritySettings.css";

interface SecuritySettingsProps {
  data: any;
  onSave: (data: any) => void;
}

export default function SecuritySettings({ data, onSave }: SecuritySettingsProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState(data);

  const handleChange = (section: string, field: string, value: any) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  const handleSave = () => {
    onSave(formData);
    showToast("تم حفظ إعدادات الأمان بنجاح", "success");
  };

  return (
    <div className="security-settings">
      {/* إعدادات الأمان */}
      <div className="settings-section">
        <h2 className="section-title">🔒 إعدادات الأمان</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <label className="setting-label">مدة صلاحية OTP (دقيقة)</label>
            <input
              type="number"
              className="setting-input"
              value={formData.securitySettings.otpValidity}
              onChange={(e) => handleChange("securitySettings", "otpValidity", parseInt(e.target.value))}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">عدد محاولات إدخال OTP</label>
            <input
              type="number"
              className="setting-input"
              value={formData.securitySettings.maxOtpAttempts}
              onChange={(e) => handleChange("securitySettings", "maxOtpAttempts", parseInt(e.target.value))}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">مدة حظر المحاولات الفاشلة (دقيقة)</label>
            <input
              type="number"
              className="setting-input"
              value={formData.securitySettings.blockDuration}
              onChange={(e) => handleChange("securitySettings", "blockDuration", parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* إعدادات الخصوصية */}
      <div className="settings-section">
        <h2 className="section-title">🔐 إعدادات الخصوصية</h2>
        <div className="settings-grid">
          <div className="setting-item full-width">
            <label className="setting-label">سياسة الخصوصية</label>
            <textarea
              className="setting-textarea"
              rows={6}
              value={formData.privacySettings.privacyPolicy}
              onChange={(e) => handleChange("privacySettings", "privacyPolicy", e.target.value)}
              placeholder="أدخل سياسة الخصوصية..."
            />
          </div>
          <div className="setting-item full-width">
            <label className="setting-label">شروط الاستخدام</label>
            <textarea
              className="setting-textarea"
              rows={6}
              value={formData.privacySettings.termsOfUse}
              onChange={(e) => handleChange("privacySettings", "termsOfUse", e.target.value)}
              placeholder="أدخل شروط الاستخدام..."
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">مدة الاحتفاظ بالبيانات (يوم)</label>
            <input
              type="number"
              className="setting-input"
              value={formData.privacySettings.dataRetentionDays}
              onChange={(e) => handleChange("privacySettings", "dataRetentionDays", parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-save" onClick={handleSave}>
          💾 حفظ التغييرات
        </button>
      </div>
    </div>
  );
}
