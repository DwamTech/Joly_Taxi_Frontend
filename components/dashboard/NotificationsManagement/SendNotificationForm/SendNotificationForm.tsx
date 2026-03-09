"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import CustomSelect from "@/components/shared/CustomSelect/CustomSelect";
import "./SendNotificationForm.css";

interface SendNotificationFormProps {
  onSubmit: (data: any) => void;
  templateData?: {
    title_ar: string;
    title_en: string;
    body_ar: string;
    body_en: string;
    type: string;
  } | null;
}

export default function SendNotificationForm({ onSubmit, templateData }: SendNotificationFormProps) {
  const { showToast } = useToast();
  const [recipientType, setRecipientType] = useState("all");
  const [priority, setPriority] = useState("info");
  const [sendType, setSendType] = useState("immediate");
  const [channels, setChannels] = useState<string[]>(["database", "push"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title_ar: "",
    title_en: "",
    body_ar: "",
    body_en: "",
    scheduled_date: "",
    scheduled_time: "",
  });

  // تحديث الحقول عند استخدام قالب
  useEffect(() => {
    if (templateData) {
      setFormData({
        title_ar: templateData.title_ar,
        title_en: templateData.title_en,
        body_ar: templateData.body_ar,
        body_en: templateData.body_en,
        scheduled_date: "",
        scheduled_time: "",
      });
      setPriority(templateData.type);
      showToast("تم تحميل بيانات القالب بنجاح", "success");
    }
  }, [templateData, showToast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChannelToggle = (channel: string) => {
    setChannels(prev =>
      prev.includes(channel)
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title_ar || !formData.title_en || !formData.body_ar || !formData.body_en) {
      showToast("يرجى ملء جميع الحقول المطلوبة", "error");
      return;
    }

    if (channels.length === 0) {
      showToast("يرجى اختيار قناة إرسال واحدة على الأقل", "error");
      return;
    }

    if (sendType === "scheduled" && (!formData.scheduled_date || !formData.scheduled_time)) {
      showToast("يرجى تحديد تاريخ ووقت الإرسال", "error");
      return;
    }

    const notificationData = {
      ...formData,
      recipient_type: recipientType,
      priority,
      send_type: sendType,
      channels,
      selected_users: selectedUsers,
    };

    onSubmit(notificationData);
  };

  return (
    <form className="send-notification-form" onSubmit={handleSubmit}>
      {/* نوع المستلمين */}
      <div className="form-section">
        <h3 className="section-title">📮 نوع المستلمين</h3>
        <div className="form-radio-group">
          {[
            { value: "all", label: "جميع المستخدمين" },
            { value: "drivers", label: "السائقين فقط" },
            { value: "riders", label: "الركاب فقط" },
            { value: "specific", label: "مستخدم محدد" },
            { value: "custom", label: "مجموعة مخصصة" },
          ].map((option) => (
            <div key={option.value} className="radio-option">
              <label className="radio-label">
                <input
                  type="radio"
                  name="recipient_type"
                  value={option.value}
                  checked={recipientType === option.value}
                  onChange={(e) => setRecipientType(e.target.value)}
                />
                <span>{option.label}</span>
              </label>
            </div>
          ))}
        </div>

        {(recipientType === "specific" || recipientType === "custom") && (
          <div className="user-search">
            <input
              type="text"
              className="form-input"
              placeholder="ابحث بالاسم أو رقم الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {selectedUsers.length > 0 && (
              <div className="selected-users">
                {selectedUsers.map((user) => (
                  <div key={user.id} className="user-tag">
                    <span>{user.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedUsers(prev => prev.filter(u => u.id !== user.id))}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* محتوى الإشعار */}
      <div className="form-section">
        <h3 className="section-title">✍️ محتوى الإشعار</h3>
        
        <div className="form-group">
          <label className="form-label required">العنوان بالعربية</label>
          <input
            type="text"
            name="title_ar"
            className="form-input"
            value={formData.title_ar}
            onChange={handleInputChange}
            placeholder="أدخل العنوان بالعربية"
          />
        </div>

        <div className="form-group">
          <label className="form-label required">العنوان بالإنجليزية</label>
          <input
            type="text"
            name="title_en"
            className="form-input"
            value={formData.title_en}
            onChange={handleInputChange}
            placeholder="Enter title in English"
          />
        </div>

        <div className="form-group">
          <label className="form-label required">النص بالعربية</label>
          <textarea
            name="body_ar"
            className="form-textarea"
            value={formData.body_ar}
            onChange={handleInputChange}
            placeholder="أدخل نص الإشعار بالعربية"
          />
        </div>

        <div className="form-group">
          <label className="form-label required">النص بالإنجليزية</label>
          <textarea
            name="body_en"
            className="form-textarea"
            value={formData.body_en}
            onChange={handleInputChange}
            placeholder="Enter notification text in English"
          />
        </div>

        <div className="form-group">
          <label className="form-label">نوع الإشعار</label>
          <CustomSelect
            options={[
              { value: "info", label: "معلومة", icon: "ℹ️" },
              { value: "warning", label: "تحذير", icon: "⚠️" },
              { value: "urgent", label: "عاجل", icon: "🚨" },
            ]}
            value={priority}
            onChange={(value) => setPriority(value)}
          />
        </div>
      </div>

      {/* قنوات الإرسال */}
    { /* <div className="form-section">
        <h3 className="section-title">📡 قنوات الإرسال</h3>
        <div className="channels-group">
          {[
            { value: "database", label: "قاعدة البيانات", icon: "💾" },
            { value: "push", label: "إشعار Push", icon: "📱" },
            { value: "sms", label: "رسالة SMS", icon: "💬" },
            { value: "email", label: "بريد إلكتروني", icon: "📧" },
          ].map((channel) => (
            <label key={channel.value} className="checkbox-label">
              <input
                type="checkbox"
                checked={channels.includes(channel.value)}
                onChange={() => handleChannelToggle(channel.value)}
              />
              <span>
                {channel.icon} {channel.label}
              </span>
            </label>
          ))}
        </div>
      </div>*/}

      {/* خيارات الإرسال */}
      <div className="form-section">
        <h3 className="section-title">⏰ خيارات الإرسال</h3>
        <div className="schedule-options">
          <button
            type="button"
            className={`schedule-btn ${sendType === "immediate" ? "active" : ""}`}
            onClick={() => setSendType("immediate")}
          >
            🚀 إرسال فوري
          </button>
          <button
            type="button"
            className={`schedule-btn ${sendType === "scheduled" ? "active" : ""}`}
            onClick={() => setSendType("scheduled")}
          >
            📅 جدولة الإرسال
          </button>
        </div>

        {sendType === "scheduled" && (
          <div className="datetime-input">
            <div className="form-group">
              <label className="form-label required">التاريخ</label>
              <input
                type="date"
                name="scheduled_date"
                className="form-input"
                value={formData.scheduled_date}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label required">الوقت</label>
              <input
                type="time"
                name="scheduled_time"
                className="form-input"
                value={formData.scheduled_time}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* أزرار الإجراءات */}
      <div className="form-actions">
        <button type="submit" className="btn-submit">
          {sendType === "immediate" ? "إرسال الآن" : "جدولة الإرسال"}
        </button>
        <button type="button" className="btn-cancel" onClick={() => window.location.reload()}>
          إلغاء
        </button>
      </div>
    </form>
  );
}
