"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import { AdminSettingsData, UpdateAdminSettingsPayload } from "@/models/Settings";
import "./GeneralSettings.css";

interface GeneralSettingsProps {
  data: AdminSettingsData;
  onSave: (data: UpdateAdminSettingsPayload) => Promise<void>;
  isSaving?: boolean;
}

export default function GeneralSettings({ data, onSave, isSaving = false }: GeneralSettingsProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState(data);
  const [bannerArFile, setBannerArFile] = useState<File | null>(null);
  const [bannerEnFile, setBannerEnFile] = useState<File | null>(null);

  useEffect(() => {
    setFormData(data);
    setBannerArFile(null);
    setBannerEnFile(null);
  }, [data]);

  const handleChange = (
    field: keyof AdminSettingsData,
    value: string | number | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toEnglishDigits = (value: string) =>
    value.replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit).toString());

  const normalizeIntegerString = (value: string | number) =>
    toEnglishDigits(String(value ?? "")).trim();

  const handleSave = async () => {
    const supportEmail = formData.support_email.trim();
    const integerPattern = /^\d+$/;
    const maxCancellations = normalizeIntegerString(formData.max_cancellations_before_alert);
    const dataRetentionDays = normalizeIntegerString(formData.data_retention_days);
    const renewalDays = normalizeIntegerString(formData.subscription_renewal_days_before_expiry);
    const otpMaxAttempts = normalizeIntegerString(formData.otp_max_attempts);

    if (!supportEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportEmail)) {
      showToast("برجاء إدخال بريد دعم صحيح", "error");
      return;
    }

    if (!integerPattern.test(maxCancellations) || Number(maxCancellations) < 1) {
      showToast("الحد الأقصى للإلغاءات يجب أن يكون رقمًا صحيحًا أكبر من صفر", "error");
      return;
    }

    if (!integerPattern.test(dataRetentionDays) || Number(dataRetentionDays) < 1) {
      showToast("عدد أيام حفظ البيانات يجب أن يكون رقمًا صحيحًا أكبر من صفر", "error");
      return;
    }

    if (!integerPattern.test(renewalDays) || Number(renewalDays) < 1) {
      showToast("أيام التجديد قبل الانتهاء يجب أن تكون رقمًا صحيحًا أكبر من صفر", "error");
      return;
    }

    if (!integerPattern.test(otpMaxAttempts) || Number(otpMaxAttempts) < 1) {
      showToast("الحد الأقصى لمحاولات OTP يجب أن يكون رقمًا صحيحًا أكبر من صفر", "error");
      return;
    }

    await onSave({
      ...formData,
      otp_max_attempts: otpMaxAttempts,
      max_cancellations_before_alert: Number(maxCancellations),
      data_retention_days: dataRetentionDays,
      subscription_renewal_days_before_expiry: renewalDays,
      support_email: supportEmail,
      banner_ar: bannerArFile,
      banner_en: bannerEnFile,
      _method: "PUT",
    });
  };

  return (
    <div className="general-settings">
      <div className="settings-section">
        <h2 className="section-title">📱 معلومات التطبيق والدعم</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <label className="setting-label">اسم التطبيق</label>
            <input
              type="text"
              className="setting-input"
              value={formData.app_name}
              onChange={(e) => handleChange("app_name", e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">إصدار التطبيق</label>
            <input
              type="text"
              className="setting-input ltr-input"
              value={formData.app_version}
              onChange={(e) => handleChange("app_version", e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">البريد الإلكتروني للدعم</label>
            <input
              type="email"
              className="setting-input ltr-input"
              value={formData.support_email}
              onChange={(e) => handleChange("support_email", e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">رقم واتساب</label>
            <input
              type="tel"
              className="setting-input ltr-input"
              value={formData.whatsapp_number}
              onChange={(e) => handleChange("whatsapp_number", e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">رقم الطوارئ</label>
            <input
              type="text"
              className="setting-input ltr-input"
              value={formData.emergency_number}
              onChange={(e) => handleChange("emergency_number", e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">رقم الاستفسارات المالية</label>
            <input
              type="text"
              className="setting-input ltr-input"
              value={formData.payment_inquiries_number}
              onChange={(e) => handleChange("payment_inquiries_number", e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">رقم InstaPay</label>
            <input
              type="text"
              className="setting-input ltr-input"
              value={formData.instapay_number}
              onChange={(e) => handleChange("instapay_number", e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">رقم Vodafone Cash</label>
            <input
              type="text"
              className="setting-input ltr-input"
              value={formData.vodafone_cash_number}
              onChange={(e) => handleChange("vodafone_cash_number", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="section-title">🔐 إعدادات الأمان والسياسات</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <label className="setting-label">الحد الأقصى لمحاولات OTP</label>
            <input
              type="number"
              className="setting-input ltr-input"
              min="1"
              value={formData.otp_max_attempts}
              onChange={(e) => handleChange("otp_max_attempts", e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">الحد الأقصى للإلغاءات قبل التحذير</label>
            <input
              type="number"
              className="setting-input ltr-input"
              min="1"
              value={formData.max_cancellations_before_alert}
              onChange={(e) =>
                handleChange("max_cancellations_before_alert", Number(e.target.value) || 0)
              }
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">عدد أيام حفظ البيانات</label>
            <input
              type="number"
              className="setting-input ltr-input"
              min="1"
              value={formData.data_retention_days}
              onChange={(e) => handleChange("data_retention_days", e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">التجديد قبل الانتهاء (أيام)</label>
            <input
              type="number"
              className="setting-input ltr-input"
              min="1"
              value={formData.subscription_renewal_days_before_expiry}
              onChange={(e) =>
                handleChange("subscription_renewal_days_before_expiry", e.target.value)
              }
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">مقاس صور البانر</label>
            <input
              type="text"
              className="setting-input ltr-input"
              value={formData.banner_image_size}
              onChange={(e) => handleChange("banner_image_size", e.target.value)}
            />
          </div>
          <div className="setting-item full-width">
            <label className="setting-label">سياسة الخصوصية (عربي)</label>
            <textarea
              className="setting-textarea"
              value={formData.privacy_policy_ar}
              onChange={(e) => handleChange("privacy_policy_ar", e.target.value)}
            />
          </div>
          <div className="setting-item full-width">
            <label className="setting-label">سياسة الخصوصية (English)</label>
            <textarea
              className="setting-textarea"
              value={formData.privacy_policy_en}
              onChange={(e) => handleChange("privacy_policy_en", e.target.value)}
            />
          </div>
          <div className="setting-item full-width">
            <label className="setting-label">شروط الاستخدام (عربي)</label>
            <textarea
              className="setting-textarea"
              value={formData.terms_of_use_ar}
              onChange={(e) => handleChange("terms_of_use_ar", e.target.value)}
            />
          </div>
          <div className="setting-item full-width">
            <label className="setting-label">شروط الاستخدام (English)</label>
            <textarea
              className="setting-textarea"
              value={formData.terms_of_use_en}
              onChange={(e) => handleChange("terms_of_use_en", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="section-title">🖼️ إعدادات البانر</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <label className="setting-label">بانر عربي (ملف صورة)</label>
            <input
              type="file"
              accept="image/*"
              className="setting-input"
              onChange={(e) => setBannerArFile(e.target.files?.[0] || null)}
            />
            <p className="setting-hint">
              {bannerArFile ? `تم اختيار: ${bannerArFile.name}` : "يمكنك رفع صورة جديدة أو تركها كما هي"}
            </p>
            {formData.banner_ar && <p className="setting-hint">البانر الحالي موجود على السيرفر</p>}
          </div>
          <div className="setting-item">
            <label className="setting-label">بانر English (ملف صورة)</label>
            <input
              type="file"
              accept="image/*"
              className="setting-input"
              onChange={(e) => setBannerEnFile(e.target.files?.[0] || null)}
            />
            <p className="setting-hint">
              {bannerEnFile ? `تم اختيار: ${bannerEnFile.name}` : "يمكنك رفع صورة جديدة أو تركها كما هي"}
            </p>
            {formData.banner_en && <p className="setting-hint">البانر الحالي موجود على السيرفر</p>}
          </div>
        </div>
      </div>

      {/* الحقول التالية من التصميم السابق وتم إيقافها حالياً لأنها غير موجودة في استجابة api/admin/settings:
          إعدادات الرحلات، إعدادات التقييمات التفصيلية، أسعار وخطط الاشتراكات */}

      <div className="settings-actions">
        <button className="btn-save" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "جاري الحفظ..." : "💾 حفظ التغييرات"}
        </button>
      </div>
    </div>
  );
}
