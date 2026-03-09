import { Subscription } from "@/models/Subscription";

export function exportSubscriptionsToExcel(subscriptions: Subscription[]) {
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "قيد المراجعة",
      active: "نشط",
      expired: "منتهي",
      rejected: "مرفوض",
      cancelled: "ملغي",
    };
    return labels[status] || status;
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      bank_transfer: "تحويل بنكي",
      cash: "نقدي",
      card: "بطاقة",
    };
    return labels[method] || method;
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("ar-EG");
  };

  // Create CSV content
  const headers = [
    "رقم الاشتراك",
    "اسم السائق",
    "هاتف السائق",
    "تقييم السائق",
    "نوع المركبة",
    "عدد الأشهر",
    "السعر الإجمالي",
    "المبلغ المدفوع",
    "رقم المرجع",
    "طريقة الدفع",
    "تاريخ الدفع",
    "الحالة",
    "تاريخ الإنشاء",
    "تاريخ التفعيل",
    "تاريخ البداية",
    "تاريخ النهاية",
    "الأيام المتبقية",
    "سبب الرفض",
    "سبب الإلغاء",
    "ملاحظات الدفع",
  ];

  const rows = subscriptions.map((sub) => [
    sub.subscription_number,
    sub.driver.name,
    sub.driver.phone,
    sub.driver.rating,
    sub.vehicle_type,
    sub.months_count,
    sub.total_price,
    sub.payment_info.amount_paid,
    sub.payment_info.reference_number,
    getPaymentMethodLabel(sub.payment_info.payment_method),
    formatDateTime(sub.payment_info.payment_date),
    getStatusLabel(sub.status),
    formatDateTime(sub.created_at),
    formatDateTime(sub.activated_at),
    formatDateTime(sub.start_date),
    formatDateTime(sub.end_date),
    sub.days_remaining !== undefined
      ? sub.days_remaining > 0
        ? sub.days_remaining
        : "منتهي"
      : "-",
    sub.rejected_reason || "-",
    sub.cancelled_reason || "-",
    sub.payment_info.additional_notes || "-",
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
    `subscriptions_export_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
