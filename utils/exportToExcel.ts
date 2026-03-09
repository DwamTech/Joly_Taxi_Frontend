import { User } from "@/models/User";

export function exportUsersToExcel(users: User[]) {
  // Create CSV content
  const headers = [
    "ID",
    "الاسم",
    "رقم الهاتف",
    "البريد الإلكتروني",
    "النوع",
    "الحالة",
    "كود الوكيل",
    "رقم المندوب",
    "تاريخ التسجيل",
    "آخر نشاط",
    // Driver fields
    "رقم الهوية",
    "تاريخ انتهاء رخصة القيادة",
    "حالة التحقق",
    "متصل الآن",
    "تقييم السائق",
    "عدد تقييمات السائق",
    "رحلات السائق المكتملة",
    "رحلات السائق الملغاة",
    // Vehicle fields
    "نوع المركبة",
    "ماركة المركبة",
    "موديل المركبة",
    "سنة المركبة",
    "رقم رخصة المركبة",
    "تاريخ انتهاء رخصة المركبة",
    "يوجد تكييف",
    "المركبة نشطة",
    // Rider fields
    "تقييم الراكب",
    "عدد تقييمات الراكب",
    "نسبة موثوقية الراكب",
    "رحلات الراكب المكتملة",
    "رحلات الراكب الملغاة",
  ];

  const rows = users.map((user) => {
    const row = [
      user.id,
      user.name,
      user.phone,
      user.email || "",
      getRoleLabel(user.role),
      getStatusLabel(user.status),
      user.agent_code || "",
      user.delegate_number || "",
      formatDate(user.created_at),
      formatDate(user.last_active_at),
      // Driver fields
      user.driver_profile?.national_id_number || "",
      user.driver_profile?.driver_license_expiry
        ? formatDate(user.driver_profile.driver_license_expiry)
        : "",
      user.driver_profile?.verification_status
        ? getVerificationLabel(user.driver_profile.verification_status)
        : "",
      user.driver_profile?.online_status ? "نعم" : "لا",
      user.driver_profile?.rating_avg || "",
      user.driver_profile?.rating_count || "",
      user.driver_profile?.completed_trips_count || "",
      user.driver_profile?.cancelled_trips_count || "",
      // Vehicle fields
      user.vehicle?.type || "",
      user.vehicle?.brand || "",
      user.vehicle?.model || "",
      user.vehicle?.year || "",
      user.vehicle?.vehicle_license_number || "",
      user.vehicle?.vehicle_license_expiry
        ? formatDate(user.vehicle.vehicle_license_expiry)
        : "",
      user.vehicle?.has_ac ? "نعم" : "لا",
      user.vehicle?.is_active ? "نعم" : "لا",
      // Rider fields
      user.rider_profile?.rating_avg || "",
      user.rider_profile?.rating_count || "",
      user.rider_profile?.reliability_percent || "",
      user.rider_profile?.completed_trips_count || "",
      user.rider_profile?.cancelled_trips_count || "",
    ];

    return row.map((cell) => `"${cell}"`).join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");

  // Add BOM for proper Arabic encoding in Excel
  const BOM = "\uFEFF";
  const csvWithBOM = BOM + csv;

  // Create blob and download
  const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `users_export_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    user: "راكب",
    driver: "سائق",
    both: "كلاهما",
    admin: "إداري",
  };
  return labels[role] || role;
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: "نشط",
    inactive: "غير نشط",
    blocked: "محظور",
  };
  return labels[status] || status;
}

function getVerificationLabel(status: string): string {
  const labels: Record<string, string> = {
    approved: "موافق عليه",
    pending: "قيد المراجعة",
    rejected: "مرفوض",
  };
  return labels[status] || status;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
