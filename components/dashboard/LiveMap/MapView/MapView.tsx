"use client";

import { useState, useEffect, useRef } from "react";
import { DriverLocation, ActiveTrip } from "@/models/LiveMap";
import "./MapView.css";

interface MapViewProps {
  drivers: DriverLocation[];
  trips: ActiveTrip[];
}

export default function MapView({ drivers, trips }: MapViewProps) {
  const [selectedDriver, setSelectedDriver] = useState<DriverLocation | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Load Leaflet from CDN
    if (typeof window !== "undefined" && !mapLoaded) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => {
        setMapLoaded(true);
      };
      document.head.appendChild(script);
    }
  }, [mapLoaded]);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([30.0444, 31.2357], 12);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add driver markers
    drivers.forEach((driver) => {
      const statusColor = getStatusColor(driver.status);
      
      const icon = L.divIcon({
        className: "custom-marker",
        html: `
          <div class="driver-marker-custom" style="border-color: ${statusColor};">
            <span class="marker-icon-custom">${driver.vehicle_type_icon}</span>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([driver.latitude, driver.longitude], { icon })
        .addTo(map);

      marker.bindPopup(`
        <div style="text-align: center; padding: 5px; font-family: Arial;">
          <strong style="font-size: 14px;">${driver.driver_name}</strong><br/>
          <span style="font-size: 12px;">${driver.vehicle_type}</span><br/>
          <span style="font-size: 12px;">⭐ ${driver.rating} • ${driver.trips_today} رحلة</span>
        </div>
      `);

      marker.on("click", () => setSelectedDriver(driver));
    });

    // Add trip lines only (no pin/target icons)
    trips.forEach((trip) => {
      // Draw dashed line between pickup and dropoff
      L.polyline(
        [[trip.pickup_lat, trip.pickup_lng], [trip.dropoff_lat, trip.dropoff_lng]],
        { color: "#FDB913", weight: 3, opacity: 0.7, dashArray: "10, 10" }
      ).addTo(map);
    });

    return () => {
      map.remove();
    };
  }, [mapLoaded, drivers, trips]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "#27ae60";
      case "on_trip": return "#FDB913";
      case "busy": return "#e74c3c";
      default: return "#95a5a6";
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
    <div className="map-view">
      <div ref={mapRef} className="leaflet-map"></div>

      {!mapLoaded && (
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p>جاري تحميل الخريطة...</p>
        </div>
      )}

      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#27ae60" }}></span>
          <span>متاح</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#FDB913" }}></span>
          <span>في رحلة</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#e74c3c" }}></span>
          <span>مشغول</span>
        </div>
      </div>

      {selectedDriver && (
        <div className="driver-info-popup">
          <button className="popup-close" onClick={() => setSelectedDriver(null)}>✕</button>
          <div className="popup-header">
            <span className="popup-icon">{selectedDriver.vehicle_type_icon}</span>
            <div>
              <h3>{selectedDriver.driver_name}</h3>
              <p className="popup-vehicle">{selectedDriver.vehicle_type}</p>
            </div>
          </div>
          <div className="popup-body">
            <div className="popup-row">
              <span>الحالة:</span>
              <span className="popup-status" style={{ color: getStatusColor(selectedDriver.status) }}>
                {getStatusLabel(selectedDriver.status)}
              </span>
            </div>
            <div className="popup-row">
              <span>التقييم:</span>
              <span>⭐ {selectedDriver.rating}</span>
            </div>
            <div className="popup-row">
              <span>رحلات اليوم:</span>
              <span>{selectedDriver.trips_today} رحلة</span>
            </div>
            <div className="popup-row">
              <span>الهاتف:</span>
              <span>{selectedDriver.phone}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
