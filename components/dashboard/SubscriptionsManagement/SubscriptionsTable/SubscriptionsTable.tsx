"use client";

import { Subscription } from "@/models/Subscription";
import "./SubscriptionsTable.css";

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  onViewSubscription: (subscription: Subscription) => void;
  onActivateSubscription: (subscriptionId: number) => void;
  onRejectSubscription: (subscriptionId: number) => void;
  onExtendSubscription: (subscriptionId: number) => void;
  onCancelSubscription: (subscriptionId: number) => void;
  onSendNotification: (driverId: number) => void;
}

export default function SubscriptionsTable({
  subscriptions,
  onViewSubscription,
  onActivateSubscription,
  onRejectSubscription,
  onExtendSubscription,
  onCancelSubscription,
  onSendNotification,
}: SubscriptionsTableProps) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="subscriptions-table-container">
      <div className="table-wrapper">
        <table className="subscriptions-table">
          <thead>
            <tr>
              <th>رقم الاشتراك</th>
              <th>السائق</th>
              <th>نوع المركبة</th>
              <th>عدد الأشهر</th>
              <th>السعر الإجمالي</th>
              <th>الأيام المتبقية</th>
              <th>تاريخ الإنشاء</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.id}>
                <td className="subscription-number-cell" data-label="رقم الاشتراك">
                  {subscription.subscription_number}
                </td>
                <td data-label="السائق">
                  <div className="driver-cell">
                    <div className="driver-avatar">
                      {subscription.driver.name.charAt(0)}
                    </div>
                    <div className="driver-info">
                      <span className="driver-name">
                        {subscription.driver.name}
                      </span>
                      <span className="driver-rating">
                        ⭐ {subscription.driver.rating}
                      </span>
                    </div>
                  </div>
                </td>
                <td data-label="نوع المركبة">
                  <span className="vehicle-badge">
                    {subscription.vehicle_type}
                  </span>
                </td>
                <td className="months-cell" data-label="عدد الأشهر">{subscription.months_count} شهر</td>
                <td className="price-cell" data-label="السعر الإجمالي">{subscription.total_price} جنيه</td>
                <td className="days-cell" data-label="الأيام المتبقية">
                  {subscription.days_remaining !== undefined
                    ? subscription.days_remaining > 0
                      ? `${subscription.days_remaining} يوم`
                      : "منتهي"
                    : "-"}
                </td>
                <td className="date-cell" data-label="تاريخ الإنشاء">
                  {formatDate(subscription.created_at)}
                </td>
                <td data-label="الحالة">
                  <span
                    className={`status-badge status-${subscription.status}`}
                  >
                    {getStatusLabel(subscription.status)}
                  </span>
                </td>
                <td data-label="الإجراءات">
                  <div className="actions-cell">
                    <button
                      className="action-btn view-btn"
                      onClick={() => onViewSubscription(subscription)}
                      title="عرض التفاصيل"
                    >
                      📋
                    </button>
                    {subscription.status === "pending" && (
                      <>
                        <button
                          className="action-btn activate-btn"
                          onClick={() =>
                            onActivateSubscription(subscription.id)
                          }
                          title="تفعيل الاشتراك"
                        >
                          ✅
                        </button>
                        <button
                          className="action-btn reject-btn"
                          onClick={() => onRejectSubscription(subscription.id)}
                          title="رفض الاشتراك"
                        >
                          ❌
                        </button>
                      </>
                    )}
                    {subscription.status === "active" && (
                      <>
                        <button
                          className="action-btn extend-btn"
                          onClick={() => onExtendSubscription(subscription.id)}
                          title="تمديد الاشتراك"
                        >
                          📅
                        </button>
                        <button
                          className="action-btn cancel-btn"
                          onClick={() => onCancelSubscription(subscription.id)}
                          title="إلغاء الاشتراك"
                        >
                          🚫
                        </button>
                      </>
                    )}
                    <button
                      className="action-btn notification-btn"
                      onClick={() => onSendNotification(subscription.driver.id)}
                      title="إرسال إشعار للسائق"
                    >
                      🔔
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
