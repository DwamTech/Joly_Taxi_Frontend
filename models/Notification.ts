export type NotificationType =
  | "trip_dispatched_to_driver"
  | "trip_offer_accepted"
  | "trip_offer_rejected"
  | "trip_started"
  | "trip_ended"
  | "trip_cancelled"
  | "trip_no_longer_available"
  | "new_rating"
  | "subscription_expiring"
  | "subscription_expired";

export type SentViaChannel = "database" | "push" | "sms" | "email";

export type NotificationStatus = "sent" | "pending" | "failed";

export type RecipientType = "all" | "drivers" | "riders" | "specific" | "custom";

export type NotificationPriority = "info" | "warning" | "urgent";

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
  data?: any;
  sent_via: SentViaChannel[];
  is_read: boolean;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationTemplate {
  id: number;
  name: string;
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
  type: NotificationPriority;
}

export interface SendNotificationRequest {
  recipient_type: RecipientType;
  recipient_ids?: number[];
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
  priority: NotificationPriority;
  sent_via: SentViaChannel[];
  send_type: "immediate" | "scheduled";
  scheduled_date?: string;
  scheduled_time?: string;
}

export interface CreateAdminNotificationRequest {
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
  notification_type: NotificationPriority;
  recipient_type: RecipientType;
  recipient_ids?: number[];
  send_immediately: boolean;
}

export interface CreateAdminNotificationResponseData {
  notification_id: number;
  total_recipients: number;
  status: NotificationStatus;
}

export interface CreateAdminNotificationResponse {
  ok: boolean;
  message: string;
  data: CreateAdminNotificationResponseData;
}

export interface NotificationHistoryItem {
  id: number;
  type: NotificationPriority;
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
  recipient_type: RecipientType;
  recipient_count: number;
  sent_at: string;
  status: NotificationStatus;
  sent_via: SentViaChannel[];
}

export interface AdminNotificationUser {
  id: number;
  role: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  role_name?: string;
}

export interface AdminNotificationItem {
  id: number;
  user_id: number | null;
  type: string;
  notification_type: NotificationPriority | string;
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
  data?: Record<string, any> | null;
  sent_via: string[];
  is_read: boolean;
  status: NotificationStatus | string;
  scheduled_at: string | null;
  sent_at: string | null;
  recipient_type: RecipientType | string | null;
  recipient_ids: number[] | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  admin_id: number | null;
  user?: AdminNotificationUser | null;
}

export interface AdminNotificationsPaginationData {
  current_page?: number;
  data?: AdminNotificationItem[];
  last_page?: number;
  per_page?: number;
  total?: number;
  next_page_url?: string | null;
  prev_page_url?: string | null;
  path?: string;
}

export interface GetAdminNotificationsResponse {
  ok: boolean;
  message: string;
  data: AdminNotificationsPaginationData;
}

export interface GetAdminNotificationDetailsResponse {
  ok: boolean;
  message: string;
  data: AdminNotificationItem;
}
