import { DriverReportsData, RiderReportsData, RegistrationMonth, DriverRevenueData } from "@/models/UserReports";
import { AuthService } from "./authService";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
).replace(/\/+$/, "");

async function apiFetch<T>(endpoint: string): Promise<T> {
  const token = AuthService.getToken();
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`فشل تحميل البيانات: ${response.status}`);
  }

  const json = await response.json();
  return json.data as T;
}

export class UserReportsService {
  static getDriverReports(): Promise<DriverReportsData> {
    return apiFetch<DriverReportsData>("api/admin/trip-reports/drivers");
  }

  static getRiderReports(): Promise<RiderReportsData> {
    return apiFetch<RiderReportsData>("api/admin/trip-reports/riders");
  }

  static getRegistrations(): Promise<RegistrationMonth[]> {
    return apiFetch<RegistrationMonth[]>("api/admin/trip-reports/registrations");
  }

  static getDriverRevenue(driverId: number): Promise<DriverRevenueData> {
    return apiFetch<DriverRevenueData>(`api/admin/trip-reports/revenue/driver/${driverId}`);
  }
}
