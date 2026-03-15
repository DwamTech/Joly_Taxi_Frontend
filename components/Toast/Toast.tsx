"use client";

import { useEffect } from "react";
import "./Toast.css";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration }: ToastProps) {
  // تحديد المدة بناءً على طول الرسالة إذا لم يتم تحديدها
  const defaultDuration = duration || (message.length > 100 ? 6000 : message.length > 50 ? 4500 : 3000);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, defaultDuration);

    return () => clearTimeout(timer);
  }, [defaultDuration, onClose]);

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>
        ✕
      </button>
    </div>
  );
}
