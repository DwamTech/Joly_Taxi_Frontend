import { AdminApi, AdminListPagination, AdminPage, AdminStatus } from "@/models/Permission";
import { AuthService } from "./authService";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
).replace(/\/+$/, "");

export interface AdminListResult {
  admins: AdminApi[];
  pagination: AdminListPagination;
}

export interface AdminFilters {
  search?: string;
  email?: string;
  role?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

export class PermissionsService {
  static async deleteAdmin(adminId: number): Promise<void> {
    const token = AuthService.getToken();
    const response = await fetch(`${API_BASE_URL}/api/admin/admins/${adminId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
    if (!response.ok) throw new Error(`فشل حذف المسؤول: ${response.status}`);
  }

  static async createAdmin(data: {
    name: string;
    email: string;
    phone?: string;
    role: string;
    password: string;
  }): Promise<AdminApi> {
    const token = AuthService.getToken();
    const response = await fetch(`${API_BASE_URL}/api/admin/admins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`فشل إضافة المسؤول: ${response.status}`);
    const json = await response.json();
    return json.data as AdminApi;
  }

  static async updateAdmin(
    adminId: number,
    data: { name: string; email: string; phone?: string; role: string }
  ): Promise<AdminApi> {
    const token = AuthService.getToken();
    const response = await fetch(`${API_BASE_URL}/api/admin/admins/${adminId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`فشل تحديث بيانات المسؤول: ${response.status}`);
    const json = await response.json();
    return json.data as AdminApi;
  }

  static async updateAdminStatus(adminId: number, status: AdminStatus): Promise<void> {
    const token = AuthService.getToken();
    const response = await fetch(`${API_BASE_URL}/api/admin/admins/${adminId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error(`فشل تحديث حالة المسؤول: ${response.status}`);
  }

  static async updateAdminPermissions(
    adminId: number,
    role: string,
    pageIds: number[]
  ): Promise<AdminApi> {
    const token = AuthService.getToken();
    const response = await fetch(`${API_BASE_URL}/api/admin/admins/${adminId}/permissions`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify({ role, page_ids: pageIds }),
    });
    if (!response.ok) throw new Error(`فشل تحديث الصلاحيات: ${response.status}`);
    const json = await response.json();
    return json.data as AdminApi;
  }

  static async getAvailablePages(): Promise<AdminPage[]> {
    const token = AuthService.getToken();
    const response = await fetch(`${API_BASE_URL}/api/admin/admins/pages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
    if (!response.ok) throw new Error(`فشل تحميل الصفحات: ${response.status}`);
    const json = await response.json();
    return json.data as AdminPage[];
  }

  static async getAdminById(id: number): Promise<AdminApi> {
    const token = AuthService.getToken();
    const response = await fetch(`${API_BASE_URL}/api/admin/admins/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
    if (!response.ok) throw new Error(`فشل تحميل بيانات المسؤول: ${response.status}`);
    const json = await response.json();
    return json.data as AdminApi;
  }

  static async getAdmins(filters: AdminFilters = {}): Promise<AdminListResult> {
    const token = AuthService.getToken();

    const params = new URLSearchParams();
    if (filters.search)  params.set("search", filters.search);
    if (filters.email)   params.set("email", filters.email);
    if (filters.role && filters.role !== "all")     params.set("role", filters.role);
    if (filters.status && filters.status !== "all") params.set("status", filters.status);
    params.set("page", String(filters.page ?? 1));
    params.set("per_page", String(filters.per_page ?? 20));

    const response = await fetch(
      `${API_BASE_URL}/api/admin/admins?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`فشل تحميل قائمة المسؤولين: ${response.status}`);
    }

    const json = await response.json();
    const { data } = json;

    return {
      admins: data.data as AdminApi[],
      pagination: {
        current_page: data.current_page,
        last_page:    data.last_page,
        per_page:     data.per_page,
        total:        data.total,
      },
    };
  }
}
