"use client";

import { useState, useEffect } from "react";
import { Admin } from "@/models/Permission";
import permissionsData from "@/data/permissions/permissions-data.json";
import "./RolePermissionsModal.css";

interface RolePermissionsModalProps {
  admin: Admin | null;
  onClose: () => void;
  onSave: (role: string, permissions: Record<string, boolean>) => void;
}

interface PagePermission {
  key: string;
  name: string;
  icon: string;
  enabled: boolean;
}

export default function RolePermissionsModal({
  admin,
  onClose,
  onSave,
}: RolePermissionsModalProps) {
  const [permissions, setPermissions] = useState<PagePermission[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (admin) {
      const rolePermissions = permissionsData.rolePermissions.find(
        (rp) => rp.role === admin.role
      );

      if (rolePermissions) {
        const pages: PagePermission[] = [
          { key: "users", name: "إدارة المستخدمين", icon: "👥", enabled: rolePermissions.permissions.users },
          { key: "trips", name: "إدارة الرحلات", icon: "🚕", enabled: rolePermissions.permissions.trips },
          { key: "subscriptions", name: "إدارة الاشتراكات", icon: "📋", enabled: rolePermissions.permissions.subscriptions },
          { key: "ratings", name: "إدارة التقييمات", icon: "⭐", enabled: rolePermissions.permissions.ratings },
          { key: "reports", name: "إدارة البلاغات", icon: "⚠️", enabled: rolePermissions.permissions.reports },
          { key: "vehicle_types", name: "إدارة أنواع المركبات", icon: "🚗", enabled: rolePermissions.permissions.vehicle_types },
          { key: "notifications", name: "إدارة الإشعارات", icon: "🔔", enabled: rolePermissions.permissions.notifications },
          { key: "statistics", name: "التقارير والإحصائيات", icon: "📊", enabled: rolePermissions.permissions.statistics },
          { key: "map", name: "الخريطة المباشرة", icon: "🗺️", enabled: rolePermissions.permissions.map },
          { key: "permissions", name: "إدارة الصلاحيات", icon: "🔐", enabled: rolePermissions.permissions.permissions },
          { key: "blocks", name: "إدارة الحظر", icon: "🚫", enabled: rolePermissions.permissions.blocks },
          { key: "activity_log", name: "سجل النشاطات", icon: "📝", enabled: rolePermissions.permissions.activity_log },
          { key: "settings", name: "إعدادات الحساب", icon: "👤", enabled: rolePermissions.permissions.settings },
          { key: "general_settings", name: "الإعدادات العامة", icon: "⚙️", enabled: rolePermissions.permissions.general_settings },
        ];

        setPermissions(pages);
      }
    }
  }, [admin]);

  const togglePermission = (key: string) => {
    if (!isEditing) return;
    
    setPermissions((prev) =>
      prev.map((p) => (p.key === key ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleSave = () => {
    if (!admin) return;

    const permissionsObj: Record<string, boolean> = {};
    permissions.forEach((p) => {
      permissionsObj[p.key] = p.enabled;
    });

    onSave(admin.role, permissionsObj);
    setIsEditing(false);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin":
        return "⭐ مدير عام";
      case "admin":
        return "👨‍💼 مدير";
      case "moderator":
        return "👤 مشرف";
      default:
        return role;
    }
  };

  if (!admin) return null;

  return (
    <div className="role-permissions-modal-overlay" onClick={onClose}>
      <div
        className="role-permissions-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="role-permissions-modal-header">
          <div className="modal-header-content">
            <h2 className="role-permissions-modal-title">
              🔐 صلاحيات الدور
            </h2>
            <div className="admin-role-info">
              <span className="admin-role-name">{admin.name}</span>
              <span className={`admin-role-badge-modal role-${admin.role}`}>
                {getRoleLabel(admin.role)}
              </span>
            </div>
          </div>
          <button className="role-permissions-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="role-permissions-modal-body">
          <div className="permissions-actions-bar">
            {!isEditing ? (
              <button
                className="edit-permissions-btn"
                onClick={() => setIsEditing(true)}
              >
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
            {permissions.map((permission) => (
              <div
                key={permission.key}
                className={`permission-card ${
                  permission.enabled ? "enabled" : "disabled"
                } ${isEditing ? "editable" : ""}`}
                onClick={() => togglePermission(permission.key)}
              >
                <div className="permission-icon">{permission.icon}</div>
                <div className="permission-info">
                  <span className="permission-name">{permission.name}</span>
                  <span className="permission-status">
                    {permission.enabled ? "✅ متاح" : "🚫 غير متاح"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="role-permissions-modal-footer">
          {isEditing ? (
            <>
              <button
                className="modal-btn modal-btn-cancel"
                onClick={() => {
                  setIsEditing(false);
                  // Reset permissions
                  if (admin) {
                    const rolePermissions = permissionsData.rolePermissions.find(
                      (rp) => rp.role === admin.role
                    );
                    if (rolePermissions) {
                      const pages: PagePermission[] = [
                        { key: "users", name: "إدارة المستخدمين", icon: "👥", enabled: rolePermissions.permissions.users },
                        { key: "trips", name: "إدارة الرحلات", icon: "🚕", enabled: rolePermissions.permissions.trips },
                        { key: "subscriptions", name: "إدارة الاشتراكات", icon: "📋", enabled: rolePermissions.permissions.subscriptions },
                        { key: "ratings", name: "إدارة التقييمات", icon: "⭐", enabled: rolePermissions.permissions.ratings },
                        { key: "reports", name: "إدارة البلاغات", icon: "⚠️", enabled: rolePermissions.permissions.reports },
                        { key: "vehicle_types", name: "إدارة أنواع المركبات", icon: "🚗", enabled: rolePermissions.permissions.vehicle_types },
                        { key: "notifications", name: "إدارة الإشعارات", icon: "🔔", enabled: rolePermissions.permissions.notifications },
                        { key: "statistics", name: "التقارير والإحصائيات", icon: "📊", enabled: rolePermissions.permissions.statistics },
                        { key: "map", name: "الخريطة المباشرة", icon: "🗺️", enabled: rolePermissions.permissions.map },
                        { key: "permissions", name: "إدارة الصلاحيات", icon: "🔐", enabled: rolePermissions.permissions.permissions },
                        { key: "blocks", name: "إدارة الحظر", icon: "🚫", enabled: rolePermissions.permissions.blocks },
                        { key: "activity_log", name: "سجل النشاطات", icon: "📝", enabled: rolePermissions.permissions.activity_log },
                        { key: "settings", name: "إعدادات الحساب", icon: "👤", enabled: rolePermissions.permissions.settings },
                        { key: "general_settings", name: "الإعدادات العامة", icon: "⚙️", enabled: rolePermissions.permissions.general_settings },
                      ];
                      setPermissions(pages);
                    }
                  }
                }}
              >
                إلغاء
              </button>
              <button className="modal-btn modal-btn-save" onClick={handleSave}>
                💾 حفظ التغييرات
              </button>
            </>
          ) : (
            <button className="modal-btn modal-btn-close" onClick={onClose}>
              إغلاق
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
