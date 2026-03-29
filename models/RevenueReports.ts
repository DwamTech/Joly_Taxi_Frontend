export interface RevenuePeriod {
  month_name_ar: string;
  month_name_en: string;
  year: number;
  month: number;
  revenue: number;
  trips_count: number;
}

export interface RevenueByVehicleType {
  vehicle_type_id: number;
  vehicle_type_name_ar: string;
  vehicle_type_name_en: string;
  revenue: number;
  trips_count: number;
}

export interface RevenueReportsData {
  trips_revenue: number;
  subscriptions_revenue: number;
  total_revenue: number;
  by_period: RevenuePeriod[];
  by_vehicle_type: RevenueByVehicleType[];
}

export interface RevenueReportsResponse {
  ok: boolean;
  data: RevenueReportsData;
}
