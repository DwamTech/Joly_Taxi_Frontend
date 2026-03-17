"use client";

import { useState, useEffect } from "react";
import { User } from "@/models/User";
import { VehicleType } from "@/models/VehicleType";
import "./CreateSubscriptionModal.css";

interface CreateSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSubscription: (userId: number, subscriptionData: SubscriptionData) => void;
  users: User[];
  vehicleTypes: VehicleType[];
  isLoading?: boolean;
}

interface SubscriptionData {
  months: number;
  vehicleTypeId: number;
}

export default function CreateSubscriptionModal({
  isOpen,
  onClose,
  onCreateSubscription,
  users,
  vehicleTypes,
  isLoading = false,
}: CreateSubscriptionModalProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    months: 1,
    vehicleTypeId: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // تصفية المستخدمين بناءً على البحث
  useEffect(() => {
    const driverUsers = users.filter((user) => user.role === "driver");
    if (!searchTerm.trim()) {
      setFilteredUsers(driverUsers);
    } else {
      const filtered = driverUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, users]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredUsers.length, currentPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (!subscriptionData.vehicleTypeId) return;
    if (!Number.isFinite(subscriptionData.months) || subscriptionData.months < 1) return;
    
    onCreateSubscription(selectedUser.id, {
      ...subscriptionData,
      months: Math.floor(subscriptionData.months),
    });
  };

  const handleClose = () => {
    setSelectedUser(null);
    setSubscriptionData({
      months: 1,
      vehicleTypeId: 0,
    });
    setSearchTerm("");
    setCurrentPage(1);
    onClose();
  };

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);
  const selectedVehicleType =
    vehicleTypes.find((vehicleType) => vehicleType.id === subscriptionData.vehicleTypeId) || null;
  const normalizedMonths = Number.isFinite(subscriptionData.months)
    ? Math.max(1, Math.floor(subscriptionData.months))
    : 1;
  const estimatedTotalPrice = selectedVehicleType
    ? Number(selectedVehicleType.base_fare) * normalizedMonths
    : 0;
  const estimatedDaysRemaining = normalizedMonths * 30;
  const estimatedCreatedAt = new Date().toLocaleDateString("ar-EG");

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

  if (!isOpen) return null;

  return (
    <div className="create-subscription-modal-overlay modal-overlay" onClick={handleClose}>
      <div className="create-subscription-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="modal-icon">💳</span>
            إنشاء اشتراك جديد
          </h2>
          <button className="modal-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          {!selectedUser ? (
            // مرحلة اختيار المستخدم
            <div className="user-selection-step">
              <div className="step-header">
                <h3>اختر المستخدم</h3>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="ابحث عن مستخدم..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <span className="search-icon">🔍</span>
                </div>
              </div>

              <div className="users-list-container">
                <div className="users-list">
                {filteredUsers.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">👤</span>
                    <p>لا يوجد سائقين</p>
                  </div>
                ) : (
                  paginatedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="user-item"
                      onClick={() => {
                        setSelectedUser(user);
                        setSubscriptionData((prev) => ({
                          ...prev,
                          vehicleTypeId: user.vehicle?.vehicle_type_id || 0,
                        }));
                      }}
                    >
                      <div className="user-avatar">
                        {user.name.charAt(0)}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{user.name}</div>
                        <div className="user-phone">{user.phone}</div>
                        {user.email && (
                          <div className="user-email">{user.email}</div>
                        )}
                      </div>
                      <div className="user-badges">
                        <span className={`role-badge role-${user.role}`}>
                          {getRoleLabel(user.role)}
                        </span>
                        <span className={`status-badge status-${user.status}`}>
                          {getStatusLabel(user.status)}
                        </span>
                      </div>
                      <div className="select-arrow">→</div>
                    </div>
                  ))
                )}
                </div>
                {filteredUsers.length > 0 && (
                  <div className="users-pagination">
                    <button
                      type="button"
                      className="pagination-btn"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      السابق
                    </button>
                    <div className="pagination-pages">
                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          className={`pagination-page ${page === currentPage ? "active" : ""}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="pagination-btn"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      التالي
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // مرحلة إنشاء الاشتراك
            <div className="subscription-creation-step">
              <div className="selected-user-info">
                <button 
                  className="back-btn"
                      onClick={() => {
                        setSelectedUser(null);
                        setSubscriptionData((prev) => ({
                          ...prev,
                          vehicleTypeId: 0,
                        }));
                      }}
                >
                  ← العودة لاختيار مستخدم آخر
                </button>
                <div className="user-card">
                  <div className="user-avatar large">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div className="user-info">
                    <h4>{selectedUser.name}</h4>
                    <p>{selectedUser.phone}</p>
                    {selectedUser.email && <p>{selectedUser.email}</p>}
                    <div className="user-badges">
                      <span className={`role-badge role-${selectedUser.role}`}>
                        {getRoleLabel(selectedUser.role)}
                      </span>
                      <span className={`status-badge status-${selectedUser.status}`}>
                        {getStatusLabel(selectedUser.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="subscription-form">
                <div className="form-group">
                  <label className="form-label">عدد الشهور</label>
                  <input
                    type="number"
                    className="form-input"
                    min={1}
                    step={1}
                    placeholder="مثال: 2"
                    value={subscriptionData.months}
                    onChange={(e) =>
                      setSubscriptionData({
                        ...subscriptionData,
                        months: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">نوع المركبة</label>
                  <select
                    className="form-input"
                    value={subscriptionData.vehicleTypeId || ""}
                    onChange={(e) =>
                      setSubscriptionData({
                        ...subscriptionData,
                        vehicleTypeId: Number(e.target.value),
                      })
                    }
                    required
                  >
                    <option value="">اختر نوع المركبة</option>
                    {vehicleTypes.map((vehicleType) => (
                      <option key={vehicleType.id} value={vehicleType.id}>
                        {vehicleType.name_ar || vehicleType.name_en}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="subscription-preview-grid">
                  <div className="preview-item">
                    <span className="preview-label">رقم الاشتراك</span>
                    <span className="preview-value">يتولد تلقائياً بعد الحفظ</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">السائق</span>
                    <span className="preview-value">{selectedUser.name}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">نوع المركبة</span>
                    <span className="preview-value">
                      {selectedVehicleType ? selectedVehicleType.name_ar || selectedVehicleType.name_en : "-"}
                    </span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">عدد الأشهر</span>
                    <span className="preview-value">{normalizedMonths} شهر</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">السعر الإجمالي</span>
                    <span className="preview-value">{estimatedTotalPrice} جنيه</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">الأيام المتبقية</span>
                    <span className="preview-value">{estimatedDaysRemaining} يوم</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">تاريخ الإنشاء</span>
                    <span className="preview-value">{estimatedCreatedAt}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">الحالة</span>
                    <span className="preview-value">نشط</span>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="btn-create"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="loading-spinner">⏳</span>
                        جاري الإنشاء...
                      </>
                    ) : (
                      <>
                        <span>💳</span>
                        إنشاء الاشتراك
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
