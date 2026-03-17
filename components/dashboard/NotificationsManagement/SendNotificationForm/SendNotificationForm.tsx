"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import CustomSelect from "@/components/shared/CustomSelect/CustomSelect";
import {
  CreateAdminNotificationRequest,
  NotificationPriority,
  RecipientType,
} from "@/models/Notification";
import { getUsers } from "@/services/usersService";
import "./SendNotificationForm.css";

interface SendNotificationFormProps {
  onSubmit: (data: CreateAdminNotificationRequest) => void | Promise<void>;
  templateData?: {
    title_ar: string;
    title_en: string;
    body_ar: string;
    body_en: string;
    type: NotificationPriority;
  } | null;
}

interface SearchedUser {
  id: number;
  name: string;
  phone: string;
  type: string;
  status?: string;
}

export default function SendNotificationForm({ onSubmit, templateData }: SendNotificationFormProps) {
  const { showToast } = useToast();
  const [recipientType, setRecipientType] = useState<RecipientType>("all");
  const [priority, setPriority] = useState<NotificationPriority>("info");
  const [sendType, setSendType] = useState("immediate");
  const [selectedUsers, setSelectedUsers] = useState<SearchedUser[]>([]);
  const [isUserPickerOpen, setIsUserPickerOpen] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersList, setUsersList] = useState<SearchedUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersSearchTerm, setUsersSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (recipientType !== "specific" && recipientType !== "custom") {
      setSelectedUsers([]);
      setIsUserPickerOpen(false);
      setUsersSearchTerm("");
      setUsersList([]);
      setUsersPage(1);
    }
  }, [recipientType]);

  const fetchUsersPage = async (page: number) => {
    setIsLoadingUsers(true);
    try {
      const response = await getUsers(page);
      const normalizedUsers: SearchedUser[] = response.data.map((user) => ({
        id: user.id,
        name: user.name,
        phone: user.phone,
        type: user.type,
        status: user.status,
      }));
      setUsersList(normalizedUsers);
      setUsersPage(response.pagination.current_page || page);
      setUsersTotalPages(response.pagination.last_page || 1);
    } catch (error: any) {
      showToast(error?.message || "فشل في تحميل المستخدمين", "error");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const openUserPicker = async () => {
    setIsUserPickerOpen(true);
    setUsersSearchTerm("");
    await fetchUsersPage(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddUser = (user: SearchedUser) => {
    setSelectedUsers((prev) => {
      if (recipientType === "specific") {
        return [user];
      }
      if (prev.some((item) => item.id === user.id)) {
        return prev;
      }
      return [...prev, user];
    });
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const isUserSelected = (userId: number) => selectedUsers.some((selectedUser) => selectedUser.id === userId);

  const filteredUsers = usersList.filter((user) => {
    if (!usersSearchTerm.trim()) return true;
    const query = usersSearchTerm.toLowerCase();
    return user.name.toLowerCase().includes(query) || user.phone.includes(usersSearchTerm);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title_ar || !formData.body_ar) {
      showToast("يرجى ملء جميع الحقول المطلوبة", "error");
      return;
    }

    if (sendType === "scheduled" && (!formData.scheduled_date || !formData.scheduled_time)) {
      showToast("يرجى تحديد تاريخ ووقت الإرسال", "error");
      return;
    }

    if ((recipientType === "specific" || recipientType === "custom") && selectedUsers.length === 0) {
      showToast("يرجى اختيار مستخدم واحد على الأقل", "error");
      return;
    }

    const notificationData: CreateAdminNotificationRequest = {
      title_ar: formData.title_ar.trim(),
      title_en: (formData.title_en || formData.title_ar).trim(),
      body_ar: formData.body_ar.trim(),
      body_en: (formData.body_en || formData.body_ar).trim(),
      notification_type: priority,
      recipient_type: recipientType,
      send_immediately: sendType === "immediate",
      recipient_ids:
        recipientType === "specific" || recipientType === "custom"
          ? selectedUsers.map((user) => user.id)
          : undefined,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(notificationData);
    } finally {
      setIsSubmitting(false);
    }
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
                  onChange={(e) => setRecipientType(e.target.value as RecipientType)}
                />
                <span>{option.label}</span>
              </label>
            </div>
          ))}
        </div>

        {(recipientType === "specific" || recipientType === "custom") && (
          <div className="user-search">
            <button type="button" className="btn-open-user-picker" onClick={openUserPicker}>
              {recipientType === "specific" ? "اختيار مستخدم" : "اختيار مجموعة مستخدمين"}
            </button>
            {selectedUsers.length > 0 && (
              <div className="selected-users">
                {selectedUsers.map((user) => (
                  <div key={user.id} className="user-tag">
                    <span>{user.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(user.id)}
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
            onChange={(value) => setPriority(value as NotificationPriority)}
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
       {/* <h3 className="section-title">⏰ خيارات الإرسال</h3>
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
        </div>*/}

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
        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          {sendType === "immediate" ? "إرسال الآن" : "جدولة الإرسال"}
        </button>
        <button type="button" className="btn-cancel" onClick={() => window.location.reload()} disabled={isSubmitting}>
          إلغاء
        </button>
      </div>

      {isUserPickerOpen && (
        <div className="user-picker-overlay" onClick={() => setIsUserPickerOpen(false)}>
          <div className="user-picker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="user-picker-header">
              <h3>{recipientType === "specific" ? "اختيار مستخدم محدد" : "اختيار مجموعة مخصصة"}</h3>
              <button type="button" className="user-picker-close" onClick={() => setIsUserPickerOpen(false)}>
                ×
              </button>
            </div>

            <div className="user-picker-search">
              <input
                type="text"
                className="form-input"
                placeholder="ابحث بالاسم أو رقم الهاتف..."
                value={usersSearchTerm}
                onChange={(e) => setUsersSearchTerm(e.target.value)}
              />
            </div>

            <div className="user-picker-list">
              {isLoadingUsers ? (
                <div className="user-picker-empty">جاري تحميل المستخدمين...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="user-picker-empty">لا يوجد مستخدمون في هذه الصفحة</div>
              ) : (
                filteredUsers.map((user) => (
                  <label key={user.id} className="user-picker-item">
                    <input
                      type="checkbox"
                      checked={isUserSelected(user.id)}
                      onChange={() =>
                        isUserSelected(user.id) ? handleRemoveUser(user.id) : handleAddUser(user)
                      }
                    />
                    <div className="user-picker-item-content">
                      <span className="user-picker-name">{user.name}</span>
                      <span className="user-picker-phone">{user.phone}</span>
                    </div>
                  </label>
                ))
              )}
            </div>

            <div className="user-picker-pagination">
              <button
                type="button"
                className="pagination-btn"
                disabled={usersPage <= 1 || isLoadingUsers}
                onClick={() => fetchUsersPage(usersPage - 1)}
              >
                السابق
              </button>
              <span>
                صفحة {usersPage} من {usersTotalPages}
              </span>
              <button
                type="button"
                className="pagination-btn"
                disabled={usersPage >= usersTotalPages || isLoadingUsers}
                onClick={() => fetchUsersPage(usersPage + 1)}
              >
                التالي
              </button>
            </div>

            <div className="user-picker-actions">
              <button type="button" className="btn-cancel" onClick={() => setIsUserPickerOpen(false)}>
                تم
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
