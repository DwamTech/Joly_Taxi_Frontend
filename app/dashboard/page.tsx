"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/dashboard/HeroSection/HeroSection";
import StatsCards from "@/components/dashboard/StatsCards/StatsCards";
import QuickActions from "@/components/dashboard/QuickActions/QuickActions";
import TripsChart from "@/components/dashboard/TripsChart/TripsChart";
import VehiclesChart from "@/components/dashboard/VehiclesChart/VehiclesChart";
import LiveTripsTimeline from "@/components/dashboard/LiveTripsTimeline/LiveTripsTimeline";
import { dashboardService, DashboardStatistics } from "@/services/dashboardService";
import "./dashboard.css";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardService.getDashboardStatistics();
        setStats(data);
        setError(null);
      } catch (err: any) {
        console.error("Error loading dashboard statistics:", err);
        setError(err.message || "فشل في تحميل الإحصائيات");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <div style={{ fontSize: "2rem" }}>⏳</div>
        <p>جاري تحميل الإحصائيات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#e74c3c" }}>
        <div style={{ fontSize: "2rem" }}>⚠️</div>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1.5rem",
            background: "#1e88e5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <>
      <HeroSection stats={stats} />
      <StatsCards stats={stats} />
      <QuickActions />
      
      <div className="charts-section">
        <div className="charts-main">
          <TripsChart monthlyStats={stats?.monthly_stats || []} />
          <VehiclesChart monthlyStats={stats?.monthly_stats || []} />
        </div>
        <div className="charts-sidebar">
          <LiveTripsTimeline />
        </div>
      </div>
    </>
  );
}
