"use client";

import Link from "next/link";
import "./QuickActions.css";

const actions = [
  {
    id: 1,
    title: "رحلة جديدة",
    description: "إضافة رحلة جديدة للنظام",
    icon: "➕",
    color: "yellow",
    href: "/dashboard/trips",
  },
  {
    id: 2,
    title: "إضافة سائق",
    description: "تسجيل سائق جديد",
    icon: "👤",
    color: "blue",
    href: "/dashboard/users",
  },
  {
    id: 3,
    title: "التقارير",
    description: "عرض التقارير والإحصائيات",
    icon: "📊",
    color: "green",
    href: "/dashboard/statistics",
  },
  {
    id: 4,
    title: "الإعدادات",
    description: "إدارة إعدادات النظام",
    icon: "⚙️",
    color: "gray",
    href: "/dashboard/settings",
  },
];

export default function QuickActions() {
  return (
    <div className="quick-actions-section">
      <h2 className="quick-actions-title">الإجراءات السريعة</h2>
      <div className="quick-actions-grid">
        {actions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className={`action-card action-card-${action.color}`}
          >
            <div className="action-icon-wrapper">
              <span className="action-icon">{action.icon}</span>
            </div>
            <div className="action-content">
              <h3 className="action-title">{action.title}</h3>
              <p className="action-description">{action.description}</p>
            </div>
            <div className="action-arrow">←</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
