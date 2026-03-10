// Trip Statistics
export interface TripStatistics {
  total_trips: number;
  completed_trips: number;
  cancelled_trips: number;
  cancellation_rate: number;
  avg_duration_minutes: number;
  avg_distance_km: number;
  avg_price: number;
  total_revenue: number;
}

// Trip by Vehicle Type
export interface TripByVehicleType {
  vehicle_type_id: number;
  vehicle_type_name: string;
  trip_count: number;
  revenue: number;
  avg_price: number;
}

// Trip by Time
export interface TripByHour {
  hour: number;
  trip_count: number;
}

export interface TripByDay {
  day: string;
  trip_count: number;
}

export interface TripByMonth {
  month: string;
  trip_count: number;
}

// Driver Statistics
export interface DriverStatistics {
  total_drivers: number;
  active_drivers: number;
  inactive_drivers: number;
}

export interface TopDriver {
  id: number;
  name: string;
  phone: string;
  rating: number;
  trip_count: number;
  total_revenue?: number;
}

export interface DriverWithHighCancellation {
  id: number;
  name: string;
  phone: string;
  cancellation_count: number;
  cancellation_rate: number;
}

// Rider Statistics
export interface RiderStatistics {
  total_riders: number;
  active_riders: number;
  inactive_riders: number;
  avg_rating: number;
}

export interface TopRider {
  id: number;
  name: string;
  phone: string;
  rating: number;
  trip_count: number;
}

export interface RiderWithHighCancellation {
  id: number;
  name: string;
  phone: string;
  cancellation_count: number;
  cancellation_rate: number;
}

// User Growth
export interface UserGrowth {
  month: string;
  new_drivers: number;
  new_riders: number;
  total_users: number;
}

// Revenue Statistics
export interface RevenueStatistics {
  trip_revenue: number;
  subscription_revenue: number;
  total_revenue: number;
}

export interface RevenueByPeriod {
  period: string;
  revenue: number;
}

export interface RevenueByVehicleType {
  vehicle_type_id: number;
  vehicle_type_name: string;
  revenue: number;
}

export interface DriverRevenue {
  driver_id: number;
  driver_name: string;
  total_revenue: number;
  trip_count: number;
}

// Report Export
export type ExportFormat = "pdf" | "excel";

export interface ExportRequest {
  report_type: string;
  format: ExportFormat;
  date_from?: string;
  date_to?: string;
}

// Scheduled Report
export type ReportFrequency = "daily" | "weekly" | "monthly";

export interface ScheduledReport {
  id: number;
  report_type: string;
  frequency: ReportFrequency;
  email: string;
  active: boolean;
  created_at: string;
}

export interface CreateScheduledReportRequest {
  report_type: string;
  frequency: ReportFrequency;
  email: string;
}
