import { RevenueReportsData } from "@/models/RevenueReports";
import { AuthService } from "./authService";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
).replace(/\/+$/, "");

export class RevenueReportsService {
  static async getRevenueReports(): Promise<RevenueReportsData> {
    const token = AuthService.getToken();

    const response = await fetch(`${API_BASE_URL}/api/admin/trip-reports/revenue`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`فشل تحميل تقارير الإيرادات: ${response.status}`);
    }

    const json = await response.json();
    return json.data as RevenueReportsData;
  }
}
