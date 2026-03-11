"use client";

import { useState } from "react";
import CustomSelect from "../../UsersManagement/CustomSelect/CustomSelect";
import "./ReportsFilters.css";

export interface FilterValues {
  search: string;
  status: string;
  reason: string;
  priority: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
}

interface ReportsFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  resultsCount: number;
}

export default function ReportsFilters({
  onFilterChange,
  resultsCount,
}: ReportsFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    status: "all",
    reason: "all",
    priority: "all",
    dateFrom: "",
    dateTo: "",
    sortBy: "newest",
  });

  const statusOptions = [
    { value: "all", label: "الكل", icon: "📋" },
    { value: "pending", label: "معلق", icon: "⏳" },
    { value: "resolved", label: "محلول", icon: "✅" },
  ];

  const reasonOptions = [
    { value: "all", label: "الكل", icon: "📝" },
    { value: "سلوك غير لائق", label: "سلوك غير لائق", icon: "⚠️" },
    { value: "تأخير", label: "تأخير", icon: "⏰" },
    { value: "إلغاء متكرر", label: "إلغاء متكرر", icon: "🚫" },
    { value: "قيادة خطرة", label: "قيادة خطرة", icon: "⚡" },
    { value: "نظافة السيارة", label: "نظافة السيارة", icon: "🚿" },
    { value: "احتيال", label: "احتيال", icon: "🔴" },
    { value: "أخرى", label: "أخرى", icon: "📌" },
  ];

  const priorityOptions = [
    { value: "all", label: "الكل", icon: "🎯" },
    { value: "high", label: "عالية", icon: "🔴" },
    { value: "medium", label: "متوسطة", icon: "🔴" },
    { value: "low", label: "منخفضة", icon: "🔴" },
  ];

  const sortOptions = [
    { value: "newest", label: "الأحدث", icon: "🆕" },
    { value: "oldest", label: "الأقدم", icon: "📅" },
    // { value: "priority", label: "الأولوية", icon: "⚡" },
  ];

  const handleChange = (field: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterValues = {
      search: "",
      status: "all",
      reason: "all",
      priority: "all",
      dateFrom: "",
      dateTo: "",
      sortBy: "newest",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="reports-filters">
      <div className="filters-header">
        <h3 className="filters-title">🔍 البحث والفلترة</h3>
        <div className="results-count">
          النتائج: <span>{resultsCount}</span>
        </div>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label>🔍 البحث</label>
          <input
            type="text"
            placeholder="رقم البلاغ، اسم المُبلِّغ، اسم المُبلَّغ عنه..."
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>📊 الحالة</label>
          <CustomSelect
            options={statusOptions}
            value={filters.status}
            onChange={(value) => handleChange("status", value)}
          />
        </div>

        <div className="filter-group">
          <label>📝 السبب</label>
          <CustomSelect
            options={reasonOptions}
            value={filters.reason}
            onChange={(value) => handleChange("reason", value)}
          />
        </div>

        {/*<div className="filter-group">
          <label>🎯 الأولوية</label>
          <CustomSelect
            options={priorityOptions}
            value={filters.priority}
            onChange={(value) => handleChange("priority", value)}
          />
        </div>*/}

        <div className="filter-group">
          <label>📅 من تاريخ</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleChange("dateFrom", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>📅 إلى تاريخ</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleChange("dateTo", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>🔄 الترتيب</label>
          <CustomSelect
            options={sortOptions}
            value={filters.sortBy}
            onChange={(value) => handleChange("sortBy", value)}
          />
        </div>

        <div className="filter-group">
          <button className="reset-btn" onClick={handleReset}>
            🔄 إعادة تعيين
          </button>
        </div>
      </div>
    </div>
  );
}
