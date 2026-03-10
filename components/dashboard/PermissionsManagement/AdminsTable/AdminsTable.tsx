"use client";

import { Admin } from "@/models/Permission";
import "./AdminsTable.css";

interface AdminsTableProps {
  admins: Admin[];
  onEdit: (admin: Admin) => void;
  onToggleStatus: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
  onViewPermissions: (admin: Admin) => void;
}

export default function AdminsTable({
  admins,
  onEdit,
  onToggleStatus,
  onDelete,
  onViewPermissions,
}: AdminsTableProps) {
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

  const getStatusLabel = (status: string) => {
    return status === "active" ? "✅ نشط" : "🚫 معطل";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (admins.length === 0) {
    return (
      <div className="admins-table-container">
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <p>لا توجد نتائج</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admins-table-container">
      <table className="admins-table">
        <thead>
          <tr>
            <th>المسؤول</th>
            <th>البريد الإلكتروني</th>
            <th>رقم الهاتف</th>
            <th>الدور</th>
            <th>الحالة</th>
            <th>تاريخ الإضافة</th>
            <th>آخر تسجيل دخول</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td data-label="">
                <div className="admin-info">
                  <div className="admin-avatar">{getInitials(admin.name)}</div>
                  <div className="admin-details">
                    <span className="admin-name">{admin.name}</span>
                  </div>
                </div>
              </td>
              <td data-label="البريد الإلكتروني">{admin.email}</td>
              <td data-label="رقم الهاتف">{admin.phone}</td>
              <td data-label="الدور">
                <span className={`admin-role-badge role-${admin.role}`}>
                  {getRoleLabel(admin.role)}
                </span>
              </td>
              <td data-label="الحالة">
                <span className={`admin-status-badge status-${admin.status}`}>
                  {getStatusLabel(admin.status)}
                </span>
              </td>
              <td data-label="تاريخ الإضافة">{admin.created_at}</td>
              <td data-label="آخر تسجيل دخول">{admin.last_login}</td>
              <td data-label="الإجراءات">
                <div className="admin-actions">
                  <button
                    className="action-btn view-permissions-btn"
                    onClick={() => onViewPermissions(admin)}
                    title="عرض الصلاحيات"
                  >
                    🔐
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => onEdit(admin)}
                    title="تعديل"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn toggle-btn"
                    onClick={() => onToggleStatus(admin)}
                    title={admin.status === "active" ? "تعطيل" : "تفعيل"}
                  >
                    {admin.status === "active" ? "🔒" : "🔓"}
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => onDelete(admin)}
                    title="حذف"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
