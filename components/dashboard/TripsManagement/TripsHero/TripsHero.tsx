"use client";

import "./TripsHero.css";

interface TripsHeroProps {
  totalTrips: number;
  ongoingTrips: number;
  completedToday: number;
  onExportData: () => void;
}

export default function TripsHero({
  totalTrips,
  ongoingTrips,
  completedToday,
  onExportData,
}: TripsHeroProps) {
  return (
    <section className="trips-hero-section">
      <div className="trips-hero-content">
        <div className="trips-hero-text">
          <h1 className="trips-hero-title">
            <span className="trips-hero-icon">🚕</span>
            إدارة الرحلات
          </h1>
          <p className="trips-hero-subtitle">
            مراقبة وإدارة جميع الرحلات في النظام بشكل لحظي
          </p>

          <div className="trips-hero-actions">
            <button className="trips-hero-btn trips-hero-btn-secondary" onClick={onExportData}>
              <span>📊</span>
              <span>تصدير البيانات</span>
            </button>
          </div>
        </div>

        <div className="trips-hero-stats">
          <div className="trips-hero-stat">
            <div className="trips-hero-stat-header">
              <span className="trips-hero-stat-icon">📋</span>
              <span className="trips-hero-stat-label">إجمالي الرحلات</span>
            </div>
            <span className="trips-hero-stat-value">{totalTrips}</span>
          </div>

          <div className="trips-hero-stat">
            <div className="trips-hero-stat-header">
              <span className="trips-hero-stat-icon">🚗</span>
              <span className="trips-hero-stat-label">الرحلات الجارية</span>
            </div>
            <span className="trips-hero-stat-value">{ongoingTrips}</span>
          </div>

          <div className="trips-hero-stat">
            <div className="trips-hero-stat-header">
              <span className="trips-hero-stat-icon">✅</span>
              <span className="trips-hero-stat-label">المنتهية اليوم</span>
            </div>
            <span className="trips-hero-stat-value">{completedToday}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
