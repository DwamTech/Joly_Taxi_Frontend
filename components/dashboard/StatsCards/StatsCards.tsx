"use client";

import { useState, useEffect } from "react";
import "./StatsCards.css";
import statsData from "@/data/dashboard/stats-cards.json";
import { DashboardStatistics } from "@/services/dashboardService";

// Icon mapping
const iconMap: Record<string, string> = {
  users: "👥",
  walking: "🚶",
  driver: "👨",
  sparkles: "✨",
  taxi: "🚖",
  calendar: "📅",
  close: "❌",
  check: "✅"
};

interface StatsCardsProps {
  stats: DashboardStatistics | null;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  // دالة للحصول على اسم الشهر الحالي
  const getCurrentMonth = () => {
    return statsData.months[new Date().getMonth()];
  };

  // دالة للحصول على اسم اليوم الحالي
  const getCurrentDay = () => {
    return statsData.days[new Date().getDay()];
  };

  // Initialize stats with titles from JSON
  const initializeStats = () => {
    return statsData.stats.map(stat => ({
      ...stat,
      title: stat.titleTemplate 
        ? stat.titleTemplate
            .replace('{month}', getCurrentMonth())
            .replace('{day}', getCurrentDay())
        : stat.title,
      value: "0"
    }));
  };

  const [displayStats, setDisplayStats] = useState(initializeStats());

  // Update stats when API data is received
  useEffect(() => {
    if (!stats) return;

    setDisplayStats(prevStats => prevStats.map(stat => {
      switch(stat.id) {
        case 1: return { ...stat, value: stats.main_stats.total_users.toLocaleString() };
        case 2: return { ...stat, value: stats.main_stats.total_riders.toString() };
        case 3: return { ...stat, value: stats.main_stats.total_drivers.toString() };
        case 4: return { ...stat, value: stats.main_stats.new_users_this_month.toLocaleString() };
        case 5: return { ...stat, value: stats.trip_stats.pending_trips.toString() };
        case 6: return { ...stat, value: stats.trip_stats.completed_trips.toLocaleString() };
        case 7: return { ...stat, value: (stats.trip_stats.today_trips || 0).toLocaleString() };
        case 8: return { ...stat, value: stats.trip_stats.cancelled_trips.toLocaleString() };
        default: return stat;
      }
    }));
  }, [stats]);

  return (
    <div className="stats-section">
      <h2 className="stats-section-title">{statsData.title}</h2>
      <div className="stats-grid">
        {displayStats.map((stat) => (
          <div key={stat.id} className={`stat-card stat-card-${stat.color}`}>
            <div className="stat-icon">{iconMap[stat.icon]}</div>
            <div className="stat-content">
              <h3 className="stat-title">{stat.title}</h3>
              <div className="stat-value">{stat.value}</div>
              {stat.isRealtime && (
                <div className="realtime-indicator">
                  <span className="pulse-dot"></span>
                  <span className="realtime-text">مباشر</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
