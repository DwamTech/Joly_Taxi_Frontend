// --- Drivers ---
export interface TopRatedDriver {
  user_id: number;
  name: string;
  phone: string;
  rating_avg: number;
  rating_count: number;
}

export interface MostTripsDriver {
  user_id: number;
  name: string;
  phone: string;
  trips_count: number;
}

export interface HighCancellationDriver {
  user_id: number;
  name: string;
  phone: string;
  cancellation_count: number;
  cancellation_rate: number;
}

export interface DriverReportsData {
  total_drivers: number;
  active_drivers: number;
  inactive_drivers: number;
  top_rated: TopRatedDriver[];
  most_trips: MostTripsDriver[];
  high_cancellation: HighCancellationDriver[];
}

export interface DriverReportsResponse {
  ok: boolean;
  data: DriverReportsData;
}

// --- Riders ---
export interface TopRatedRider {
  user_id: number;
  name: string;
  phone: string;
  avg_stars: number;
  rating_count: number;
}

export interface MostTripsRider {
  user_id: number;
  name: string;
  phone: string;
  trips_count: number;
}

export interface HighCancellationRider {
  user_id: number;
  name: string;
  phone: string;
  cancellation_count: number;
  cancellation_rate: number;
}

export interface RiderReportsData {
  total_riders: number;
  active_riders: number;
  inactive_riders: number;
  average_rating: number;
  top_rated: TopRatedRider[];
  most_trips: MostTripsRider[];
  high_cancellation: HighCancellationRider[];
}

export interface RiderReportsResponse {
  ok: boolean;
  data: RiderReportsData;
}

// --- Registrations ---
export interface RegistrationMonth {
  year: number;
  month: number;
  month_name_ar: string;
  month_name_en: string;
  total: number;
  drivers: number;
  riders: number;
}

// --- Driver Revenue Report ---
export interface DriverRevenueMonth {
  month_name_ar: string;
  month_name_en: string;
  trips_count: number;
  revenue: number;
}

export interface DriverRevenueData {
  driver_id: number;
  driver_name: string;
  trips_revenue: number;
  trips_count: number;
  subscriptions_revenue: number;
  total_revenue: number;
  monthly_breakdown: DriverRevenueMonth[];
}
