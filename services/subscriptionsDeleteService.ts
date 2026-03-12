import { AuthService } from "./authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface AdminActionResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

async function parseError(response: Response, fallbackMessage: string): Promise<never> {
  let message = fallbackMessage;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const errJson: AdminActionResponse | any = await response.json().catch(() => null);
    if (errJson?.message) {
      message = errJson.message;
    }
    if (errJson?.errors) {
      const details = Object.values(errJson.errors)
        .flat()
        .join(" | ");
      if (details) {
        message = `${message}: ${details}`;
      }
    }
    throw new Error(message);
  }

  const text = await response.text().catch(() => "");
  throw new Error(text || message);
}

export async function deleteAdminSubscription(subscriptionId: number): Promise<string> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/subscriptions/${subscriptionId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    return parseError(response, "فشل في حذف الاشتراك");
  }

  const json: AdminActionResponse = await response.json().catch(() => ({}));
  return json?.message || "تم حذف الاشتراك بنجاح";
}

