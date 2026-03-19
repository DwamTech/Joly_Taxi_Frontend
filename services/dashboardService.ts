import { AuthService } from "./authService";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
).replace(/\/+$/, "");

export interface MainStats {
  total_users: number;
  total_drivers: number;
  total_riders: number;
  new_users_this_month: number;
}

export interface TripStats {
  completed_trips: number;
  cancelled_trips: number;
  pending_trips: number;
  total_trips: number;
  today_trips?: number;
}

export interface MonthlyStats {
  month: string;
  month_name: string;
  trips: number;
  completed_trips: number;
  new_users: number;
}

export interface RevenueStats {
  total_revenue: number;
  this_month_revenue: number;
  average_trip_price: number;
}

export interface RatingStats {
  total_ratings: number;
  average_rating: number;
  stars_breakdown: {
    "5": number;
    "4": number;
    "3": number;
    "2": number;
    "1": number;
  };
}

export interface DashboardStatistics {
  main_stats: MainStats;
  trip_stats: TripStats;
  monthly_stats: MonthlyStats[];
  revenue_stats: RevenueStats;
  rating_stats: RatingStats;
}

export interface DashboardStatisticsResponse {
  message: string;
  data: DashboardStatistics;
}

export interface ActiveTrip {
  id: number;
  trip_id: string;
  status: string;
  rider: {
    id: number;
    name: string;
  };
  driver: {
    id: number;
    name: string;
  };
  vehicle_type: string;
  from_address: string;
  to_address: string;
  created_at: string;
}

export interface VehicleTypeUsage {
  vehicle_type_id: number;
  vehicle_type_name: string;
  total_trips: number;
  percentage: number;
}

export interface LiveTripsResponse {
  message: string;
  data: {
    active_trips: ActiveTrip[];
    vehicle_types_usage: VehicleTypeUsage[];
  };
}

export interface TripReportOverview {
  total_trips: number;
  completed_trips: number;
  cancelled_trips: number;
  open_trips: number;
  accepted_trips: number;
  started_trips: number;
  expired_trips: number;
  cancellation_rate: string;
  average_trip_duration_minutes: number;
  average_distance_km: number;
  average_price: number;
  total_revenue: number;
}

export interface TripReportVehicleTypeItem {
  vehicle_type_id?: number | null;
  vehicle_type_name: string;
  trips_count: number;
  revenue: number;
  average_price: number;
}

export interface TripReportByHourItem {
  hour: string;
  trips_count: number;
  revenue: number;
}

export interface TripReportByPeriodItem {
  label: string;
  trips_count: number;
  revenue: number;
}

export interface TripReportsFiltersApplied {
  from_date: string | null;
  to_date: string | null;
  vehicle_type: string | null;
  status: string | null;
}

export interface TripReportsData {
  overview: TripReportOverview;
  vehicle_type_report: {
    by_vehicle_type: TripReportVehicleTypeItem[];
    most_requested_vehicle_type: TripReportVehicleTypeItem | null;
  };
  time_report: {
    by_hour: TripReportByHourItem[];
    by_day: TripReportByPeriodItem[];
    by_month: TripReportByPeriodItem[];
  };
  filters_applied: TripReportsFiltersApplied;
}

export interface TripReportsQueryParams {
  from_date?: string;
  to_date?: string;
  vehicle_type?: string;
  status?: string;
}

interface TripReportsResponse {
  ok?: boolean;
  message?: string;
  data?: Partial<TripReportsData>;
}

interface UsersStatusResponse {
  data?: {
    active_users?: number;
    total_riders?: number;
    verified_drivers?: number;
  };
}

interface UsersPageResponse {
  data?: Array<{
    id: number;
    registration_date?: string;
    created_at?: string;
  }>;
  pagination?: {
    total?: number;
  };
}

interface TripsPageResponse {
  data?: {
    total?: number;
    data?: Array<{
      id: number;
      status?: string;
      rider?: { id: number; name: string } | null;
      driver?: { id: number; name: string } | null;
      vehicle_type?: { name?: string | null } | null;
      from_address?: string;
      to_address?: string;
      created_at?: string;
    }>;
  };
}

function toSafeNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function toSafeText(value: unknown, fallback = "-"): string {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function normalizeVehicleTypeItem(item: unknown): TripReportVehicleTypeItem {
  const data = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
  return {
    vehicle_type_id: typeof data.vehicle_type_id === "number" ? data.vehicle_type_id : null,
    vehicle_type_name: toSafeText(
      data.vehicle_type_name ?? data.vehicle_type ?? data.name,
      "غير محدد"
    ),
    trips_count: toSafeNumber(data.trips_count ?? data.trip_count ?? data.total_trips),
    revenue: toSafeNumber(data.revenue ?? data.total_revenue),
    average_price: toSafeNumber(data.average_price ?? data.avg_price),
  };
}

function normalizePeriodItem(item: unknown): TripReportByPeriodItem {
  const data = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
  return {
    label: toSafeText(data.day ?? data.month ?? data.period ?? data.label, "-"),
    trips_count: toSafeNumber(data.trips_count ?? data.trip_count ?? data.total_trips),
    revenue: toSafeNumber(data.revenue ?? data.total_revenue),
  };
}

function normalizeHourItem(item: unknown): TripReportByHourItem {
  const data = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
  return {
    hour: toSafeText(data.hour, "00:00"),
    trips_count: toSafeNumber(data.trips_count ?? data.trip_count ?? data.total_trips),
    revenue: toSafeNumber(data.revenue ?? data.total_revenue),
  };
}

function buildDefaultTripReportsData(): TripReportsData {
  const byHour = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${String(hour).padStart(2, "0")}:00`,
    trips_count: 0,
    revenue: 0,
  }));

  return {
    overview: {
      total_trips: 0,
      completed_trips: 0,
      cancelled_trips: 0,
      open_trips: 0,
      accepted_trips: 0,
      started_trips: 0,
      expired_trips: 0,
      cancellation_rate: "0%",
      average_trip_duration_minutes: 0,
      average_distance_km: 0,
      average_price: 0,
      total_revenue: 0,
    },
    vehicle_type_report: {
      by_vehicle_type: [],
      most_requested_vehicle_type: null,
    },
    time_report: {
      by_hour: byHour,
      by_day: [],
      by_month: [],
    },
    filters_applied: {
      from_date: null,
      to_date: null,
      vehicle_type: null,
      status: null,
    },
  };
}

function normalizeTripReportsData(raw?: Partial<TripReportsData>): TripReportsData {
  const fallback = buildDefaultTripReportsData();
  if (!raw) return fallback;

  const rawOverview = (raw.overview ?? {}) as Record<string, unknown>;
  const overview: TripReportOverview = {
    total_trips: toSafeNumber(rawOverview.total_trips),
    completed_trips: toSafeNumber(rawOverview.completed_trips),
    cancelled_trips: toSafeNumber(rawOverview.cancelled_trips),
    open_trips: toSafeNumber(rawOverview.open_trips),
    accepted_trips: toSafeNumber(rawOverview.accepted_trips),
    started_trips: toSafeNumber(rawOverview.started_trips),
    expired_trips: toSafeNumber(rawOverview.expired_trips),
    cancellation_rate:
      typeof rawOverview.cancellation_rate === "string"
        ? rawOverview.cancellation_rate
        : `${toSafeNumber(rawOverview.cancellation_rate)}%`,
    average_trip_duration_minutes: toSafeNumber(
      rawOverview.average_trip_duration_minutes
    ),
    average_distance_km: toSafeNumber(rawOverview.average_distance_km),
    average_price: toSafeNumber(rawOverview.average_price),
    total_revenue: toSafeNumber(rawOverview.total_revenue),
  };

  const rawVehicleReport = (raw.vehicle_type_report ?? {}) as Record<string, unknown>;
  const byVehicleTypeRaw = Array.isArray(rawVehicleReport.by_vehicle_type)
    ? rawVehicleReport.by_vehicle_type
    : [];
  const byVehicleType = byVehicleTypeRaw.map(normalizeVehicleTypeItem);

  const rawMostRequested = rawVehicleReport.most_requested_vehicle_type;
  const mostRequested = rawMostRequested ? normalizeVehicleTypeItem(rawMostRequested) : null;

  const rawTimeReport = (raw.time_report ?? {}) as Record<string, unknown>;
  const byHourRaw = Array.isArray(rawTimeReport.by_hour) ? rawTimeReport.by_hour : [];
  const byDayRaw = Array.isArray(rawTimeReport.by_day) ? rawTimeReport.by_day : [];
  const byMonthRaw = Array.isArray(rawTimeReport.by_month) ? rawTimeReport.by_month : [];

  const rawFilters = (raw.filters_applied ?? {}) as Record<string, unknown>;

  return {
    overview,
    vehicle_type_report: {
      by_vehicle_type: byVehicleType,
      most_requested_vehicle_type: mostRequested,
    },
    time_report: {
      by_hour: byHourRaw.map(normalizeHourItem),
      by_day: byDayRaw.map(normalizePeriodItem),
      by_month: byMonthRaw.map(normalizePeriodItem),
    },
    filters_applied: {
      from_date: typeof rawFilters.from_date === "string" ? rawFilters.from_date : null,
      to_date: typeof rawFilters.to_date === "string" ? rawFilters.to_date : null,
      vehicle_type:
        typeof rawFilters.vehicle_type === "string" ? rawFilters.vehicle_type : null,
      status: typeof rawFilters.status === "string" ? rawFilters.status : null,
    },
  };
}

async function requestJson<T>(endpoint: string, token: string | null): Promise<{ status: number; data: T | null }> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  const data = await response.json().catch(() => null);
  return { status: response.status, data: data as T | null };
}

export const dashboardService = {
  async getDashboardStatistics(): Promise<DashboardStatistics> {
    try {
      const token = AuthService.getToken();
      const mainStatsResult = await requestJson<DashboardStatisticsResponse>("/api/admin/statistics/dashboard", token);
      if (mainStatsResult.status >= 200 && mainStatsResult.status < 300 && mainStatsResult.data?.data) {
        return mainStatsResult.data.data;
      }

      const [usersStatsResult, usersPageResult, tripsResult] = await Promise.all([
        requestJson<UsersStatusResponse>("/api/admin/users/stats", token),
        requestJson<UsersPageResponse>("/api/admin/users?page=1", token),
        requestJson<TripsPageResponse>("/api/admin/trips?page=1", token),
      ]);

      if (usersStatsResult.status === 401 || usersPageResult.status === 401 || tripsResult.status === 401) {
        throw new Error("غير مصرح، يرجى تسجيل الدخول مرة أخرى");
      }

      let usersStatus = usersStatsResult.data?.data;
      if (!usersStatus) {
        const usersStatusResult = await requestJson<UsersStatusResponse>("/api/admin/users/status", token);
        if (usersStatusResult.status === 401) {
          throw new Error("غير مصرح، يرجى تسجيل الدخول مرة أخرى");
        }
        usersStatus = usersStatusResult.data?.data;
      }
      const usersPage = usersPageResult.data;
      const tripsPage = tripsResult.data?.data;
      const tripsList = Array.isArray(tripsPage?.data) ? tripsPage.data : [];

      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      const currentMonthNewUsers = Array.isArray(usersPage?.data)
        ? usersPage.data.filter((u) => {
            const rawDate = u.registration_date || u.created_at;
            if (!rawDate) return false;
            const parsed = new Date(rawDate);
            return parsed.getFullYear() === year && parsed.getMonth() === month;
          }).length
        : 0;

      const completedTrips = tripsList.filter((trip) => trip.status === "completed").length;
      const cancelledTrips = tripsList.filter((trip) => trip.status === "cancelled").length;
      const pendingTrips = tripsList.filter((trip) => trip.status === "open" || trip.status === "pending").length;
      const todayDate = now.toISOString().slice(0, 10);
      const todayTrips = tripsList.filter((trip) => (trip.created_at || "").slice(0, 10) === todayDate).length;

      return {
        main_stats: {
          total_users: usersPage?.pagination?.total || usersStatus?.active_users || 0,
          total_drivers: usersStatus?.verified_drivers || 0,
          total_riders: usersStatus?.total_riders || 0,
          new_users_this_month: currentMonthNewUsers,
        },
        trip_stats: {
          completed_trips: completedTrips,
          cancelled_trips: cancelledTrips,
          pending_trips: pendingTrips,
          total_trips: tripsPage?.total || tripsList.length,
          today_trips: todayTrips,
        },
        monthly_stats: [],
        revenue_stats: {
          total_revenue: 0,
          this_month_revenue: 0,
          average_trip_price: 0,
        },
        rating_stats: {
          total_ratings: 0,
          average_rating: 0,
          stars_breakdown: {
            "5": 0,
            "4": 0,
            "3": 0,
            "2": 0,
            "1": 0,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching dashboard statistics:", error);
      throw error;
    }
  },

  async getLiveTrips(): Promise<ActiveTrip[]> {
    try {
      const token = AuthService.getToken();
      const liveStatsResult = await requestJson<LiveTripsResponse>("/api/admin/statistics/live-trips-vehicles", token);
      if (liveStatsResult.status >= 200 && liveStatsResult.status < 300) {
        return liveStatsResult.data?.data?.active_trips || [];
      }

      if (liveStatsResult.status === 401) {
        throw new Error("غير مصرح، يرجى تسجيل الدخول مرة أخرى");
      }

      const tripsResult = await requestJson<TripsPageResponse>("/api/admin/trips?page=1", token);
      if (tripsResult.status === 401) {
        throw new Error("غير مصرح، يرجى تسجيل الدخول مرة أخرى");
      }
      const trips = tripsResult.data?.data?.data || [];
      return trips
        .filter((trip) => trip.status === "ongoing" || trip.status === "accepted")
        .map((trip) => ({
          id: trip.id,
          trip_id: String(trip.id),
          status: trip.status || "ongoing",
          rider: {
            id: trip.rider?.id || 0,
            name: trip.rider?.name || "غير متاح",
          },
          driver: {
            id: trip.driver?.id || 0,
            name: trip.driver?.name || "غير متاح",
          },
          vehicle_type: trip.vehicle_type?.name || "غير محدد",
          from_address: trip.from_address || "",
          to_address: trip.to_address || "",
          created_at: trip.created_at || new Date().toISOString(),
        }));
    } catch (error) {
      console.error("Error fetching live trips:", error);
      throw error;
    }
  },

  async getTripReports(params?: TripReportsQueryParams): Promise<TripReportsData> {
    try {
      const token = AuthService.getToken();
      const query = new URLSearchParams();
      if (params?.from_date) query.set("from_date", params.from_date);
      if (params?.to_date) query.set("to_date", params.to_date);
      if (params?.vehicle_type) query.set("vehicle_type", params.vehicle_type);
      if (params?.status) query.set("status", params.status);
      const endpoint = query.size
        ? `/api/admin/trip-reports?${query.toString()}`
        : "/api/admin/trip-reports";
      const result = await requestJson<TripReportsResponse>(endpoint, token);

      if (result.status === 401) {
        throw new Error("غير مصرح، يرجى تسجيل الدخول مرة أخرى");
      }

      if (result.status >= 200 && result.status < 300) {
        return normalizeTripReportsData(result.data?.data);
      }

      throw new Error(result.data?.message || "فشل في جلب تقارير الرحلات");
    } catch (error) {
      console.error("Error fetching trip reports:", error);
      throw error;
    }
  },
};
