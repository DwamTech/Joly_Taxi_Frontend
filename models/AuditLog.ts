export interface AuditLog {
  id: number | string;
  admin_name: string;
  admin_id: string | number;
  action: string;
  action_type:
    | "login"
    | "logout"
    | "create"
    | "update"
    | "delete"
    | "block"
    | "unblock"
    | "approve"
    | "reject"
    | "send"
    | "settings";
  entity_type: string;
  entity_id: string | number;
  details: string;
  ip_address: string;
  created_at: string;
}

export interface AuditLogPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface AuditLogStats {
  total_activities: number;
  today_activities: number;
  active_admins: number;
  critical_actions: number;
}

export interface AuditLogResponse {
  data: AuditLog[];
  pagination: AuditLogPagination;
  stats?: AuditLogStats;
}

export interface AuditLogFilters {
  search?: string;
  action_type?: string;
  admin_id?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}
