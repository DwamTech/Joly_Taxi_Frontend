"use client";

import { DriverLocation, ActiveTrip } from "@/models/LiveMap";
import "./MapSidebar.css";

interface MapSidebarProps {
  drivers: DriverLocation[];
  trips: ActiveTrip[];
  lastUpdate: Date;
}

export default function MapSidebar({ drivers, trips, lastUpdate }: MapSidebarProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available": return "🟢";
      case "on_trip": return "🟡";
      case "busy": return "🔴";
      default: return "⚫";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available": return "متاح";
      case "on_trip": return "في رحلة";
      case "busy": return "مشغول";
      default: return "غير متصل";
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

      <div className="sidebar-section">
        <h4 className="section-title">
          <span>👨‍✈️</span>
          السائقين المتصلين ({drivers.length})
        </h4>
        <div className="drivers-list">
          {drivers.slice(0, 10).map((driver) => (
            <div key={driver.driver_id} className="driver-item">
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

      <div className="sidebar-section">
        <h4 className="section-title">
          <span>🚗</span>
          الرحلات الجارية ({trips.length})
        </h4>
        <div className="trips-list">
          {trips.map((trip) => (
            <div key={trip.trip_id} className="trip-item">
              <div className="trip-header">
                <span className="trip-number">{trip.trip_number}</span>
                <span className="trip-time">{trip.elapsed_time}</span>
              </div>
              <div className="trip-details">
                <div className="trip-row">
                  <span className="trip-label">السائق:</span>
                  <span className="trip-value">{trip.driver_name}</span>
                </div>
                <div className="trip-row">
                  <span className="trip-label">الراكب:</span>
                  <span className="trip-value">{trip.rider_name}</span>
                </div>
                <div className="trip-row">
                  <span className="trip-label">من:</span>
                  <span className="trip-value">{trip.pickup_location}</span>
                </div>
                <div className="trip-row">
                  <span className="trip-label">إلى:</span>
                  <span className="trip-value">{trip.dropoff_location}</span>
                </div>
                <div className="trip-footer">
                  <span>{trip.distance_km} كم</span>
                  <span>{trip.price} ج.م</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
