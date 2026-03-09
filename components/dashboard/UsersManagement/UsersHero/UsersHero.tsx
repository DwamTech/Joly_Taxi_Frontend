"use client";

import "./UsersHero.css";
import heroData from "@/data/dashboard/users-hero.json";

interface UsersHeroProps {
  totalUsers: number;
  activeDrivers: number;
  activeRiders: number;
  onAddUser: () => void;
  onExportData: () => void;
}

export default function UsersHero({
  totalUsers,
  activeDrivers,
  activeRiders,
  onAddUser,
  onExportData,
}: UsersHeroProps) {
  const { title, subtitle, actions, stats } = heroData;

  const statsValues = [
    { ...stats[0], value: totalUsers },
    { ...stats[1], value: activeDrivers },
    { ...stats[2], value: activeRiders },
  ];

  return (
    <section className="users-hero-section">
      <div className="users-hero-content">
        <div className="users-hero-text">
          <h1 className="users-hero-title">
            <span className="users-hero-icon">👥</span>
            {title}
          </h1>
          <p className="users-hero-subtitle">{subtitle}</p>

          <div className="users-hero-actions">
            {actions.map((action, index) => (
              <button
                key={index}
                className={`users-hero-btn users-hero-btn-${action.type}`}
                onClick={
                  action.type === 'primary' 
                    ? onAddUser 
                    : action.type === 'secondary' 
                    ? onExportData 
                    : undefined
                }
                suppressHydrationWarning
              >
                <span>{action.icon}</span>
                <span>{action.text}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="users-hero-stats">
          {statsValues.map((stat, index) => (
            <div key={index} className="users-hero-stat">
              <div className="users-hero-stat-header">
                <span className="users-hero-stat-icon">{stat.icon}</span>
                <span className="users-hero-stat-label">{stat.label}</span>
              </div>
              <span className="users-hero-stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
