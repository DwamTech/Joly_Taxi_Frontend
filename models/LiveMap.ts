// Driver Status on Map
export type DriverStatus = "available" | "on_trip" | "busy" | "offline";

export interface DriverLocation {
  driver_id: number;
  driver_name: string;
  phone: string;
  vehicle_type: string;
  vehicle_type_icon: string;
  status: DriverStatus;
  rating: number;
  trips_today: number;
  latitude: number;
  longitude: number;
  last_update: string;
}

// Active Trip on Map
export interface ActiveTrip {
  trip_id: number;
  trip_number: string;
  driver_id: number;
  driver_name: string;
  rider_id: number;
  rider_name: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_lat: number;
  pickup_lng: number;
  dropoff_lat: number;
  dropoff_lng: number;
  status: string;
  elapsed_time: string;
  estimated_time: string;
  distance_km: number;
  price: number;
}

// Map Statistics
export interface MapStatistics {
  online_drivers: number;
  active_trips: number;
  open_requests: number;
  available_drivers: number;
}

// Map Filters
export interface MapFilters {
  show_drivers: boolean;
  show_trips: boolean;
  vehicle_type: string;
  area: string;
  status: DriverStatus | "all";
}
