import { AuthService } from "./authService";
import {
  GetAdminSettingsResponse,
  UpdateAdminSettingsPayload,
  UpdateAdminSettingsResponse,
} from "@/models/Settings";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
).replace(/\/+$/, "");

class SettingsService {
  private toEnglishDigits(value: string) {
    return value.replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit).toString());
  }

  private normalizeIntegerField(value: string | number) {
    return this.toEnglishDigits(String(value ?? "")).trim();
  }

  async getSettings(): Promise<GetAdminSettingsResponse> {
    const token = AuthService.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "x-lang": "ar",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      throw await this.buildError(response, "فشل في جلب الإعدادات");
    }

    return response.json();
  }

  async updateSettings(payload: UpdateAdminSettingsPayload): Promise<UpdateAdminSettingsResponse> {
    const token = AuthService.getToken();
    const headers: HeadersInit = {
      "x-lang": "ar",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const formData = new FormData();
    formData.append("_method", payload._method || "PUT");
    formData.append("otp_max_attempts", this.normalizeIntegerField(payload.otp_max_attempts));
    formData.append("instapay_number", payload.instapay_number);
    formData.append("vodafone_cash_number", payload.vodafone_cash_number);
    formData.append("payment_inquiries_number", payload.payment_inquiries_number);
    formData.append("emergency_number", payload.emergency_number);
    formData.append(
      "max_cancellations_before_alert",
      this.normalizeIntegerField(payload.max_cancellations_before_alert)
    );
    formData.append("whatsapp_number", payload.whatsapp_number);
    formData.append("app_name", payload.app_name);
    formData.append("app_version", payload.app_version);
    formData.append("support_email", payload.support_email.trim());
    formData.append(
      "subscription_renewal_days_before_expiry",
      this.normalizeIntegerField(payload.subscription_renewal_days_before_expiry)
    );
    formData.append("banner_image_size", payload.banner_image_size);
    formData.append("privacy_policy_ar", payload.privacy_policy_ar);
    formData.append("privacy_policy_en", payload.privacy_policy_en);
    formData.append("terms_of_use_ar", payload.terms_of_use_ar);
    formData.append("terms_of_use_en", payload.terms_of_use_en);
    formData.append("data_retention_days", this.normalizeIntegerField(payload.data_retention_days));

    if (payload.banner_ar instanceof File) {
      formData.append("banner_ar", payload.banner_ar);
    }

    if (payload.banner_en instanceof File) {
      formData.append("banner_en", payload.banner_en);
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {
      method: "POST",
      headers,
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      throw await this.buildError(response, "فشل في تحديث الإعدادات");
    }

    return response.json();
  }

  private async buildError(response: Response, fallbackMessage: string) {
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
    } else {
      const text = await response.text().catch(() => "");
      if (text) {
        message = text;
      }
    }

    return new Error(message);
  }
}

export const settingsService = new SettingsService();
