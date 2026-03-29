"use client";

import { useEffect, useState } from "react";
import { AuthService } from "@/services/authService";
import "./Header.css";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [userName, setUserName] = useState("...");
  const [userRole, setUserRole] = useState("...");

  useEffect(() => {
    const session = AuthService.getSession();
    if (session) {
      setUserName(session.userName || "مجهول");
      setUserRole(session.role === "admin" ? "مدير النظام" : session.role);
    }
  }, []);

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
          <div className="user-profile">
            <div className="user-avatar">👤</div>
            <div className="user-info">
              <span className="user-name">{userName}</span>
              <span className="user-role">{userRole}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
