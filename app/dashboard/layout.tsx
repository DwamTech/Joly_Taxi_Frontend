"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar/Sidebar";
import Header from "@/components/dashboard/Header/Header";
import "./dashboard.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="dashboard-main">
        <Header onMenuClick={toggleSidebar} />
        <div className="dashboard-content">
          {children}
        </div>
      </div>
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}
    </div>
  );
}
