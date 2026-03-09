"use client";

import { useState } from "react";
import CustomSelect from "../CustomSelect/CustomSelect";
import "./UsersFilters.css";

export interface FilterValues {
  search: string;
  phone: string;
  role: string;
  status: string;
  sortBy: string;
}

interface UsersFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  resultsCount: number;
}

export default function UsersFilters({
  onFilterChange,
  resultsCount,
}: UsersFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    phone: "",
    role: "all",
    status: "all",
    sortBy: "newest",
  });

  const statusOptions = [
    { value: "all", label: "الكل", icon: "👥" },
    { value: "active", label: "نشط", icon: "✅" },
    { value: "blocked", label: "محظور", icon: "🚫" },
  ];

  const sortOptions = [
    { value: "newest", label: "الأحدث", icon: "🆕" },
    { value: "oldest", label: "الأقدم", icon: "📅" },
    { value: "most_active", label: "الأكثر نشاطاً", icon: "⚡" },
  ];

  const handleInputChange = (
    field: keyof FilterValues,
    value: string
  ) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterValues = {
      search: "",
      phone: "",
      role: "all",
      status: "all",
      sortBy: "newest",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="users-filters">
      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">
            <span>🔍</span>
            البحث بالاسم
          </label>
          <input
            type="text"
            className="filter-input"
            placeholder="ابحث عن مستخدم..."
            value={filters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>📱</span>
            البحث برقم الهاتف
          </label>
          <input
            type="text"
            className="filter-input"
            placeholder="01xxxxxxxxx"
            value={filters.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
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
          <span>مستخدم</span>
        </div>
        <button className="clear-filters-btn" onClick={clearFilters}>
          مسح الفلاتر
        </button>
      </div>
    </div>
  );
}
