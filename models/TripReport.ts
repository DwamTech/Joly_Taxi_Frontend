export interface TripReport {
  id: number;
  trip_request_id: number;
  reporter_id: number;
  reported_id: number;
  reason: string;
  description?: string;
  status: "pending" | "resolved";
  priority: "high" | "medium" | "low";
  admin_notes?: string;
  action_taken?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  reporter?: {
    id: number;
    name: string;
    phone: string;
    type: "rider" | "driver";
    reports_count: number;
  };
  reported?: {
    id: number;
    name: string;
    phone: string;
    type: "rider" | "driver";
    reports_received_count: number;
    rating_avg: number;
  };
  trip?: {
    id: number;
    pickup_location: string;
    dropoff_location: string;
    status: string;
    created_at: string;
  };
}
