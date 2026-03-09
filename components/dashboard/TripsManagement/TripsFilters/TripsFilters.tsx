"use client";

import { useState } from "react";
import CustomSelect from "../../UsersManagement/CustomSelect/CustomSelect";
import "./TripsFilters.css";

export interface TripFilterValues {
  search: string;
  riderName: string;
  driverName: string;
  status: string;
  vehicleType: string;
  priceMin: string;
  priceMax: string;
  requiresAc: string;
  sortBy: string;
}

interface TripsFiltersProps {
  onFilterChange: (filters: TripFilterValues) => void;
  resultsCount: number;
}

export default function TripsFilters({
  onFilterChange,
  resultsCount,
}: TripsFiltersProps) {
  const [filters, setFilters] = useState<TripFilterValues>({
    search: "",
    riderName: "",
    driverName: "",
    status: "all",
    vehicleType: "all",
    priceMin: "",
    priceMax: "",
    requiresAc: "all",
    sortBy: "newest",
  });

  const statusOptions = [
    { value: "all", label: "الكل", icon: "📋" },
    { value: "open", label: "مفتوحة", icon: "🔓" },
    { value: "accepted", label: "مقبولة", icon: "✅" },
    { value: "started", label: "جارية", icon: "🚗" },
    { value: "ended", label: "منتهية", icon: "✔️" },
    { value: "cancelled", label: "ملغاة", icon: "❌" },
    { value: "expired", label: "منتهية الصلاحية", icon: "⏰" },
  ];

  const vehicleOptions = [
    { value: "all", label: "الكل", icon: "🚕" },
    { value: "سيدان", label: "سيدان", icon: "🚗" },
    { value: "SUV", label: "SUV", icon: "🚙" },
    { value: "فان", label: "فان", icon: "🚐" },
  ];

  const acOptions = [
    { value: "all", label: "الكل", icon: "🔘" },
    { value: "yes", label: "نعم", icon: "❄️" },
    { value: "no", label: "لا", icon: "⭕" },
  ];

  const sortOptions = [
    { value: "newest", label: "الأحدث", icon: "🆕" },
    { value: "oldest", label: "الأقدم", icon: "📅" },
    { value: "highest_price", label: "الأعلى سعراً", icon: "💰" },
  ];

  const handleInputChange = (
    field: keyof TripFilterValues,
    value: string
  ) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: TripFilterValues = {
      search: "",
      riderName: "",
      driverName: "",
      status: "all",
      vehicleType: "all",
      priceMin: "",
      priceMax: "",
      requiresAc: "all",
      sortBy: "newest",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="trips-filters">
      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">
            <span>🔍</span>
            البحث برقم الرحلة
          </label>
          <input
            type="text"
            className="filter-input"
            placeholder="TRIP-2024-001"
            value={filters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>👤</span>
            اسم الراكب
          </label>
          <input
            type="text"
            className="filter-input"
            placeholder="ابحث عن راكب..."
            value={filters.riderName}
            onChange={(e) => handleInputChange("riderName", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>🚗</span>
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
            <span>💰</span>
            نطاق السعر (من)
          </label>
          <input
            type="number"
            className="filter-input"
            placeholder="0"
            value={filters.priceMin}
            onChange={(e) => handleInputChange("priceMin", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>💰</span>
            نطاق السعر (إلى)
          </label>
          <input
            type="number"
            className="filter-input"
            placeholder="1000"
            value={filters.priceMax}
            onChange={(e) => handleInputChange("priceMax", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span>❄️</span>
            يتطلب تكييف
          </label>
          <CustomSelect
            options={acOptions}
            value={filters.requiresAc}
            onChange={(value) => handleInputChange("requiresAc", value)}
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
          <span>رحلة</span>
        </div>
        <button className="clear-filters-btn" onClick={clearFilters}>
          مسح الفلاتر
        </button>
      </div>
    </div>
  );
}
