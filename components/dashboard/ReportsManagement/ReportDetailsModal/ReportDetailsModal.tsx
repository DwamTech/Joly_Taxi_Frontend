"use client";

import { useState } from "react";
import { TripReport } from "@/models/TripReport";
import { useToast } from "@/components/Toast/ToastContainer";
import "./ReportDetailsModal.css";

interface ReportDetailsModalProps {
  report: TripReport;
  onClose: () => void;
  onResolve: (reportId: number) => void;
}

export default function ReportDetailsModal({
  report,
  onClose,
  onResolve,
}: ReportDetailsModalProps) {
  const { showToast } = useToast();
  const [adminNotes, setAdminNotes] = useState(report.admin_notes || "");
  const [actionTaken, setActionTaken] = useState(report.action_taken || "");
  const [showUserDetails, setShowUserDetails] = useState<"reporter" | "reported" | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSaveNotes = () => {
    // TODO: Call API to save notes
    showToast("تم حفظ الملاحظات بنجاح", "success");
  };

  const handleResolve = () => {
    onResolve(report.id);
    onClose();
  };

  const handleBlockUser = () => {
    // TODO: Call API to block user
    showToast("تم حظر المستخدم بنجاح", "warning");
  };

  const handleSendWarning = () => {
    // TODO: Call API to send warning
    showToast("تم إرسال تحذير للمستخدم", "success");
  };

  const handleSendNotification = () => {
    // TODO: Call API to send notification
    showToast("تم إرسال إشعار للطرفين", "success");
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "#c62828",
      medium: "#f57c00",
      low: "#1976d2",
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content report-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>تفاصيل البلاغ #{report.id}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="report-info-grid">
            <div className="info-card">
              <div className="info-label">الحالة</div>
              <div className="info-value">
                <span className={`status-badge status-${report.status}`}>
                  {report.status === "pending" ? "معلق" : "محلول"}
                </span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-label">الأولوية</div>
              <div className="info-value">
                <span
                  className="priority-badge"
                  style={{ background: getPriorityColor(report.priority) }}
                >
                  {report.priority === "high"
                    ? "عالية"
                    : report.priority === "medium"
                    ? "متوسطة"
                    : "منخفضة"}
                </span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-label">تاريخ البلاغ</div>
              <div className="info-value">{formatDate(report.created_at)}</div>
            </div>

            {report.resolved_at && (
              <div className="info-card">
                <div className="info-label">تاريخ الحل</div>
                <div className="info-value">{formatDate(report.resolved_at)}</div>
              </div>
            )}
          </div>

          <div className="section">
            <h3 className="section-title">🚗 معلومات الرحلة</h3>
            <div className="trip-info">
              <div className="trip-detail">
                <span className="detail-label">رقم الرحلة:</span>
                <a href={`/dashboard/trips?id=${report.trip_request_id}`} className="trip-link">
                  #{report.trip_request_id}
                </a>
              </div>
              {report.trip && (
                <>
                  <div className="trip-detail">
                    <span className="detail-label">من:</span>
                    <span>{report.trip.pickup_location}</span>
                  </div>
                  <div className="trip-detail">
                    <span className="detail-label">إلى:</span>
                    <span>{report.trip.dropoff_location}</span>
                  </div>
                  <div className="trip-detail">
                    <span className="detail-label">الحالة:</span>
                    <span>{report.trip.status}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="users-section">
            <div className="user-card reporter">
              <h3 className="section-title">👤 المُبلِّغ</h3>
              <div className="user-details">
                <div className="user-detail">
                  <span className="detail-label">الاسم:</span>
                  <span className="detail-value">{report.reporter?.name}</span>
                </div>
                <div className="user-detail">
                  <span className="detail-label">النوع:</span>
                  <span className="detail-value">
                    {report.reporter?.type === "rider" ? "راكب" : "سائق"}
                  </span>
                </div>
                <div className="user-detail">
                  <span className="detail-label">رقم الهاتف:</span>
                  <span className="detail-value phone">{report.reporter?.phone}</span>
                </div>
                <div className="user-detail">
                  <span className="detail-label">عدد البلاغات السابقة:</span>
                  <span className="detail-value">{report.reporter?.reports_count}</span>
                </div>
                <button
                  className="view-profile-btn"
                  onClick={() => setShowUserDetails("reporter")}
                >
                  عرض الملف الشخصي
                </button>
              </div>
            </div>

            <div className="user-card reported">
              <h3 className="section-title">⚠️ المُبلَّغ عنه</h3>
              <div className="user-details">
                <div className="user-detail">
                  <span className="detail-label">الاسم:</span>
                  <span className="detail-value">{report.reported?.name}</span>
                </div>
                <div className="user-detail">
                  <span className="detail-label">النوع:</span>
                  <span className="detail-value">
                    {report.reported?.type === "rider" ? "راكب" : "سائق"}
                  </span>
                </div>
                <div className="user-detail">
                  <span className="detail-label">رقم الهاتف:</span>
                  <span className="detail-value phone">{report.reported?.phone}</span>
                </div>
                <div className="user-detail">
                  <span className="detail-label">عدد البلاغات المستلمة:</span>
                  <span className="detail-value">
                    {report.reported?.reports_received_count}
                  </span>
                </div>
                <div className="user-detail">
                  <span className="detail-label">التقييم العام:</span>
                  <span className="detail-value">
                    ⭐ {report.reported?.rating_avg.toFixed(1)}
                  </span>
                </div>
                <button
                  className="view-profile-btn"
                  onClick={() => setShowUserDetails("reported")}
                >
                  عرض الملف الشخصي
                </button>
              </div>
            </div>
          </div>

          <div className="section">
            <h3 className="section-title">📝 تفاصيل البلاغ</h3>
            <div className="report-details">
              <div className="detail-row">
                <span className="detail-label">السبب:</span>
                <span className="detail-value">{report.reason}</span>
              </div>
              {report.description && (
                <div className="detail-row">
                  <span className="detail-label">الوصف التفصيلي:</span>
                  <p className="description-text">{report.description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="section">
            <h3 className="section-title">📋 ملاحظات الإدارة</h3>
            <textarea
              className="admin-notes-input"
              placeholder="أضف ملاحظات الإدارة هنا..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="section">
            <h3 className="section-title">⚡ الإجراء المتخذ</h3>
            <textarea
              className="action-input"
              placeholder="وصف الإجراء المتخذ..."
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="modal-footer">
          <div className="action-buttons">
            <button className="action-button save-btn" onClick={handleSaveNotes}>
              💾 حفظ الملاحظات
            </button>
            {report.status === "pending" && (
              <button className="action-button resolve-btn" onClick={handleResolve}>
                ✅ وضع علامة كمحلول
              </button>
            )}
            <button className="action-button block-btn" onClick={handleBlockUser}>
              🚫 حظر المُبلَّغ عنه
            </button>
            <button className="action-button warning-btn" onClick={handleSendWarning}>
              ⚠️ إرسال تحذير
            </button>
            <button className="action-button notify-btn" onClick={handleSendNotification}>
              📧 إشعار للطرفين
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
