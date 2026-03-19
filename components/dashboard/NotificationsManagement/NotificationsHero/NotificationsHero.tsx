"use client";

import "./NotificationsHero.css";

interface NotificationsHeroProps {
  totalNotifications: number;
  todayNotifications: number;
  failedNotifications: number;
  unreadNotifications: number;
}

export default function NotificationsHero({
  totalNotifications,
  todayNotifications,
  failedNotifications,
  unreadNotifications,
}: NotificationsHeroProps) {
  return (
    <section className="notifications-hero">
      <div className="notifications-hero-content">
        <div className="notifications-hero-text">
          <h1 className="notifications-hero-title">إدارة الإشعارات</h1>
          <p className="notifications-hero-subtitle">
            إرسال وإدارة الإشعارات للمستخدمين والسائقين بكفاءة عالية
          </p>
        </div>

        <div className="notifications-hero-stats">
          <div className="hero-stat-card">
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #FDB913 0%, #FFA500 100%)" }}>
              📊
            </div>
            <div className="stat-info">
              <div className="stat-value">{totalNotifications.toLocaleString()}</div>
              <div className="stat-label">إجمالي الإشعارات</div>
            </div>
          </div>

          <div className="hero-stat-card">
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)" }}>
              📅
            </div>
            <div className="stat-info">
              <div className="stat-value">{todayNotifications.toLocaleString()}</div>
              <div className="stat-label">إشعارات اليوم</div>
            </div>
          </div>

          <div className="hero-stat-card">
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #f44336 0%, #e53935 100%)" }}>
              ⚠️
            </div>
            <div className="stat-info">
              <div className="stat-value">{failedNotifications.toLocaleString()}</div>
              <div className="stat-label">الإشعارات الفاشلة</div>
            </div>
          </div>

          <div className="hero-stat-card">
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #8e44ad 0%, #6f2da8 100%)" }}>
              🔕
            </div>
            <div className="stat-info">
              <div className="stat-value">{unreadNotifications.toLocaleString()}</div>
              <div className="stat-label">الإشعارات غير المقروءة</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
