"use client";

import { ToastProvider } from "@/components/Toast/ToastContainer";
import PermissionsManagementContent from "@/components/dashboard/PermissionsManagement/PermissionsManagementContent/PermissionsManagementContent";
import "./permissions.css";

export default function PermissionsPage() {
  return (
    <ToastProvider>
      <PermissionsManagementContent />
    </ToastProvider>
  );
}
