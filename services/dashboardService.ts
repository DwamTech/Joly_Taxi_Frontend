import { AuthService } from "./authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

export const dashboardService = {
  async getDashboardStatistics(): Promise<DashboardStatistics> {
    try {
      const token = AuthService.getToken();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const url = `${API_BASE_URL}/api/admin/statistics/dashboard`;
      console.log('Fetching dashboard statistics from:', url);

      const response = await fetch(url, {
        method: "GET",
        headers,
        credentials: 'include',
      });

      console.log('Dashboard statistics response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Dashboard statistics API Error:', errorText);
        throw new Error(`فشل في جلب إحصائيات اللوحة: ${response.status}`);
      }

      const result: DashboardStatisticsResponse = await response.json();
      console.log('Dashboard statistics data received:', result);
      return result.data;
    } catch (error) {
      console.error("Error fetching dashboard statistics:", error);
      throw error;
    }
  },

  async getLiveTrips(): Promise<ActiveTrip[]> {
    try {
      const token = AuthService.getToken();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const url = `${API_BASE_URL}/api/admin/statistics/live-trips-vehicles`;
      console.log('Fetching live trips from:', url);

      const response = await fetch(url, {
        method: "GET",
        headers,
        credentials: 'include',
      });

      console.log('Live trips response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Live trips API Error:', errorText);
        throw new Error(`فشل في جلب الرحلات الجارية: ${response.status}`);
      }

      const result: LiveTripsResponse = await response.json();
      console.log('Live trips data received:', result);
      return result.data.active_trips || [];
    } catch (error) {
      console.error("Error fetching live trips:", error);
      throw error;
    }
  },
};
