"use client";

import { useState } from "react";
import CustomSelect from "@/components/shared/CustomSelect/CustomSelect";
import "./PermissionsFilters.css";

export interface FilterValues {
  search: string;
  email: string;
  role: string;
  status: string;
}

interface PermissionsFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  resultsCount: number;
}

export default function PermissionsFilters({
  onFilterChange,
  resultsCount,
}: PermissionsFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    email: "",
    role: "all",
    status: "all",
  });

  const roleOptions = [
    { value: "all", label: "جميع الأدوار", icon: "👥" },
    { value: "super_admin", label: "مدير عام", icon: "⭐" },
    { value: "admin", label: "مدير", icon: "👨‍💼" },
    { value: "moderator", label: "مشرف", icon: "👤" },
  ];

  const statusOptions = [
    { value: "all", label: "جميع الحالات", icon: "📊" },
    { value: "active", label: "نشط", icon: "✅" },
    { value: "disabled", label: "معطل", icon: "🚫" },
  ];

  const handleInputChange = (field: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterValues = {
      search: "",
      email: "",
      role: "all",
      status: "all",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="permissions-filters">
      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">
            <span>🔍</span>
            البحث بالاسم
          </label>
          <input
            type="text"
            className="filter-input"
            placeholder="ابحث عن مسؤول..."
            value={filters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>📧</span>
            البريد الإلكتروني
          </label>
          <input
            type="text"
            className="filter-input"
            placeholder="example@jollytaxi.com"
            value={filters.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>🎭</span>
            الدور
          </label>
          <CustomSelect
            options={roleOptions}
            value={filters.role}
            onChange={(value) => handleInputChange("role", value)}
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
      </div>

      <div className="filters-actions">
        <div className="results-count">
          <span>النتائج:</span>
          <span className="results-number">{resultsCount}</span>
          <span>مسؤول</span>
        </div>
        <button className="clear-filters-btn" onClick={clearFilters}>
          مسح الفلاتر
        </button>
      </div>
    </div>
  );
}
