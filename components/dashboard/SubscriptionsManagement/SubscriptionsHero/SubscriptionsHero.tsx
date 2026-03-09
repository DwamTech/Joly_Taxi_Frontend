"use client";

import "./SubscriptionsHero.css";

interface SubscriptionsHeroProps {
  totalSubscriptions: number;
  activeSubscriptions: number;
  pendingSubscriptions: number;
  onExportData: () => void;
}

export default function SubscriptionsHero({
  totalSubscriptions,
  activeSubscriptions,
  pendingSubscriptions,
  onExportData,
}: SubscriptionsHeroProps) {
  return (
    <section className="subscriptions-hero-section">
      <div className="subscriptions-hero-content">
        <div className="subscriptions-hero-text">
          <h1 className="subscriptions-hero-title">
            <span className="subscriptions-hero-icon">📋</span>
            إدارة الاشتراكات
          </h1>
          <p className="subscriptions-hero-subtitle">
            إدارة اشتراكات السائقين وتفعيلها ومتابعة حالتها
          </p>

          <div className="subscriptions-hero-actions">
            <button
              className="subscriptions-hero-btn subscriptions-hero-btn-secondary"
              onClick={onExportData}
            >
              <span>📊</span>
              <span>تصدير البيانات</span>
            </button>
          </div>
        </div>

        <div className="subscriptions-hero-stats">
          <div className="subscriptions-hero-stat">
            <div className="subscriptions-hero-stat-header">
              <span className="subscriptions-hero-stat-icon">📋</span>
              <span className="subscriptions-hero-stat-label">إجمالي الاشتراكات</span>
            </div>
            <span className="subscriptions-hero-stat-value">{totalSubscriptions}</span>
          </div>

          <div className="subscriptions-hero-stat">
            <div className="subscriptions-hero-stat-header">
              <span className="subscriptions-hero-stat-icon">✅</span>
              <span className="subscriptions-hero-stat-label">النشطة</span>
            </div>
            <span className="subscriptions-hero-stat-value">{activeSubscriptions}</span>
          </div>

          <div className="subscriptions-hero-stat">
            <div className="subscriptions-hero-stat-header">
              <span className="subscriptions-hero-stat-icon">⏳</span>
              <span className="subscriptions-hero-stat-label">قيد المراجعة</span>
            </div>
            <span className="subscriptions-hero-stat-value">{pendingSubscriptions}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
