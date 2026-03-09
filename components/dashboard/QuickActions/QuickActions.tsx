"use client";

import "./QuickActions.css";
import actionsData from "@/data/dashboard/quick-actions.json";

// Icon mapping
const iconMap: Record<string, string> = {
  plus: "➕",
  user: "👤",
  chart: "📊",
  settings: "⚙️"
};

export default function QuickActions() {
  const { title, actions } = actionsData;

  return (
    <div className="quick-actions-section">
      <h2 className="quick-actions-title">{title}</h2>
      <div className="quick-actions-grid">
        {actions.map((action) => (
          <button 
            key={action.id} 
            className={`action-card action-card-${action.color}`}
          >
            <div className="action-icon-wrapper">
              <span className="action-icon">{iconMap[action.icon]}</span>
            </div>
            <div className="action-content">
              <h3 className="action-title">{action.title}</h3>
              <p className="action-description">{action.description}</p>
            </div>
            <div className="action-arrow">←</div>
          </button>
        ))}
      </div>
    </div>
  );
}
