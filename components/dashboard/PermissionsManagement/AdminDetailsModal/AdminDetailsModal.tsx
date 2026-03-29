"use client";

import { useEffect, useState } from "react";
import { PermissionsService } from "@/services/permissionsService";
import { AdminApi } from "@/models/Permission";
import "./AdminDetailsModal.css";

interface Props {
  adminId: number;
  onClose: () => void;
}

const PAGE_ICONS: Record<string, string> = {
  home: "🏠", users: "👥", taxi: "🚕", clipboard: "📋",
  star: "⭐", warning: "⚠️", car: "🚗", bell: "🔔",
  settings: "⚙️", chart: "📊", map: "🗺️", lock: "🔐",
  ban: "🚫", document: "📄",
};

export default function AdminDetailsModal({ adminId, onClose }: Props) {
  const [data, setData] = useState<AdminApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    PermissionsService.getAdminById(adminId)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [adminId]);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin": return { label: "مدير عام", color: "#7b1fa2", bg: "#f3e5f5" };
      case "admin":       return { label: "مدير",     color: "#1976d2", bg: "#e3f2fd" };
      case "moderator":   return { label: "مشرف",     color: "#2e7d32", bg: "#e8f5e9" };
      default:            return { label: role,        color: "#555",    bg: "#f5f5f5" };
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="adm-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="adm-header">
          <h2 className="adm-title">تفاصيل المسؤول</h2>
          <button className="adm-close" onClick={onClose} aria-label="إغلاق">✕</button>
        </div>

        <div className="adm-body">
          {loading && (
            <div className="adm-loading">
              <div className="adm-spinner" />
              <span>جاري التحميل...</span>
            </div>
          )}

          {error && !loading && (
            <div className="adm-error">⚠️ {error}</div>
          )}

          {data && !loading && (() => {
            const role = getRoleLabel(data.role);
            return (
              <>
                {/* Profile section */}
                <div className="adm-profile">
                  <div className="adm-avatar">{getInitials(data.name)}</div>
                  <div className="adm-profile-info">
                    <h3 className="adm-name">{data.name}</h3>
                    <span className="adm-role-badge" style={{ color: role.color, background: role.bg }}>
                      {role.label}
                    </span>
                    <span className={`adm-status-badge ${data.status === "active" ? "active" : "disabled"}`}>
                      {data.status === "active" ? "✅ نشط" : "🚫 معطل"}
                    </span>
                  </div>
                </div>

                {/* Info grid */}
                <div className="adm-info-grid">
                  <div className="adm-info-item">
                    <span className="adm-info-icon">📧</span>
                    <div>
                      <div className="adm-info-label">البريد الإلكتروني</div>
                      <div className="adm-info-value" dir="ltr">{data.email}</div>
                    </div>
                  </div>
                  {data.phone && (
                    <div className="adm-info-item">
                      <span className="adm-info-icon">📱</span>
                      <div>
                        <div className="adm-info-label">رقم الهاتف</div>
                        <div className="adm-info-value" dir="ltr">{data.phone}</div>
                      </div>
                    </div>
                  )}
                  <div className="adm-info-item">
                    <span className="adm-info-icon">📅</span>
                    <div>
                      <div className="adm-info-label">تاريخ الإضافة</div>
                      <div className="adm-info-value">{data.created_at.split("T")[0]}</div>
                    </div>
                  </div>
                  <div className="adm-info-item">
                    <span className="adm-info-icon">🕐</span>
                    <div>
                      <div className="adm-info-label">آخر تسجيل دخول</div>
                      <div className="adm-info-value">{data.last_login.split("T")[0]}</div>
                    </div>
                  </div>
                </div>

                {/* Pages / Permissions */}
                <div className="adm-pages-section">
                  <h4 className="adm-pages-title">
                    🔐 الصفحات المتاحة
                    <span className="adm-pages-count">{data.pages.length}</span>
                  </h4>
                  <div className="adm-pages-grid">
                    {data.pages.map((page) => (
                      <div key={page.id} className="adm-page-item">
                        <span className="adm-page-icon">
                          {PAGE_ICONS[page.icon] ?? "📄"}
                        </span>
                        <span className="adm-page-name">{page.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
