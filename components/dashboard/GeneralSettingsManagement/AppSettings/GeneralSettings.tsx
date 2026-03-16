"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import "./GeneralSettings.css";

interface GeneralSettingsProps {
  data: any;
  onSave: (data: any) => void;
}

export default function GeneralSettings({ data, onSave }: GeneralSettingsProps) {
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

  const handleNestedChange = (section: string, subsection: string, field: string, value: any) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [subsection]: {
          ...formData[section][subsection],
          [field]: value,
        },
      },
    });
  };

  const handleSave = () => {
    onSave(formData);
    showToast("تم حفظ الإعدادات بنجاح", "success");
  };

  return (
    <div className="general-settings">
      {/* معلومات التطبيق */}
      <div className="settings-section">
        <h2 className="section-title">📱 معلومات التطبيق</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <label className="setting-label">البريد الإلكتروني</label>
            <input
              type="email"
              className="setting-input"
              value={formData.appInfo.email}
              onChange={(e) => handleChange("appInfo", "email", e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">رقم الهاتف</label>
            <input
              type="tel"
              className="setting-input"
              value={formData.appInfo.phone}
              onChange={(e) => handleChange("appInfo", "phone", e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">رقم الدعم</label>
            <input
              type="text"
              className="setting-input"
              value={formData.appInfo.supportNumber}
              onChange={(e) => handleChange("appInfo", "supportNumber", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* إعدادات الرحلات */}
      <div className="settings-section">
        <h2 className="section-title">🚖 إعدادات الرحلات</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <label className="setting-label">الحد الأقصى لوقت انتظار الرحلة (دقيقة)</label>
            <input
              type="number"
              className="setting-input"
              value={formData.tripSettings.maxWaitTime}
              onChange={(e) => handleChange("tripSettings", "maxWaitTime", parseInt(e.target.value))}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">مدة صلاحية العرض (دقيقة)</label>
            <input
              type="number"
              className="setting-input"
              value={formData.tripSettings.offerValidity}
              onChange={(e) => handleChange("tripSettings", "offerValidity", parseInt(e.target.value))}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">نسبة العمولة (%)</label>
            <input
              type="number"
              className="setting-input"
              value={formData.tripSettings.commissionRate}
              onChange={(e) => handleChange("tripSettings", "commissionRate", parseInt(e.target.value))}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">نطاق البحث الافتراضي (كم)</label>
            <input
              type="number"
              className="setting-input"
              value={formData.tripSettings.defaultSearchRadius}
              onChange={(e) => handleChange("tripSettings", "defaultSearchRadius", parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* إعدادات التقييمات */}
      <div className="settings-section">
        <h2 className="section-title">⭐ إعدادات التقييمات</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <label className="setting-label">الحد الأدنى للتقييم المقبول</label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              className="setting-input"
              value={formData.ratingSettings.minAcceptableRating}
              onChange={(e) => handleChange("ratingSettings", "minAcceptableRating", parseFloat(e.target.value))}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">عدد التقييمات السلبية قبل التحذير</label>
            <input
              type="number"
              className="setting-input"
              value={formData.ratingSettings.negativeRatingsBeforeWarning}
              onChange={(e) => handleChange("ratingSettings", "negativeRatingsBeforeWarning", parseInt(e.target.value))}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label toggle-label">
              <span>تفعيل التقييمات الإجبارية</span>
              <input
                type="checkbox"
                className="setting-toggle"
                checked={formData.ratingSettings.mandatoryRatings}
                onChange={(e) => handleChange("ratingSettings", "mandatoryRatings", e.target.checked)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* إعدادات الإلغاء */}
      <div className="settings-section">
        <h2 className="section-title">❌ إعدادات الإلغاء</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <label className="setting-label">الحد الأقصى للإلغاءات قبل التحذير</label>
            <input
              type="number"
              className="setting-input"
              min="1"
              max="10"
              value={formData.cancellationSettings.maxCancellationsBeforeWarning}
              onChange={(e) => handleChange("cancellationSettings", "maxCancellationsBeforeWarning", parseInt(e.target.value))}
            />
            <p className="setting-hint">
              عدد المرات المسموح بها لإلغاء الرحلات قبل إرسال تحذير للمستخدم
            </p>
          </div>
          <div className="setting-item">
            <label className="setting-label">عدد مرات إلغاء الرحلة قبل الحظر</label>
            <input
              type="number"
              className="setting-input"
              min="1"
              max="20"
              value={formData.cancellationSettings.maxCancellationsBeforeBan || 5}
              onChange={(e) => handleChange("cancellationSettings", "maxCancellationsBeforeBan", parseInt(e.target.value))}
              placeholder="5"
            />
            <p className="setting-hint">
              عدد المرات المسموح بها لإلغاء الرحلات قبل حظر المستخدم مؤقتاً
            </p>
          </div>
        </div>
      </div>

      {/* إعدادات الاشتراكات */}
      <div className="settings-section">
        <h2 className="section-title">💳 إعدادات الاشتراكات</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <label className="setting-label">سعر الاشتراك الشهري (ريال)</label>
            <input
              type="number"
              className="setting-input"
              value={formData.subscriptionSettings.prices.monthly}
              onChange={(e) => handleNestedChange("subscriptionSettings", "prices", "monthly", parseInt(e.target.value))}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">سعر الاشتراك الربع سنوي (ريال)</label>
            <input
              type="number"
              className="setting-input"
              value={formData.subscriptionSettings.prices.quarterly}
              onChange={(e) => handleNestedChange("subscriptionSettings", "prices", "quarterly", parseInt(e.target.value))}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">سعر الاشتراك السنوي (ريال)</label>
            <input
              type="number"
              className="setting-input"
              value={formData.subscriptionSettings.prices.yearly}
              onChange={(e) => handleNestedChange("subscriptionSettings", "prices", "yearly", parseInt(e.target.value))}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">مدة الاشتراك (يوم)</label>
            <input
              type="number"
              className="setting-input"
              value={formData.subscriptionSettings.duration}
              onChange={(e) => handleChange("subscriptionSettings", "duration", parseInt(e.target.value))}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label">إرسال تذكير قبل انتهاء الاشتراك (أيام)</label>
            <input
              type="number"
              className="setting-input"
              value={formData.subscriptionSettings.reminderDaysBefore}
              onChange={(e) => handleChange("subscriptionSettings", "reminderDaysBefore", parseInt(e.target.value))}
            />
          </div>
          <div className="setting-item">
            <label className="setting-label toggle-label">
              <span>تفعيل التجديد التلقائي</span>
              <input
                type="checkbox"
                className="setting-toggle"
                checked={formData.subscriptionSettings.autoRenewal}
                onChange={(e) => handleChange("subscriptionSettings", "autoRenewal", e.target.checked)}
              />
            </label>
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
