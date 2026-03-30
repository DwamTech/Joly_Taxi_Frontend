export interface AdminProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface ProfileResponse {
  ok: boolean;
  data: AdminProfile;
}
