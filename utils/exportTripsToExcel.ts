import { Trip } from "@/models/Trip";

export function exportTripsToExcel(trips: Trip[]) {
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      open: "مفتوحة",
      accepted: "مقبولة",
      ongoing: "جارية",
      completed: "منتهية",
      cancelled: "ملغاة",
      expired: "منتهية الصلاحية",
    };
    return labels[status] || status;
  };

  const getPaymentMethodLabel = (method?: string) => {
    const labels: Record<string, string> = {
      cash: "نقدي",
      card: "بطاقة",
      wallet: "محفظة",
    };
    return method ? labels[method] || method : "-";
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("ar-EG");
  };

  // Create CSV content
  const headers = [
    "رقم الرحلة",
    "الراكب",
    "هاتف الراكب",
    "السائق",
    "هاتف السائق",
    "تقييم السائق",
    "نوع المركبة",
    "ماركة المركبة",
    "موديل المركبة",
    "رقم اللوحة",
    "من",
    "إلى",
    "المسافة (كم)",
    "السعر المقدر",
    "السعر النهائي",
    "يتطلب تكييف",
    "الحالة",
    "طريقة الدفع",
    "تاريخ الإنشاء",
    "تاريخ القبول",
    "تاريخ البدء",
    "تاريخ الانتهاء",
    "تاريخ الإلغاء",
    "تم الإلغاء بواسطة",
    "سبب الإلغاء",
    "ملاحظات",
  ];

  const rows = trips.map((trip) => [
    trip.trip_number,
    trip.rider_name,
    trip.rider_phone,
    trip.driver_name || "-",
    trip.driver_phone || "-",
    trip.driver_rating || "-",
    trip.vehicle_type,
    trip.vehicle_brand || "-",
    trip.vehicle_model || "-",
    trip.vehicle_license || "-",
    trip.from_location.address,
    trip.to_location.address,
    trip.distance_km,
    trip.estimated_price,
    trip.final_price || "-",
    trip.requires_ac ? "نعم" : "لا",
    getStatusLabel(trip.status),
    getPaymentMethodLabel(trip.payment_method),
    formatDateTime(trip.created_at),
    formatDateTime(trip.accepted_at),
    formatDateTime(trip.started_at),
    formatDateTime(trip.completed_at),
    formatDateTime(trip.cancelled_at),
    trip.cancelled_by === "rider"
      ? "الراكب"
      : trip.cancelled_by === "driver"
      ? "السائق"
      : trip.cancelled_by === "system"
      ? "النظام"
      : "-",
    trip.cancellation_reason || "-",
    trip.notes || "-",
  ]);

  // Convert to CSV
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  // Add BOM for proper Arabic encoding
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  // Create download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `trips_export_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
