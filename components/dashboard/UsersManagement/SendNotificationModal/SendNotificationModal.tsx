"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import "./SendNotificationModal.css";

interface SendNotificationModalProps {
  userId: number;
  userName: string;
  onClose: () => void;
}

export default function SendNotificationModal({
  userId,
  userName,
  onClose,
}: SendNotificationModalProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title_ar: "",
    title_en: "",
    body_ar: "",
    body_en: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title_ar.trim() || !formData.body_ar.trim()) {
      showToast("يرجى ملء العنوان والمحتوى بالعربية على الأقل", "error");
      return;
    }

    setIsLoading(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      // Use AuthService to get token
      const { AuthService } = await import("@/services/authService");
      const token = AuthService.getToken();

      if (!token) {
        throw new Error("لم يتم العثور على رمز المصادقة");
      }

      const requestBody = {
        user_id: userId,
        title_ar: formData.title_ar,
        title_en: formData.title_en || formData.title_ar,
        body_ar: formData.body_ar,
        body_en: formData.body_en || formData.body_ar,
      };

      console.log('Sending notification request:', requestBody);
      console.log('API URL:', `${API_BASE_URL}/api/admin/notifications/send`);

      const response = await fetch(`${API_BASE_URL}/api/admin/notifications/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        throw new Error(errorData.message || `فشل في إرسال الإشعار: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success response:', result);
      showToast(result.message || "تم إرسال الإشعار بنجاح", "success");
      onClose();
    } catch (error: any) {
      console.error("Error sending notification:", error);
      showToast(error.message || "فشل في إرسال الإشعار", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="send-notification-overlay" onClick={onClose}>
      <div
        className="send-notification-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              <span>🔔</span>
              إرسال إشعار
            </h2>
            <p className="modal-subtitle">إرسال إشعار إلى {userName}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="notification-form">
          <div className="form-section">
            <h3 className="section-title">النسخة العربية</h3>
            <div className="form-group">
              <label htmlFor="title_ar" className="form-label">
                العنوان <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title_ar"
                name="title_ar"
                value={formData.title_ar}
                onChange={handleChange}
                className="form-input"
                placeholder="أدخل عنوان الإشعار بالعربية"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="body_ar" className="form-label">
                المحتوى <span className="required">*</span>
              </label>
              <textarea
                id="body_ar"
                name="body_ar"
                value={formData.body_ar}
                onChange={handleChange}
                className="form-textarea"
                placeholder="أدخل محتوى الإشعار بالعربية"
                rows={4}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">English Version (Optional)</h3>
            <div className="form-group">
              <label htmlFor="title_en" className="form-label">
                Title
              </label>
              <input
                type="text"
                id="title_en"
                name="title_en"
                value={formData.title_en}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter notification title in English"
              />
            </div>

            <div className="form-group">
              <label htmlFor="body_en" className="form-label">
                Content
              </label>
              <textarea
                id="body_en"
                name="body_en"
                value={formData.body_en}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Enter notification content in English"
                rows={4}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-small"></span>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <span>📤</span>
                  إرسال الإشعار
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
