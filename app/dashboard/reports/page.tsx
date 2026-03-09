"use client";

import { ToastProvider } from "@/components/Toast/ToastContainer";
import ReportsManagementContent from "@/components/dashboard/ReportsManagement/ReportsManagementContent/ReportsManagementContent";
import "./reports.css";

export default function ReportsManagementPage() {
  return (
    <ToastProvider>
      <ReportsManagementContent />
    </ToastProvider>
  );
}
