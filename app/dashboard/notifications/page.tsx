"use client";

import { useState } from "react";
import { ToastProvider } from "@/components/Toast/ToastContainer";
import NotificationsManagementContent from "@/components/dashboard/NotificationsManagement/NotificationsManagementContent/NotificationsManagementContent";
import "./notifications.css";

export default function NotificationsPage() {
  return (
    <ToastProvider>
      <NotificationsManagementContent />
    </ToastProvider>
  );
}
