"use client";

import { Subscription } from "@/models/Subscription";
import "./SubscriptionDetailsModal.css";

interface SubscriptionDetailsModalProps {
  subscription: Subscription;
  onClose: () => void;
  onActivate?: (subscriptionId: number) => void;
  onReject?: (subscriptionId: number) => void;
  onExtend?: (subscriptionId: number) => void;
  onCancel?: (subscriptionId: number) => void;
  onSendNotification?: (driverId: number) => void;
  onDelete?: (subscriptionId: number) => void;
}

export default function SubscriptionDetailsModal({
  subscription,
  onClose,
  onActivate,
  onReject,
  onExtend,
  onCancel,
  onSendNotification,
  onDelete,
}: SubscriptionDetailsModalProps) {
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "قيد المراجعة",
      active: "نشط",
      expired: "منتهي",
      rejected: "مرفوض",
      cancelled: "ملغي",
    };
    return labels[status] || status;
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      bank_transfer: "تحويل بنكي",
      cash: "نقدي",
      card: "بطاقة",
    };
    return labels[method] || method;
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="subscription-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>تفاصيل الاشتراك</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* معلومات الاشتراك */}
          <div className="details-section">
            <h3 className="section-title">
              <span>📋</span>
              معلومات الاشتراك
            </h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">رقم الاشتراك:</span>
                <span className="detail-value subscription-number">
                  {subscription.subscription_number}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">الحالة:</span>
                <span className={`status-badge status-${subscription.status}`}>
                  {getStatusLabel(subscription.status)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">تاريخ الإنشاء:</span>
                <span className="detail-value">
                  {formatDateTime(subscription.created_at)}
                </span>
              </div>
              {subscription.activated_at && (
                <div className="detail-item">
                  <span className="detail-label">تاريخ التفعيل:</span>
                  <span className="detail-value">
                    {formatDateTime(subscription.activated_at)}
                  </span>
                </div>
              )}
              <div className="detail-item">
                <span className="detail-label">نوع المركبة:</span>
                <span className="detail-value">{subscription.vehicle_type}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">عدد الأشهر:</span>
                <span className="detail-value">
                  {subscription.months_count} شهر
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">السعر الإجمالي:</span>
                <span className="detail-value price-highlight">
                  {subscription.total_price} جنيه
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">المبلغ المدفوع:</span>
                <span className="detail-value price-highlight">
                  {subscription.payment_info.amount_paid} جنيه
                </span>
              </div>
              {subscription.start_date && (
                <div className="detail-item">
                  <span className="detail-label">تاريخ البداية:</span>
                  <span className="detail-value">
                    {formatDateTime(subscription.start_date)}
                  </span>
                </div>
              )}
              {subscription.end_date && (
                <div className="detail-item">
                  <span className="detail-label">تاريخ النهاية:</span>
                  <span className="detail-value">
                    {formatDateTime(subscription.end_date)}
                  </span>
                </div>
              )}
              {subscription.days_remaining !== undefined && (
                <div className="detail-item">
                  <span className="detail-label">الأيام المتبقية:</span>
                  <span className="detail-value days-remaining">
                    {subscription.days_remaining > 0
                      ? `${subscription.days_remaining} يوم`
                      : "منتهي"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* معلومات الدفع */}
          <div className="details-section">
            <h3 className="section-title">
              <span>💳</span>
              معلومات الدفع
            </h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">رقم المرجع:</span>
                <span className="detail-value reference-number">
                  {subscription.payment_info.reference_number}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">طريقة الدفع:</span>
                <span className="detail-value">
                  {getPaymentMethodLabel(subscription.payment_info.payment_method)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">تاريخ الدفع:</span>
                <span className="detail-value">
                  {formatDateTime(subscription.payment_info.payment_date)}
                </span>
              </div>
              {subscription.payment_info.additional_notes && (
                <div className="detail-item full-width">
                  <span className="detail-label">ملاحظات إضافية:</span>
                  <span className="detail-value">
                    {subscription.payment_info.additional_notes}
                  </span>
                </div>
              )}
            </div>
            {subscription.payment_info.receipt_image && (
              <div className="receipt-section">
                <span className="detail-label">صورة الإيصال:</span>
                <div className="receipt-image-container">
                  <img
                    src={subscription.payment_info.receipt_image}
                    alt="إيصال الدفع"
                    className="receipt-image"
                    onClick={() =>
                      window.open(subscription.payment_info.receipt_image, "_blank")
                    }
                  />
                  <span className="receipt-hint">اضغط لعرض الصورة بالحجم الكامل</span>
                </div>
              </div>
            )}
          </div>

          {/* معلومات السائق */}
          <div className="details-section">
            <h3 className="section-title">
              <span>👤</span>
              معلومات السائق
            </h3>
            <div className="driver-profile">
              {subscription.driver.avatar ? (
                <img
                  src={subscription.driver.avatar}
                  alt={subscription.driver.name}
                  className="driver-profile-avatar"
                />
              ) : (
                <div className="driver-profile-avatar driver-profile-avatar-fallback">
                  {subscription.driver.name?.charAt(0) || "س"}
                </div>
              )}
              <div className="driver-profile-meta">
                <div className="driver-profile-name">{subscription.driver.name}</div>
                <div className="driver-profile-phone">{subscription.driver.phone}</div>
              </div>
            </div>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">التقييم العام:</span>
                <span className="detail-value rating">
                  ⭐ {subscription.driver.rating}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">عدد الرحلات المكتملة:</span>
                <span className="detail-value">
                  {subscription.driver.completed_trips} رحلة
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">الاشتراكات السابقة:</span>
                <span className="detail-value">
                  {subscription.driver.previous_subscriptions} اشتراك
                </span>
              </div>
            </div>
          </div>

          {/* معلومات الرفض/الإلغاء */}
          {subscription.status === "rejected" && subscription.rejected_reason && (
            <div className="details-section rejection-section">
              <h3 className="section-title">
                <span>❌</span>
                سبب الرفض
              </h3>
              <p className="reason-text">{subscription.rejected_reason}</p>
            </div>
          )}

          {subscription.status === "cancelled" && subscription.cancelled_reason && (
            <div className="details-section cancellation-section">
              <h3 className="section-title">
                <span>🚫</span>
                معلومات الإلغاء
              </h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">تاريخ الإلغاء:</span>
                  <span className="detail-value">
                    {formatDateTime(subscription.cancelled_at)}
                  </span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">سبب الإلغاء:</span>
                  <span className="detail-value">
                    {subscription.cancelled_reason}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="footer-actions">
            {subscription.status === "pending" && onActivate && (
              <button
                className="action-btn activate-btn"
                onClick={() => onActivate(subscription.id)}
                title="تفعيل الاشتراك"
              >
                <span>✅</span>
              </button>
            )}
            {subscription.status === "pending" && onReject && (
              <button
                className="action-btn reject-btn"
                onClick={() => onReject(subscription.id)}
                title="رفض الاشتراك"
              >
                <span>❌</span>
              </button>
            )}
            {subscription.status === "active" && onExtend && (
              <button
                className="action-btn extend-btn"
                onClick={() => onExtend(subscription.id)}
                title="تمديد الاشتراك"
              >
                <span>📅</span>
              </button>
            )}
            {subscription.status === "active" && onCancel && (
              <button
                className="action-btn cancel-btn"
                onClick={() => onCancel(subscription.id)}
                title="إلغاء الاشتراك"
              >
                <span>🚫</span>
              </button>
            )}
            {onSendNotification && (
              <button
                className="action-btn notification-btn"
                onClick={() => onSendNotification(subscription.driver.id)}
                title="إرسال إشعار"
              >
                <span>🔔</span>
              </button>
            )}
            {onDelete && (
              <button
                className="action-btn delete-btn"
                onClick={() => onDelete(subscription.id)}
                title="حذف الاشتراك"
              >
                <span>🗑️</span>
              </button>
            )}
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
