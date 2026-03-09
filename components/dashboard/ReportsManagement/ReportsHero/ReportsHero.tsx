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
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">🚨 إدارة البلاغات</h1>
          {/* <span className="hero-subtitle">- التعامل مع بلاغات المستخدمين ومتابعة حالتها</span> */}
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-value">{totalReports}</div>
              <div className="stat-label">إجمالي البلاغات</div>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <div className="stat-value">{pendingReports}</div>
              <div className="stat-label">البلاغات المعلقة</div>
            </div>
          </div>

          <div className="stat-card resolved">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-value">{resolvedReports}</div>
              <div className="stat-label">البلاغات المحلولة</div>
            </div>
          </div>

          <div className="stat-card today">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <div className="stat-value">{todayReports}</div>
              <div className="stat-label">البلاغات اليوم</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
