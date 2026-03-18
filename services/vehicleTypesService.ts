import { VehicleType } from "@/models/VehicleType";
import { AuthService } from "./authService";

const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
    : "";

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
  name?: string;
  name_ar?: string;
  name_en?: string;
}

interface AdminVehicleTypesResponse {
  message: string;
  data: ApiVehicleType[];
}

interface AdminVehicleTypeDetailsResponse {
  message: string;
  data: ApiVehicleType;
  statistics?: {
    registered_drivers?: { value: number };
    active_drivers?: { value: number };
    total_trips?: { value: number };
    month_trips?: { value: number };
    average_price?: { value: number };
    total_revenue?: { value: number };
  };
}

interface AdminVehicleTypeActionResponse {
  message: string;
  data?: ApiVehicleType;
}

interface ChangeOrderRequest {
  orders: Array<{
    id: number;
    sort_order: number;
  }>;
}

interface ChangeOrderResponse {
  message: string;
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

type VehicleTypeUpsertInput = Partial<VehicleType> & { iconFile?: File | null };

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
  const nameAr = api.name_ar ?? api.name ?? "";
  const nameEn = api.name_en ?? api.name ?? api.name_ar ?? "";
  return {
    id: api.id,
    name_ar: nameAr,
    name_en: nameEn,
    icon: sanitizeIcon(api.icon ?? null),
    base_fare: toNumber(api.base_fare),
    price_per_km: toNumber(api.price_per_km),
    requires_subscription: api.requires_subscription,
    wait_time_seconds: api.wait_time_seconds,
    active: api.active,
    sort_order: api.sort_order,
    max_search_radius_km: toNumber(api.max_search_radius_km),
    has_ac: inferHasAc(nameAr || nameEn),
    created_at: api.created_at,
    updated_at: api.updated_at,
  };
}

function mapDetailsToModel(result: AdminVehicleTypeDetailsResponse): VehicleType {
  const base = mapApiToModel(result.data);
  return {
    ...base,
    registered_vehicles: result.statistics?.registered_drivers?.value ?? base.registered_vehicles,
    active_drivers: result.statistics?.active_drivers?.value ?? base.active_drivers,
    total_trips: result.statistics?.total_trips?.value ?? base.total_trips,
    monthly_trips: result.statistics?.month_trips?.value ?? base.monthly_trips,
    avg_trip_price: result.statistics?.average_price?.value ?? base.avg_trip_price,
    total_revenue: result.statistics?.total_revenue?.value ?? base.total_revenue,
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

export async function getAdminVehicleTypeById(id: number): Promise<VehicleType> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const url = `${API_BASE_URL}/api/admin/vehicle-types/${id}`;
  const response = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "فشل في جلب تفاصيل نوع المركبة");
  }
  const result: AdminVehicleTypeDetailsResponse = await response.json();
  return mapDetailsToModel(result);
}

function buildMultipartHeaders(): HeadersInit {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

function buildVehicleTypeFormData(input: VehicleTypeUpsertInput, method?: "put"): FormData {
  const formData = new FormData();
  if (method) {
    formData.append("_method", method);
  }
  formData.append("name_ar", input.name_ar || "");
  formData.append("name_en", input.name_en || input.name_ar || "");
  formData.append("base_fare", formatMoney(input.base_fare));
  formData.append("price_per_km", formatMoney(input.price_per_km));
  formData.append("requires_subscription", input.requires_subscription ? "1" : "0");
  const wait = Number.isFinite(input.wait_time_seconds as number)
    ? Math.max(0, Math.floor(input.wait_time_seconds as number))
    : 0;
  formData.append("wait_time_seconds", String(wait));
  formData.append("active", input.active ? "1" : "0");
  const sort = Number.isFinite(input.sort_order as number)
    ? Math.max(1, Math.floor(input.sort_order as number))
    : 1;
  formData.append("sort_order", String(sort));
  formData.append("max_search_radius_km", formatDistance(input.max_search_radius_km));
  if (input.iconFile) {
    formData.append("icon", input.iconFile);
  }
  return formData;
}

export async function createAdminVehicleType(input: VehicleTypeUpsertInput): Promise<VehicleType> {
  const headers = buildMultipartHeaders();
  const formData = buildVehicleTypeFormData(input);

  const url = `${API_BASE_URL}/api/admin/vehicle-types`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
    body: formData,
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
    name_ar: input.name_ar || "",
    name_en: input.name_en || input.name_ar || "",
    icon: null,
    base_fare: toNumber(input.base_fare),
    price_per_km: toNumber(input.price_per_km),
    requires_subscription: !!input.requires_subscription,
    wait_time_seconds: (input.wait_time_seconds as number) ?? 0,
    active: !!input.active,
    sort_order: (input.sort_order as number) ?? 1,
    max_search_radius_km: toNumber(input.max_search_radius_km),
    has_ac: inferHasAc(input.name_ar || input.name_en || ""),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function updateAdminVehicleType(id: number, input: VehicleTypeUpsertInput): Promise<VehicleType> {
  const headers = buildMultipartHeaders();
  const formData = buildVehicleTypeFormData(input, "put");

  const url = `${API_BASE_URL}/api/admin/vehicle-types/${id}`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
    body: formData,
  });
  if (!response.ok) {
    let message = "فشل في تعديل نوع المركبة";
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
  const refreshed = await getAdminVehicleTypeById(id);
  return refreshed;
}

export async function toggleAdminVehicleTypeActive(id: number): Promise<VehicleType | null> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/vehicle-types/${id}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers,
    credentials: "include",
  });
  if (!response.ok) {
    let message = "فشل في تغيير حالة نوع المركبة";
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

  const result: AdminVehicleTypeActionResponse = await response.json();
  if (result?.data) {
    return mapApiToModel(result.data);
  }
  return null;
}

export async function changeAdminVehicleTypesOrder(orders: ChangeOrderRequest["orders"]): Promise<void> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const payload: ChangeOrderRequest = {
    orders: orders.map((o) => ({
      id: o.id,
      sort_order: Math.max(1, Math.floor(o.sort_order)),
    })),
  };

  const url = `${API_BASE_URL}/api/admin/vehicle-types/change-order`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let message = "فشل في تحديث ترتيب أنواع المركبات";
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

  const result: ChangeOrderResponse = await response.json();
  if (!result?.message) {
    return;
  }
}
