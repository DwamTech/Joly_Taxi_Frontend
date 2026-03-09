export type UserRole = 'user' | 'driver' | 'both' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'blocked';
export type VerificationStatus = 'approved' | 'pending' | 'rejected';
export type SubscriptionStatus = 'active' | 'pending' | 'rejected' | 'expired';

export interface DriverProfile {
  national_id_number: string;
  driver_license_expiry: string;
  expire_profile_at: string;
  verification_status: VerificationStatus;
  online_status: boolean;
  rating_avg: number;
  rating_count: number;
  completed_trips_count: number;
  cancelled_trips_count: number;
}

export interface RiderProfile {
  id: number;
  user_id: number;
  rating_avg: number;
  rating_count: number;
  reliability_percent: number;
  completed_trips_count: number;
  cancelled_trips_count: number;
  preferences: any | null;
  created_at: string;
  updated_at: string;
}

export interface FavoriteTrip {
  id: number;
  user_id: number;
  trip_id: number | null;
  vehicle_type_id: number;
  title: string;
  from_lat: number;
  from_lng: number;
  to_lat: number;
  to_lng: number;
  requires_ac: boolean;
  usage_count: number;
  last_estimated_price: number | null;
  last_estimated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Rating {
  id: number;
  trip_request_id: number;
  rater_user_id: number;
  rated_user_id: number;
  rater_type: 'driver' | 'rider';
  stars: number;
  comment: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: number;
  driver_user_id: number;
  vehicle_type_id: number;
  brand_id: number;
  model_id: number;
  vehicle_year_id: number;
  has_ac: boolean;
  vehicle_license_number: string;
  vehicle_license_expiry: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  type: string; // For display
  brand: string; // For display
  model: string; // For display
  year: number; // For display
  vehicle_type?: VehicleType;
}

export interface VehicleType {
  id: number;
  name_ar: string;
  name_en: string;
  name: string;
  icon: string | null;
  base_fare: number;
  price_per_km: number;
  requires_subscription: boolean;
  wait_time_seconds: number;
  active: boolean;
  sort_order: number;
  max_search_radius_km: number;
  created_at: string;
  updated_at: string;
}

export interface DriverDocument {
  id: number;
  driver_user_id: number;
  type: 'driver_photo' | 'national_id_front' | 'national_id_back' | 'driver_license_front' | 'driver_license_back' | 'vehicle_license_front' | 'vehicle_license_back';
  file_path: string;
  file_url: string;
  expires_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Device {
  id: number;
  user_id: number;
  device_id: string;
  device_type: string | null;
  fcm_token: string | null;
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlockedUser {
  id: number;
  blocker_user_id: number;
  blocked_user_id: number;
  reason: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  driver_id: number;
  vehicle_type_id: number;
  vehicle_type: string; // For display
  months: number;
  total_price: number;
  reference: string | null;
  paid_amount: number;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Documents {
  national_id: string;
  driver_license: string;
  vehicle_license: string;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  role: UserRole;
  status: UserStatus;
  agent_code: string | null;
  delegate_number: string | null;
  created_at: string;
  last_active_at: string;
  last_login_at: string;
  driver_profile?: DriverProfile;
  rider_profile?: RiderProfile;
  vehicle?: Vehicle;
  subscriptions?: Subscription[];
  documents?: DriverDocument[];
  devices?: Device[];
  blocked_users?: BlockedUser[];
  blocked_by_users?: BlockedUser[];
  favorite_trips?: FavoriteTrip[];
  received_ratings?: Rating[];
  sent_ratings?: Rating[];
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}
