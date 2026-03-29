"use client";

import { useState, useEffect } from "react";
import { PermissionsService } from "@/services/permissionsService";
import { AdminApi, AdminPage } from "@/models/Permission";
import "./RolePermissionsModal.css";

const PAGE_ICONS: Record<string, string> = {
  home: "🏠", users: "👥", taxi: "🚕", clipboard: "📋",
  star: "⭐", warning: "⚠️", car: "🚗", bell: "🔔",
  settings: "⚙️", chart: "📊", map: "🗺️", lock: "🔐",
  ban: "🚫", document: "📝",
};

interface PagePermission extends AdminPage {
  enabled: boolean;
}

interface RolePermissionsModalProps {
  admin: AdminApi | null;
  onClose: () => void;
  onSave: (updatedAdmin: AdminApi) => void;
}

export default function RolePermissionsModal({ admin, onClose, onSave }: RolePermissionsModalProps) {
  const [permissions, setPermissions] = useState<PagePermission[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // keep original for cancel
  const [original, setOriginal] = useState<PagePermission[]>([]);

  useEffect(() => {
    if (!admin) return;
    setLoading(true);
    setError(null);

    PermissionsService.getAvailablePages()
      .then((allPages) => {
        const adminPageIds = new Set((admin.pages ?? []).map((p) => p.id));
        const mapped: PagePermission[] = allPages.map((page) => ({
          ...page,
          enabled: adminPageIds.has(page.id),
        }));
        setPermissions(mapped);
        setOriginal(mapped);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [admin]);

  const togglePermission = (id: number) => {
    if (!isEditing) return;
    setPermissions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!admin) return;
    setSaving(true);
    try {
      const pageIds = permissions.filter((p) => p.enabled).map((p) => p.id);
      const updatedAdmin = await PermissionsService.updateAdminPermissions(admin.id, admin.role, pageIds);
      setOriginal(permissions);
      setIsEditing(false);
      onSave(updatedAdmin);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setPermissions(original);
    setIsEditing(false);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin": return "⭐ مدير عام";
      case "admin":       return "👨‍💼 مدير";
      case "moderator":   return "👤 مشرف";
      default:            return role;
    }
  };

  if (!admin) return null;

  return (
    <div className="role-permissions-modal-overlay" onClick={onClose}>
      <div className="role-permissions-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="role-permissions-modal-header">
          <div className="modal-header-content">
            <h2 className="role-permissions-modal-title">🔐 صلاحيات الدور</h2>
            <div className="admin-role-info">
              <span className="admin-role-name">{admin.name}</span>
              <span className={`admin-role-badge-modal role-${admin.role}`}>
                {getRoleLabel(admin.role)}
              </span>
            </div>
          </div>
          <button className="role-permissions-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="role-permissions-modal-body">
          {loading && (
            <div className="rpm-loading">
              <div className="rpm-spinner" />
              <span>جاري تحميل الصلاحيات...</span>
            </div>
          )}

          {error && !loading && (
            <div className="rpm-error">⚠️ {error}</div>
          )}

          {!loading && !error && (
            <>
              <div className="permissions-actions-bar">
                {!isEditing ? (
                  <button className="edit-permissions-btn" onClick={() => setIsEditing(true)}>
                    ✏️ تعديل الصلاحيات
                  </button>
                ) : (
                  <div className="editing-info">
                    <span className="editing-badge">🔄 وضع التعديل</span>
                    <span className="editing-hint">اضغط على البطاقات لتغيير الصلاحيات</span>
                  </div>
                )}
              </div>

              <div className="permissions-grid">
                {permissions.map((p) => (
                  <div
                    key={p.id}
                    className={`permission-card ${p.enabled ? "enabled" : "disabled"} ${isEditing ? "editable" : ""}`}
                    onClick={() => togglePermission(p.id)}
                  >
                    <div className="permission-icon">{PAGE_ICONS[p.icon] ?? "📄"}</div>
                    <div className="permission-info">
                      <span className="permission-name">{p.name}</span>
                      <span className="permission-status">
                        {p.enabled ? "✅ متاح" : "🚫 غير متاح"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="role-permissions-modal-footer">
          {isEditing ? (
            <>
              <button className="modal-btn modal-btn-cancel" onClick={handleCancel}>إلغاء</button>
              <button className="modal-btn modal-btn-save" onClick={handleSave} disabled={saving}>
                {saving ? <><span className="rpm-save-spinner" /> جاري الحفظ...</> : "💾 حفظ التغييرات"}
              </button>
            </>
          ) : (
            <button className="modal-btn modal-btn-close" onClick={onClose}>إغلاق</button>
          )}
        </div>
      </div>
    </div>
  );
}
