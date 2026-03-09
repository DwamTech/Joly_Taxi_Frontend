import { TripReport } from "@/models/TripReport";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const reportsService = {
  /**
   * Get all reports with pagination
   */
  async getReports(page: number = 1, perPage: number = 20) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/trip-reports?page=${page}&per_page=${perPage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  },

  /**
   * Get report details by ID
   */
  async getReportDetails(reportId: number): Promise<TripReport> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/trip-reports/${reportId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch report details");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching report details:", error);
      throw error;
    }
  },

  /**
   * Update report status
   */
  async updateReportStatus(
    reportId: number,
    status: "pending" | "resolved",
    adminNotes?: string,
    actionTaken?: string
  ) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/trip-reports/${reportId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            status,
            admin_notes: adminNotes,
            action_taken: actionTaken,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update report status");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating report status:", error);
      throw error;
    }
  },

  /**
   * Update report priority
   */
  async updateReportPriority(
    reportId: number,
    priority: "high" | "medium" | "low"
  ) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/trip-reports/${reportId}/priority`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ priority }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update report priority");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating report priority:", error);
      throw error;
    }
  },

  /**
   * Delete report
   */
  async deleteReport(reportId: number) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/trip-reports/${reportId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete report");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting report:", error);
      throw error;
    }
  },

  /**
   * Send warning to user
   */
  async sendWarning(userId: number, message: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/users/${userId}/warning`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send warning");
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending warning:", error);
      throw error;
    }
  },

  /**
   * Send notification to both parties
   */
  async sendNotificationToBoth(reportId: number, message: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/trip-reports/${reportId}/notify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  },

  /**
   * Get reports statistics
   */
  async getReportsStats() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/trip-reports/stats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reports stats");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching reports stats:", error);
      throw error;
    }
  },
};
