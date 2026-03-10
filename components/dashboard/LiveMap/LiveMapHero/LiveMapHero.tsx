"use client";

import "./LiveMapHero.css";

interface LiveMapHeroProps {
  onlineDrivers: number;
  activeTrips: number;
  openRequests: number;
  availableDrivers: number;
}

export default function LiveMapHero({
  onlineDrivers,
  activeTrips,
  openRequests,
  availableDrivers,
}: LiveMapHeroProps) {
  return (
    <section className="map-hero">
      <div className="map-hero-content">
        <div className="map-hero-text">
          <h1 className="map-hero-title">الخريطة المباشرة</h1>
          <p className="map-hero-subtitle">
            مراقبة السائقين والرحلات على الخريطة في الوقت الفعلي
          </p>
        </div>

        <div className="map-hero-stats">
          <div className="hero-stat-card">
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #27ae60 0%, #229954 100%)" }}>
              🟢
            </div>
            <div className="stat-info">
              <div className="stat-value">{onlineDrivers}</div>
              <div className="stat-label">سائق متصل</div>
            </div>
          </div>

          <div className="hero-stat-card">
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #FDB913 0%, #FFA500 100%)" }}>
              🚗
            </div>
            <div className="stat-info">
              <div className="stat-value">{activeTrips}</div>
              <div className="stat-label">رحلة جارية</div>
            </div>
          </div>

          <div className="hero-stat-card">
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)" }}>
              📋
            </div>
            <div className="stat-info">
              <div className="stat-value">{openRequests}</div>
              <div className="stat-label">طلب مفتوح</div>
            </div>
          </div>

          <div className="hero-stat-card">
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)" }}>
              ✅
            </div>
            <div className="stat-info">
              <div className="stat-value">{availableDrivers}</div>
              <div className="stat-label">سائق متاح</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
