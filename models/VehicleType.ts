export interface VehicleType {
  id: number;
  name_ar: string;
  name_en: string;
  icon: string | null;
  base_fare: number;
  price_per_km: number;
  requires_subscription: boolean;
  wait_time_seconds: number;
  active: boolean;
  sort_order: number;
  max_search_radius_km: number;
  has_ac: boolean; // مكيفة أو غير مكيفة
  registered_vehicles?: number;
  active_drivers?: number;
  total_trips?: number;
  monthly_trips?: number;
  avg_trip_price?: number;
  total_revenue?: number;
  created_at?: string;
  updated_at?: string;
}
