import { Subscription } from "@/models/Subscription";
import { AuthService } from "./authService";

const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
    : "";

interface ApiDriver {
  id?: number;
  role?: string;
  name?: string;
  phone?: string | null;
  avatar?: string | null;
  image?: string | null;
  profile_image?: string | null;
  rating?: number | string | null;
  rating_avg?: number | string | null;
  completed_trips?: number | string | null;
  trips_completed?: number | string | null;
  previous_subscriptions?: number | string | null;
  subscriptions_count?: number | string | null;
}

interface ApiPaymentInfo {
  amount_paid?: number | string | null;
  paid_amount?: number | string | null;
  reference_number?: string | null;
  reference?: string | null;
  receipt_image?: string | null;
  payment_method?: string | null;
  payment_date?: string | null;
  additional_notes?: string | null;
}

interface ApiSubscription {
  id: number;
  subscription_number?: string | null;
  driver_id?: number | string | null;
  vehicle_type_id?: number | string | null;
  driver?: ApiDriver | null;
  user?: ApiDriver | null;
  driver_user?: ApiDriver | null;
  vehicle_type?:
    | string
    | { name?: string | null; name_ar?: string | null; name_en?: string | null }
    | null;
  months_count?: number | string | null;
  months?: number | string | null;
  total_price?: number | string | null;
  reference?: string | null;
  paid_amount?: number | string | null;
  payment_method?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  activated_at?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  days_remaining?: number | string | null;
  days_used?: number | string | null;
  total_days?: number | string | null;
  payment_info?: ApiPaymentInfo | null;
  rejected_reason?: string | null;
  cancelled_reason?: string | null;
  cancelled_at?: string | null;
}

interface LaravelPagination<T> {
  current_page?: number;
  data?: T[];
  last_page?: number;
  per_page?: number;
  total?: number;
}

interface AdminSubscriptionsResponse {
  message?: string;
  data?: ApiSubscription[] | LaravelPagination<ApiSubscription>;
  pagination?: LaravelPagination<ApiSubscription>;
}

interface AdminSubscriptionDetailsResponse {
  message?: string;
  data?: ApiSubscription;
}

interface CreateOrRenewApiResponse {
  ok?: boolean;
  message?: string;
  data?: ApiSubscription;
}

export interface AdminSubscriptionsResult {
  subscriptions: Subscription[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

export interface CreateOrRenewSubscriptionPayload {
  driver_id: number;
  vehicle_type_id: number;
  months: number;
}

export interface CreateOrRenewSubscriptionResult {
  message: string;
  subscription: Subscription;
}

function toNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
  return fallback;
}

function mapStatus(status: string | null | undefined): Subscription["status"] {
  const normalized = (status || "").toLowerCase();
  if (normalized === "pending") return "pending";
  if (normalized === "active") return "active";
  if (normalized === "expired") return "expired";
  if (normalized === "rejected" || normalized === "reject") return "rejected";
  if (normalized === "cancelled" || normalized === "canceled" || normalized === "canceled") return "cancelled";
  return "pending";
}

function mapPaymentMethod(method: string | null | undefined): Subscription["payment_info"]["payment_method"] {
  const normalized = (method || "").toLowerCase();
  if (normalized === "bank_transfer" || normalized === "bank") return "bank_transfer";
  if (normalized === "cash") return "cash";
  if (normalized === "card" || normalized === "visa" || normalized === "mastercard") return "card";
  return "bank_transfer";
}

function mapApiSubscriptionToModel(api: ApiSubscription): Subscription {
  const driver = api.driver || api.driver_user || api.user || {};
  const paymentInfo = api.payment_info || {};

  const vehicleType =
    typeof api.vehicle_type === "string"
      ? api.vehicle_type
      : api.vehicle_type && typeof api.vehicle_type === "object"
        ? api.vehicle_type.name || api.vehicle_type.name_ar || api.vehicle_type.name_en || "-"
        : "-";

  const createdAt = api.created_at || new Date().toISOString();
  const totalPrice = toNumber(api.total_price, 0);
  const monthsCount = toNumber(api.months_count ?? api.months, 0);
  const startDate = api.start_date || undefined;
  let endDate = api.end_date || undefined;
  if (!endDate && startDate && monthsCount > 0) {
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + monthsCount);
    endDate = d.toISOString();
  }
  let daysRemaining: number | undefined =
    api.days_remaining === null || api.days_remaining === undefined
      ? undefined
      : toNumber(api.days_remaining, 0);
  if (daysRemaining === undefined && endDate) {
    const msDiff = new Date(endDate).getTime() - Date.now();
    daysRemaining = Math.ceil(msDiff / (1000 * 60 * 60 * 24));
  }

  return {
    id: api.id,
    subscription_number: api.subscription_number || api.reference || `SUB-${api.id}`,
    driver: {
      id: toNumber(driver.id, 0),
      name: driver.name || "-",
      phone: driver.phone || "-",
      avatar: driver.avatar || driver.image || driver.profile_image || undefined,
      rating: toNumber(driver.rating ?? driver.rating_avg, 0),
      completed_trips: toNumber(driver.completed_trips ?? driver.trips_completed, 0),
      previous_subscriptions: toNumber(driver.previous_subscriptions ?? driver.subscriptions_count, 0),
    },
    vehicle_type: vehicleType || "-",
    months_count: monthsCount,
    total_price: totalPrice,
    status: mapStatus(api.status),
    created_at: createdAt,
    activated_at: api.activated_at || undefined,
    start_date: startDate,
    end_date: endDate,
    days_remaining: daysRemaining,
    payment_info: {
      amount_paid: toNumber(paymentInfo.amount_paid ?? paymentInfo.paid_amount ?? api.paid_amount, totalPrice),
      reference_number: paymentInfo.reference_number || paymentInfo.reference || api.reference || "",
      receipt_image: paymentInfo.receipt_image || undefined,
      payment_method: mapPaymentMethod(paymentInfo.payment_method || api.payment_method),
      payment_date: paymentInfo.payment_date || api.updated_at || createdAt,
      additional_notes: paymentInfo.additional_notes || undefined,
    },
    rejected_reason: api.rejected_reason || undefined,
    cancelled_reason: api.cancelled_reason || undefined,
    cancelled_at: api.cancelled_at || undefined,
  };
}

export async function createOrRenewAdminSubscription(
  payload: CreateOrRenewSubscriptionPayload
): Promise<CreateOrRenewSubscriptionResult> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/subscriptions/create-or-renew`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "فشل في إنشاء/تجديد الاشتراك";
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

  const result: CreateOrRenewApiResponse = await response.json();
  if (!result?.data) {
    throw new Error(result?.message || "استجابة إنشاء الاشتراك غير صالحة");
  }

  return {
    message: result.message || "تم إنشاء/تجديد الاشتراك بنجاح",
    subscription: mapApiSubscriptionToModel(result.data),
  };
}

export async function getAdminSubscriptions(page: number = 1): Promise<AdminSubscriptionsResult> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/subscriptions?page=${page}`;
  const response = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    let message = "فشل في جلب الاشتراكات";
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

  const json: AdminSubscriptionsResponse = await response.json();

  const paginated = json.data && !Array.isArray(json.data) ? json.data : null;
  const list: ApiSubscription[] = Array.isArray(json.data) ? json.data : Array.isArray(paginated?.data) ? paginated.data : [];

  const pageInfo = paginated || json.pagination;
  const currentPage = pageInfo?.current_page ?? page;
  const lastPage = pageInfo?.last_page ?? 1;
  const perPage = pageInfo?.per_page ?? list.length;
  const total = pageInfo?.total ?? list.length;

  return {
    subscriptions: list.map(mapApiSubscriptionToModel),
    pagination: {
      currentPage,
      lastPage,
      perPage,
      total,
    },
  };
}

export async function getAdminSubscriptionById(subscriptionId: number): Promise<Subscription> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/subscriptions/${subscriptionId}`;
  const response = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    let message = "فشل في جلب تفاصيل الاشتراك";
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

  const json: AdminSubscriptionDetailsResponse | any = await response.json();
  const api: ApiSubscription | undefined =
    json?.data ||
    json?.subscription ||
    json?.data?.subscription ||
    undefined;
  if (!api) {
    throw new Error("لم يتم العثور على تفاصيل الاشتراك");
  }
  return mapApiSubscriptionToModel(api);
}
