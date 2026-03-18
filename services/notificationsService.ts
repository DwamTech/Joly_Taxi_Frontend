import {
  NotificationTemplate,
  CreateAdminNotificationRequest,
  CreateAdminNotificationResponse,
  NotificationHistoryItem,
} from "@/models/Notification";
import { AuthService } from "./authService";

const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
    : "";

interface SearchUserItem {
  id: number;
  name: string;
  phone: string;
  type: string;
}

interface SearchUsersApiResponse {
  data?: SearchUserItem[];
}

export interface HighCancellationWarningRequest {
  target_group: "all";
  include_stats: boolean;
}

export interface HighCancellationWarningUser {
  user_id: number;
  user_name: string;
  user_type: string;
  cancelled_trips: number;
  completed_trips: number;
  total_trips: number;
  cancellation_rate: string;
}

export interface HighCancellationWarningResponse {
  ok: boolean;
  message: string;
  data: {
    threshold: number;
    target_group: string;
    notifications_sent: number;
    notifications_failed: number;
    users: HighCancellationWarningUser[];
  };
}

class NotificationsService {
  private async fetchAPI(endpoint: string, options?: RequestInit) {
    const token = AuthService.getToken();
    const headers = new Headers({
      "Content-Type": "application/json",
      "x-lang": "ar",
      Accept: "application/json",
    });
    if (options?.headers) {
      const incomingHeaders = new Headers(options.headers);
      incomingHeaders.forEach((value, key) => {
        headers.set(key, value);
      });
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      let message = "حدث خطأ غير متوقع";
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const error = await response.json().catch(() => null);
        if (error?.message) {
          message = error.message;
        }
        if (error?.errors) {
          const details = Object.values(error.errors).flat().join(" | ");
          if (details) {
            message = `${message}: ${details}`;
          }
        }
      } else {
        const text = await response.text().catch(() => "");
        if (text) {
          message = text;
        }
      }
      throw new Error(message);
    }

    return response.json();
  }

  async createNotification(
    data: CreateAdminNotificationRequest
  ): Promise<CreateAdminNotificationResponse> {
    return this.fetchAPI("/api/admin/notifications/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async sendNotification(
    data: CreateAdminNotificationRequest
  ): Promise<CreateAdminNotificationResponse> {
    return this.createNotification(data);
  }

  async getNotificationsHistory(page: number = 1): Promise<{
    data: NotificationHistoryItem[];
    pagination: {
      current_page: number;
      last_page: number;
      total: number;
      per_page: number;
    };
  }> {
    return this.fetchAPI(`/api/admin/notifications/history?page=${page}`);
  }

  async getNotificationDetails(id: number): Promise<NotificationHistoryItem> {
    return this.fetchAPI(`/api/admin/notifications/${id}`);
  }

  async resendNotification(id: number): Promise<{ success: boolean; message: string }> {
    return this.fetchAPI(`/api/admin/notifications/${id}/resend`, {
      method: "POST",
    });
  }

  async deleteNotification(id: number): Promise<{ success: boolean; message: string }> {
    return this.fetchAPI(`/api/admin/notifications/${id}`, {
      method: "DELETE",
    });
  }

  async getTemplates(): Promise<NotificationTemplate[]> {
    return this.fetchAPI("/api/admin/notifications/templates");
  }

  async createTemplate(template: Omit<NotificationTemplate, "id">): Promise<NotificationTemplate> {
    return this.fetchAPI("/api/admin/notifications/templates", {
      method: "POST",
      body: JSON.stringify(template),
    });
  }

  async updateTemplate(id: number, template: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
    return this.fetchAPI(`/api/admin/notifications/templates/${id}`, {
      method: "PUT",
      body: JSON.stringify(template),
    });
  }

  async deleteTemplate(id: number): Promise<{ success: boolean; message: string }> {
    return this.fetchAPI(`/api/admin/notifications/templates/${id}`, {
      method: "DELETE",
    });
  }

  async getNotificationsStats(): Promise<{
    total: number;
    today: number;
    failed: number;
    pending: number;
  }> {
    return this.fetchAPI("/api/admin/notifications/stats");
  }

  async sendHighCancellationWarning(
    payload: HighCancellationWarningRequest = { target_group: "all", include_stats: true }
  ): Promise<HighCancellationWarningResponse> {
    return this.fetchAPI("/api/admin/notifications/send-high-cancellation-warning", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async searchUsers(query: string): Promise<SearchUserItem[]> {
    const result = await this.fetchAPI(`/api/admin/users/search?q=${encodeURIComponent(query)}`);
    if (Array.isArray(result)) {
      return result as SearchUserItem[];
    }
    if (Array.isArray((result as SearchUsersApiResponse)?.data)) {
      return (result as SearchUsersApiResponse).data as SearchUserItem[];
    }
    return [];
  }
}

export const notificationsService = new NotificationsService();
