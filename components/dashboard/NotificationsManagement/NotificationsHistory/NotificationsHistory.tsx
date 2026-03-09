"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import CustomSelect from "@/components/shared/CustomSelect/CustomSelect";
import "./NotificationsHistory.css";

interface Notification {
  id: number;
  type: string;
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
  recipient_type: string;
  recipient_count: number;
  sent_at: string;
  status: string;
  sent_via: string[];
}

interface NotificationsHistoryProps {
  notifications: Notification[];
  onResend: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function NotificationsHistory({
  notifications,
  onResend,
  onDelete,
}: NotificationsHistoryProps) {
  const { showToast } = useToast();
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: number }>({
    show: false,
    id: 0,
  });

  const filteredNotifications = notifications.filter((notif) => {
    if (filters.search && !notif.title_ar.includes(filters.search) && !notif.title_en.includes(filters.search)) {
      return false;
    }
    if (filters.type !== "all" && notif.type !== filters.type) {
      return false;
    }
    if (filters.status !== "all" && notif.status !== filters.status) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      sent: { label: "مرسل", color: "#27ae60" },
      pending: { label: "معلق", color: "#f39c12" },
      failed: { label: "فشل", color: "#e74c3c" },
    };
    const config = statusConfig[status] || statusConfig.sent;
    return (
      <span className="status-badge" style={{ background: config.color }}>
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig: any = {
      info: { label: "معلومة", color: "#3498db" },
      warning: { label: "تحذير", color: "#f39c12" },
      urgent: { label: "عاجل", color: "#e74c3c" },
    };
    const config = typeConfig[type] || typeConfig.info;
    return (
      <span className="type-badge" style={{ borderColor: config.color, color: config.color }}>
        {config.label}
      </span>
    );
  };

  const handleDelete = (id: number) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = () => {
    onDelete(deleteConfirm.id);
    setDeleteConfirm({ show: false, id: 0 });
    showToast("تم حذف الإشعار بنجاح", "success");
  };

  return (
    <div className="notifications-history">
      <div className="history-filters">
        <input
          type="text"
          className="filter-input"
          placeholder="🔍 البحث بالعنوان..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <CustomSelect
          options={[
            { value: "all", label: "جميع الأنواع", icon: "📋" },
            { value: "info", label: "معلومة", icon: "ℹ️" },
            { value: "warning", label: "تحذير", icon: "⚠️" },
            { value: "urgent", label: "عاجل", icon: "🚨" },
          ]}
          value={filters.type}
          onChange={(value) => setFilters({ ...filters, type: value })}
        />
        <CustomSelect
          options={[
            { value: "all", label: "جميع الحالات", icon: "📊" },
            { value: "sent", label: "مرسل", icon: "✅" },
            { value: "pending", label: "معلق", icon: "⏳" },
            { value: "failed", label: "فشل", icon: "❌" },
          ]}
          value={filters.status}
          onChange={(value) => setFilters({ ...filters, status: value })}
        />
      </div>

      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>رقم الإشعار</th>
              <th>النوع</th>
              <th>العنوان</th>
              <th>المستلمون</th>
              <th>العدد</th>
              <th>تاريخ الإرسال</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotifications.map((notif) => (
              <tr key={notif.id}>
                <td>#{notif.id}</td>
                <td>{getTypeBadge(notif.type)}</td>
                <td>
                  <div className="notification-titles">
                    <div className="title-ar">{notif.title_ar}</div>
                    <div className="title-en">{notif.title_en}</div>
                  </div>
                </td>
                <td>
                  <span className="recipient-type">
                    {notif.recipient_type === "all" && "الجميع"}
                    {notif.recipient_type === "drivers" && "السائقين"}
                    {notif.recipient_type === "riders" && "الركاب"}
                    {notif.recipient_type === "specific" && "مستخدم محدد"}
                    {notif.recipient_type === "custom" && "مجموعة مخصصة"}
                  </span>
                </td>
                <td>{notif.recipient_count.toLocaleString()}</td>
                <td>{new Date(notif.sent_at).toLocaleString("ar-EG")}</td>
                <td>{getStatusBadge(notif.status)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn view-btn"
                      onClick={() => setSelectedNotification(notif)}
                      title="عرض"
                    >
                      👁️
                    </button>
                    <button
                      className="action-btn resend-btn"
                      onClick={() => onResend(notif.id)}
                      title="إعادة إرسال"
                    >
                      🔄
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(notif.id)}
                      title="حذف"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedNotification && (
        <div className="modal-overlay" onClick={() => setSelectedNotification(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>تفاصيل الإشعار</h3>
              <button className="modal-close" onClick={() => setSelectedNotification(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <strong>النوع:</strong> {getTypeBadge(selectedNotification.type)}
              </div>
              <div className="detail-row">
                <strong>العنوان (عربي):</strong> {selectedNotification.title_ar}
              </div>
              <div className="detail-row">
                <strong>العنوان (إنجليزي):</strong> {selectedNotification.title_en}
              </div>
              <div className="detail-row">
                <strong>النص (عربي):</strong> {selectedNotification.body_ar}
              </div>
              <div className="detail-row">
                <strong>النص (إنجليزي):</strong> {selectedNotification.body_en}
              </div>
              <div className="detail-row">
                <strong>قنوات الإرسال:</strong> {selectedNotification.sent_via.join(", ")}
              </div>
              <div className="detail-row">
                <strong>الحالة:</strong> {getStatusBadge(selectedNotification.status)}
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm.show && (
        <ConfirmDialog
          title="تأكيد الحذف"
          message="هل أنت متأكد من حذف هذا الإشعار؟"
          confirmText="حذف"
          cancelText="إلغاء"
          type="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm({ show: false, id: 0 })}
        />
      )}
    </div>
  );
}
