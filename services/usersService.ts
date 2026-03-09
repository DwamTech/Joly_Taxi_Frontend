import { User } from "@/models/User";
import { AuthService } from "./authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ApiUser {
  id: number;
  name: string;
  phone: string;
  type: "user" | "rider" | "driver" | "both";
  status: "active" | "inactive" | "blocked";
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
  active_users: number;
  total_riders: number;
  verified_drivers: number;
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

export const usersService = {
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

      const url = `${API_BASE_URL}/api/admin/users/status`;
      console.log('Fetching users stats from:', url);

      const response = await fetch(url, {
        method: "GET",
        headers,
        credentials: 'include',
      });

      console.log('Stats response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Stats API Error:', errorText);
        throw new Error(`فشل في جلب إحصائيات المستخدمين: ${response.status}`);
      }

      const result = await response.json();
      console.log('Stats data received:', result);
      
      // Return data from response
      return result.data;
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

  async toggleBlockUser(userId: number): Promise<{ status: string; message: string }> {
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
    };
  },
};
