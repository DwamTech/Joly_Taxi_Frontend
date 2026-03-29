"use client";

import { useState } from "react";
import { AdminApi, AdminListPagination } from "@/models/Permission";
import TablePagination from "@/components/shared/TablePagination/TablePagination";
import AdminDetailsModal from "../AdminDetailsModal/AdminDetailsModal";
import "./AdminsTable.css";

interface AdminsTableProps {
  admins: AdminApi[];
  pagination: AdminListPagination;
  onPageChange: (page: number) => void;
  onEdit: (admin: AdminApi) => void;
  onToggleStatus: (admin: AdminApi) => void;
  onDelete: (admin: AdminApi) => void;
  onViewPermissions: (admin: AdminApi) => void;
}

export default function AdminsTable({
  admins,
  pagination,
  onPageChange,
  onEdit,
  onToggleStatus,
  onDelete,
  onViewPermissions,
}: AdminsTableProps) {
  const [detailsId, setDetailsId] = useState<number | null>(null);
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin": return "⭐ مدير عام";
      case "admin":       return "👨‍💼 مدير";
      case "moderator":   return "👤 مشرف";
      default:            return role;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":   return "✅ نشط";
      case "inactive": return "⏸️ غير نشط";
      case "blocked":  return "🚫 محظور";
      default:         return status;
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const { current_page, last_page, per_page, total } = pagination;
  const from = (current_page - 1) * per_page + 1;
  const to   = Math.min(current_page * per_page, total);

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
            <th>آخر تسجيل دخول</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td data-label="المسؤول">
                <div className="admin-info">
                  <div className="admin-avatar">{getInitials(admin.name)}</div>
                  <div className="admin-details">
                    <span className="admin-name">{admin.name}</span>
                  </div>
                </div>
              </td>
              <td data-label="البريد الإلكتروني">{admin.email}</td>
              <td data-label="رقم الهاتف" dir="ltr">{admin.phone ?? "—"}</td>
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
              <td data-label="آخر تسجيل دخول">
                <div className="date-cell">
                  <span>{admin.last_login.split(" ")[0]}</span>
                  <span className="time-text">{admin.last_login.split(" ")[1] ?? ""}</span>
                </div>
              </td>
              <td data-label="الإجراءات">
                <div className="admin-actions">
                  <button className="action-btn details-btn"          onClick={() => setDetailsId(admin.id)}   title="عرض التفاصيل">👁️</button>
                  <button className="action-btn view-permissions-btn" onClick={() => onViewPermissions(admin)} title="عرض الصلاحيات">🔐</button>
                  <button className="action-btn edit-btn"             onClick={() => onEdit(admin)}            title="تعديل">✏️</button>
                  <button className="action-btn toggle-btn"           onClick={() => onToggleStatus(admin)}    title={admin.status === "active" ? "تعطيل" : "تفعيل"}>
                    {admin.status === "active" ? "🔒" : "🔓"}
                  </button>
                  <button className="action-btn delete-btn"           onClick={() => onDelete(admin)}          title="حذف">🗑️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-pagination-wrapper">
        <span className="pagination-info-text">عرض {from}–{to} من {total} مسؤول</span>
        <TablePagination
          page={current_page}
          lastPage={last_page}
          total={total}
          perPage={per_page}
          onPageChange={onPageChange}
        />
      </div>

      {detailsId !== null && (
        <AdminDetailsModal adminId={detailsId} onClose={() => setDetailsId(null)} />
      )}
    </div>
  );
}
