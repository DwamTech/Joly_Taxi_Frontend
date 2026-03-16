"use client";

import { useState, useEffect } from "react";
import { User } from "@/models/User";
import "./CreateSubscriptionModal.css";

interface CreateSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSubscription: (userId: number, subscriptionData: SubscriptionData) => void;
  users: User[];
  isLoading?: boolean;
}

interface SubscriptionData {
  type: "monthly" | "quarterly" | "yearly";
  startDate: string;
  notes?: string;
}

export default function CreateSubscriptionModal({
  isOpen,
  onClose,
  onCreateSubscription,
  users,
  isLoading = false,
}: CreateSubscriptionModalProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    type: "monthly",
    startDate: new Date().toISOString().split('T')[0],
    notes: "",
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
    
    onCreateSubscription(selectedUser.id, subscriptionData);
  };

  const handleClose = () => {
    setSelectedUser(null);
    setSubscriptionData({
      type: "monthly",
      startDate: new Date().toISOString().split('T')[0],
      notes: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
    onClose();
  };

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

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

  const getSubscriptionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      monthly: "شهري",
      quarterly: "ربع سنوي",
      yearly: "سنوي",
    };
    return labels[type] || type;
  };

  const getSubscriptionPrice = (type: string) => {
    const prices: Record<string, number> = {
      monthly: 299,
      quarterly: 799,
      yearly: 2999,
    };
    return prices[type] || 0;
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
                      onClick={() => setSelectedUser(user)}
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
                  onClick={() => setSelectedUser(null)}
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
                  <label className="form-label">نوع الاشتراك</label>
                  <div className="subscription-types">
                    {["monthly", "quarterly", "yearly"].map((type) => (
                      <label key={type} className="subscription-type-option">
                        <input
                          type="radio"
                          name="subscriptionType"
                          value={type}
                          checked={subscriptionData.type === type}
                          onChange={(e) => setSubscriptionData({
                            ...subscriptionData,
                            type: e.target.value as "monthly" | "quarterly" | "yearly"
                          })}
                        />
                        <div className="option-content">
                          <span className="option-title">
                            {getSubscriptionTypeLabel(type)}
                          </span>
                          <span className="option-price">
                            {getSubscriptionPrice(type)} جنيه
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">تاريخ البداية</label>
                  <input
                    type="date"
                    className="form-input"
                    value={subscriptionData.startDate}
                    onChange={(e) => setSubscriptionData({
                      ...subscriptionData,
                      startDate: e.target.value
                    })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ملاحظات (اختياري)</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="أضف أي ملاحظات..."
                    value={subscriptionData.notes}
                    onChange={(e) => setSubscriptionData({
                      ...subscriptionData,
                      notes: e.target.value
                    })}
                  />
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
