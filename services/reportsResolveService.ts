import { AuthService } from "./authService";

const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
    : "";

interface ResolveReportResponse {
  message: string;
}

export async function resolveAdminReport(reportId: number): Promise<void> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/reports/${reportId}/resolve`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "فشل في تغيير حالة البلاغ");
  }

  const result: ResolveReportResponse = await response.json();
  if (!result?.message) {
    return;
  }
}
