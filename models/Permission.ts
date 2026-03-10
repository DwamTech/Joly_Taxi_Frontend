export interface Admin {
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
