export interface AdminSettingsData {
  otp_max_attempts: string;
  banner_ar: string | null;
  banner_en: string | null;
  instapay_number: string;
  vodafone_cash_number: string;
  payment_inquiries_number: string;
  emergency_number: string;
  max_cancellations_before_alert: number;
  whatsapp_number: string;
  app_name: string;
  app_version: string;
  support_email: string;
  subscription_renewal_days_before_expiry: string;
  banner_image_size: string;
  privacy_policy_ar: string;
  privacy_policy_en: string;
  terms_of_use_ar: string;
  terms_of_use_en: string;
  data_retention_days: string;
}

export interface GetAdminSettingsResponse {
  ok: boolean;
  message: string;
  data: AdminSettingsData;
}

export interface UpdateAdminSettingsPayload {
  otp_max_attempts: string;
  instapay_number: string;
  vodafone_cash_number: string;
  payment_inquiries_number: string;
  emergency_number: string;
  max_cancellations_before_alert: number;
  whatsapp_number: string;
  app_name: string;
  app_version: string;
  support_email: string;
  subscription_renewal_days_before_expiry: string;
  banner_image_size: string;
  privacy_policy_ar: string;
  privacy_policy_en: string;
  terms_of_use_ar: string;
  terms_of_use_en: string;
  data_retention_days: string;
  banner_ar?: File | null;
  banner_en?: File | null;
  _method?: "PUT";
}

export interface UpdateAdminSettingsResponse {
  ok: boolean;
  message: string;
  data?: AdminSettingsData;
}
