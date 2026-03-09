"use client";

import { useState } from "react";
import CustomSelect from "@/components/shared/CustomSelect/CustomSelect";
import "./BlocksFilters.css";

export interface FilterValues {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

interface BlocksFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  resultsCount: number;
}

export default function BlocksFilters({
  onFilterChange,
  resultsCount,
}: BlocksFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });

  const statusOptions = [
    { value: "all", label: "جميع الحالات", icon: "📋" },
    { value: "active", label: "نشط", icon: "🚫" },
    { value: "cancelled", label: "ملغي", icon: "✅" },
  ];

  const handleInputChange = (field: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterValues = {
      search: "",
      status: "all",
      dateFrom: "",
      dateTo: "",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="blocks-filters">
      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">
            <span>🔍</span>
            البحث
          </label>
          <input
            type="text"
            className="filter-input"
            placeholder="ابحث باسم الحاظر أو المحظور..."
            value={filters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
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
          <span>حالة حظر</span>
        </div>
        <button className="clear-filters-btn" onClick={clearFilters}>
          مسح الفلاتر
        </button>
      </div>
    </div>
  );
}
