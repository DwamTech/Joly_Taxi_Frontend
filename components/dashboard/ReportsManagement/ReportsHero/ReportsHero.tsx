"use client";

import "./ReportsHero.css";

interface ReportsHeroProps {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  todayReports: number;
}

export default function ReportsHero({
  totalReports,
  pendingReports,
  resolvedReports,
  todayReports,
}: ReportsHeroProps) {
  return (
    <div className="reports-hero">
      <div className="reports-hero-content">
        <div className="reports-hero-text">
          <h1 className="reports-hero-title">🚨 إدارة البلاغات</h1>
        </div>

        <div className="reports-hero-stats">
          <div className="reports-stat-card">
            <div className="reports-stat-icon">📊</div>
            <div className="reports-stat-info">
              <div className="reports-stat-value">{totalReports}</div>
              <div className="reports-stat-label">إجمالي البلاغات</div>
            </div>
          </div>

          <div className="reports-stat-card pending">
            <div className="reports-stat-icon">⏳</div>
            <div className="reports-stat-info">
              <div className="reports-stat-value">{pendingReports}</div>
              <div className="reports-stat-label">البلاغات المعلقة</div>
            </div>
          </div>

          <div className="reports-stat-card resolved">
            <div className="reports-stat-icon">✅</div>
            <div className="reports-stat-info">
              <div className="reports-stat-value">{resolvedReports}</div>
              <div className="reports-stat-label">البلاغات المحلولة</div>
            </div>
          </div>

          <div className="reports-stat-card today">
            <div className="reports-stat-icon">📅</div>
            <div className="reports-stat-info">
              <div className="reports-stat-value">{todayReports}</div>
              <div className="reports-stat-label">البلاغات اليوم</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
