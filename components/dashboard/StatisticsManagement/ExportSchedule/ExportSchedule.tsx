"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import { dashboardService } from "@/services/dashboardService";
import { UserReportsService } from "@/services/userReportsService";
import { RevenueReportsService } from "@/services/revenueReportsService";
import "./ExportSchedule.css";

// ─── Table registry ────────────────────────────────────────────────────────────
interface TableDef {
  key: string;
  label: string;
  tab: string;
  icon: string;
  fetchHeaders: () => Promise<{ headers: string[]; rows: Array<Array<string | number>> }>;
}

function normalizeHourLabel(hour: string): string {
  const [h] = hour.split(":");
  const n = Number(h);
  if (Number.isNaN(n)) return hour;
  if (n === 0) return "12 ص";
  if (n < 12) return `${n} ص`;
  if (n === 12) return "12 م";
  return `${n - 12} م`;
}

const TABLE_DEFS: TableDef[] = [
  // ── Trip Reports ──
  {
    key: "trip_vehicle",
    label: "الرحلات حسب نوع المركبة",
    tab: "تقارير الرحلات",
    icon: "🚙",
    fetchHeaders: async () => {
      const d = await dashboardService.getTripReports({});
      return {
        headers: ["نوع المركبة", "عدد الرحلات", "الإيرادات", "متوسط السعر"],
        rows: d.vehicle_type_report.by_vehicle_type.map((r) => [
          r.vehicle_type_name, r.trips_count, r.revenue, r.average_price,
        ]),
      };
    },
  },
  {
    key: "trip_hourly",
    label: "الرحلات حسب الساعة",
    tab: "تقارير الرحلات",
    icon: "🕐",
    fetchHeaders: async () => {
      const d = await dashboardService.getTripReports({});
      return {
        headers: ["الساعة", "عدد الرحلات", "الإيرادات"],
        rows: d.time_report.by_hour.map((r) => [normalizeHourLabel(r.hour), r.trips_count, r.revenue]),
      };
    },
  },
  {
    key: "trip_daily",
    label: "الرحلات حسب اليوم",
    tab: "تقارير الرحلات",
    icon: "📅",
    fetchHeaders: async () => {
      const d = await dashboardService.getTripReports({});
      return {
        headers: ["اليوم", "عدد الرحلات", "الإيرادات"],
        rows: d.time_report.by_day.map((r) => [r.label, r.trips_count, r.revenue]),
      };
    },
  },
  {
    key: "trip_monthly",
    label: "الرحلات حسب الشهر",
    tab: "تقارير الرحلات",
    icon: "📆",
    fetchHeaders: async () => {
      const d = await dashboardService.getTripReports({});
      return {
        headers: ["الشهر", "عدد الرحلات", "الإيرادات"],
        rows: d.time_report.by_month.map((r) => [r.label, r.trips_count, r.revenue]),
      };
    },
  },
  // ── User Reports ──
  {
    key: "driver_rated",
    label: "السائقين الأعلى تقييماً",
    tab: "تقارير المستخدمين",
    icon: "🌟",
    fetchHeaders: async () => {
      const d = await UserReportsService.getDriverReports();
      return {
        headers: ["الاسم", "رقم الهاتف", "التقييم", "عدد التقييمات"],
        rows: d.top_rated.map((r) => [r.name, r.phone, r.rating_avg, r.rating_count]),
      };
    },
  },
  {
    key: "driver_trips",
    label: "السائقين الأكثر رحلات",
    tab: "تقارير المستخدمين",
    icon: "🚗",
    fetchHeaders: async () => {
      const d = await UserReportsService.getDriverReports();
      return {
        headers: ["الاسم", "رقم الهاتف", "عدد الرحلات"],
        rows: d.most_trips.map((r) => [r.name, r.phone, r.trips_count]),
      };
    },
  },
  {
    key: "driver_cancel",
    label: "السائقين بمعدل إلغاء عالي",
    tab: "تقارير المستخدمين",
    icon: "⚠️",
    fetchHeaders: async () => {
      const d = await UserReportsService.getDriverReports();
      return {
        headers: ["الاسم", "رقم الهاتف", "عدد الإلغاءات", "معدل الإلغاء"],
        rows: d.high_cancellation.map((r) => [r.name, r.phone, r.cancellation_count, `${r.cancellation_rate}%`]),
      };
    },
  },
  {
    key: "rider_rated",
    label: "الركاب الأعلى تقييماً",
    tab: "تقارير المستخدمين",
    icon: "🌟",
    fetchHeaders: async () => {
      const d = await UserReportsService.getRiderReports();
      return {
        headers: ["الاسم", "رقم الهاتف", "التقييم", "عدد التقييمات"],
        rows: d.top_rated.map((r) => [r.name, r.phone, r.avg_stars, r.rating_count]),
      };
    },
  },
  {
    key: "rider_trips",
    label: "الركاب الأكثر رحلات",
    tab: "تقارير المستخدمين",
    icon: "🚗",
    fetchHeaders: async () => {
      const d = await UserReportsService.getRiderReports();
      return {
        headers: ["الاسم", "رقم الهاتف", "عدد الرحلات"],
        rows: d.most_trips.map((r) => [r.name, r.phone, r.trips_count]),
      };
    },
  },
  {
    key: "rider_cancel",
    label: "الركاب بمعدل إلغاء عالي",
    tab: "تقارير المستخدمين",
    icon: "⚠️",
    fetchHeaders: async () => {
      const d = await UserReportsService.getRiderReports();
      return {
        headers: ["الاسم", "رقم الهاتف", "عدد الإلغاءات", "معدل الإلغاء"],
        rows: d.high_cancellation.map((r) => [r.name, r.phone, r.cancellation_count, `${r.cancellation_rate}%`]),
      };
    },
  },
  {
    key: "registrations",
    label: "التسجيلات الشهرية",
    tab: "تقارير المستخدمين",
    icon: "📈",
    fetchHeaders: async () => {
      const d = await UserReportsService.getRegistrations();
      return {
        headers: ["الشهر", "السنة", "الإجمالي", "سائقين", "ركاب"],
        rows: d.map((r) => [r.month_name_ar, r.year, r.total, r.drivers, r.riders]),
      };
    },
  },
  // ── Revenue Reports ──
  {
    key: "revenue_period",
    label: "الإيرادات الشهرية",
    tab: "تقارير الإيرادات",
    icon: "📆",
    fetchHeaders: async () => {
      const d = await RevenueReportsService.getRevenueReports();
      return {
        headers: ["الشهر", "السنة", "عدد الرحلات", "الإيرادات"],
        rows: d.by_period.map((r) => [r.month_name_ar, r.year, r.trips_count, `${r.revenue} ج.م`]),
      };
    },
  },
  {
    key: "revenue_vehicle",
    label: "الإيرادات حسب نوع المركبة",
    tab: "تقارير الإيرادات",
    icon: "🚙",
    fetchHeaders: async () => {
      const d = await RevenueReportsService.getRevenueReports();
      return {
        headers: ["نوع المركبة", "عدد الرحلات", "الإيرادات"],
        rows: d.by_vehicle_type.map((r) => [r.vehicle_type_name_ar, r.trips_count, `${r.revenue} ج.م`]),
      };
    },
  },
];

// ─── Export helpers ─────────────────────────────────────────────────────────────
function downloadCsv(headers: string[], rows: Array<Array<string | number>>, label: string) {
  const csv = [
    headers.join(","),
    ...rows.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  const safeDate = new Date().toISOString().split("T")[0];
  a.download = `${label}_${safeDate}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

async function downloadPdf(headers: string[], rows: Array<Array<string | number>>, label: string) {
  const { jsPDF } = await import("jspdf");
  const isWide = headers.length > 3;
  const cw = isWide ? 1600 : 1100;
  const pad = 36;
  const titleH = 54;
  const headH = 42;
  const rowH = 36;
  const colW = (cw - pad * 2) / headers.length;
  const ch = pad + titleH + headH + Math.max(rows.length, 1) * rowH + pad;

  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, cw, ch);
  ctx.fillStyle = "#111827";
  ctx.font = "700 34px Tahoma,Arial,sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(label, cw - pad, pad + titleH / 2);

  const tableTop = pad + titleH;
  headers.forEach((h, ci) => {
    const x = pad + ci * colW;
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(x, tableTop, colW, headH);
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, tableTop, colW, headH);
    ctx.fillStyle = "#fff";
    ctx.font = "700 22px Tahoma,Arial,sans-serif";
    ctx.fillText(h, x + colW - 12, tableTop + headH / 2);
  });

  const renderRows = rows.length ? rows : [headers.map(() => "-")];
  renderRows.forEach((row, ri) => {
    const y = tableTop + headH + ri * rowH;
    row.forEach((cell, ci) => {
      const x = pad + ci * colW;
      ctx.fillStyle = ri % 2 === 0 ? "#fff" : "#f9fafb";
      ctx.fillRect(x, y, colW, rowH);
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, colW, rowH);
      ctx.fillStyle = "#111827";
      ctx.font = "500 19px Tahoma,Arial,sans-serif";
      ctx.fillText(String(cell), x + colW - 12, y + rowH / 2);
    });
  });

  const doc = new jsPDF({ orientation: isWide ? "landscape" : "portrait", unit: "pt", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const hm = 20;
  const vm = 20;
  const rw = pw - hm * 2;
  const scale = rw / cw;
  const sliceH = Math.floor((ph - vm * 2) / scale);

  let oy = 0;
  let first = true;
  while (oy < ch) {
    const sh = Math.min(sliceH, ch - oy);
    const sc = document.createElement("canvas");
    sc.width = cw;
    sc.height = sh;
    sc.getContext("2d")!.drawImage(canvas, 0, oy, cw, sh, 0, 0, cw, sh);
    if (!first) doc.addPage();
    doc.addImage(sc.toDataURL("image/png"), "PNG", hm, vm, rw, sh * scale);
    first = false;
    oy += sh;
  }
  doc.save(`${label}_${new Date().toISOString().split("T")[0]}.pdf`);
}

// ─── Component ──────────────────────────────────────────────────────────────────
export default function ExportSchedule() {
  const { showToast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [format, setFormat] = useState<"pdf" | "excel">("pdf");
  const [exporting, setExporting] = useState(false);

  const tabs = Array.from(new Set(TABLE_DEFS.map((t) => t.tab)));

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleTab = (tab: string) => {
    const tabKeys = TABLE_DEFS.filter((t) => t.tab === tab).map((t) => t.key);
    const allSelected = tabKeys.every((k) => selected.has(k));
    setSelected((prev) => {
      const next = new Set(prev);
      tabKeys.forEach((k) => (allSelected ? next.delete(k) : next.add(k)));
      return next;
    });
  };

  const handleExport = async () => {
    if (selected.size === 0) {
      showToast("اختر جدولاً واحداً على الأقل", "warning");
      return;
    }
    setExporting(true);
    const defs = TABLE_DEFS.filter((t) => selected.has(t.key));
    let done = 0;
    for (const def of defs) {
      try {
        showToast(`جاري تجهيز: ${def.label}...`, "info");
        const { headers, rows } = await def.fetchHeaders();
        if (format === "excel") {
          downloadCsv(headers, rows, def.label);
        } else {
          await downloadPdf(headers, rows, def.label);
        }
        done++;
      } catch {
        showToast(`فشل تصدير: ${def.label}`, "error");
      }
    }
    setExporting(false);
    if (done > 0) showToast(`تم تصدير ${done} جدول بنجاح`, "success");
  };

  return (
    <div className="export-schedule">
      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">�</span>
          تصدير الجداول
        </h2>

        {/* Format selector */}
        <div className="export-format-row">
          <span className="export-format-label">صيغة التصدير:</span>
          <div className="format-buttons">
            <button
              type="button"
              className={`format-btn ${format === "pdf" ? "active" : ""}`}
              onClick={() => setFormat("pdf")}
            >
              <span className="format-icon">📄</span>
              <span>PDF</span>
            </button>
            <button
              type="button"
              className={`format-btn ${format === "excel" ? "active" : ""}`}
              onClick={() => setFormat("excel")}
            >
              <span className="format-icon">📊</span>
              <span>Excel</span>
            </button>
          </div>
        </div>

        {/* Table selection */}
        <div className="tables-selection">
          {tabs.map((tab) => {
            const tabDefs = TABLE_DEFS.filter((t) => t.tab === tab);
            const allChecked = tabDefs.every((t) => selected.has(t.key));
            const someChecked = tabDefs.some((t) => selected.has(t.key));
            return (
              <div key={tab} className="tab-group">
                <div className="tab-group-header">
                  <label className="tab-group-label">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      ref={(el) => { if (el) el.indeterminate = someChecked && !allChecked; }}
                      onChange={() => toggleTab(tab)}
                    />
                    <span>{tab}</span>
                  </label>
                </div>
                <div className="tab-group-items">
                  {tabDefs.map((def) => (
                    <label key={def.key} className={`table-item ${selected.has(def.key) ? "checked" : ""}`}>
                      <input
                        type="checkbox"
                        checked={selected.has(def.key)}
                        onChange={() => toggle(def.key)}
                      />
                      <span className="table-item-icon">{def.icon}</span>
                      <span className="table-item-label">{def.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="export-actions">
          <span className="selected-count">
            {selected.size > 0 ? `${selected.size} جدول محدد` : "لم يتم تحديد أي جدول"}
          </span>
          <div className="export-action-btns">
            <button
              type="button"
              className="clear-btn"
              onClick={() => setSelected(new Set())}
              disabled={selected.size === 0}
            >
              مسح التحديد
            </button>
            <button
              type="button"
              className="export-btn"
              onClick={handleExport}
              disabled={exporting || selected.size === 0}
            >
              {exporting ? (
                <><span className="btn-spinner" />جاري التصدير...</>
              ) : (
                <><span>📥</span>تصدير المحدد</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
