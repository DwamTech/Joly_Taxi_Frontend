import { User } from "@/models/User";
import { AuthService } from "./authService";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
).replace(/\/+$/, "");

export interface ApiUser {
  id: number;
  name: string;
  phone: string;
  type: "user" | "rider" | "driver" | "both";
  status: "active" | "inactive" | "blocked";
  profile_status?: "pending" | "approved" | "rejected";
  verification_status?: "pending" | "approved" | "rejected";
  registration_date: string;
  last_activity: string;
}

export interface RiderInfo {
  average_rating: number;
  total_ratings: number;
  completed_trips: number;
  cancelled_trips: number;
}

export interface DriverDocument {
  id: number;
  type: string;
  url: string;
  expires_at: string | null;
  status: string | null;
}

export interface DriverInfo {
  national_id: string;
  license_expiry: string;
  profile_expiry: string;
  verification_status: "pending" | "approved" | "rejected";
  profile_status?: "pending" | "approved" | "rejected";
  status?: "pending" | "approved" | "rejected";
  online_status: "online" | "offline";
  average_rating: number;
  total_ratings: number;
  completed_trips: number;
  cancelled_trips: number;
  vehicle: any | null;
  subscriptions: any[];
  documents: DriverDocument[];
}

export interface ApiUserDetails {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  type: "user" | "rider" | "driver" | "both";
  status: "active" | "inactive" | "blocked";
  registration_date: string;
  last_login: string;
  rider_info?: RiderInfo;
  driver_info?: DriverInfo;
}

export interface UserDetailsResponse {
  message: string;
  data: ApiUserDetails;
}

export interface ActivityLog {
  id: number;
  date: string;
  status: "ended" | "cancelled" | "ongoing";
  from_address: string | null;
  to_address: string | null;
  distance_km: string;
  eta_seconds: number;
  requires_ac: boolean;
  amount: string;
}

export interface ActivityLogResponse {
  message: string;
  data: ActivityLog[];
}

export interface TripInfo {
  id: number;
  from_address: string | null;
  to_address: string | null;
  status: string;
  date: string;
  price: string;
}

export interface ReportAgainst {
  id: number;
  date: string;
  reporter_name: string;
  description: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  trip_info: TripInfo;
}

export interface ReportFrom {
  id: number;
  date: string;
  reported_name: string;
  type: string;
  description: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  trip_info: TripInfo;
}

export interface UserReportsData {
  reports_against: ReportAgainst[];
  reports_from: ReportFrom[];
}

export interface UserReportsResponse {
  message: string;
  data: UserReportsData;
}

export interface UsersStatsResponse {
  total_users: number;
  total_drivers: number;
  total_riders: number;
  total_both: number;
  active_users: number;
  active_drivers: number;
  active_riders: number;
  inactive_users: number;
  blocked_users: number;
  verified_drivers?: number;
}

export interface UsersResponse {
  message: string;
  data: ApiUser[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
  stats?: UsersStatsResponse;
}

export interface CreateAdminUserPayload {
  name: string;
  phone: string;
  email?: string;
  password: string;
  role: "driver" | "rider" | "admin";
  status?: "active" | "blocked";
  agent_code?: number;
  national_id_number?: string;
  driver_license_expiry?: string;
  vehicle_type_id?: number;
  brand_id?: number;
  model_id?: number;
  vehicle_year_id?: number;
  brand?: string;
  model?: string;
  year?: number;
  has_ac?: boolean;
  vehicle_license_number?: string;
  vehicle_license_expiry?: string;
  driver_photo?: File | null;
  national_id_front?: File | null;
  national_id_back?: File | null;
  driver_license_front?: File | null;
  driver_license_back?: File | null;
  vehicle_license_front?: File | null;
  vehicle_license_back?: File | null;
}

function toSafeNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function normalizeUsersStatsResponse(raw: unknown): UsersStatsResponse {
  const source =
    raw && typeof raw === "object"
      ? ((raw as { stats?: unknown }).stats ??
        (raw as { data?: unknown }).data ??
        raw)
      : {};
  const payload = (source && typeof source === "object" ? source : {}) as Record<string, unknown>;
  const totalUsers = toSafeNumber(payload.total_users ?? payload.active_users);
  const totalDrivers = toSafeNumber(payload.total_drivers ?? payload.verified_drivers);
  const totalRiders = toSafeNumber(payload.total_riders);
  const totalBoth = toSafeNumber(payload.total_both);
  const activeUsers = toSafeNumber(payload.active_users);
  const activeDrivers = toSafeNumber(payload.active_drivers ?? payload.verified_drivers);
  const activeRiders = toSafeNumber(payload.active_riders ?? payload.total_riders);
  const inactiveUsers = toSafeNumber(payload.inactive_users);
  const blockedUsers = toSafeNumber(payload.blocked_users);

  return {
    total_users: totalUsers,
    total_drivers: totalDrivers,
    total_riders: totalRiders,
    total_both: totalBoth,
    active_users: activeUsers,
    active_drivers: activeDrivers,
    active_riders: activeRiders,
    inactive_users: inactiveUsers,
    blocked_users: blockedUsers,
    verified_drivers: toSafeNumber(payload.verified_drivers),
  };
}

export const usersService = {
  async createUser(payload: CreateAdminUserPayload): Promise<any> {
    try {
      const token = AuthService.getToken();
      const headers: HeadersInit = {
        Accept: "application/json",
        "x-lang": "ar",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const formData = new FormData();
      formData.append("name", payload.name.trim());
      formData.append("phone", payload.phone.trim());
      formData.append("password", payload.password);
      formData.append("role", payload.role);

      if (payload.email?.trim()) formData.append("email", payload.email.trim());
      if (payload.status) formData.append("status", payload.status);
      if (payload.agent_code !== undefined) formData.append("agent_code", String(payload.agent_code));

      if (payload.national_id_number?.trim()) {
        formData.append("national_id_number", payload.national_id_number.trim());
      }
      if (payload.driver_license_expiry) formData.append("driver_license_expiry", payload.driver_license_expiry);
      if (payload.vehicle_type_id !== undefined) {
        formData.append("vehicle_type_id", String(payload.vehicle_type_id));
      }
      if (payload.brand_id !== undefined) formData.append("brand_id", String(payload.brand_id));
      if (payload.model_id !== undefined) formData.append("model_id", String(payload.model_id));
      if (payload.vehicle_year_id !== undefined) {
        formData.append("vehicle_year_id", String(payload.vehicle_year_id));
      }
      if (payload.brand?.trim()) formData.append("brand", payload.brand.trim());
      if (payload.model?.trim()) formData.append("model", payload.model.trim());
      if (payload.year !== undefined) formData.append("year", String(payload.year));
      if (payload.has_ac !== undefined) formData.append("has_ac", payload.has_ac ? "1" : "0");
      if (payload.vehicle_license_number?.trim()) {
        formData.append("vehicle_license_number", payload.vehicle_license_number.trim());
      }
      if (payload.vehicle_license_expiry) {
        formData.append("vehicle_license_expiry", payload.vehicle_license_expiry);
      }

      if (payload.driver_photo instanceof File) formData.append("driver_photo", payload.driver_photo);
      if (payload.national_id_front instanceof File) {
        formData.append("national_id_front", payload.national_id_front);
      }
      if (payload.national_id_back instanceof File) formData.append("national_id_back", payload.national_id_back);
      if (payload.driver_license_front instanceof File) {
        formData.append("driver_license_front", payload.driver_license_front);
      }
      if (payload.driver_license_back instanceof File) {
        formData.append("driver_license_back", payload.driver_license_back);
      }
      if (payload.vehicle_license_front instanceof File) {
        formData.append("vehicle_license_front", payload.vehicle_license_front);
      }
      if (payload.vehicle_license_back instanceof File) {
        formData.append("vehicle_license_back", payload.vehicle_license_back);
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: "POST",
        headers,
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        const message = errJson?.message || "فشل في إضافة المستخدم";
        const details =
          errJson?.errors && typeof errJson.errors === "object"
            ? Object.values(errJson.errors).flat().join(" | ")
            : "";
        throw new Error(details ? `${message}: ${details}` : message);
      }

      return response.json();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async getUsers(page: number = 1): Promise<UsersResponse> {
    try {
      // Get token from Cookie using AuthService
      const token = AuthService.getToken();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Add authorization header if token exists
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const url = `${API_BASE_URL}/api/admin/users?page=${page}`;
      console.log('Fetching users from:', url);

      const response = await fetch(url, {
        method: "GET",
        headers,
        credentials: 'include', // لإرسال الـ Cookies
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`فشل في جلب بيانات المستخدمين: ${response.status}`);
      }

      const data: UsersResponse = await response.json();
      console.log('Users data received:', data);
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  async getUsersStats(): Promise<UsersStatsResponse> {
    try {
      const token = AuthService.getToken();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const endpoints = ["/api/admin/users/stats", "/api/admin/users/status"];
      for (const endpoint of endpoints) {
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, {
          method: "GET",
          headers,
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          return normalizeUsersStatsResponse(result);
        }
      }

      throw new Error("فشل في جلب إحصائيات المستخدمين");
    } catch (error) {
      console.error("Error fetching users stats:", error);
      throw error;
    }
  },

  async getUserDetails(userId: number): Promise<ApiUserDetails> {
    try {
      const token = AuthService.getToken();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/users/${userId}`,
        {
          method: "GET",
          headers,
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error("فشل في جلب تفاصيل المستخدم");
      }

      const result: UserDetailsResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  },

  async getUserActivityLog(userId: number): Promise<ActivityLog[]> {
    try {
      const token = AuthService.getToken();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/users/${userId}/activity-log`,
        {
          method: "GET",
          headers,
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error("فشل في جلب سجل النشاط");
      }

      const result: ActivityLogResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching activity log:", error);
      throw error;
    }
  },

  async deleteUser(userId: number): Promise<void> {
    try {
      const token = AuthService.getToken();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers,
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "فشل في حذف المستخدم");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  async getUserReports(userId: number): Promise<UserReportsData> {
    try {
      const token = AuthService.getToken();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const url = `${API_BASE_URL}/api/admin/users/${userId}/reports`;
      console.log('Fetching reports from:', url);

      const response = await fetch(url, {
        method: "GET",
        headers,
        credentials: 'include',
      });

      console.log('Reports response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Reports API Error:', errorText);
        throw new Error(`فشل في جلب الشكاوى: ${response.status}`);
      }

      const result: UserReportsResponse = await response.json();
      console.log('Reports data received:', result);
      // Ensure we always return proper structure
      return {
        reports_against: Array.isArray(result.data?.reports_against) ? result.data.reports_against : [],
        reports_from: Array.isArray(result.data?.reports_from) ? result.data.reports_from : []
      };
    } catch (error) {
      console.error("Error fetching user reports:", error);
      throw error;
    }
  },

  async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    try {
      const token = AuthService.getToken();
      
      const headers: HeadersInit = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Use FormData for file uploads and Laravel PUT method spoofing
      const formData = new FormData();
      
      // Add _method for Laravel
      formData.append('_method', 'PUT');
      
      // Add basic fields
      if (userData.name) formData.append('name', userData.name);
      if (userData.phone) formData.append('phone', userData.phone);
      if (userData.email) formData.append('email', userData.email);
      if (userData.role) formData.append('type', userData.role);
      if (userData.status) formData.append('status', userData.status);
      if (userData.agent_code) formData.append('agent_code', userData.agent_code);
      if (userData.delegate_number) formData.append('delegate_number', userData.delegate_number);
      const updatePayload = userData as Partial<User> & {
        block_reason?: string;
        rejection_reason?: string;
      };
      if (updatePayload.block_reason) {
        formData.append('reason', updatePayload.block_reason);
      }
      if (updatePayload.rejection_reason) {
        formData.append('rejection_reason', updatePayload.rejection_reason);
      }

      // Add driver data if exists
      if (userData.driver_profile) {
        if (userData.driver_profile.national_id_number) {
          formData.append('national_id', userData.driver_profile.national_id_number);
        }
        if (userData.driver_profile.driver_license_expiry) {
          formData.append('license_expiry', userData.driver_profile.driver_license_expiry);
        }
        if (userData.driver_profile.expire_profile_at) {
          formData.append('profile_expiry', userData.driver_profile.expire_profile_at);
        }
        if (userData.driver_profile.verification_status) {
          formData.append('verification_status', userData.driver_profile.verification_status);
          formData.append('profile_status', userData.driver_profile.verification_status);
        }
        if (userData.driver_profile.profile_status) {
          formData.append('profile_status', userData.driver_profile.profile_status);
        }
      }

      // Add vehicle data if exists
      if (userData.vehicle) {
        if (userData.vehicle.type) formData.append('vehicle_type', userData.vehicle.type);
        if (userData.vehicle.brand) formData.append('vehicle_brand', userData.vehicle.brand);
        if (userData.vehicle.model) formData.append('vehicle_model', userData.vehicle.model);
        if (userData.vehicle.year) formData.append('vehicle_year', userData.vehicle.year.toString());
        if (userData.vehicle.vehicle_license_number) {
          formData.append('vehicle_license_number', userData.vehicle.vehicle_license_number);
        }
        if (userData.vehicle.vehicle_license_expiry) {
          formData.append('vehicle_license_expiry', userData.vehicle.vehicle_license_expiry);
        }
        formData.append('has_ac', userData.vehicle.has_ac ? '1' : '0');
      }

      // Add rider data if exists
      if (userData.rider_profile) {
        if (userData.rider_profile.reliability_percent !== undefined) {
          formData.append('reliability_percent', userData.rider_profile.reliability_percent.toString());
        }
        if (userData.rider_profile.preferences) {
          if (userData.rider_profile.preferences.preferred_vehicle_types) {
            formData.append(
              'preferred_vehicle_types',
              JSON.stringify(userData.rider_profile.preferences.preferred_vehicle_types)
            );
          }
          if (userData.rider_profile.preferences.requires_ac !== undefined) {
            formData.append('requires_ac', userData.rider_profile.preferences.requires_ac ? '1' : '0');
          }
          if (userData.rider_profile.preferences.language) {
            formData.append('language', userData.rider_profile.preferences.language);
          }
        }
      }

      const url = `${API_BASE_URL}/api/admin/users/${userId}`;
      console.log('Updating user at:', url);

      const response = await fetch(url, {
        method: "POST", // Use POST with _method=PUT for Laravel
        headers,
        credentials: 'include',
        body: formData,
      });

      console.log('Update response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Update API Error:', errorData);
        throw new Error(errorData.message || `فشل في تحديث المستخدم: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update successful:', result);
      
      // Return the updated user
      return userData as User;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  async toggleBlockUser(userId: number, reason?: string): Promise<{ status: string; message: string }> {
    try {
      const token = AuthService.getToken();
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const url = `${API_BASE_URL}/api/admin/users/${userId}/toggle-block`;
      console.log('Toggling block status at:', url);

      const response = await fetch(url, {
        method: "POST",
        headers,
        credentials: 'include',
        body: reason ? JSON.stringify({ reason }) : undefined,
      });

      console.log('Toggle block response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Toggle block API Error:', errorData);
        throw new Error(errorData.message || `فشل في تغيير حالة الحظر: ${response.status}`);
      }

      const result = await response.json();
      console.log('Toggle block successful:', result);
      
      return {
        status: result.data?.status || result.status || 'blocked',
        message: result.message || 'تم تغيير حالة الحظر بنجاح'
      };
    } catch (error) {
      console.error("Error toggling block status:", error);
      throw error;
    }
  },

  // Convert API user to UI user format
  convertToUIUser(apiUser: ApiUser): User {
    const profileStatus = apiUser.profile_status || apiUser.verification_status;
    const isDriver = apiUser.type === "driver" || apiUser.type === "both";
    const now = new Date().toISOString();

    return {
      id: apiUser.id,
      name: apiUser.name,
      phone: apiUser.phone,
      email: null,
      role: apiUser.type === "user" ? "user" : apiUser.type === "rider" ? "user" : apiUser.type,
      status: apiUser.status,
      agent_code: null,
      delegate_number: null,
      created_at: apiUser.registration_date,
      last_active_at: apiUser.last_activity,
      last_login_at: apiUser.last_activity,
      driver_profile: isDriver
        ? {
            national_id_number: "",
            driver_license_expiry: now,
            expire_profile_at: now,
            verification_status: profileStatus || "pending",
            profile_status: profileStatus || "pending",
            online_status: false,
            rating_avg: 0,
            rating_count: 0,
            completed_trips_count: 0,
            cancelled_trips_count: 0,
          }
        : undefined,
    };
  },
};

// Named exports for direct imports
export const getAllUsers = (page?: number) => usersService.getUsers(page);
export const getUsers = (page?: number) => usersService.getUsers(page);
export const createUser = (payload: CreateAdminUserPayload) => usersService.createUser(payload);
export const getUsersStats = () => usersService.getUsersStats();
export const getUserDetails = (userId: number) => usersService.getUserDetails(userId);
export const updateUser = (userId: number, userData: Partial<User>) => usersService.updateUser(userId, userData);
export const toggleBlockUser = (userId: number, reason?: string) => usersService.toggleBlockUser(userId, reason);
export const deleteUser = (userId: number) => usersService.deleteUser(userId);
export const convertToUIUser = (apiUser: ApiUser): User => usersService.convertToUIUser(apiUser);

export async function getUserReports(userId: number): Promise<UserReportsData> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/reports`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `فشل في جلب الشكاوى: ${response.status}`);
  }

  const result: UserReportsResponse = await response.json();
  return result.data ?? { reports_against: [], reports_from: [] };
}

export async function getUserActivityLog(userId: number): Promise<import("@/models/Trip").Trip[]> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const endpoints = [
    `${API_BASE_URL}/api/admin/users/${userId}/activity-log`,
    `${API_BASE_URL}/api/admin/users/${userId}/trips`,
  ];

  for (const endpoint of endpoints) {
    const response = await fetch(endpoint, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 404 && endpoint.endsWith("/activity-log")) {
        continue;
      }
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `فشل في جلب سجل النشاط: ${response.status}`);
    }

    const result = await response.json();
    const raw: ActivityLog[] = Array.isArray(result) ? result : (result.data ?? []);

    return raw.map((a) => ({
      id: a.id,
      rider_user_id: userId,
      vehicle_type_id: 0,
      from_lat: 0,
      from_lng: 0,
      to_lat: 0,
      to_lng: 0,
      from_address: a.from_address ?? "",
      to_address: a.to_address ?? "",
      distance_km: parseFloat(String(a.distance_km)) || 0,
      eta_seconds: a.eta_seconds,
      price_per_km_snapshot: 0,
      suggested_price: parseFloat(String(a.amount)) || 0,
      final_price: parseFloat(String(a.amount)) || 0,
      requires_ac: a.requires_ac,
      status: a.status as import("@/models/Trip").TripStatus,
      created_at: a.date,
      updated_at: a.date,
    }));
  }

  throw new Error("فشل في جلب سجل النشاط");
}
