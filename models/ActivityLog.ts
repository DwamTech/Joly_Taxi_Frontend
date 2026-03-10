export interface ActivityLog {
  id: string;
  admin_name: string;
  admin_id: string;
  action: string;
  action_type: "login" | "logout" | "create" | "update" | "delete" | "block" | "unblock" | "approve" | "reject" | "send" | "settings";
  entity_type: string;
  entity_id: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export interface ActivityLogStats {
  total_activities: number;
  today_activities: number;
  active_admins: number;
  critical_actions: number;
}
