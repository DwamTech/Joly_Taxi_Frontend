"use client";

import { useState, useEffect } from "react";
import CustomSelect from "../../UsersManagement/CustomSelect/CustomSelect";
import "./TripsFilters.css";
import { getVehicleTypes } from "@/services/tripsService";

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
  // Load initial filters from localStorage or use defaults
  const getInitialFilters = (): TripFilterValues => {
    if (typeof window !== 'undefined') {
      const savedFilters = localStorage.getItem('tripsFilters');
      if (savedFilters) {
        try {
          return JSON.parse(savedFilters);
        } catch (error) {
          console.error('Error parsing saved filters:', error);
        }
      }
    }
    
    return {
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
  };

  const [filters, setFilters] = useState<TripFilterValues>(getInitialFilters);
  const [savedResultsCount, setSavedResultsCount] = useState<number>(0);
  const [vehicleOptions, setVehicleOptions] = useState<{ value: string; label: string; icon?: string }[]>([
    { value: "all", label: "الكل", icon: "🚕" },
  ]);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tripsFilters', JSON.stringify(filters));
    }
  }, [filters]);

  // Save results count to localStorage
  useEffect(() => {
    if (resultsCount !== undefined && resultsCount >= 0) {
      setSavedResultsCount(resultsCount);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tripsResultsCount', resultsCount.toString());
      }
    }
  }, [resultsCount]);

  // Load saved results count on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCount = localStorage.getItem('tripsResultsCount');
      if (savedCount) {
        setSavedResultsCount(parseInt(savedCount));
      }
      
      // Listen for results updates
      const handleResultsUpdate = (event: CustomEvent) => {
        setSavedResultsCount(event.detail.count);
      };
      
      window.addEventListener('tripsResultsUpdated', handleResultsUpdate as EventListener);
      return () => window.removeEventListener('tripsResultsUpdated', handleResultsUpdate as EventListener);
    }
  }, []);

  useEffect(() => {
    const loadVehicleTypes = async () => {
      try {
        const types = await getVehicleTypes();
        const opts = [
          { value: "all", label: "الكل", icon: "🚕" },
          ...types.map((t) => ({
            value: String(t.id),
            label: t.name,
            icon: "🚕",
          })),
        ];
        setVehicleOptions(opts);
      } catch (error) {
        setVehicleOptions([{ value: "all", label: "الكل", icon: "🚕" }]);
      }
    };
    loadVehicleTypes();
  }, []);

  // Apply filters on component mount
  useEffect(() => {
    onFilterChange(filters);
  }, []);

  // Restore page scroll position if saved
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedScrollPosition = sessionStorage.getItem('tripsPageScrollPosition');
      if (savedScrollPosition) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollPosition));
          sessionStorage.removeItem('tripsPageScrollPosition');
        }, 100);
      }
    }
  }, []);

  // Save scroll position before component unmounts
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tripsPageScrollPosition', window.scrollY.toString());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const statusOptions = [
    { value: "all", label: "الكل", icon: "📋" },
    { value: "open", label: "مفتوحة", icon: "🔓" },
    { value: "accepted", label: "مقبولة", icon: "✅" },
    { value: "started", label: "جارية", icon: "🚗" },
    { value: "ended", label: "منتهية", icon: "✔️" },
    { value: "cancelled", label: "ملغاة", icon: "❌" },
   
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
    
    // Clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tripsFilters');
      localStorage.removeItem('tripsResultsCount');
    }
    setSavedResultsCount(0);
  };

  // Use saved results count if current resultsCount is 0 or undefined (during loading)
  const displayResultsCount = resultsCount > 0 ? resultsCount : savedResultsCount;

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
          <span className="results-number">
            {displayResultsCount}
            {resultsCount === 0 && savedResultsCount > 0 && (
              <span className="loading-indicator"> ⟳</span>
            )}
          </span>
          <span>رحلة</span>
        </div>
        <div className="filters-status">
          {(filters.search || filters.riderName || filters.driverName || 
            filters.status !== "all" || filters.vehicleType !== "all" || 
            filters.priceMin || filters.priceMax || filters.requiresAc !== "all" || 
            filters.sortBy !== "newest") && (
            <span className="filters-active-indicator">
              🔍 الفلاتر محفوظة
            </span>
          )}
        </div>
        <button className="clear-filters-btn" onClick={clearFilters}>
          مسح الفلاتر
        </button>
      </div>
    </div>
  );
}
