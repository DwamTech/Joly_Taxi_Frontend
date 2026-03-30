import { AdminProfile } from "@/models/Profile";
import { AuthService } from "./authService";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
).replace(/\/+$/, "");

export class ProfileService {
  static async changePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<void> {
    const token = AuthService.getToken();
    const response = await fetch(`${API_BASE_URL}/api/admin/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`فشل تغيير كلمة المرور: ${response.status}`);
  }

  static async updateProfile(data: { name: string; email: string; phone: string }): Promise<AdminProfile> {
    const token = AuthService.getToken();
    const response = await fetch(`${API_BASE_URL}/api/admin/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`فشل تحديث بيانات الحساب: ${response.status}`);
    const json = await response.json();
    return json.data as AdminProfile;
  }

  static async getProfile(): Promise<AdminProfile> {
    const token = AuthService.getToken();
    const response = await fetch(`${API_BASE_URL}/api/admin/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
    if (!response.ok) throw new Error(`فشل تحميل بيانات الحساب: ${response.status}`);
    const json = await response.json();
    return json.data as AdminProfile;
  }
}
