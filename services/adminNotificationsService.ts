import { AuthService } from "./authService";
import {
  AdminNotificationItem,
  GetAdminNotificationDetailsResponse,
  GetAdminNotificationsResponse,
} from "@/models/Notification";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
).replace(/\/+$/, "");

class AdminNotificationsService {
  private async extractErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
    let message = fallbackMessage;
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
      return message;
    }

    const text = await response.text().catch(() => "");
    if (text) {
      return text;
    }
    return message;
  }

  async getAdminNotifications(page: number = 1, perPage: number = 20): Promise<GetAdminNotificationsResponse> {
    const token = AuthService.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "x-lang": "ar",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const query = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
    });
    const response = await fetch(`${API_BASE_URL}/api/admin/notifications?${query.toString()}`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      let message = "فشل في جلب إشعارات الادمن";
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

  async getMyNotifications(page: number = 1, perPage: number = 20): Promise<GetAdminNotificationsResponse> {
    const token = AuthService.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "x-lang": "ar",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const query = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
    });
    const response = await fetch(
      `${API_BASE_URL}/api/admin/notifications/my-notifications?${query.toString()}`,
      {
        method: "GET",
        headers,
        credentials: "include",
      }
    );

    if (!response.ok) {
      let message = "فشل في جلب الإشعارات المرسلة للادمن";
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

  async getAdminNotificationDetails(
    notificationId: number
  ): Promise<GetAdminNotificationDetailsResponse | AdminNotificationItem> {
    const token = AuthService.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "x-lang": "ar",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/notifications/${notificationId}`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      let message = "فشل في جلب تفاصيل الإشعار";
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

  async deleteAdminNotification(notificationId: number): Promise<{ ok?: boolean; message?: string }> {
    const token = AuthService.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "x-lang": "ar",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/notifications/${notificationId}`, {
      method: "DELETE",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const message = await this.extractErrorMessage(response, "فشل في حذف الإشعار");
      throw new Error(message);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }
    return { ok: true };
  }

  async markNotificationAsRead(notificationId: number): Promise<{ ok?: boolean; message?: string }> {
    const token = AuthService.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "x-lang": "ar",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
      method: "POST",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const message = await this.extractErrorMessage(response, "فشل في تحديث حالة قراءة الإشعار");
      throw new Error(message);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }
    return { ok: true };
  }

  async markAllNotificationsAsRead(): Promise<{ ok?: boolean; message?: string }> {
    const token = AuthService.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "x-lang": "ar",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
      method: "POST",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const message = await this.extractErrorMessage(response, "فشل في تعليم كل الإشعارات كمقروءة");
      throw new Error(message);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }
    return { ok: true };
  }

  async getUnreadNotificationsCount(): Promise<number> {
    const token = AuthService.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "x-lang": "ar",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/notifications/unread-count`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const message = await this.extractErrorMessage(response, "فشل في جلب عدد الإشعارات غير المقروءة");
      throw new Error(message);
    }

    const result = await response.json().catch(() => null) as
      | { count?: number; unread_count?: number; data?: { count?: number; unread_count?: number } }
      | null;
    const count =
      result?.data?.unread_count ??
      result?.data?.count ??
      result?.unread_count ??
      result?.count ??
      0;
    return Number.isFinite(Number(count)) ? Number(count) : 0;
  }
}

export const adminNotificationsService = new AdminNotificationsService();
