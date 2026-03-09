"use client";

import "./RatingsHero.css";

interface RatingsHeroProps {
  activeTab: "ratings" | "tags";
  onTabChange: (tab: "ratings" | "tags") => void;
}

export default function RatingsHero({ activeTab, onTabChange }: RatingsHeroProps) {
  return (
    <div className="ratings-hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">⭐ إدارة التقييمات</h1>
          <p className="hero-subtitle">
            مراقبة وإدارة تقييمات المستخدمين والسائقين
          </p>
        </div>

        <div className="hero-tabs">
          <button
            className={`tab-btn ${activeTab === "ratings" ? "active" : ""}`}
            onClick={() => onTabChange("ratings")}
          >
            <span className="tab-icon">📋</span>
            <span className="tab-text">قائمة التقييمات</span>
          </button>
          <button
            className={`tab-btn ${activeTab === "tags" ? "active" : ""}`}
            onClick={() => onTabChange("tags")}
          >
            <span className="tab-icon">🔖</span>
            <span className="tab-text">إدارة الوسوم</span>
          </button>
        </div>
      </div>
    </div>
  );
}
