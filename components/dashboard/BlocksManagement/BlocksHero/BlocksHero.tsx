"use client";

import "./BlocksHero.css";

interface BlocksHeroProps {
  totalBlocks: number;
  activeBlocks: number;
  cancelledBlocks: number;
  topBlockers: number;
}

export default function BlocksHero({
  totalBlocks,
  activeBlocks,
  cancelledBlocks,
  topBlockers,
}: BlocksHeroProps) {
  return (
    <section className="blocks-hero">
      <div className="blocks-hero-content">
        <div className="blocks-hero-text">
          <h1 className="blocks-hero-title">إدارة الحظر</h1>
          <p className="blocks-hero-subtitle">
            مراقبة وإدارة حالات الحظر بين المستخدمين بكفاءة عالية
          </p>
        </div>

        <div className="blocks-hero-stats">
          <div className="hero-stat-card">
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #FDB913 0%, #FFA500 100%)" }}>
              📊
            </div>
            <div className="stat-info">
              <div className="stat-value">{totalBlocks.toLocaleString()}</div>
              <div className="stat-label">إجمالي حالات الحظر</div>
            </div>
          </div>

          <div className="hero-stat-card">
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)" }}>
              🚫
            </div>
            <div className="stat-info">
              <div className="stat-value">{activeBlocks.toLocaleString()}</div>
              <div className="stat-label">الحظر النشط</div>
            </div>
          </div>

          <div className="hero-stat-card">
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #27ae60 0%, #229954 100%)" }}>
              ✅
            </div>
            <div className="stat-info">
              <div className="stat-value">{cancelledBlocks.toLocaleString()}</div>
              <div className="stat-label">الحظر الملغي</div>
            </div>
          </div>

          <div className="hero-stat-card">
            <div className="stat-icon" style={{ background: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)" }}>
              👥
            </div>
            <div className="stat-info">
              <div className="stat-value">{topBlockers.toLocaleString()}</div>
              <div className="stat-label">المستخدمين الأكثر حظراً</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
