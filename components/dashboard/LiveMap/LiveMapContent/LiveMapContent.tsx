"use client";

import { useState, useEffect, useCallback } from "react";
import LiveMapHero from "../LiveMapHero/LiveMapHero";
import MapView from "../MapView/MapView";
import MapSidebar from "../MapSidebar/MapSidebar";
import MapFilters from "../MapFilters/MapFilters";
import { LiveMapService } from "@/services/liveMapService";
import { DriverLocation, MapFilters as MapFiltersType } from "@/models/LiveMap";
import "./LiveMapContent.css";

const REFRESH_INTERVAL = 10_000;

export default function LiveMapContent() {
  const [drivers, setDrivers] = useState<DriverLocation[]>([]);
  const [summary, setSummary] = useState({
    total_online_drivers: 0,
    total_on_trip: 0,
    total_available: 0,
    total_busy: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);

  const [filters, setFilters] = useState<MapFiltersType>({
    show_drivers: true,
    show_trips: true,
    vehicle_type: "all",
    area: "all",
    status: "all",
  });

  const fetchData = useCallback(async () => {
    try {
      const data = await LiveMapService.getOnlineDrivers();
      setDrivers(data.drivers);
      setSummary(data.summary);
      setLastUpdate(new Date());
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  // All drivers passing filter (excluding on_trip which go to trips layer)
  const filteredDrivers = drivers.filter((d) => {
    if (!filters.show_drivers) return false;
    if (filters.vehicle_type !== "all" && d.vehicle_type !== filters.vehicle_type) return false;
    if (filters.status !== "all" && d.status !== filters.status) return false;
    return true;
  });

  // on_trip drivers shown as "trips" on map + sidebar
  const activeTrips = filters.show_trips
    ? drivers.filter((d) => d.status === "on_trip")
    : [];

  if (loading) {
    return (
      <div className="live-map-loading">
        <div className="loading-spinner" />
        <span>جاري تحميل الخريطة...</span>
      </div>
    );
  }

  return (
    <div className="live-map-page">
      {error && (
        <div className="live-map-error">
          ⚠️ {error}
          <button onClick={fetchData}>إعادة المحاولة</button>
        </div>
      )}

      <LiveMapHero
        onlineDrivers={summary.total_online_drivers}
        activeTrips={summary.total_on_trip}
        openRequests={0}
        availableDrivers={summary.total_available}
      />

      <MapFilters filters={filters} onFilterChange={setFilters} />

      <div className="map-container">
        <MapView
          drivers={filteredDrivers}
          trips={activeTrips}
          selectedDriverId={selectedDriverId}
          onDriverSelect={(d) => setSelectedDriverId(d?.driver_id ?? null)}
        />
        <MapSidebar
          drivers={filteredDrivers}
          trips={activeTrips}
          lastUpdate={lastUpdate}
          onDriverClick={(id) => setSelectedDriverId(id)}
        />
      </div>
    </div>
  );
}
