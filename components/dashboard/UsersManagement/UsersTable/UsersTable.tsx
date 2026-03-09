"use client";

import { useState } from "react";
import { User } from "@/models/User";
import "./UsersTable.css";

interface UsersTableProps {
  users: User[];
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onBlockUser: (userId: number) => void;
  onDeleteUser: (userId: number) => void;
  onSendNotification: (userId: number) => void;
}

export default function UsersTable({
  users,
  onViewUser,
  onEditUser,
  onBlockUser,
  onDeleteUser,
  onSendNotification,
}: UsersTableProps) {
  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      user: "راكب",
      driver: "سائق",
      both: "كلاهما",
      admin: "إداري",
    };
    return labels[role] || role;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: "نشط",
      inactive: "غير نشط",
      blocked: "محظور",
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "الآن";
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    
    return date.toLocaleDateString("ar-EG");
  };

  return (
    <div className="users-table-container">
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>رقم الهاتف</th>
              <th>النوع</th>
              <th>الحالة</th>
              <th>تاريخ التسجيل</th>
              <th>آخر نشاط</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td data-label="">
                  <div className="user-name-cell">
                    <div className="user-avatar">
                      {user.name.charAt(0)}
                    </div>
                    <div className="user-info">
                      <span className="user-name">{user.name}</span>
                      {user.email && (
                        <span className="user-email">{user.email}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="phone-cell" data-label="رقم الهاتف">{user.phone}</td>
                <td data-label="الدور">
                  <span className={`role-badge role-${user.role}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td data-label="الحالة">
                  <span className={`status-badge status-${user.status}`}>
                    {getStatusLabel(user.status)}
                  </span>
                </td>
                <td className="date-cell" data-label="تاريخ التسجيل">{formatDate(user.created_at)}</td>
                <td className="activity-cell" data-label="آخر نشاط">
                  {formatDateTime(user.last_active_at)}
                </td>
                <td data-label="الإجراءات">
                  <div className="actions-cell">
                    <button
                      className="action-btn view-btn"
                      onClick={() => onViewUser(user)}
                      title="عرض التفاصيل"
                    >
                      📋
                    </button>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => onEditUser(user)}
                      title="تعديل البيانات"
                    >
                      ✏️
                    </button>
                    <button
                      className={`action-btn ${
                        user.status === "blocked" ? "unblock-btn" : "block-btn"
                      }`}
                      onClick={() => onBlockUser(user.id)}
                      title={
                        user.status === "blocked"
                          ? "إلغاء الحظر"
                          : "حظر المستخدم"
                      }
                    >
                      {user.status === "blocked" ? "✅" : "🚫"}
                    </button>
                    <button
                      className="action-btn notification-btn"
                      onClick={() => onSendNotification(user.id)}
                      title="إرسال إشعار"
                    >
                      🔔
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => onDeleteUser(user.id)}
                      title="حذف المستخدم"
                    >
                      <span style={{ color: '#dc3545', fontSize: '18px', fontWeight: 'bold' }}>✕</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
