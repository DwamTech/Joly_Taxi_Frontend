"use client";

import { useState, useEffect } from "react";
import LiveMapHero from "../LiveMapHero/LiveMapHero";
import MapView from "../MapView/MapView";
import MapSidebar from "../MapSidebar/MapSidebar";
import MapFilters from "../MapFilters/MapFilters";
import liveMapData from "@/data/map/live-map-data.json";
import { MapFilters as MapFiltersType } from "@/models/LiveMap";
import "./LiveMapContent.css";

export default function LiveMapContent() {
  const [filters, setFilters] = useState<MapFiltersType>({
    show_drivers: true,
    show_trips: true,
    vehicle_type: "all",
    area: "all",
    status: "all",
  });

  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Auto refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredDrivers = liveMapData.drivers.filter((driver) => {
    if (!filters.show_drivers) return false;
    if (filters.vehicle_type !== "all" && driver.vehicle_type !== filters.vehicle_type) return false;
    if (filters.status !== "all" && driver.status !== filters.status) return false;
    return true;
  });

  const filteredTrips = filters.show_trips ? liveMapData.activeTrips : [];

  return (
    <div className="live-map-page">
      <LiveMapHero
        onlineDrivers={liveMapData.statistics.online_drivers}
        activeTrips={liveMapData.statistics.active_trips}
        openRequests={liveMapData.statistics.open_requests}
        availableDrivers={liveMapData.statistics.available_drivers}
      />

      <MapFilters filters={filters} onFilterChange={setFilters} />

      <div className="map-container">
        <MapView drivers={filteredDrivers as any} trips={filteredTrips as any} />
        <MapSidebar
          drivers={filteredDrivers as any}
          trips={filteredTrips as any}
          lastUpdate={lastUpdate}
        />
      </div>
    </div>
  );
}
