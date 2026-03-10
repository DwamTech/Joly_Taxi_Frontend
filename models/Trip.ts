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
  status_name?: string;
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
  cancelled_by_name?: string;
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
  vehicle_type_icon?: string;
  vehicle_base_fare?: number;
  vehicle_price_per_km?: number;
  vehicle_requires_subscription?: boolean;
  vehicle_wait_time_seconds?: number;
  vehicle_active?: boolean;
  vehicle_sort_order?: number;
  vehicle_max_search_radius_km?: number;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_license?: string;
  
  // Detailed relations
  offers?: TripOffer[];
  timelines?: TripTimeline[];
  ratings?: TripRating[];
}

export interface TripUpdate {
  id: number;
  status?: TripStatus;
  distance_km?: number;
  eta_seconds?: number;
  final_price?: number;
  cancelled_by?: string;
  cancellation_reason?: string;
  updated_at?: string;
}

export interface TripOffer {
  id: number;
  trip_request_id?: number;
  driver_user_id?: number;
  offered_price: number;
  original_offered_price?: number;
  is_price_changed?: boolean;
  edit_count?: number;
  locked_until?: string | null;
  status: string;
  status_name?: string;
  created_at: string;
  updated_at: string;
}

export interface TripTimeline {
  id: number;
  trip_request_id?: number;
  event_type: string;
  payload?: any;
  created_at: string;
  updated_at: string;
}

export interface TripRatingTag {
  id: number;
  label?: string;
  label_ar?: string;
  label_en?: string;
  applicable_to?: string;
  min_stars?: number;
  max_stars?: number;
  is_positive?: boolean;
  active?: boolean;
}

export interface TripRating {
  id: number;
  trip_request_id?: number;
  rater_user_id: number;
  rated_user_id: number;
  rater_type: string;
  stars: number;
  comment?: string | null;
  created_at: string;
  updated_at: string;
  rater_type_name?: string;
  has_comment?: boolean;
  tags?: TripRatingTag[];
  rater?: {
    id: number;
    role: string;
    name: string;
    phone?: string | null;
  };
  rated_user?: {
    id: number;
    role: string;
    name: string;
    phone?: string | null;
  };
}

