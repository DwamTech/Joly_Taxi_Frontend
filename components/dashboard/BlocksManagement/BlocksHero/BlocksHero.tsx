"use client";

import "./BlocksHero.css";

interface BlocksHeroProps {
  totalBlocks: number;
  activeBlocks: number;
  inactiveBlocks: number;
  cancelledBlocks: number;
  todayBlocks: number;
  thisWeekBlocks: number;
  thisMonthBlocks: number;
  topBlockingUserName: string;
  topBlockingUserCount: number;
  topBlockedUserName: string;
  topBlockedUserCount: number;
}

export default function BlocksHero({
  totalBlocks,
  activeBlocks,
  inactiveBlocks,
  cancelledBlocks,
  todayBlocks,
  thisWeekBlocks,
  thisMonthBlocks,
  topBlockingUserName,
  topBlockingUserCount,
  topBlockedUserName,
  topBlockedUserCount,
}: BlocksHeroProps) {
  const statsItems = [
    {
      icon: "📊",
      value: totalBlocks,
      label: "إجمالي حالات الحظر",
      color: "linear-gradient(135deg, #FDB913 0%, #FFA500 100%)",
    },
    {
      icon: "🚫",
      value: activeBlocks,
      label: "الحظر النشط",
      color: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
    },
    {
      icon: "⏸️",
      value: inactiveBlocks,
      label: "الحظر غير النشط",
      color: "linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)",
    },
    {
      icon: "✅",
      value: cancelledBlocks,
      label: "الحظر الملغي",
      color: "linear-gradient(135deg, #27ae60 0%, #229954 100%)",
    },
    {
      icon: "🗓️",
      value: todayBlocks,
      label: "حظر اليوم",
      color: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
    },
    {
      icon: "📅",
      value: thisWeekBlocks,
      label: "حظر هذا الأسبوع",
      color: "linear-gradient(135deg, #16a085 0%, #117a65 100%)",
    },
    {
      icon: "🗓️",
      value: thisMonthBlocks,
      label: "حظر هذا الشهر",
      color: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
    },
  ];

  return (
    <>
      <section className="blocks-hero">
        <div className="blocks-hero-content">
          <div className="blocks-hero-text">
            <h1 className="blocks-hero-title">إدارة الحظر</h1>
            <p className="blocks-hero-subtitle">
              مراقبة وإدارة حالات الحظر بين المستخدمين بكفاءة عالية
            </p>
          </div>

          <div className="blocks-hero-stats">
            {statsItems.map((item) => (
              <div className="hero-stat-card" key={item.label}>
                <div className="stat-icon" style={{ background: item.color }}>
                  {item.icon}
                </div>
                <div className="stat-info">
                  <div className="stat-value">{item.value.toLocaleString()}</div>
                  <div className="stat-label">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="blocks-hero-top-users">
        <div className="hero-top-user-card">
          <div className="top-user-header">
            <span className="top-user-icon">🛡️</span>
            <div className="top-user-title">الأكثر حظراً للآخرين</div>
          </div>
          <div className="top-user-name">{topBlockingUserName}</div>
          <div className="top-user-count">عدد الحالات: {topBlockingUserCount.toLocaleString()}</div>
        </div>
        <div className="hero-top-user-card">
          <div className="top-user-header">
            <span className="top-user-icon">⚠️</span>
            <div className="top-user-title">الأكثر تعرضاً للحظر</div>
          </div>
          <div className="top-user-name">{topBlockedUserName}</div>
          <div className="top-user-count">عدد الحالات: {topBlockedUserCount.toLocaleString()}</div>
        </div>
      </div>
    </>
  );
}
