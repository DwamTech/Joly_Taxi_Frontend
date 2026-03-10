"use client";

import { ToastProvider } from "@/components/Toast/ToastContainer";
import LiveMapContent from "@/components/dashboard/LiveMap/LiveMapContent/LiveMapContent";
import "./map.css";

export default function LiveMapPage() {
  return (
    <ToastProvider>
      <LiveMapContent />
    </ToastProvider>
  );
}
