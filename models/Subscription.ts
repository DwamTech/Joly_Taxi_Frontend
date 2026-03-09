export type SubscriptionStatus = 
  | "pending" 
  | "active" 
  | "expired" 
  | "rejected" 
  | "cancelled";

export interface PaymentInfo {
  amount_paid: number;
  reference_number: string;
  receipt_image?: string;
  payment_method: "bank_transfer" | "cash" | "card";
  payment_date: string;
  additional_notes?: string;
}

export interface DriverInfo {
  id: number;
  name: string;
  phone: string;
  avatar?: string;
  rating: number;
  completed_trips: number;
  previous_subscriptions: number;
}

export interface Subscription {
  id: number;
  subscription_number: string;
  driver: DriverInfo;
  vehicle_type: string;
  months_count: number;
  total_price: number;
  status: SubscriptionStatus;
  created_at: string;
  activated_at?: string;
  start_date?: string;
  end_date?: string;
  days_remaining?: number;
  payment_info: PaymentInfo;
  rejected_reason?: string;
  cancelled_reason?: string;
  cancelled_at?: string;
}
