import {
  Notification,
  NotificationTemplate,
  SendNotificationRequest,
  NotificationHistoryItem,
} from "@/models/Notification";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

class NotificationsService {
  private async fetchAPI(endpoint: string, options?: RequestInit) {
    const token = localStorage.getItem("auth_token");
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "حدث خطأ غير متوقع" }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async sendNotification(data: SendNotificationRequest): Promise<{ success: boolean; message: string }> {
    return this.fetchAPI("/admin/notifications/send", {
      method: "POST",
      body: JSON.stringify(data),
    });
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
    return this.fetchAPI(`/admin/notifications/history?page=${page}`);
  }

  async getNotificationDetails(id: number): Promise<NotificationHistoryItem> {
    return this.fetchAPI(`/admin/notifications/${id}`);
  }

  async resendNotification(id: number): Promise<{ success: boolean; message: string }> {
    return this.fetchAPI(`/admin/notifications/${id}/resend`, {
      method: "POST",
    });
  }

  async deleteNotification(id: number): Promise<{ success: boolean; message: string }> {
    return this.fetchAPI(`/admin/notifications/${id}`, {
      method: "DELETE",
    });
  }

  async getTemplates(): Promise<NotificationTemplate[]> {
    return this.fetchAPI("/admin/notifications/templates");
  }

  async createTemplate(template: Omit<NotificationTemplate, "id">): Promise<NotificationTemplate> {
    return this.fetchAPI("/admin/notifications/templates", {
      method: "POST",
      body: JSON.stringify(template),
    });
  }

  async updateTemplate(id: number, template: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
    return this.fetchAPI(`/admin/notifications/templates/${id}`, {
      method: "PUT",
      body: JSON.stringify(template),
    });
  }

  async deleteTemplate(id: number): Promise<{ success: boolean; message: string }> {
    return this.fetchAPI(`/admin/notifications/templates/${id}`, {
      method: "DELETE",
    });
  }

  async getNotificationsStats(): Promise<{
    total: number;
    today: number;
    failed: number;
    pending: number;
  }> {
    return this.fetchAPI("/admin/notifications/stats");
  }

  async searchUsers(query: string): Promise<Array<{ id: number; name: string; phone: string; type: string }>> {
    return this.fetchAPI(`/admin/users/search?q=${encodeURIComponent(query)}`);
  }
}

export const notificationsService = new NotificationsService();
