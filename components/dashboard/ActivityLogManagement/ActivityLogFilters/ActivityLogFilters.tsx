"use client";

import { useState } from "react";
import CustomSelect from "@/components/shared/CustomSelect/CustomSelect";
import "./ActivityLogFilters.css";

export interface FilterValues {
  search: string;
  actionType: string;
  adminId: string;
  dateFrom: string;
  dateTo: string;
}

interface ActivityLogFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  resultsCount: number;
  admins: Array<{ id: string; name: string }>;
}

export default function ActivityLogFilters({
  onFilterChange,
  resultsCount,
  admins,
}: ActivityLogFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    actionType: "all",
    adminId: "all",
    dateFrom: "",
    dateTo: "",
  });

  const actionTypeOptions = [
    { value: "all", label: "جميع الإجراءات", icon: "📊" },
    { value: "login", label: "تسجيل دخول", icon: "🔓" },
    { value: "logout", label: "تسجيل خروج", icon: "🔒" },
    { value: "create", label: "إضافة", icon: "➕" },
    { value: "update", label: "تعديل", icon: "✏️" },
    { value: "delete", label: "حذف", icon: "🗑️" },
    { value: "block", label: "حظر", icon: "🚫" },
    { value: "unblock", label: "إلغاء حظر", icon: "✅" },
    { value: "approve", label: "تفعيل", icon: "✔️" },
    { value: "reject", label: "رفض", icon: "❌" },
    { value: "send", label: "إرسال", icon: "📤" },
    { value: "settings", label: "إعدادات", icon: "⚙️" },
  ];

  const adminOptions = [
    { value: "all", label: "جميع المسؤولين", icon: "👥" },
    ...admins.map((admin) => ({
      value: admin.id,
      label: admin.name,
      icon: "👤",
    })),
  ];

  const handleInputChange = (field: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterValues = {
      search: "",
      actionType: "all",
      adminId: "all",
      dateFrom: "",
      dateTo: "",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="activity-log-filters">
      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">
            <span>🔍</span>
            البحث
          </label>
          <input
            type="text"
            className="filter-input"
            placeholder="ابحث في الإجراءات..."
            value={filters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>📋</span>
            نوع الإجراء
          </label>
          <CustomSelect
            options={actionTypeOptions}
            value={filters.actionType}
            onChange={(value) => handleInputChange("actionType", value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>👤</span>
            المسؤول
          </label>
          <CustomSelect
            options={adminOptions}
            value={filters.adminId}
            onChange={(value) => handleInputChange("adminId", value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>📅</span>
            من تاريخ
          </label>
          <input
            type="date"
            className="filter-input"
            value={filters.dateFrom}
            onChange={(e) => handleInputChange("dateFrom", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>📅</span>
            إلى تاريخ
          </label>
          <input
            type="date"
            className="filter-input"
            value={filters.dateTo}
            onChange={(e) => handleInputChange("dateTo", e.target.value)}
          />
        </div>
      </div>

      <div className="filters-actions">
        <div className="results-count">
          <span>النتائج:</span>
          <span className="results-number">{resultsCount}</span>
          <span>نشاط</span>
        </div>
        <button className="clear-filters-btn" onClick={clearFilters}>
          مسح الفلاتر
        </button>
      </div>
    </div>
  );
}
