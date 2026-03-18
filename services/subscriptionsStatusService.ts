import { AuthService } from "./authService";
import { Subscription, SubscriptionStatus } from "@/models/Subscription";
import { getAdminSubscriptionById } from "./subscriptionsService";

const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
    : "";

interface AdminActionResponse {
  message?: string;
  errors?: Record<string, string[]>;
  data?: any;
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

export async function updateAdminSubscriptionStatus(
  subscriptionId: number,
  status: SubscriptionStatus
): Promise<Subscription> {
  const token = AuthService.getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-lang": "ar",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api/admin/subscriptions/${subscriptionId}/status`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    return parseError(response, "فشل في تحديث حالة الاشتراك");
  }

  await response.json().catch(() => ({}));
  const updated = await getAdminSubscriptionById(subscriptionId);
  return updated;
}
