import { VehicleType } from "@/models/VehicleType";
import { AuthService } from "./authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface ApiVehicleType {
  id: number;
  icon?: string | null;
  base_fare: string | number;
  price_per_km: string | number;
  requires_subscription: boolean;
  wait_time_seconds: number;
  active: boolean;
  sort_order: number;
  max_search_radius_km: string | number;
  created_at: string;
  updated_at: string;
  name: string;
}

interface AdminVehicleTypesResponse {
  message: string;
  data: ApiVehicleType[];
}

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  const n = parseFloat(value);
  return isNaN(n) ? 0 : n;
}

function sanitizeIcon(url: string | null | undefined): string | null {
  if (!url) return null;
  let cleaned = url.replace(/`/g, "").trim();
  cleaned = cleaned.replace(/\s+/g, " ");
  try {
    // Encode spaces and special chars safely
    cleaned = encodeURI(cleaned);
  } catch {
    // Fallback to simple space replacement
    cleaned = cleaned.replace(/ /g, "%20");
  }
  return cleaned;
}

function formatMoney(value: string | number | null | undefined): string {
  const n = toNumber(value);
  return n.toFixed(2);
}

function formatDistance(value: string | number | null | undefined): string {
  const n = toNumber(value);
  return n.toFixed(2);
}

function inferHasAc(name: string): boolean {
  const n = (name || "").toLowerCase();
  return (
    n.includes("مكيفة") ||
    n.includes("مبرد") ||
    n.includes("refrigerated") ||
    n.includes("ac")
  );
}

function mapApiToModel(api: ApiVehicleType): VehicleType {
  return {
    id: api.id,
    name_ar: api.name,
    name_en: api.name,
    icon: sanitizeIcon(api.icon ?? null),
    base_fare: toNumber(api.base_fare),
    price_per_km: toNumber(api.price_per_km),
    requires_subscription: api.requires_subscription,
    wait_time_seconds: api.wait_time_seconds,
    active: api.active,
    sort_order: api.sort_order,
    max_search_radius_km: toNumber(api.max_search_radius_km),
    has_ac: inferHasAc(api.name),
    created_at: api.created_at,
    updated_at: api.updated_at,
  };
}

export async function getAdminVehicleTypes(): Promise<VehicleType[]> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const url = `${API_BASE_URL}/api/admin/vehicle-types`;
  const response = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "فشل في جلب أنواع المركبات");
  }
  const result: AdminVehicleTypesResponse = await response.json();
  const list = Array.isArray(result?.data) ? result.data : [];
  return list.map(mapApiToModel);
}

export async function createAdminVehicleType(input: Partial<VehicleType>): Promise<VehicleType> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const payload: any = {
    name_ar: input.name_ar || "",
    name_en: input.name_en || input.name_ar || "",
    base_fare: formatMoney(input.base_fare),
    price_per_km: formatMoney(input.price_per_km),
    requires_subscription: input.requires_subscription ? 1 : 0,
    wait_time_seconds: Number.isFinite(input.wait_time_seconds as number)
      ? Math.max(0, Math.floor(input.wait_time_seconds as number))
      : 0,
    active: input.active ? 1 : 0,
    sort_order: Number.isFinite(input.sort_order as number)
      ? Math.max(1, Math.floor(input.sort_order as number))
      : 1,
    max_search_radius_km: formatDistance(input.max_search_radius_km),
  };
  if (input.icon) {
    payload.icon = sanitizeIcon(input.icon ?? null);
  }

  const url = `${API_BASE_URL}/api/admin/vehicle-types`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let message = "فشل في إضافة نوع مركبة جديد";
    try {
      const errJson = await response.json();
      if (errJson?.message) {
        message = errJson.message;
      }
      if (errJson?.errors) {
        const details = Object.values(errJson.errors)
          .flat()
          .join(" | ");
        if (details) {
          message = `${message}: ${details}`;
        }
      }
      throw new Error(message);
    } catch {
      const text = await response.text();
      throw new Error(text || message);
    }
  }
  const result: any = await response.json();
  const data: ApiVehicleType | undefined = result?.data;
  if (data) {
    return mapApiToModel(data);
  }
  return {
    id: 0,
    name_ar: payload.name_ar,
    name_en: payload.name_en,
    icon: sanitizeIcon(payload.icon ?? null),
    base_fare: toNumber(payload.base_fare),
    price_per_km: toNumber(payload.price_per_km),
    requires_subscription: !!payload.requires_subscription,
    wait_time_seconds: payload.wait_time_seconds ?? 0,
    active: !!payload.active,
    sort_order: payload.sort_order ?? 1,
    max_search_radius_km: toNumber(payload.max_search_radius_km),
    has_ac: inferHasAc(payload.name_ar || payload.name_en || ""),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
