"use client";

import { ToastProvider } from "@/components/Toast/ToastContainer";
import ActivityLogContent from "@/components/dashboard/ActivityLogManagement/ActivityLogContent/ActivityLogContent";
import "./activity-log.css";

export default function ActivityLogPage() {
  return (
    <ToastProvider>
      <ActivityLogContent />
    </ToastProvider>
  );
}
