"use client";

import { useState } from "react";
import { Subscription } from "@/models/Subscription";
import "./ExtendSubscriptionModal.css";

interface ExtendSubscriptionModalProps {
  subscription: Subscription;
  onClose: () => void;
  onConfirm: (subscriptionId: number, additionalMonths: number) => void;
}

export default function ExtendSubscriptionModal({
  subscription,
  onClose,
  onConfirm,
}: ExtendSubscriptionModalProps) {
  const [additionalMonths, setAdditionalMonths] = useState<number>(1);

  const calculateNewEndDate = () => {
    if (!subscription.end_date) return "-";
    const currentEndDate = new Date(subscription.end_date);
    const newEndDate = new Date(currentEndDate);
    newEndDate.setMonth(newEndDate.getMonth() + additionalMonths);
    return newEndDate.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAdditionalPrice = () => {
    const pricePerMonth = subscription.total_price / subscription.months_count;
    return (pricePerMonth * additionalMonths).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (additionalMonths > 0) {
      onConfirm(subscription.id, additionalMonths);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="extend-subscription-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>تمديد الاشتراك</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="subscription-info">
              <div className="info-item">
                <span className="info-label">رقم الاشتراك:</span>
                <span className="info-value">
                  {subscription.subscription_number}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">السائق:</span>
                <span className="info-value">{subscription.driver.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">نوع المركبة:</span>
                <span className="info-value">{subscription.vehicle_type}</span>
              </div>
              <div className="info-item">
                <span className="info-label">تاريخ النهاية الحالي:</span>
                <span className="info-value">
                  {subscription.end_date
                    ? new Date(subscription.end_date).toLocaleDateString(
                        "ar-EG",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "-"}
                </span>
              </div>
            </div>

            <div className="form-section">
              <label htmlFor="additionalMonths" className="form-label">
                عدد الأشهر الإضافية:
              </label>
              <div className="months-selector">
                <button
                  type="button"
                  className="month-btn"
                  onClick={() =>
                    setAdditionalMonths(Math.max(1, additionalMonths - 1))
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  id="additionalMonths"
                  value={additionalMonths}
                  onChange={(e) =>
                    setAdditionalMonths(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  min="1"
                  max="12"
                  className="months-input"
                  required
                />
                <button
                  type="button"
                  className="month-btn"
                  onClick={() =>
                    setAdditionalMonths(Math.min(12, additionalMonths + 1))
                  }
                >
                  +
                </button>
              </div>
              <span className="form-hint">
                يمكنك تمديد الاشتراك من 1 إلى 12 شهر
              </span>
            </div>

            <div className="calculation-section">
              <div className="calc-item">
                <span className="calc-label">تاريخ النهاية الجديد:</span>
                <span className="calc-value new-date">
                  {calculateNewEndDate()}
                </span>
              </div>
              <div className="calc-item">
                <span className="calc-label">المبلغ الإضافي:</span>
                <span className="calc-value price">
                  {calculateAdditionalPrice()} جنيه
                </span>
              </div>
              <div className="calc-item total">
                <span className="calc-label">إجمالي الأشهر:</span>
                <span className="calc-value">
                  {subscription.months_count + additionalMonths} شهر
                </span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              إلغاء
            </button>
            <button type="submit" className="confirm-btn">
              تأكيد التمديد
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
