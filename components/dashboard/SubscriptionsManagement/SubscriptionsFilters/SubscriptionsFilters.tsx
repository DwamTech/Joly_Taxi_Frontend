"use client";

import { useState, useEffect } from "react";
import CustomSelect from "../../UsersManagement/CustomSelect/CustomSelect";
import "./SubscriptionsFilters.css";

export interface SubscriptionFilterValues {
  search: string;
  driverName: string;
  status: string;
  vehicleType: string;
  sortBy: string;
}

interface SubscriptionsFiltersProps {
  onFilterChange: (filters: SubscriptionFilterValues) => void;
  resultsCount: number;
  onSendNotification: () => void;
  isSendingNotification?: boolean;
  onOpenCreateSubscription: () => void;
}

export default function SubscriptionsFilters({
  onFilterChange,
  resultsCount,
  onSendNotification,
  isSendingNotification = false,
  onOpenCreateSubscription,
}: SubscriptionsFiltersProps) {
  const [filters, setFilters] = useState<SubscriptionFilterValues>({
    search: "",
    driverName: "",
    status: "all",
    vehicleType: "all",
    sortBy: "newest",
  });

  // تحميل الفلاتر المحفوظة عند فتح الصفحة
  useEffect(() => {
    const savedFilters = localStorage.getItem("subscriptionsFilters");
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);
        setFilters(parsed);
        onFilterChange(parsed);
      } catch (error) {
        console.error("Error loading saved filters:", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // تشغيل مرة واحدة فقط عند التحميل

  const statusOptions = [
    { value: "all", label: "الكل", icon: "📋" },
    { value: "pending", label: "قيد المراجعة", icon: "⏳" },
    { value: "active", label: "نشط", icon: "✅" },
    { value: "expired", label: "منتهي", icon: "⏰" },
    { value: "rejected", label: "مرفوض", icon: "❌" },
    { value: "cancelled", label: "ملغي", icon: "🚫" },
  ];

  const vehicleOptions = [
    { value: "all", label: "الكل", icon: "🚕" },
    { value: "سيدان", label: "سيدان", icon: "🚗" },
    { value: "SUV", label: "SUV", icon: "🚙" },
    { value: "فان", label: "فان", icon: "🚐" },
  ];

  const sortOptions = [
    { value: "newest", label: "الأحدث", icon: "🆕" },
    { value: "oldest", label: "الأقدم", icon: "📅" },
    { value: "expiring_soon", label: "الأقرب للانتهاء", icon: "⏰" },
  ];

  const handleInputChange = (
    field: keyof SubscriptionFilterValues,
    value: string
  ) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    // حفظ الفلاتر فوراً في localStorage
    try {
      localStorage.setItem("subscriptionsFilters", JSON.stringify(newFilters));
    } catch (error) {
      console.error("Error saving filters:", error);
    }
  };

  const clearFilters = () => {
    const defaultFilters: SubscriptionFilterValues = {
      search: "",
      driverName: "",
      status: "all",
      vehicleType: "all",
      sortBy: "newest",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    // إزالة الفلاتر المحفوظة
    try {
      localStorage.removeItem("subscriptionsFilters");
    } catch (error) {
      console.error("Error clearing filters:", error);
    }
  };

  return (
    <div className="subscriptions-filters">
      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">
            <span>🔍</span>
            البحث برقم الاشتراك
          </label>
          <input
            type="text"
            className="filter-input"
            placeholder="SUB-2024-001"
            value={filters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>👤</span>
            اسم السائق
          </label>
          <input
            type="text"
            className="filter-input"
            placeholder="ابحث عن سائق..."
            value={filters.driverName}
            onChange={(e) => handleInputChange("driverName", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>📊</span>
            الحالة
          </label>
          <CustomSelect
            options={statusOptions}
            value={filters.status}
            onChange={(value) => handleInputChange("status", value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>🚕</span>
            نوع المركبة
          </label>
          <CustomSelect
            options={vehicleOptions}
            value={filters.vehicleType}
            onChange={(value) => handleInputChange("vehicleType", value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>🔄</span>
            الترتيب
          </label>
          <CustomSelect
            options={sortOptions}
            value={filters.sortBy}
            onChange={(value) => handleInputChange("sortBy", value)}
          />
        </div>
      </div>

      <div className="filters-actions">
        <div className="results-count">
          <span>النتائج:</span>
          <span className="results-number">{resultsCount}</span>
          <span>اشتراك</span>
        </div>
        <div className="action-buttons">
          <button 
            className="create-subscription-btn"
            onClick={onOpenCreateSubscription}
          >
            <span className="btn-icon">💳</span>
            <span className="btn-text">إنشاء اشتراك</span>
          </button>
          <button 
            className={`send-notification-btn ${isSendingNotification ? 'loading' : ''}`}
            onClick={onSendNotification}
            disabled={isSendingNotification}
          >
            <span className="btn-icon">
              {isSendingNotification ? '⏳' : '🔔'}
            </span>
            <span className="btn-text">
              {isSendingNotification ? 'جاري الإرسال...' : 'إرسال إشعار للتنبية بتجديد الاشتراك'}
            </span>
          </button>
          <button className="clear-filters-btn" onClick={clearFilters}>
            <span className="btn-icon">🗑️</span>
            <span className="btn-text">مسح الفلاتر</span>
          </button>
        </div>
      </div>
    </div>
  );
}