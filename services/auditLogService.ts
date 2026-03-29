import { AuditLogFilters, AuditLogResponse } from "@/models/AuditLog";
import { AuthService } from "./authService";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
).replace(/\/+$/, "");

export class AuditLogService {
  static async getAuditLogs(
    filters: AuditLogFilters = {}
  ): Promise<AuditLogResponse> {
    const token = AuthService.getToken();

    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.action_type && filters.action_type !== "all")
      params.set("action_type", filters.action_type);
    if (filters.admin_id && filters.admin_id !== "all")
      params.set("admin_id", filters.admin_id);
    if (filters.date_from) params.set("date_from", filters.date_from);
    if (filters.date_to) params.set("date_to", filters.date_to);
    params.set("page", String(filters.page ?? 1));
    params.set("per_page", String(filters.per_page ?? 20));

    const url = `${API_BASE_URL}/api/admin/audit-logs?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`فشل تحميل سجل النشاطات: ${response.status}`);
    }

    const json = await response.json();

    // normalize response — handle both paginated and flat array shapes
    if (Array.isArray(json)) {
      return {
        data: json,
        pagination: {
          current_page: filters.page ?? 1,
          last_page: 1,
          per_page: filters.per_page ?? 20,
          total: json.length,
        },
      };
    }

    // Laravel-style paginated response: { data, current_page, last_page, total, per_page }
    if (json.data && json.current_page !== undefined) {
      return {
        data: json.data,
        pagination: {
          current_page: json.current_page,
          last_page: json.last_page,
          per_page: json.per_page,
          total: json.total,
        },
        stats: json.stats,
      };
    }

    // wrapped response: { data: { data, pagination }, stats }
    return json as AuditLogResponse;
  }
}
