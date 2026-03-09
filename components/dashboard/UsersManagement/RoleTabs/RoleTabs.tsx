"use client";

import "./RoleTabs.css";

interface RoleTabsProps {
  activeRole: string;
  onRoleChange: (role: string) => void;
  counts: {
    all: number;
    user: number;
    driver: number;
    both: number;
  };
}

export default function RoleTabs({
  activeRole,
  onRoleChange,
  counts,
}: RoleTabsProps) {
  const tabs = [
    { id: "all", label: "الكل", icon: "👥", count: counts.all },
    { id: "user", label: "راكب فقط", icon: "🚶", count: counts.user },
    { id: "driver", label: "سائق فقط", icon: "🚗", count: counts.driver },
    { id: "both", label: "كلاهما", icon: "🔄", count: counts.both },
  ];

  return (
    <div className="role-tabs-container">
      <div className="role-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`role-tab ${activeRole === tab.id ? "active" : ""}`}
            onClick={() => onRoleChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
