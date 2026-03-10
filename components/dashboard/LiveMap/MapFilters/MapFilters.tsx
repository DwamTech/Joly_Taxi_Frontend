"use client";

import { MapFilters as MapFiltersType } from "@/models/LiveMap";
import CustomSelect from "@/components/shared/CustomSelect/CustomSelect";
import "./MapFilters.css";

interface MapFiltersProps {
  filters: MapFiltersType;
  onFilterChange: (filters: MapFiltersType) => void;
}

export default function MapFilters({ filters, onFilterChange }: MapFiltersProps) {
  const statusOptions = [
    { value: "all", label: "جميع الحالات", icon: "👥" },
    { value: "available", label: "متاح", icon: "🟢" },
    { value: "on_trip", label: "في رحلة", icon: "🟡" },
    { value: "busy", label: "مشغول", icon: "🔴" },
  ];

  const vehicleTypeOptions = [
    { value: "all", label: "جميع أنواع المركبات", icon: "🚗" },
    { value: "سيارة اقتصادية", label: "سيارة اقتصادية", icon: "🚗" },
    { value: "سيارة مريحة", label: "سيارة مريحة", icon: "🚙" },
    { value: "سيارة فاخرة", label: "سيارة فاخرة", icon: "🚘" },
    { value: "سيارة كبيرة", label: "سيارة كبيرة", icon: "🚐" },
  ];

  return (
    <div className="map-filters">
      <div className="filter-group">
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={filters.show_drivers}
            onChange={(e) => onFilterChange({ ...filters, show_drivers: e.target.checked })}
          />
          <span>عرض السائقين</span>
        </label>
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={filters.show_trips}
            onChange={(e) => onFilterChange({ ...filters, show_trips: e.target.checked })}
          />
          <span>عرض الرحلات</span>
        </label>
      </div>

      <div className="filter-group">
        <div className="filter-select-wrapper">
          <CustomSelect
            options={statusOptions}
            value={filters.status}
            onChange={(value) => onFilterChange({ ...filters, status: value as any })}
          />
        </div>

        <div className="filter-select-wrapper">
          <CustomSelect
            options={vehicleTypeOptions}
            value={filters.vehicle_type}
            onChange={(value) => onFilterChange({ ...filters, vehicle_type: value })}
          />
        </div>
      </div>
    </div>
  );
}
