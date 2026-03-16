"use client";

import { useState, useEffect } from "react";
import { getUserActivityLog } from "@/services/usersService";
import { Trip } from "@/models/Trip";
import "./ActivityLogModal.css";

interface ActivityLogModalProps {
  userId: number;
  userName: string;
  onClose: () => void;
}

export default function ActivityLogModal({
  userId,
  userName,
  onClose,
}: ActivityLogModalProps) {
  const [activities, setActivities] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivityLog = async () => {
      try {
        setIsLoading(true);
        const data = await getUserActivityLog(userId);
        setActivities(data);
      } catch (err: any) {
        setError(err.message || "فشل في تحميل سجل النشاط");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityLog();
  }, [userId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} دقيقة`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} ساعة ${remainingMinutes} دقيقة`;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ended: "مكتملة",
      cancelled: "ملغاة",
      started: "جارية",
      accepted: "مقبولة",
      open: "يتم البحث",
      expired: "منتهية الصلاحية",
    };
    return labels[status] || status;
  };

  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      ended: "status-completed",
      cancelled: "status-cancelled",
      started: "status-ongoing",
      accepted: "status-accepted",
      open: "status-searching",
      expired: "status-expired",
    };
    return classes[status] || "";
  };

  return (
    <div className="activity-log-overlay" onClick={onClose}>
      <div className="activity-log-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              <span>📊</span>
              سجل النشاط
            </h2>
            <p className="modal-subtitle">آخر 10 رحلات لـ {userName}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>جاري تحميل سجل النشاط...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
              <button className="retry-btn" onClick={() => window.location.reload()}>
                إعادة المحاولة
              </button>
            </div>
          ) : activities.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>لا يوجد سجل نشاط لهذا المستخدم</p>
            </div>
          ) : (
            <div className="activity-table-container">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>رقم الرحلة</th>
                    <th>التاريخ والوقت</th>
                    <th>من</th>
                    <th>إلى</th>
                    <th>المسافة</th>
                    <th>الوقت المتوقع</th>
                    <th>تكييف</th>
                    <th>المبلغ</th>
                    <th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="trip-id">#{activity.id}</td>
                      <td className="trip-date">{formatDate(activity.created_at)}</td>
                      <td className="trip-address">
                        {activity.from_address || (
                          <span className="no-data">غير محدد</span>
                        )}
                      </td>
                      <td className="trip-address">
                        {activity.to_address || (
                          <span className="no-data">غير محدد</span>
                        )}
                      </td>
                      <td className="trip-distance">
                        {activity.distance_km.toFixed(2)} كم
                      </td>
                      <td className="trip-eta">
                        {formatDuration(activity.eta_seconds)}
                      </td>
                      <td className="trip-ac">
                        {activity.requires_ac ? (
                          <span className="ac-badge yes">❄️ نعم</span>
                        ) : (
                          <span className="ac-badge no">لا</span>
                        )}
                      </td>
                      <td className="trip-amount">
                        {(activity.final_price || activity.suggested_price).toFixed(2)} ج.م
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(activity.status)}`}>
                          {getStatusLabel(activity.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">إجمالي الرحلات:</span>
              <span className="stat-value">{activities.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">الرحلات المكتملة:</span>
              <span className="stat-value completed">
                {activities.filter((a) => a.status === "ended").length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">الرحلات الملغاة:</span>
              <span className="stat-value cancelled">
                {activities.filter((a) => a.status === "cancelled").length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">إجمالي المبلغ:</span>
              <span className="stat-value total">
                {activities
                  .reduce((sum, a) => sum + (a.final_price || a.suggested_price), 0)
                  .toFixed(2)}{" "}
                ج.م
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
