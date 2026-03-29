"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DriverLocation } from "@/models/LiveMap";
import "./MapView.css";

interface MapViewProps {
  drivers: DriverLocation[];
  trips: DriverLocation[]; // drivers on_trip shown as trips
  selectedDriverId?: number | null;
  onDriverSelect?: (driver: DriverLocation | null) => void;
}

export default function MapView({ drivers, trips, selectedDriverId, onDriverSelect }: MapViewProps) {
  const [selectedDriver, setSelectedDriver] = useState<DriverLocation | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "#27ae60";
      case "on_trip":   return "#FDB913";
      case "busy":      return "#e74c3c";
      default:          return "#95a5a6";
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

  const handleSelect = useCallback((driver: DriverLocation | null) => {
    setSelectedDriver(driver);
    onDriverSelect?.(driver);
  }, [onDriverSelect]);

  // Load Leaflet once
  useEffect(() => {
    if (typeof window === "undefined" || mapLoaded) return;
    if ((window as any).L) { setMapLoaded(true); return; }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, [mapLoaded]);

  // Build/rebuild map when data changes
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    // Destroy previous instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const allDrivers = [...drivers, ...trips];

    // Center on first driver or default to Cairo
    const center: [number, number] =
      allDrivers.length > 0
        ? [allDrivers[0].latitude, allDrivers[0].longitude]
        : [30.0444, 31.2357];

    const map = L.map(mapRef.current, { zoomControl: true }).setView(center, 12);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    // Draw all driver markers
    allDrivers.forEach((driver) => {
      const color = getStatusColor(driver.status);
      const icon = L.divIcon({
        className: "",
        html: `<div class="driver-marker-custom" style="border-color:${color}">
                 <span class="marker-icon-custom">${driver.vehicle_type_icon}</span>
               </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([driver.latitude, driver.longitude], { icon }).addTo(map);

      // Click opens React popup (not Leaflet popup)
      marker.on("click", () => handleSelect(driver));
    });

    // Draw trip lines for on_trip drivers (from their position toward a dummy destination)
    // Since API only gives current position, we draw a pulsing circle to indicate active trip
    trips.forEach((driver) => {
      L.circleMarker([driver.latitude, driver.longitude], {
        radius: 18,
        color: "#FDB913",
        weight: 2,
        opacity: 0.8,
        fillColor: "#FDB913",
        fillOpacity: 0.15,
        dashArray: "6 4",
      }).addTo(map);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLoaded, drivers, trips, handleSelect]);

  // Pan to externally selected driver
  useEffect(() => {
    if (!mapInstanceRef.current || selectedDriverId == null) return;
    const all = [...drivers, ...trips];
    const driver = all.find((d) => d.driver_id === selectedDriverId);
    if (driver) {
      mapInstanceRef.current.setView([driver.latitude, driver.longitude], 15, { animate: true });
      handleSelect(driver);
    }
  }, [selectedDriverId, drivers, trips, handleSelect]);

  return (
    <div className="map-view">
      <div ref={mapRef} className="leaflet-map" />

      {!mapLoaded && (
        <div className="map-loading">
          <div className="loading-spinner" />
          <p>جاري تحميل الخريطة...</p>
        </div>
      )}

      <div className="map-legend">
        <div className="legend-item"><span className="legend-dot" style={{ background: "#27ae60" }} /><span>متاح</span></div>
        <div className="legend-item"><span className="legend-dot" style={{ background: "#FDB913" }} /><span>في رحلة</span></div>
        <div className="legend-item"><span className="legend-dot" style={{ background: "#e74c3c" }} /><span>مشغول</span></div>
      </div>

      {/* React popup — shown on top of map */}
      {selectedDriver && (
        <div className="driver-info-popup">
          <button className="popup-close" onClick={() => handleSelect(null)}>✕</button>
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
            {selectedDriver.phone && (
              <div className="popup-row">
                <span>الهاتف:</span>
                <span dir="ltr">{selectedDriver.phone}</span>
              </div>
            )}
            <div className="popup-row">
              <span>الإحداثيات:</span>
              <span dir="ltr" style={{ fontSize: "12px", color: "#7f8c8d" }}>
                {selectedDriver.latitude.toFixed(5)}, {selectedDriver.longitude.toFixed(5)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
