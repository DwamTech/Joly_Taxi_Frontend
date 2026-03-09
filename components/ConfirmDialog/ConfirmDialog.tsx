"use client";

import "./ConfirmDialog.css";

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  type = "danger",
}: ConfirmDialogProps) {
  return (
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-dialog-header confirm-dialog-${type}`}>
          <span className="confirm-dialog-icon">
            {type === "danger" ? "⚠️" : type === "warning" ? "⚠️" : "ℹ️"}
          </span>
          <h3>{title}</h3>
        </div>
        <div className="confirm-dialog-body">
          <p>{message}</p>
        </div>
        <div className="confirm-dialog-actions">
          <button className="confirm-dialog-btn cancel-btn" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`confirm-dialog-btn confirm-btn confirm-btn-${type}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
