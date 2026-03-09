"use client";

import { ToastProvider } from "@/components/Toast/ToastContainer";
import BlocksManagementContent from "@/components/dashboard/BlocksManagement/BlocksManagementContent/BlocksManagementContent";
import "./blocks.css";

export default function BlocksPage() {
  return (
    <ToastProvider>
      <BlocksManagementContent />
    </ToastProvider>
  );
}
