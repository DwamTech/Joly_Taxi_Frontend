"use client";

import { useState, useEffect } from "react";
import CustomSelect from "../../UsersManagement/CustomSelect/CustomSelect";
import "./TagsFilters.css";

export interface TagFilterValues {
  search: string;
  appliesTo: string;
  type: string;
  status: string;
  starsRange: string;
  sortBy: string;
}

interface TagsFiltersProps {
  onFilterChange: (filters: TagFilterValues) => void;
  resultsCount: number;
}

export default function TagsFilters({
  onFilterChange,
  resultsCount,
}: TagsFiltersProps) {
  const [filters, setFilters] = useState<TagFilterValues>({
    search: "",
    appliesTo: "all",
    type: "all",
    status: "all",
    starsRange: "all",
    sortBy: "newest",
  });

  // تحميل الفلاتر المحفوظة عند فتح الصفحة
  useEffect(() => {
    const savedFilters = localStorage.getItem("tagsFilters");
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

  const appliesToOptions = [
    { value: "all", label: "الكل", icon: "👥" },
    { value: "driver", label: "سائق", icon: "🚗" },
    { value: "rider", label: "راكب", icon: "👤" },
    { value: "both", label: "كلاهما", icon: "🤝" },
  ];

  const typeOptions = [
    { value: "all", label: "الكل", icon: "🏷️" },
    { value: "positive", label: "إيجابي", icon: "👍" },
    { value: "negative", label: "سلبي", icon: "👎" },
  ];

  const statusOptions = [
    { value: "all", label: "الكل", icon: "📋" },
    { value: "active", label: "نشط", icon: "✅" },
    { value: "inactive", label: "غير نشط", icon: "❌" },
  ];

  const starsRangeOptions = [
    { value: "all", label: "الكل", icon: "⭐" },
    { value: "1", label: "1 نجمة", icon: "⭐" },
    { value: "2", label: "2 نجمة", icon: "⭐" },
    { value: "3", label: "3 نجوم", icon: "⭐" },
    { value: "4", label: "4 نجوم", icon: "⭐" },
    { value: "5", label: "5 نجوم", icon: "⭐" },
    { value: "1-2", label: "1-2 نجوم", icon: "⭐" },
    { value: "3-4", label: "3-4 نجوم", icon: "⭐" },
    { value: "4-5", label: "4-5 نجوم", icon: "⭐" },
  ];

  const sortOptions = [
    { value: "newest", label: "الأحدث", icon: "🆕" },
    { value: "oldest", label: "الأقدم", icon: "📅" },
    { value: "name_ar", label: "الاسم (عربي)", icon: "🔤" },
    { value: "name_en", label: "الاسم (إنجليزي)", icon: "🔤" },
    { value: "stars_asc", label: "النجوم (تصاعدي)", icon: "⭐" },
    { value: "stars_desc", label: "النجوم (تنازلي)", icon: "⭐" },
  ];

  const handleInputChange = (
    field: keyof TagFilterValues,
    value: string
  ) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    // حفظ الفلاتر فوراً في localStorage
    try {
      localStorage.setItem("tagsFilters", JSON.stringify(newFilters));
    } catch (error) {
      console.error("Error saving filters:", error);
    }
  };

  const clearFilters = () => {
    const defaultFilters: TagFilterValues = {
      search: "",
      appliesTo: "all",
      type: "all",
      status: "all",
      starsRange: "all",
      sortBy: "newest",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    // إزالة الفلاتر المحفوظة
    try {
      localStorage.removeItem("tagsFilters");
    } catch (error) {
      console.error("Error clearing filters:", error);
    }
  };

  return (
    <div className="tags-filters">
      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">
            <span>🔍</span>
            البحث في الوسوم
          </label>
          <input
            type="text"
            className="filter-input"
            placeholder="ابحث في النص العربي أو الإنجليزي..."
            value={filters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>👥</span>
            ينطبق على
          </label>
          <CustomSelect
            options={appliesToOptions}
            value={filters.appliesTo}
            onChange={(value) => handleInputChange("appliesTo", value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>🏷️</span>
            نوع التقييم
          </label>
          <CustomSelect
            options={typeOptions}
            value={filters.type}
            onChange={(value) => handleInputChange("type", value)}
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
            <span>⭐</span>
            نطاق النجوم
          </label>
          <CustomSelect
            options={starsRangeOptions}
            value={filters.starsRange}
            onChange={(value) => handleInputChange("starsRange", value)}
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
          <span>وسم</span>
        </div>
        <div className="action-buttons">
          <button className="clear-filters-btn" onClick={clearFilters}>
            <span className="btn-icon">🗑️</span>
            <span className="btn-text">مسح الفلاتر</span>
          </button>
        </div>
      </div>
    </div>
  );
}