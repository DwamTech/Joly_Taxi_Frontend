"use client";

import { Subscription, SubscriptionStatus } from "@/models/Subscription";
import { formatText, formatNumber, formatDate } from "@/utils/formatters";
import "./SubscriptionsTable.css";

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  onViewSubscription: (subscription: Subscription) => void;
  onActivateSubscription: (subscriptionId: number) => void;
  onRejectSubscription: (subscriptionId: number) => void;
  onExtendSubscription: (subscriptionId: number) => void;
  onDeleteSubscription: (subscriptionId: number) => void;
  onChangeStatus: (subscriptionId: number, status: SubscriptionStatus) => void;
}

export default function SubscriptionsTable({
  subscriptions,
  onViewSubscription,
  onActivateSubscription,
  onRejectSubscription,
  onExtendSubscription,
  onDeleteSubscription,
  onChangeStatus,
}: SubscriptionsTableProps) {
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
    //  pending: "قيد المراجعة",
      active: "نشط",
     // expired: "منتهي",
      rejected: "مرفوض",
    //  cancelled: "ملغي",
    };
    return labels[status] || status;
  };

  const formatDateString = (dateString: string) => {
    return formatDate(dateString);
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
                  <select
                    className={`status-select status-${subscription.status}`}
                    value={subscription.status}
                    onChange={(e) => onChangeStatus(subscription.id, e.target.value as SubscriptionStatus)}
                  >
                  {/*  <option value="pending">قيد المراجعة</option>*/}
                    <option value="active">نشط</option>
                   {/* <option value="expired">منتهي</option>*/}
                    <option value="rejected">مرفوض</option>
                  </select>
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
                      </>
                    )}
                    <button
                      className="action-btn delete-btn"
                      onClick={() => onDeleteSubscription(subscription.id)}
                      title="حذف الاشتراك"
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
    </div>
  );
}
