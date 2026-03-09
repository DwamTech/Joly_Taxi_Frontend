"use client";

import { useState } from "react";
import CustomSelect from "../../UsersManagement/CustomSelect/CustomSelect";
import "./RatingsFilters.css";

interface RatingsFiltersProps {
  onFilter: (filters: any) => void;
  resultsCount: number;
}

export default function RatingsFilters({ onFilter, resultsCount }: RatingsFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    raterType: "all",
    stars: "all",
    hasComment: "all",
    sortBy: "newest",
  });

  const raterTypeOptions = [
    { value: "all", label: "الكل", icon: "👥" },
    { value: "rider", label: "راكب", icon: "👤" },
    { value: "driver", label: "سائق", icon: "🚗" },
  ];

  const starsOptions = [
    { value: "all", label: "الكل", icon: "⭐" },
    { value: "5", label: "⭐⭐⭐⭐⭐", icon: "🌟" },
    { value: "4", label: "⭐⭐⭐⭐", icon: "✨" },
    { value: "3", label: "⭐⭐⭐", icon: "💫" },
    { value: "2", label: "⭐⭐", icon: "⭐" },
    { value: "1", label: "⭐", icon: "🔸" },
  ];

  const commentOptions = [
    { value: "all", label: "الكل", icon: "📋" },
    { value: "yes", label: "نعم", icon: "💬" },
    { value: "no", label: "لا", icon: "🚫" },
  ];

  const sortOptions = [
    { value: "newest", label: "الأحدث", icon: "🆕" },
    { value: "oldest", label: "الأقدم", icon: "📅" },
    { value: "highest", label: "الأعلى تقييماً", icon: "⬆️" },
    { value: "lowest", label: "الأقل تقييماً", icon: "⬇️" },
  ];

  const handleChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="ratings-filters">
      <div className="filters-header">
        <h3 className="filters-title">🔍 البحث والفلترة</h3>
        <span className="results-count">{resultsCount} نتيجة</span>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">
            <span>🔍</span>
            البحث
          </label>
          <input
            type="text"
            className="filter-input"
            placeholder="رقم الرحلة، اسم المُقيم، اسم المُقيَّم..."
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>👥</span>
            نوع المُقيِّم
          </label>
          <CustomSelect
            options={raterTypeOptions}
            value={filters.raterType}
            onChange={(value) => handleChange("raterType", value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>⭐</span>
            عدد النجوم
          </label>
          <CustomSelect
            options={starsOptions}
            value={filters.stars}
            onChange={(value) => handleChange("stars", value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>💬</span>
            وجود تعليق
          </label>
          <CustomSelect
            options={commentOptions}
            value={filters.hasComment}
            onChange={(value) => handleChange("hasComment", value)}
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
            onChange={(value) => handleChange("sortBy", value)}
          />
        </div>
      </div>
    </div>
  );
}
