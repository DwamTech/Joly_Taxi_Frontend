"use client";

import { useState, useEffect, useMemo } from "react";
import { Trip } from "@/models/Trip";
import { ToastProvider, useToast } from "@/components/Toast/ToastContainer";
import Pagination from "@/components/Pagination/Pagination";
import TripsHero from "@/components/dashboard/TripsManagement/TripsHero/TripsHero";
import TripsFilters, {
  TripFilterValues,
} from "@/components/dashboard/TripsManagement/TripsFilters/TripsFilters";
import TripsTable from "@/components/dashboard/TripsManagement/TripsTable/TripsTable";
import TripDetailsModal from "@/components/dashboard/TripsManagement/TripDetailsModal/TripDetailsModal";
import mockData from "@/data/dashboard/mock-trips.json";
import { exportTripsToExcel } from "@/utils/exportTripsToExcel";
import { fetchTripUpdates, mergeTripUpdates } from "@/services/tripsService";
import "./trips.css";

function TripsManagementContent() {
  const { showToast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [paginatedTrips, setPaginatedTrips] = useState<Trip[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
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

  // Load trips from mock data
  useEffect(() => {
    const tripsData = mockData as unknown as { trips: Trip[] };
    setTrips(tripsData.trips);
    setFilteredTrips(tripsData.trips);
  }, []);

  // Calculate stats for hero
  const tripStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      totalTrips: trips.length,
      ongoingTrips: trips.filter(
        (t) => t.status === "started" || t.status === "accepted"
      ).length,
      completedToday: trips.filter((t) => {
        if (t.status !== "ended" || !t.updated_at) return false;
        const completedDate = new Date(t.updated_at);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === today.getTime();
      }).length,
    };
  }, [trips]);

  // Apply filters
  useEffect(() => {
    let result = [...trips];

    // Search by trip number
    if (filters.search) {
      result = result.filter((trip) =>
        `TRIP-${trip.id}`.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Search by rider name
    if (filters.riderName) {
      result = result.filter(
        (trip) =>
          trip.rider_name &&
          trip.rider_name.toLowerCase().includes(filters.riderName.toLowerCase())
      );
    }

    // Search by driver name
    if (filters.driverName) {
      result = result.filter(
        (trip) =>
          trip.driver_name &&
          trip.driver_name
            .toLowerCase()
            .includes(filters.driverName.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status !== "all") {
      result = result.filter((trip) => trip.status === filters.status);
    }

    // Filter by vehicle type
    if (filters.vehicleType !== "all") {
      result = result.filter((trip) => trip.vehicle_type === filters.vehicleType);
    }

    // Filter by price range
    if (filters.priceMin) {
      const minPrice = parseFloat(filters.priceMin);
      result = result.filter(
        (trip) =>
          (trip.final_price || trip.suggested_price) >= minPrice
      );
    }
    if (filters.priceMax) {
      const maxPrice = parseFloat(filters.priceMax);
      result = result.filter(
        (trip) =>
          (trip.final_price || trip.suggested_price) <= maxPrice
      );
    }

    // Filter by AC requirement
    if (filters.requiresAc !== "all") {
      const requiresAc = filters.requiresAc === "yes";
      result = result.filter((trip) => trip.requires_ac === requiresAc);
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "highest_price":
        result.sort(
          (a, b) =>
            (b.final_price || b.suggested_price) -
            (a.final_price || a.suggested_price)
        );
        break;
    }

    setFilteredTrips(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, trips]);

  // Apply pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedTrips(filteredTrips.slice(startIndex, endIndex));
  }, [currentPage, filteredTrips, itemsPerPage]);

  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters: TripFilterValues) => {
    setFilters(newFilters);
  };

  const handleViewTrip = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  const handleExportData = () => {
    exportTripsToExcel(filteredTrips);
    showToast("تم تصدير البيانات بنجاح", "success");
  };

  // Real-time updates for trip data only (not user/driver data)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Fetch only trip updates from API
        // The API should return only trip-specific fields without user/driver details
        const updates = await fetchTripUpdates();
        
        // Merge updates while preserving user/driver information
        setTrips((prevTrips) => mergeTripUpdates(prevTrips, updates));
        
        // Note: In production, uncomment the above and remove the mock data below
        // For now, using mock data - no real-time updates in development
      } catch (error) {
        console.error("Error fetching trip updates:", error);
        // Don't show error toast to avoid annoying users during development
        // In production, you might want to handle this differently
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="trips-management-page">
      <TripsHero
        totalTrips={tripStats.totalTrips}
        ongoingTrips={tripStats.ongoingTrips}
        completedToday={tripStats.completedToday}
        onExportData={handleExportData}
      />

      <TripsFilters
        onFilterChange={handleFilterChange}
        resultsCount={filteredTrips.length}
      />

      <TripsTable trips={paginatedTrips} onViewTrip={handleViewTrip} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={filteredTrips.length}
        itemsPerPage={itemsPerPage}
      />

      {selectedTrip && (
        <TripDetailsModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}
    </div>
  );
}

export default function TripsManagementPage() {
  return (
    <ToastProvider>
      <TripsManagementContent />
    </ToastProvider>
  );
}
