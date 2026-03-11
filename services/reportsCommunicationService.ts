import { AuthService } from "./authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface AdminReportActionResponse {
  message: string;
}

interface ToggleBlockResponse {
  message?: string;
  data?: {
    status?: string;
  };
  status?: string;
}

export async function notifyAdminReport(reportId: number, message: string): Promise<void> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/reports/${reportId}/notify`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ message }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "فشل في إرسال الإشعار");
  }

  const result: AdminReportActionResponse = await response.json();
  if (!result?.message) {
    return;
  }
}

export async function warnAdminReport(reportId: number, warningMessage: string): Promise<void> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/reports/${reportId}/warning`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ warning_message: warningMessage }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "فشل في إرسال التحذير");
  }

  const result: AdminReportActionResponse = await response.json();
  if (!result?.message) {
    return;
  }
}

export async function toggleBlockUserFromReport(userId: number): Promise<{ status?: string; message?: string }> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/users/${userId}/toggle-block`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "فشل في تغيير حالة الحظر");
  }

  const result: ToggleBlockResponse = await response.json();
  return {
    status: result?.data?.status || result?.status,
    message: result?.message,
  };
}
