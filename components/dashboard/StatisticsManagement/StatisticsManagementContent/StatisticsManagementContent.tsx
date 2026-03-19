"use client";

import { useState } from "react";
import StatisticsHero from "../StatisticsHero/StatisticsHero";
import TripReports from "../TripReports/TripReports";
import UserReports from "../UserReports/UserReports";
import RevenueReports from "../RevenueReports/RevenueReports";
import ExportSchedule from "../ExportSchedule/ExportSchedule";
import statisticsData from "@/data/statistics/statistics-data.json";
import "./StatisticsManagementContent.css";

type TabType = "trips" | "users" | "revenue" | "export";

export default function StatisticsManagementContent() {
  const [activeTab, setActiveTab] = useState<TabType>("trips");

  return (
    <div className="statistics-management-page">
      <StatisticsHero
        totalTrips={statisticsData.tripStatistics.total_trips}
        totalRevenue={statisticsData.revenueStatistics.total_revenue}
        activeDrivers={statisticsData.driverStatistics.active_drivers}
        activeRiders={statisticsData.riderStatistics.active_riders}
      />

      <div className="statistics-tabs">
        <button
          className={`stat-tab ${activeTab === "trips" ? "active" : ""}`}
          onClick={() => setActiveTab("trips")}
        >
          <span className="tab-icon">🚗</span>
          <span className="tab-text">تقارير الرحلات</span>
        </button>
        {/*<button
          className={`stat-tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <span className="tab-icon">👥</span>
          <span className="tab-text">تقارير المستخدمين</span>
        </button>
        <button
          className={`stat-tab ${activeTab === "revenue" ? "active" : ""}`}
          onClick={() => setActiveTab("revenue")}
        >
          <span className="tab-icon">💰</span>
          <span className="tab-text">تقارير الإيرادات</span>
        </button>*/}
        <button
          className={`stat-tab ${activeTab === "export" ? "active" : ""}`}
          onClick={() => setActiveTab("export")}
        >
          <span className="tab-icon">📤</span>
          <span className="tab-text">تصدير وجدولة</span>
        </button>
      </div>

      <div className="statistics-content">
        {activeTab === "trips" && <TripReports />}
        {activeTab === "users" && <UserReports />}
        {activeTab === "revenue" && <RevenueReports />}
        {activeTab === "export" && <ExportSchedule />}
      </div>
    </div>
  );
}
