"use client";

import { DriverLocation } from "@/models/LiveMap";
import "./MapSidebar.css";

interface MapSidebarProps {
  drivers: DriverLocation[];
  trips: DriverLocation[];       // on_trip drivers
  lastUpdate: Date;
  onDriverClick?: (driverId: number) => void;
}

export default function MapSidebar({ drivers, trips, lastUpdate, onDriverClick }: MapSidebarProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available": return "🟢";
      case "on_trip":   return "🟡";
      case "busy":      return "🔴";
      default:          return "⚫";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available": return "متاح";
      case "on_trip":   return "في رحلة";
      case "busy":      return "مشغول";
      default:          return "غير متصل";
    }
  };

  return (
    <div className="map-sidebar">
      <div className="sidebar-header">
        <h3>التحديث التلقائي</h3>
        <span className="update-time">
          آخر تحديث: {lastUpdate.toLocaleTimeString("ar-EG")}
        </span>
      </div>

      {/* All online drivers */}
      <div className="sidebar-section">
        <h4 className="section-title">
          <span>👨‍✈️</span>
          السائقين المتصلين ({drivers.length})
        </h4>
        <div className="drivers-list">
          {drivers.length === 0 && (
            <p className="sidebar-empty">لا يوجد سائقين متصلين</p>
          )}
          {drivers.map((driver) => (
            <div
              key={driver.driver_id}
              className="driver-item clickable"
              onClick={() => onDriverClick?.(driver.driver_id)}
              title="اضغط لعرض على الخريطة"
            >
              <div className="driver-icon">{driver.vehicle_type_icon}</div>
              <div className="driver-details">
                <div className="driver-name">{driver.driver_name}</div>
                <div className="driver-meta">
                  {driver.vehicle_type} • ⭐ {driver.rating}
                </div>
              </div>
              <div className="driver-status">
                <span className="status-icon">{getStatusIcon(driver.status)}</span>
                <span className="status-text">{getStatusLabel(driver.status)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active trips (on_trip drivers) */}
      <div className="sidebar-section">
        <h4 className="section-title">
          <span>🚗</span>
          الرحلات الجارية ({trips.length})
        </h4>
        <div className="trips-list">
          {trips.length === 0 && (
            <p className="sidebar-empty">لا توجد رحلات جارية</p>
          )}
          {trips.map((driver) => (
            <div
              key={driver.driver_id}
              className="trip-item clickable"
              onClick={() => onDriverClick?.(driver.driver_id)}
              title="اضغط لعرض على الخريطة"
            >
              <div className="trip-header">
                <span className="trip-number">{driver.vehicle_type_icon} {driver.driver_name}</span>
                <span className="trip-badge on-trip">في رحلة</span>
              </div>
              <div className="trip-details">
                <div className="trip-row">
                  <span className="trip-label">نوع المركبة:</span>
                  <span className="trip-value">{driver.vehicle_type}</span>
                </div>
                <div className="trip-row">
                  <span className="trip-label">التقييم:</span>
                  <span className="trip-value">⭐ {driver.rating}</span>
                </div>
                <div className="trip-row">
                  <span className="trip-label">رحلات اليوم:</span>
                  <span className="trip-value">{driver.trips_today}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
