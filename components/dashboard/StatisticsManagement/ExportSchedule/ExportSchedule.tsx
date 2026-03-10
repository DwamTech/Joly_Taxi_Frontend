"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import CustomSelect from "@/components/shared/CustomSelect/CustomSelect";
import "./ExportSchedule.css";

export default function ExportSchedule() {
  const { showToast } = useToast();
  const [exportForm, setExportForm] = useState({
    reportType: "trips",
    format: "pdf",
    dateFrom: "",
    dateTo: "",
  });

  const [scheduleForm, setScheduleForm] = useState({
    reportType: "trips",
    frequency: "weekly",
    email: "",
  });

  const reportTypeOptions = [
    { value: "trips", label: "تقرير الرحلات", icon: "🚗" },
    { value: "drivers", label: "تقرير السائقين", icon: "👨‍✈️" },
    { value: "riders", label: "تقرير الركاب", icon: "👥" },
    { value: "revenue", label: "تقرير الإيرادات", icon: "💰" },
    { value: "vehicle_types", label: "تقرير أنواع المركبات", icon: "🚙" },
    { value: "complete", label: "تقرير شامل", icon: "📊" },
  ];

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`جاري تصدير التقرير بصيغة ${exportForm.format.toUpperCase()}...`, "info");
    setTimeout(() => {
      showToast("تم تصدير التقرير بنجاح", "success");
    }, 2000);
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("تم جدولة التقرير بنجاح", "success");
    setScheduleForm({ ...scheduleForm, email: "" });
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
      <div className="report-section">
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
      </div>

      {/* Info Box */}
      <div className="info-box">
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
      </div>
    </div>
  );
}
