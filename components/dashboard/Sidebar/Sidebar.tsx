"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Sidebar.css";
import menuData from "@/data/dashboard/sidebar-menu.json";

// Icon mapping
const iconMap: Record<string, string> = {
  home: "🏠",
  user: "👤",
  users: "👥",
  taxi: "🚖",
  clipboard: "📋",
  star: "⭐",
  warning: "⚠️",
  car: "🚗",
  bell: "🔔",
  settings: "⚙️",
  chart: "📊",
  map: "📍",
  lock: "🔐",
  ban: "🚫",
  document: "📝",
  logout: "🚪"
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { menuItems, footer } = menuData;

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Image src="/logo.png" alt="جولي تاكسي" width={150} height={75} />
        </div>
        <button className="sidebar-close-btn" onClick={onClose}>
          ✕
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`sidebar-item ${pathname === item.path ? "active" : ""}`}
            onClick={handleLinkClick}
          >
            <span className="sidebar-icon">{iconMap[item.icon]}</span>
            <span className="sidebar-text">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link href={footer.path} className="sidebar-item logout" onClick={handleLinkClick}>
          <span className="sidebar-icon">{iconMap[footer.icon]}</span>
          <span className="sidebar-text">{footer.name}</span>
        </Link>
      </div>
    </aside>
  );
}
