import { TripReport } from "@/models/TripReport";
import { AuthService } from "./authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface ApiReportUser {
  id: number;
  role: string;
  name: string;
  phone: string | null;
  email: string | null;
  agent_code: string | null;
  status: string | null;
  locale: string | null;
  created_at: string;
  updated_at: string;
  role_name?: string | null;
}

interface ApiTripRequest {
  id: number;
  from_address?: string | null;
  to_address?: string | null;
  status?: string | null;
  status_name?: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiReport {
  id: number;
  trip_request_id: number;
  reporter_id: number;
  reported_id: number;
  reason: string;
  report_type: string | null;
  description: string | null;
  status: "pending" | "resolved" | string;
  admin_notes: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  resolved_by: number | null;
  reporter?: ApiReportUser | null;
  reported?: ApiReportUser | null;
  trip_request?: ApiTripRequest | null;
}

interface Paginated<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}

interface AdminReportsResponse {
  message: string;
  data: Paginated<ApiReport>;
}

interface AdminReportDetailsResponse {
  message: string;
  data: ApiReport;
}

interface AdminReportActionResponse {
  message: string;
}

interface AdminReportNotesResponse {
  message: string;
  data?: ApiReport;
}

export interface AdminReportsResult {
  reports: TripReport[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

function mapUser(user: ApiReportUser | null | undefined): TripReport["reporter"] | undefined {
  if (!user) return undefined;
  const type: "rider" | "driver" = user.role === "driver" ? "driver" : "rider";
  return {
    id: user.id,
    name: user.name,
    phone: user.phone || "",
    type,
    reports_count: 0,
  };
}

function mapReportedUser(user: ApiReportUser | null | undefined): TripReport["reported"] | undefined {
  if (!user) return undefined;
  const type: "rider" | "driver" = user.role === "driver" ? "driver" : "rider";
  return {
    id: user.id,
    name: user.name,
    phone: user.phone || "",
    type,
    reports_received_count: 0,
    rating_avg: 0,
  };
}

function mapReport(api: ApiReport): TripReport {
  const status: "pending" | "resolved" = api.status === "resolved" ? "resolved" : "pending";
  return {
    id: api.id,
    trip_request_id: api.trip_request_id,
    reporter_id: api.reporter_id,
    reported_id: api.reported_id,
    reason: api.reason,
    report_type: api.report_type,
    description: api.description ?? undefined,
    status,
    priority: "medium",
    admin_notes: api.admin_notes ?? undefined,
    resolved_at: api.resolved_at ?? undefined,
    resolved_by: api.resolved_by,
    created_at: api.created_at,
    updated_at: api.updated_at,
    reporter: mapUser(api.reporter),
    reported: mapReportedUser(api.reported),
    trip: api.trip_request
      ? {
          id: api.trip_request.id,
          pickup_location: api.trip_request.from_address || "",
          dropoff_location: api.trip_request.to_address || "",
          status: api.trip_request.status_name || api.trip_request.status || "",
          created_at: api.trip_request.created_at,
        }
      : undefined,
  };
}

export async function getAdminReports(page = 1): Promise<AdminReportsResult> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/reports?page=${page}`;
  const response = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "فشل في جلب البلاغات");
  }

  const result: AdminReportsResponse = await response.json();
  const pageData = result?.data;
  const list = Array.isArray(pageData?.data) ? pageData.data : [];
  return {
    reports: list.map(mapReport),
    pagination: {
      currentPage: pageData?.current_page ?? page,
      lastPage: pageData?.last_page ?? 1,
      perPage: pageData?.per_page ?? list.length,
      total: pageData?.total ?? list.length,
    },
  };
}

export async function getAdminReportById(id: number): Promise<TripReport> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/reports/${id}`;
  const response = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "فشل في جلب تفاصيل البلاغ");
  }

  const result: AdminReportDetailsResponse = await response.json();
  return mapReport(result.data);
}

export async function deleteAdminReport(id: number): Promise<void> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/reports/${id}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers,
    credentials: "include",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "فشل في حذف البلاغ");
  }

  const result: AdminReportActionResponse = await response.json();
  if (!result?.message) {
    return;
  }
}

export async function saveAdminReportNotes(id: number, adminNotes: string): Promise<TripReport | null> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/reports/${id}/notes`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ admin_notes: adminNotes }),
  });
  if (!response.ok) {
    let message = "فشل في حفظ ملاحظات الإدارة";
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

  const result: AdminReportNotesResponse = await response.json();
  if (result?.data) {
    return mapReport(result.data);
  }
  return null;
}
