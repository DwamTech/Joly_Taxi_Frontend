import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell/DashboardShell";
import "./dashboard.css";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://back.mishwar-masr.app"
).replace(/\/+$/, "");

async function hasValidAdminSession(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "x-lang": "ar",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    const user = await response.json().catch(() => null);
    return user?.role === "admin";
  } catch {
    return false;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const isValidAdminSession = await hasValidAdminSession(token);

  if (!isValidAdminSession) {
    redirect("/login");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
