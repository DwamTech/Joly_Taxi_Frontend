"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import "./SystemSettings.css";

interface SystemSettingsProps {
  data: any;
  onSave: (data: any) => void;
}

export default function SystemSettings({ data, onSave }: SystemSettingsProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState(data);
  const [uploadingBackup, setUploadingBackup] = useState(false);

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
    showToast("تم حفظ إعدادات النظام بنجاح", "success");
  };

  const handleCreateBackup = () => {
    showToast("جاري إنشاء نسخة احتياطية...", "info");
    setTimeout(() => {
      showToast("تم إنشاء النسخة الاحتياطية بنجاح", "success");
    }, 2000);
  };

  const handleRestoreBackup = () => {
    if (confirm("هل أنت متأكد من استرجاع النسخة الاحتياطية؟ سيتم استبدال البيانات الحالية.")) {
      showToast("جاري استرجاع النسخة الاحتياطية...", "info");
      setTimeout(() => {
        showToast("تم استرجاع النسخة الاحتياطية بنجاح", "success");
      }, 2000);
    }
  };

  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingBackup(true);
      showToast("جاري رفع النسخة الاحتياطية...", "info");
      setTimeout(() => {
        setUploadingBackup(false);
        showToast("تم رفع النسخة الاحتياطية بنجاح", "success");
      }, 2000);
    }
  };

  return (
    <div className="system-settings">
      {/* إعدادات النظام */}
      <div className="settings-section">
        <h2 className="section-title">🛠️ إعدادات النظام</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <label className="setting-label toggle-label">
              <span>تفعيل وضع الصيانة</span>
              <input
                type="checkbox"
                className="setting-toggle"
                checked={formData.systemSettings.maintenanceMode}
                onChange={(e) => handleChange("systemSettings", "maintenanceMode", e.target.checked)}
              />
            </label>
            <p className="setting-hint">
              عند التفعيل، سيظهر للمستخدمين رسالة "جاري العمل على تحديث التطبيق"
            </p>
          </div>
          <div className="setting-item full-width">
            <label className="setting-label">رسالة الصيانة</label>
            <textarea
              className="setting-textarea"
              rows={4}
              value={formData.systemSettings.maintenanceMessage}
              onChange={(e) => handleChange("systemSettings", "maintenanceMessage", e.target.value)}
              placeholder="أدخل رسالة الصيانة..."
            />
          </div>
        </div>
      </div>

      {/* النسخ الاحتياطي */}
      <div className="settings-section">
        <h2 className="section-title">💾 النسخ الاحتياطي</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <label className="setting-label toggle-label">
              <span>تفعيل النسخ الاحتياطي التلقائي</span>
              <input
                type="checkbox"
                className="setting-toggle"
                checked={formData.backupSettings.autoBackup}
                onChange={(e) => handleChange("backupSettings", "autoBackup", e.target.checked)}
              />
            </label>
          </div>
          <div className="setting-item">
            <label className="setting-label">تكرار النسخ الاحتياطي</label>
            <select
              className="setting-select"
              value={formData.backupSettings.backupFrequency}
              onChange={(e) => handleChange("backupSettings", "backupFrequency", e.target.value)}
            >
             
              <option value="weekly">أسبوعي</option>
              <option value="monthly">شهري</option>
            </select>
          </div>
          <div className="setting-item">
            <div className="backup-info">
              <div className="info-row">
                <span className="info-label">آخر نسخة احتياطية:</span>
                <span className="info-value">
                  {new Date(formData.backupSettings.lastBackup).toLocaleString("ar-EG")}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">حجم النسخة:</span>
                <span className="info-value">{formData.backupSettings.backupSize}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="backup-actions">
          <button className="btn-backup" onClick={handleCreateBackup}>
            📦 إنشاء نسخة احتياطية جديدة
          </button>
          <button className="btn-restore" onClick={handleRestoreBackup}>
            ↩️ استرجاع نسخة احتياطية
          </button>
          <label className="btn-upload">
            📤 رفع نسخة احتياطية
            <input
              type="file"
              accept=".zip,.sql"
              onChange={handleUploadBackup}
              style={{ display: "none" }}
              disabled={uploadingBackup}
            />
          </label>
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
