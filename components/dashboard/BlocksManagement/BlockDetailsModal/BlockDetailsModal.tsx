"use client";

import { UserBlockItem } from "@/models/Block";
import "./BlockDetailsModal.css";

interface BlockDetailsModalProps {
  block: UserBlockItem | null;
  onClose: () => void;
}

export default function BlockDetailsModal({
  block,
  onClose,
}: BlockDetailsModalProps) {
  if (!block) return null;
  const formatDateTime = (value: string) =>
    new Date(value.replace(" ", "T")).toLocaleString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getUserTypeBadge = (type: string) => {
    if (type === "driver") {
      return <span className="modal-user-type-badge driver">🚗 سائق</span>;
    }
    if (type === "user" || type === "rider") {
      return <span className="modal-user-type-badge rider">👤 راكب</span>;
    }
    return <span className="modal-user-type-badge rider">👥 {type}</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <span className="modal-status-badge status-active">🚫 نشط</span>;
    }
    return <span className="modal-status-badge status-cancelled">✅ ملغي</span>;
  };

  const getAccountStatusText = (status: string) => {
    if (status === "active") return "نشط";
    if (status === "blocked") return "محظور";
    if (status === "inactive") return "غير نشط";
    if (status === "suspended") return "موقوف";
    if (status === "pending") return "قيد المراجعة";
    return status || "غير معروف";
  };

  return (
    <div className="block-modal-overlay" onClick={onClose}>
      <div className="block-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="block-modal-header">
          <h2>تفاصيل الحظر #{block.id}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="block-modal-body">
          <div className="modal-section">
            <h3 className="modal-section-title">
              <span className="section-icon">👤</span>
              بيانات الحاظر
            </h3>
            <div className="modal-info-grid">
              <div className="modal-info-item">
                <span className="info-label">الاسم:</span>
                <span className="info-value">{block.blocker.name}</span>
              </div>
              <div className="modal-info-item">
                <span className="info-label">النوع:</span>
                {getUserTypeBadge(block.blocker.role)}
              </div>
              <div className="modal-info-item">
                <span className="info-label">رقم المستخدم:</span>
                <span className="info-value">#{block.blocker.id}</span>
              </div>
              <div className="modal-info-item">
                <span className="info-label">الهاتف:</span>
                <span className="info-value ltr-phone">{block.blocker.phone}</span>
              </div>
              <div className="modal-info-item">
                <span className="info-label">البريد:</span>
                <span className="info-value">{block.blocker.email}</span>
              </div>
              <div className="modal-info-item">
                <span className="info-label">حالة الحساب:</span>
                <span className="info-value">{getAccountStatusText(block.blocker.status)}</span>
              </div>
              <div className="modal-info-item">
                <span className="info-label">مرات الحظر:</span>
                <span className="info-value">{block.blocker.blocks_count ?? 0}</span>
              </div>
            </div>
          </div>

          <div className="modal-divider"></div>

          <div className="modal-section">
            <h3 className="modal-section-title">
              <span className="section-icon">🚫</span>
              بيانات المحظور
            </h3>
            <div className="modal-info-grid">
              <div className="modal-info-item">
                <span className="info-label">الاسم:</span>
                <span className="info-value">{block.blocked.name}</span>
              </div>
              <div className="modal-info-item">
                <span className="info-label">النوع:</span>
                {getUserTypeBadge(block.blocked.role)}
              </div>
              <div className="modal-info-item">
                <span className="info-label">رقم المستخدم:</span>
                <span className="info-value">#{block.blocked.id}</span>
              </div>
              <div className="modal-info-item">
                <span className="info-label">الهاتف:</span>
                <span className="info-value ltr-phone">{block.blocked.phone}</span>
              </div>
              <div className="modal-info-item">
                <span className="info-label">البريد:</span>
                <span className="info-value">{block.blocked.email}</span>
              </div>
              <div className="modal-info-item">
                <span className="info-label">حالة الحساب:</span>
                <span className="info-value">{getAccountStatusText(block.blocked.status)}</span>
              </div>
            </div>
          </div>

          <div className="modal-divider"></div>

          <div className="modal-section">
            <h3 className="modal-section-title">
              <span className="section-icon">📋</span>
              تفاصيل الحظر
            </h3>
            <div className="modal-info-grid">
              <div className="modal-info-item full-width">
                <span className="info-label">سبب الحظر:</span>
                <span className="info-value reason-text">{block.reason}</span>
              </div>
              <div className="modal-info-item">
                <span className="info-label">الحالة:</span>
                {getStatusBadge(block.status)}
              </div>
              <div className="modal-info-item">
                <span className="info-label">تاريخ الحظر:</span>
                <span className="info-value">
                  {formatDateTime(block.created_at)}
                </span>
              </div>
              <div className="modal-info-item">
                <span className="info-label">آخر تحديث:</span>
                <span className="info-value">
                  {formatDateTime(block.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="block-modal-footer">
          <button className="modal-btn close-modal-btn" onClick={onClose}>
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
