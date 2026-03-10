"use client";

import { useState } from "react";
import { ToastProvider } from "@/components/Toast/ToastContainer";
import StatisticsManagementContent from "@/components/dashboard/StatisticsManagement/StatisticsManagementContent/StatisticsManagementContent";
import "./statistics.css";

export default function StatisticsPage() {
  return (
    <ToastProvider>
      <StatisticsManagementContent />
    </ToastProvider>
  );
}
