"use client";

import "./Header.css";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-right">
          <button className="hamburger-btn" onClick={onMenuClick}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h2 className="header-title">لوحة التحكم</h2>
        </div>
        
        <div className="header-left">
          {/* <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            <span className="notification-badge">3</span>
          </button> */}
          
          <div className="user-profile">
            <div className="user-avatar">👤</div>
            <div className="user-info">
              <span className="user-name">أحمد محمد</span>
              <span className="user-role">مدير النظام</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
