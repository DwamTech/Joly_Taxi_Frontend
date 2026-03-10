import { Trip } from "@/models/Trip";
import { AuthService } from "./authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ApiUserRef {
  id: number;
  name: string;
  phone: string | null;
}

export interface ApiVehicleType {
  id: number;
  name: string;
  icon?: string | null;
}

export interface ApiTrip {
  id: number;
  rider_user_id: number;
  driver_user_id: number | null;
  vehicle_type_id: number;
  from_lat: string | number;
  from_lng: string | number;
  to_lat: string | number;
  to_lng: string | number;
  from_address: string;
  to_address: string;
  distance_km: string | number;
  eta_seconds: number;
  price_per_km_snapshot: string | number;
  suggested_price: string | number;
  final_price: string | number | null;
  requires_ac: boolean;
  notes?: string | null;
  status: string;
  cancelled_by?: string | null;
  cancellation_reason?: string | null;
  created_at: string;
  updated_at: string;
  status_name?: string | null;
  cancelled_by_name?: string | null;
  rider?: ApiUserRef | null;
  driver?: ApiUserRef | null;
  vehicle_type?: ApiVehicleType | null;
  ratings?: any[];
}

export interface AdminTripsPagination {
  current_page: number;
  data: ApiTrip[];
  first_page_url?: string | null;
  from?: number | null;
  last_page: number;
  last_page_url?: string | null;
  links?: Array<{ url: string | null; label: string; page: number | null; active: boolean }>;
  next_page_url?: string | null;
  path?: string | null;
  per_page: number;
  prev_page_url?: string | null;
  to?: number | null;
  total: number;
}

export interface AdminTripsResponse {
  message: string;
  data: AdminTripsPagination;
}

export interface SingleTripResponse {
  message: string;
  data: any;
}

export interface VehicleTypesResponse {
  message: string;
  data: Array<{
    id: number;
    icon?: string | null;
    name: string;
  }>;
}

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  const n = parseFloat(value);
  return isNaN(n) ? 0 : n;
}

function sanitizeUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  return value.replace(/`/g, "").trim();
}

function mapApiTripToTrip(api: ApiTrip): Trip {
  return {
    id: api.id,
    rider_user_id: api.rider_user_id,
    driver_user_id: api.driver_user_id ?? undefined,
    vehicle_type_id: api.vehicle_type_id,
    status_name: api.status_name ?? undefined,
    from_lat: toNumber(api.from_lat),
    from_lng: toNumber(api.from_lng),
    to_lat: toNumber(api.to_lat),
    to_lng: toNumber(api.to_lng),
    from_address: api.from_address,
    to_address: api.to_address,
    distance_km: toNumber(api.distance_km),
    eta_seconds: api.eta_seconds,
    price_per_km_snapshot: toNumber(api.price_per_km_snapshot),
    suggested_price: toNumber(api.suggested_price),
    requires_ac: api.requires_ac,
    notes: api.notes ?? undefined,
    status: api.status as Trip["status"],
    final_price: api.final_price !== null ? toNumber(api.final_price) : undefined,
    cancelled_by: api.cancelled_by ?? undefined,
    cancellation_reason: api.cancellation_reason ?? undefined,
    cancelled_by_name: api.cancelled_by_name ?? undefined,
    created_at: api.created_at,
    updated_at: api.updated_at,
    rider_name: api.rider?.name ?? undefined,
    rider_phone: api.rider?.phone ?? undefined,
    driver_name: api.driver?.name ?? undefined,
    driver_phone: api.driver?.phone ?? undefined,
    driver_avatar: undefined,
    driver_rating: undefined,
    vehicle_type: api.vehicle_type?.name ?? undefined,
    vehicle_type_icon: sanitizeUrl(api.vehicle_type?.icon),
    vehicle_base_fare: api.vehicle_type ? toNumber((api.vehicle_type as any).base_fare) : undefined,
    vehicle_price_per_km: api.vehicle_type ? toNumber((api.vehicle_type as any).price_per_km) : undefined,
    vehicle_requires_subscription: (api.vehicle_type as any)?.requires_subscription ?? undefined,
    vehicle_wait_time_seconds: (api.vehicle_type as any)?.wait_time_seconds ?? undefined,
    vehicle_active: (api.vehicle_type as any)?.active ?? undefined,
    vehicle_sort_order: (api.vehicle_type as any)?.sort_order ?? undefined,
    vehicle_max_search_radius_km: api.vehicle_type ? toNumber((api.vehicle_type as any).max_search_radius_km) : undefined,
    vehicle_brand: undefined,
    vehicle_model: undefined,
    vehicle_license: undefined,
  };
}

export async function getTrips(page: number = 1): Promise<Trip[]> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const url = `${API_BASE_URL}/api/admin/trips?page=${page}`;
  const response = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "فشل في جلب الرحلات");
  }
  const result: AdminTripsResponse = await response.json();
  const trips = (result.data?.data ?? []).map(mapApiTripToTrip);
  return trips;
}

export interface TripUpdate {
  id: number;
  status?: Trip["status"];
  distance_km?: number;
  eta_seconds?: number;
  final_price?: number;
  cancelled_by?: string;
  cancellation_reason?: string;
  updated_at?: string;
}

export async function fetchTripUpdates(): Promise<TripUpdate[]> {
  return [];
}

export function mergeTripUpdates(prevTrips: Trip[], updates: TripUpdate[]): Trip[] {
  const byId = new Map<number, Trip>();
  prevTrips.forEach((t) => byId.set(t.id, t));
  updates.forEach((u) => {
    const existing = byId.get(u.id);
    if (existing) {
      const merged: Trip = {
        ...existing,
        status: u.status ?? existing.status,
        distance_km: u.distance_km ?? existing.distance_km,
        eta_seconds: u.eta_seconds ?? existing.eta_seconds,
        final_price: u.final_price ?? existing.final_price,
        cancelled_by: u.cancelled_by ?? existing.cancelled_by,
        cancellation_reason: u.cancellation_reason ?? existing.cancellation_reason,
        updated_at: u.updated_at ?? existing.updated_at,
      };
      byId.set(u.id, merged);
    }
  });
  return Array.from(byId.values());
}

function mapApiTripDetailsToTrip(api: any): Trip {
  const base: Trip = mapApiTripToTrip(api as ApiTrip);
  const firstVehicle = api.driver?.vehicles?.[0];
  const driverRatingRaw = api.driver?.driver_profile?.rating_avg;
  const offers = Array.isArray(api.offers)
    ? api.offers.map((o: any) => ({
        id: o.id,
        trip_request_id: o.trip_request_id,
        driver_user_id: o.driver_user_id,
        offered_price: toNumber(o.offered_price),
        original_offered_price: o.original_offered_price != null ? toNumber(o.original_offered_price) : undefined,
        is_price_changed: o.is_price_changed,
        edit_count: o.edit_count,
        locked_until: o.locked_until ?? null,
        status: o.status,
        status_name: o.status_name ?? undefined,
        created_at: o.created_at,
        updated_at: o.updated_at,
      }))
    : undefined;
  const timelines = Array.isArray(api.timelines)
    ? api.timelines.map((t: any) => ({
        id: t.id,
        trip_request_id: t.trip_request_id,
        event_type: t.event_type,
        payload: t.payload,
        created_at: t.created_at,
        updated_at: t.updated_at,
      }))
    : undefined;
  const ratings = Array.isArray(api.ratings)
    ? api.ratings.map((r: any) => ({
        id: r.id,
        trip_request_id: r.trip_request_id,
        rater_user_id: r.rater_user_id,
        rated_user_id: r.rated_user_id,
        rater_type: r.rater_type,
        stars: r.stars,
        comment: r.comment ?? null,
        created_at: r.created_at,
        updated_at: r.updated_at,
        rater_type_name: r.rater_type_name ?? undefined,
        has_comment: r.has_comment ?? undefined,
        tags: Array.isArray(r.tags)
          ? r.tags.map((tag: any) => ({
              id: tag.id,
              label: tag.label ?? undefined,
              label_ar: tag.label_ar ?? undefined,
              label_en: tag.label_en ?? undefined,
              applicable_to: tag.applicable_to ?? undefined,
              min_stars: tag.min_stars ?? undefined,
              max_stars: tag.max_stars ?? undefined,
              is_positive: tag.is_positive ?? undefined,
              active: tag.active ?? undefined,
            }))
          : undefined,
        rater: r.rater
          ? {
              id: r.rater.id,
              role: r.rater.role,
              name: r.rater.name,
              phone: r.rater.phone ?? null,
            }
          : undefined,
        rated_user: r.rated_user
          ? {
              id: r.rated_user.id,
              role: r.rated_user.role,
              name: r.rated_user.name,
              phone: r.rated_user.phone ?? null,
            }
          : undefined,
      }))
    : undefined;
  return {
    ...base,
    driver_rating: driverRatingRaw != null ? toNumber(driverRatingRaw) : base.driver_rating,
    vehicle_brand: firstVehicle?.brand ?? base.vehicle_brand,
    vehicle_model: firstVehicle?.model ?? base.vehicle_model,
    vehicle_license: firstVehicle?.vehicle_license_number ?? base.vehicle_license,
    offers,
    timelines,
    ratings,
  };
}

export async function getTripById(id: number): Promise<Trip> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const url = `${API_BASE_URL}/api/admin/trips/${id}`;
  const response = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "فشل في جلب تفاصيل الرحلة");
  }
  const result: SingleTripResponse = await response.json();
  const trip = mapApiTripDetailsToTrip(result.data);
  return trip;
}

export async function getVehicleTypes(): Promise<ApiVehicleType[]> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-lang": "ar",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const url = `${API_BASE_URL}/api/vehicle-types`;
  const response = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "فشل في جلب أنواع المركبات");
  }
  const result: VehicleTypesResponse = await response.json();
  const types: ApiVehicleType[] = (result.data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    icon: sanitizeUrl(t.icon ?? null) ?? undefined,
  }));
  return types;
}
