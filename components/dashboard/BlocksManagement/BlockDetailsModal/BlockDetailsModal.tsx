"use client";

import "./BlockDetailsModal.css";

interface Block {
  id: number;
  blocker_user_id: number;
  blocker_name: string;
  blocker_type: string;
  blocked_user_id: number;
  blocked_name: string;
  blocked_type: string;
  reason: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface BlockDetailsModalProps {
  block: Block | null;
  onClose: () => void;
}

export default function BlockDetailsModal({
  block,
  onClose,
}: BlockDetailsModalProps) {
  if (!block) return null;

  const getUserTypeBadge = (type: string) => {
    if (type === "driver") {
      return <span className="modal-user-type-badge driver">🚗 سائق</span>;
    }
    return <span className="modal-user-type-badge rider">👤 راكب</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <span className="modal-status-badge status-active">🚫 نشط</span>;
    }
    return <span className="modal-status-badge status-cancelled">✅ ملغي</span>;
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
                <span className="info-value">{block.blocker_name}</span>
              </div>
              <div className="modal-info-item">
                <span className="info-label">النوع:</span>
                {getUserTypeBadge(block.blocker_type)}
              </div>
              <div className="modal-info-item">
                <span className="info-label">رقم المستخدم:</span>
                <span className="info-value">#{block.blocker_user_id}</span>
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
                <span className="info-value">{block.blocked_name}</span>
              </div>
              <div className="modal-info-item">
                <span className="info-label">النوع:</span>
                {getUserTypeBadge(block.blocked_type)}
              </div>
              <div className="modal-info-item">
                <span className="info-label">رقم المستخدم:</span>
                <span className="info-value">#{block.blocked_user_id}</span>
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
                  {new Date(block.created_at).toLocaleString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="modal-info-item">
                <span className="info-label">آخر تحديث:</span>
                <span className="info-value">
                  {new Date(block.updated_at).toLocaleString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
