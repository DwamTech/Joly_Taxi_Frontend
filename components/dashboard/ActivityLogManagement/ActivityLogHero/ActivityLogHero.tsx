"use client";

import "./ActivityLogHero.css";

interface ActivityLogHeroProps {
  totalActivities: number;
  todayActivities: number;
  activeAdmins: number;
  criticalActions: number;
}

export default function ActivityLogHero({
  totalActivities,
  todayActivities,
  activeAdmins,
  criticalActions,
}: ActivityLogHeroProps) {
  return (
    <div className="activity-log-hero">
      <div className="activity-log-hero-content">
        <div className="activity-log-hero-text">
          <h1 className="activity-log-hero-title">سجل النشاطات</h1>
          <p className="activity-log-hero-subtitle">
            تتبع جميع الإجراءات الإدارية
          </p>
        </div>

        <div className="activity-log-hero-stats">
          <div className="activity-log-stat-card">
            <div className="activity-log-stat-content">
              <span className="activity-log-stat-icon">📊</span>
              <span className="activity-log-stat-value">{totalActivities}</span>
              <span className="activity-log-stat-label">إجمالي</span>
            </div>
          </div>

          <div className="activity-log-stat-card">
            <div className="activity-log-stat-content">
              <span className="activity-log-stat-icon">📅</span>
              <span className="activity-log-stat-value">{todayActivities}</span>
              <span className="activity-log-stat-label">اليوم</span>
            </div>
          </div>

          <div className="activity-log-stat-card">
            <div className="activity-log-stat-content">
              <span className="activity-log-stat-icon">👥</span>
              <span className="activity-log-stat-value">{activeAdmins}</span>
              <span className="activity-log-stat-label">مسؤول نشط</span>
            </div>
          </div>

          <div className="activity-log-stat-card">
            <div className="activity-log-stat-content">
              <span className="activity-log-stat-icon">⚠️</span>
              <span className="activity-log-stat-value">{criticalActions}</span>
              <span className="activity-log-stat-label">حرج</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
