"use client";

import Sidebar from "@/components/dashboard/Sidebar/Sidebar";
import Header from "@/components/dashboard/Header/Header";
import HeroSection from "@/components/dashboard/HeroSection/HeroSection";
import StatsCards from "@/components/dashboard/StatsCards/StatsCards";
import QuickActions from "@/components/dashboard/QuickActions/QuickActions";
import TripsChart from "@/components/dashboard/TripsChart/TripsChart";
import VehiclesChart from "@/components/dashboard/VehiclesChart/VehiclesChart";
import LiveTripsTimeline from "@/components/dashboard/LiveTripsTimeline/LiveTripsTimeline";
import "./dashboard.css";

export default function DashboardPage() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <div className="dashboard-content">
          <HeroSection />
          <StatsCards />
          <QuickActions />
          
          <div className="charts-section">
            <div className="charts-main">
              <TripsChart />
              <VehiclesChart />
            </div>
            <div className="charts-sidebar">
              <LiveTripsTimeline />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
