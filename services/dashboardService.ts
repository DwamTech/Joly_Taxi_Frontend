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
};
