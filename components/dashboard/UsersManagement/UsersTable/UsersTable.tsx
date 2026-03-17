"use client";

import { useState } from "react";
import { User } from "@/models/User";
import { useToast } from "@/components/Toast/ToastContainer";
import "./UsersTable.css";

interface UsersTableProps {
  users: User[];
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onBlockUser: (userId: number, reason?: string) => void;
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
  const { showToast } = useToast();
  const [blockReasonModal, setBlockReasonModal] = useState<{
    isOpen: boolean;
    userId: number | null;
    userName: string;
  }>({
    isOpen: false,
    userId: null,
    userName: "",
  });
  const [blockReason, setBlockReason] = useState("");
  const getRoleLabel = (role: string) => {
    console.log('Getting role label for:', role);
    const labels: Record<string, string> = {
      user: "راكب",
      driver: "سائق",
      both: "كلاهما",
      admin: "إداري",
    };
    const label = labels[role] || role;
    console.log('Role label result:', label);
    return label;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: "نشط",
      inactive: "غير نشط",
      blocked: "محظور",
    };
    return labels[status] || status;
  };

  const getProfileStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "قيد المراجعة",
      approved: "موافق عليه",
      rejected: "مرفوض",
    };
    return labels[status] || status;
  };

  const getUserProfileStatus = (user: User) => {
    if (user.role !== "driver" && user.role !== "both") {
      return null;
    }
    return (
      user.driver_profile?.profile_status ||
      user.driver_profile?.verification_status ||
      "pending"
    );
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

  const handleBlockClick = (user: User) => {
    if (user.status === "blocked") {
      onBlockUser(user.id);
      return;
    }

    setBlockReasonModal({
      isOpen: true,
      userId: user.id,
      userName: user.name,
    });
    setBlockReason("");
  };

  const closeBlockReasonModal = () => {
    setBlockReasonModal({
      isOpen: false,
      userId: null,
      userName: "",
    });
    setBlockReason("");
  };

  const confirmBlockWithReason = () => {
    if (!blockReason.trim()) {
      showToast("لازم تكتبي سبب الحظر قبل التأكيد", "error");
      return;
    }

    if (!blockReasonModal.userId) {
      showToast("حدث خطأ أثناء تحديد المستخدم", "error");
      return;
    }

    onBlockUser(blockReasonModal.userId, blockReason.trim());
    closeBlockReasonModal();
  };

  return (
    <>
      <div className="users-table-container">
        <div className="table-wrapper">
          <table className="users-table">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>رقم الهاتف</th>
              <th>النوع</th>
              <th>الحالة</th>
              <th>حالة البروفايل</th>
              <th>تاريخ التسجيل</th>
              <th>آخر نشاط</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              // إضافة console.log لتتبع البيانات في الجدول
              console.log('Rendering user in table:', { name: user.name, role: user.role });
              const profileStatus = getUserProfileStatus(user);
              
              return (
              <tr key={user.id}>
                <td data-label="">
                  <div className="user-name-cell">
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
                <td data-label="حالة البروفايل">
                  {profileStatus ? (
                    <span className={`status-badge profile-status-${profileStatus}`}>
                      {getProfileStatusLabel(profileStatus)}
                    </span>
                  ) : (
                    <span className="status-badge profile-status-na">غير متاح</span>
                  )}
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
                      onClick={() => handleBlockClick(user)}
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
              );
            })}
          </tbody>
          </table>
        </div>
      </div>
      {blockReasonModal.isOpen && (
        <div className="users-table-block-reason-overlay" onClick={closeBlockReasonModal}>
          <div className="users-table-block-reason-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="users-table-block-reason-title">سبب الحظر</h3>
            <p className="users-table-block-reason-subtitle">
              اكتبي سبب حظر المستخدم {blockReasonModal.userName}
            </p>
            <textarea
              className="users-table-block-reason-input"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="مثال: إساءة استخدام التطبيق أو مخالفات متكررة..."
              rows={4}
            />
            <div className="users-table-block-reason-actions">
              <button
                type="button"
                className="users-table-block-reason-cancel"
                onClick={closeBlockReasonModal}
              >
                إلغاء
              </button>
              <button
                type="button"
                className="users-table-block-reason-confirm"
                onClick={confirmBlockWithReason}
              >
                تأكيد الحظر
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
