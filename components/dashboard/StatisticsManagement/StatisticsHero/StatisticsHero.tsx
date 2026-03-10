"use client";

import "./StatisticsHero.css";

interface StatisticsHeroProps {
  totalTrips: number;
  totalRevenue: number;
  activeDrivers: number;
  activeRiders: number;
}

export default function StatisticsHero({
  totalTrips,
  totalRevenue,
  activeDrivers,
  activeRiders,
}: StatisticsHeroProps) {
  return (
    <section className="statistics-hero">
      <div className="statistics-hero-content">
        <div className="statistics-hero-text">
          <h1 className="statistics-hero-title">التقارير والإحصائيات</h1>
          <p className="statistics-hero-subtitle">
            تحليل شامل لأداء المنصة والإيرادات والمستخدمين
          </p>
        </div>

        <div className="statistics-hero-stats">
          <div className="hero-stat-card">
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #FDB913 0%, #FFA500 100%)" }}>
              🚗
            </div>
            <div className="stat-info">
              <div className="stat-value">{totalTrips.toLocaleString()}</div>
              <div className="stat-label">إجمالي الرحلات</div>
            </div>
          </div>

          <div className="hero-stat-card">
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #27ae60 0%, #229954 100%)" }}>
              💰
            </div>
            <div className="stat-info">
              <div className="stat-value">{totalRevenue.toLocaleString()} ج.م</div>
              <div className="stat-label">إجمالي الإيرادات</div>
            </div>
          </div>

          <div className="hero-stat-card">
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)" }}>
              👨‍✈️
            </div>
            <div className="stat-info">
              <div className="stat-value">{activeDrivers.toLocaleString()}</div>
              <div className="stat-label">السائقين النشطين</div>
            </div>
          </div>

          <div className="hero-stat-card">
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)" }}>
              👥
            </div>
            <div className="stat-info">
              <div className="stat-value">{activeRiders.toLocaleString()}</div>
              <div className="stat-label">الركاب النشطين</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
