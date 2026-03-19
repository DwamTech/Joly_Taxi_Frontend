"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import CustomSelect from "@/components/shared/CustomSelect/CustomSelect";
import { dashboardService, TripReportsQueryParams } from "@/services/dashboardService";
import "./ExportSchedule.css";

type ExportTableKey = "vehicle_type" | "hourly" | "daily" | "monthly";

interface ExportTableData {
  title: string;
  headers: string[];
  rows: Array<Array<string | number>>;
}

function normalizeHourLabel(hour: string): string {
  const [hourPart] = hour.split(":");
  const parsedHour = Number(hourPart);
  if (Number.isNaN(parsedHour)) return hour;
  if (parsedHour === 0) return "12 ص";
  if (parsedHour < 12) return `${parsedHour} ص`;
  if (parsedHour === 12) return "12 م";
  return `${parsedHour - 12} م`;
}

function createExportTable(
  tableKey: ExportTableKey,
  data: Awaited<ReturnType<typeof dashboardService.getTripReports>>
): ExportTableData {
  if (tableKey === "vehicle_type") {
    return {
      title: "تقرير حسب نوع المركبة",
      headers: ["نوع المركبة", "عدد الرحلات", "الإيرادات", "متوسط السعر"],
      rows: data.vehicle_type_report.by_vehicle_type.map((item) => [
        item.vehicle_type_name,
        item.trips_count,
        item.revenue,
        item.average_price,
      ]),
    };
  }

  if (tableKey === "hourly") {
    return {
      title: "تقرير الرحلات حسب الساعة",
      headers: ["الساعة", "عدد الرحلات", "الإيرادات"],
      rows: data.time_report.by_hour.map((item) => [
        normalizeHourLabel(item.hour),
        item.trips_count,
        item.revenue,
      ]),
    };
  }

  if (tableKey === "daily") {
    return {
      title: "تقرير الرحلات حسب اليوم",
      headers: ["اليوم", "عدد الرحلات", "الإيرادات"],
      rows: data.time_report.by_day.map((item) => [item.label, item.trips_count, item.revenue]),
    };
  }

  return {
    title: "تقرير الرحلات حسب الشهر",
    headers: ["الشهر", "عدد الرحلات", "الإيرادات"],
    rows: data.time_report.by_month.map((item) => [item.label, item.trips_count, item.revenue]),
  };
}

function downloadCsv(table: ExportTableData, filePrefix: string) {
  const csvContent = [
    table.headers.join(","),
    ...table.rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filePrefix}_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function downloadPdf(table: ExportTableData, filePrefix: string) {
  const { jsPDF } = await import("jspdf");
  const isWideTable = table.headers.length > 3;
  const canvasWidth = isWideTable ? 1600 : 1100;
  const outerPadding = 36;
  const titleHeight = 54;
  const headerHeight = 42;
  const rowHeight = 36;
  const contentWidth = canvasWidth - outerPadding * 2;
  const rowsCount = Math.max(table.rows.length, 1);
  const canvasHeight =
    outerPadding + titleHeight + headerHeight + rowsCount * rowHeight + outerPadding;

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("تعذر إنشاء ملف PDF");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#111827";
  context.font = "700 34px Tahoma, Arial, sans-serif";
  context.textAlign = "right";
  context.textBaseline = "middle";
  context.fillText(table.title, canvasWidth - outerPadding, outerPadding + titleHeight / 2);

  const columnsCount = table.headers.length;
  const columnWidth = contentWidth / columnsCount;
  const tableTop = outerPadding + titleHeight;

  table.headers.forEach((header, columnIndex) => {
    const x = outerPadding + columnIndex * columnWidth;
    context.fillStyle = "#f59e0b";
    context.fillRect(x, tableTop, columnWidth, headerHeight);
    context.strokeStyle = "#d1d5db";
    context.lineWidth = 1;
    context.strokeRect(x, tableTop, columnWidth, headerHeight);

    context.fillStyle = "#ffffff";
    context.font = "700 24px Tahoma, Arial, sans-serif";
    context.textAlign = "right";
    context.fillText(
      header,
      x + columnWidth - 14,
      tableTop + headerHeight / 2
    );
  });

  const rowsToRender =
    table.rows.length > 0 ? table.rows : [Array.from({ length: columnsCount }).map(() => "-")];

  rowsToRender.forEach((row, rowIndex) => {
    const y = tableTop + headerHeight + rowIndex * rowHeight;
    row.forEach((cell, columnIndex) => {
      const x = outerPadding + columnIndex * columnWidth;
      context.fillStyle = rowIndex % 2 === 0 ? "#ffffff" : "#f9fafb";
      context.fillRect(x, y, columnWidth, rowHeight);
      context.strokeStyle = "#e5e7eb";
      context.lineWidth = 1;
      context.strokeRect(x, y, columnWidth, rowHeight);

      context.fillStyle = "#111827";
      context.font = "500 20px Tahoma, Arial, sans-serif";
      context.textAlign = "right";
      context.fillText(String(cell), x + columnWidth - 14, y + rowHeight / 2);
    });
  });

  const doc = new jsPDF({
    orientation: isWideTable ? "landscape" : "portrait",
    unit: "pt",
    format: "a4",
  });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const horizontalMargin = 20;
  const verticalMargin = 20;
  const renderWidthPt = pageWidth - horizontalMargin * 2;
  const scale = renderWidthPt / canvas.width;
  const sliceHeightPx = Math.floor((pageHeight - verticalMargin * 2) / scale);

  let offsetY = 0;
  let isFirstPage = true;
  while (offsetY < canvas.height) {
    const currentSliceHeight = Math.min(sliceHeightPx, canvas.height - offsetY);
    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = currentSliceHeight;
    const sliceContext = sliceCanvas.getContext("2d");
    if (!sliceContext) {
      throw new Error("تعذر إنشاء ملف PDF");
    }
    sliceContext.drawImage(
      canvas,
      0,
      offsetY,
      canvas.width,
      currentSliceHeight,
      0,
      0,
      canvas.width,
      currentSliceHeight
    );

    const imageData = sliceCanvas.toDataURL("image/png");
    const renderHeightPt = currentSliceHeight * scale;
    if (!isFirstPage) {
      doc.addPage();
    }
    doc.addImage(
      imageData,
      "PNG",
      horizontalMargin,
      verticalMargin,
      renderWidthPt,
      renderHeightPt
    );
    isFirstPage = false;
    offsetY += currentSliceHeight;
  }

  doc.save(`${filePrefix}_${new Date().toISOString().split("T")[0]}.pdf`);
}

export default function ExportSchedule() {
  const { showToast } = useToast();
  const [exportForm, setExportForm] = useState({
    reportType: "trips",
    tableType: "vehicle_type" as ExportTableKey,
    format: "pdf",
    dateFrom: "",
    dateTo: "",
  });

  const reportTypeOptions = [
    { value: "trips", label: "تقرير الرحلات", icon: "🚗" },
  //  { value: "drivers", label: "تقرير السائقين", icon: "👨‍✈️" },
  //  { value: "riders", label: "تقرير الركاب", icon: "👥" },
  //  { value: "revenue", label: "تقرير الإيرادات", icon: "💰" },
  //  { value: "vehicle_types", label: "تقرير أنواع المركبات", icon: "🚙" },
  //  { value: "complete", label: "تقرير شامل", icon: "📊" },
  ];

  const tableTypeOptions = [
    { value: "vehicle_type", label: "جدول حسب نوع المركبة", icon: "🚙" },
    { value: "hourly", label: "جدول حسب الساعة", icon: "🕐" },
    { value: "daily", label: "جدول حسب اليوم", icon: "📅" },
    { value: "monthly", label: "جدول حسب الشهر", icon: "📆" },
  ];

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (exportForm.dateFrom && exportForm.dateTo && exportForm.dateFrom > exportForm.dateTo) {
      showToast("تاريخ البداية يجب أن يكون قبل تاريخ النهاية", "error");
      return;
    }

    try {
      showToast(`جاري تجهيز ${exportForm.format.toUpperCase()}...`, "info");
      const params: TripReportsQueryParams = {
        from_date: exportForm.dateFrom || undefined,
        to_date: exportForm.dateTo || undefined,
      };
      const reportData = await dashboardService.getTripReports(params);
      const selectedTable = createExportTable(exportForm.tableType, reportData);

      if (!selectedTable.rows.length) {
        showToast("لا توجد بيانات في الجدول المختار ضمن الفترة المحددة", "warning");
        return;
      }

      const filePrefix = `trip_reports_${exportForm.tableType}`;
      if (exportForm.format === "excel") {
        downloadCsv(selectedTable, filePrefix);
        showToast("تم تنزيل ملف Excel للجدول المختار بنجاح", "success");
        return;
      }

      await downloadPdf(selectedTable, filePrefix);
      showToast("تم تنزيل ملف PDF للجدول المختار بنجاح", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "فشل في تصدير الجدول المحدد";
      showToast(message, "error");
    }
  };

  return (
    <div className="export-schedule">
      {/* Export Section */}
      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">📤</span>
          تصدير التقارير
        </h2>
        <form onSubmit={handleExport} className="export-form">
          <div className="form-grid">
            <div className="form-group">
              <label>نوع التقرير</label>
              <CustomSelect
                options={reportTypeOptions.slice(0, 5)}
                value={exportForm.reportType}
                onChange={(value) => setExportForm({ ...exportForm, reportType: value })}
              />
            </div>

            <div className="form-group">
              <label>صيغة التصدير</label>
              <div className="format-buttons">
                <button
                  type="button"
                  className={`format-btn ${exportForm.format === "pdf" ? "active" : ""}`}
                  onClick={() => setExportForm({ ...exportForm, format: "pdf" })}
                >
                  <span className="format-icon">📄</span>
                  <span>PDF</span>
                </button>
                <button
                  type="button"
                  className={`format-btn ${exportForm.format === "excel" ? "active" : ""}`}
                  onClick={() => setExportForm({ ...exportForm, format: "excel" })}
                >
                  <span className="format-icon">📊</span>
                  <span>Excel</span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>الجدول المراد تصديره</label>
              <CustomSelect
                options={tableTypeOptions}
                value={exportForm.tableType}
                onChange={(value) =>
                  setExportForm({ ...exportForm, tableType: value as ExportTableKey })
                }
              />
            </div>

            <div className="form-group">
              <label>من تاريخ</label>
              <input
                type="date"
                value={exportForm.dateFrom}
                onChange={(e) => setExportForm({ ...exportForm, dateFrom: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>إلى تاريخ</label>
              <input
                type="date"
                value={exportForm.dateTo}
                onChange={(e) => setExportForm({ ...exportForm, dateTo: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" className="export-btn">
            <span>📥</span>
            <span>تصدير التقرير</span>
          </button>
        </form>
      </div>

      {/* Schedule Section */}
      {/*<div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">⏰</span>
          جدولة التقارير الدورية
        </h2>
        <p className="section-description">
          سيتم إرسال التقارير تلقائياً إلى البريد الإلكتروني المحدد حسب الفترة المختارة
        </p>
        <form onSubmit={handleSchedule} className="schedule-form">
          <div className="form-grid">
            <div className="form-group">
              <label>نوع التقرير</label>
              <CustomSelect
                options={reportTypeOptions}
                value={scheduleForm.reportType}
                onChange={(value) => setScheduleForm({ ...scheduleForm, reportType: value })}
              />
            </div>

            <div className="form-group">
              <label>التكرار</label>
              <div className="frequency-buttons">
                <button
                  type="button"
                  className={`freq-btn ${scheduleForm.frequency === "daily" ? "active" : ""}`}
                  onClick={() => setScheduleForm({ ...scheduleForm, frequency: "daily" })}
                >
                  <span className="freq-icon">📅</span>
                  <span>يومي</span>
                </button>
                <button
                  type="button"
                  className={`freq-btn ${scheduleForm.frequency === "weekly" ? "active" : ""}`}
                  onClick={() => setScheduleForm({ ...scheduleForm, frequency: "weekly" })}
                >
                  <span className="freq-icon">📊</span>
                  <span>أسبوعي</span>
                </button>
                <button
                  type="button"
                  className={`freq-btn ${scheduleForm.frequency === "monthly" ? "active" : ""}`}
                  onClick={() => setScheduleForm({ ...scheduleForm, frequency: "monthly" })}
                >
                  <span className="freq-icon">📆</span>
                  <span>شهري</span>
                </button>
              </div>
            </div>

            <div className="form-group full-width">
              <label>البريد الإلكتروني</label>
              <input
                type="email"
                value={scheduleForm.email}
                onChange={(e) => setScheduleForm({ ...scheduleForm, email: e.target.value })}
                className="form-input"
                placeholder="example@domain.com"
                required
              />
            </div>
          </div>

          <button type="submit" className="schedule-btn">
            <span>⏰</span>
            <span>جدولة التقرير</span>
          </button>
        </form>
      </div>*/}

      {/* Info Box */}
      {/*<div className="info-box">
        <div className="info-icon">ℹ️</div>
        <div className="info-content">
          <h3>ملاحظات هامة:</h3>
          <ul>
            <li>سيتم إرسال التقارير المجدولة تلقائياً في الوقت المحدد</li>
            <li>يمكنك تصدير التقارير بصيغة PDF أو Excel</li>
            <li>التقارير المصدرة تحتوي على جميع البيانات المتاحة في الفترة المحددة</li>
            <li>يتم استخدام البريد الإلكتروني الخاص بالمشروع لإرسال التقارير</li>
          </ul>
        </div>
      </div>*/}
    </div>
  );
}
