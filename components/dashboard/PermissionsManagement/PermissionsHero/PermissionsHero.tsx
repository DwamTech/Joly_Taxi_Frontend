"use client";

import "./PermissionsHero.css";

interface PermissionsHeroProps {
  totalAdmins: number;
  activeAdmins: number;
  disabledAdmins: number;
  superAdmins: number;
}

export default function PermissionsHero({
  totalAdmins,
  activeAdmins,
  disabledAdmins,
  superAdmins,
}: PermissionsHeroProps) {
  return (
    <div className="permissions-hero">
      <div className="permissions-hero-content">
        <div className="permissions-hero-text">
          <h1 className="permissions-hero-title">إدارة الصلاحيات</h1>
          <p className="permissions-hero-subtitle">
            إدارة المسؤولين وصلاحياتهم
          </p>
        </div>

        <div className="permissions-hero-stats">
          <div className="permissions-stat-card">
            <div className="permissions-stat-content">
              <span className="permissions-stat-icon">👥</span>
              <span className="permissions-stat-value">{totalAdmins}</span>
              <span className="permissions-stat-label">إجمالي</span>
            </div>
          </div>

          <div className="permissions-stat-card">
            <div className="permissions-stat-content">
              <span className="permissions-stat-icon">✅</span>
              <span className="permissions-stat-value">{activeAdmins}</span>
              <span className="permissions-stat-label">نشط</span>
            </div>
          </div>

          <div className="permissions-stat-card">
            <div className="permissions-stat-content">
              <span className="permissions-stat-icon">🚫</span>
              <span className="permissions-stat-value">{disabledAdmins}</span>
              <span className="permissions-stat-label">معطل</span>
            </div>
          </div>

          <div className="permissions-stat-card">
            <div className="permissions-stat-content">
              <span className="permissions-stat-icon">⭐</span>
              <span className="permissions-stat-value">{superAdmins}</span>
              <span className="permissions-stat-label">مدير عام</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
