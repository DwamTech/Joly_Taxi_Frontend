export type TripStatus = 
  | "open" 
  | "accepted" 
  | "started" 
  | "ended" 
  | "cancelled" 
  | "expired";

export interface TripLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface Trip {
  id: number;
  rider_user_id: number;
  driver_user_id?: number;
  vehicle_type_id: number;
  from_lat: number;
  from_lng: number;
  to_lat: number;
  to_lng: number;
  from_address: string;
  to_address: string;
  distance_km: number;
  eta_seconds: number;
  price_per_km_snapshot: number;
  suggested_price: number;
  requires_ac: boolean;
  notes?: string;
  status: TripStatus;
  final_price?: number;
  cancelled_by?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  
  // Additional fields from relationships (populated by frontend)
  rider_name?: string;
  rider_phone?: string;
  rider_avatar?: string;
  driver_name?: string;
  driver_phone?: string;
  driver_avatar?: string;
  driver_rating?: number;
  vehicle_type?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_license?: string;
}

