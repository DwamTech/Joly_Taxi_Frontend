export type AdminStatus = "active" | "inactive" | "blocked";
export type AdminRole   = "super_admin" | "admin" | "moderator";
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "super_admin" | "admin" | "moderator";
  status: "active" | "disabled";
  created_at: string;
  last_login: string;
  avatar?: string;
}

export interface RolePermissions {
  role: "super_admin" | "admin" | "moderator";
  permissions: {
    users: boolean;
    trips: boolean;
    subscriptions: boolean;
    ratings: boolean;
    reports: boolean;
    vehicle_types: boolean;
    notifications: boolean;
    statistics: boolean;
    map: boolean;
    permissions: boolean;
    blocks: boolean;
    activity_log: boolean;
    settings: boolean;
    general_settings: boolean;
  };
}

export interface PermissionsStats {
  total_admins: number;
  active_admins: number;
  disabled_admins: number;
  super_admins: number;
}

// ── API types ────────────────────────────────────────────────────────────────

export interface AdminPage {
  id: number;
  name: string;
  icon: string;
  path: string;
}

export interface AdminApi {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: AdminRole;
  status: AdminStatus;
  created_at: string;
  last_login: string;
  pages: AdminPage[];
}

export interface AdminListPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface AdminListResponse {
  message: string;
  data: {
    current_page: number;
    data: AdminApi[];
    last_page: number;
    per_page: number;
    total: number;
  };
}
