"use client";

import "./VehicleTypesHero.css";

interface VehicleTypesHeroProps {
  onAddNew: () => void;
}

export default function VehicleTypesHero({ onAddNew }: VehicleTypesHeroProps) {
  return (
    <div className="vehicle-types-hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">🚗 إدارة أنواع المركبات</h1>
          <p className="hero-description">
            إدارة أنواع المركبات وأسعارها ونطاق البحث والإعدادات الخاصة بكل نوع
          </p>
        </div>
        <button className="add-vehicle-type-btn" onClick={onAddNew}>
          <span className="btn-icon">➕</span>
          <span>إضافة نوع جديد</span>
        </button>
      </div>
    </div>
  );
}
