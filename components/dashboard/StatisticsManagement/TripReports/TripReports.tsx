"use client";

import { useEffect, useMemo, useState } from "react";
import {
  dashboardService,
  TripReportByHourItem,
  TripReportByPeriodItem,
  TripReportsData,
  TripReportsQueryParams,
} from "@/services/dashboardService";
import CustomSelect from "@/components/dashboard/UsersManagement/CustomSelect/CustomSelect";
import TablePagination from "@/components/shared/TablePagination/TablePagination";
import { usePagination } from "@/hooks/usePagination";
import "./TripReports.css";

const PER_PAGE = 10;

const emptyTripReportsData: TripReportsData = {
  overview: {
    total_trips: 0,
    completed_trips: 0,
    cancelled_trips: 0,
    open_trips: 0,
    accepted_trips: 0,
    started_trips: 0,
    expired_trips: 0,
    cancellation_rate: "0%",
    average_trip_duration_minutes: 0,
    average_distance_km: 0,
    average_price: 0,
    total_revenue: 0,
  },
  vehicle_type_report: { by_vehicle_type: [], most_requested_vehicle_type: null },
  time_report: { by_hour: [], by_day: [], by_month: [] },
  filters_applied: { from_date: null, to_date: null, vehicle_type: null, status: null },
};

function formatNumber(value: number): string {
  return value.toLocaleString("ar-EG");
}
function formatCurrency(value: number): string {
  return `${value.toLocaleString("ar-EG")} ج.م`;
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

export default function TripReports() {
  const [reportData, setReportData] = useState<TripReportsData>(emptyTripReportsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draftFilters, setDraftFilters] = useState<TripReportsQueryParams>({
    from_date: "", to_date: "", vehicle_type: "all", status: "all",
  });
  const [appliedFilters, setAppliedFilters] = useState<TripReportsQueryParams>({});

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    dashboardService.getTripReports(appliedFilters)
      .then((data) => { if (active) setReportData(data); })
      .catch((err) => { if (active) { setError(err instanceof Error ? err.message : "حدث خطأ"); setReportData(emptyTripReportsData); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [appliedFilters]);

  const overview = reportData.overview;
  const tripsByVehicleType = reportData.vehicle_type_report.by_vehicle_type;
  const tripsByHour = reportData.time_report.by_hour;
  const tripsByDay = reportData.time_report.by_day;
  const tripsByMonth = reportData.time_report.by_month;

  const mostRequested = useMemo(() => {
    if (reportData.vehicle_type_report.most_requested_vehicle_type)
      return reportData.vehicle_type_report.most_requested_vehicle_type;
    if (!tripsByVehicleType.length) return null;
    return tripsByVehicleType.reduce((prev, cur) => prev.trips_count > cur.trips_count ? prev : cur);
  }, [reportData.vehicle_type_report.most_requested_vehicle_type, tripsByVehicleType]);

  const vehicleTypeOptions = useMemo(() => {
    const set = new Set(tripsByVehicleType.map((t) => t.vehicle_type_name).filter(Boolean));
    if (draftFilters.vehicle_type && draftFilters.vehicle_type !== "all") set.add(draftFilters.vehicle_type);
    return [{ value: "all", label: "كل الأنواع", icon: "🚗" }, ...Array.from(set).map((n) => ({ value: n, label: n, icon: "🚙" }))];
  }, [tripsByVehicleType, draftFilters.vehicle_type]);

  const statusOptions = useMemo(() => [
    { value: "all", label: "كل الحالات", icon: "📋" },
    { value: "open", label: "مفتوحة", icon: "🟡" },
    { value: "accepted", label: "مقبولة", icon: "🤝" },
    { value: "started", label: "بدأت", icon: "🚕" },
    { value: "completed", label: "مكتملة", icon: "✅" },
    { value: "cancelled", label: "ملغاة", icon: "❌" },
    { value: "expired", label: "منتهية", icon: "⌛" },
  ], []);

  // Pagination for each table
  const vehiclePag = usePagination(tripsByVehicleType, PER_PAGE);
  const hourPag    = usePagination(tripsByHour, PER_PAGE);
  const dayPag     = usePagination(tripsByDay, PER_PAGE);
  const monthPag   = usePagination(tripsByMonth, PER_PAGE);

  const onFilterChange = (key: keyof TripReportsQueryParams, value: string) =>
    setDraftFilters((prev) => ({ ...prev, [key]: value }));

  const applyFilters = () => setAppliedFilters({
    from_date: draftFilters.from_date || undefined,
    to_date: draftFilters.to_date || undefined,
    vehicle_type: draftFilters.vehicle_type !== "all" ? draftFilters.vehicle_type : undefined,
    status: draftFilters.status !== "all" ? draftFilters.status : undefined,
  });

  const resetFilters = () => {
    setDraftFilters({ from_date: "", to_date: "", vehicle_type: "all", status: "all" });
    setAppliedFilters({});
  };

  const renderTimeTable = (
    pag: ReturnType<typeof usePagination>,
    title: string,
    icon: string,
    getLabel: (item: any) => string,
  ) => (
    <div className="report-section">
      <h2 className="section-title"><span className="title-icon">{icon}</span>{title}</h2>
      <div className="table-container">
        <table className="report-table">
          <thead>
            <tr><th>الفترة</th><th>عدد الرحلات</th><th>الإيرادات</th></tr>
          </thead>
          <tbody>
            {pag.paged.length === 0 ? (
              <tr><td colSpan={3} style={{ textAlign: "center" }}>لا توجد بيانات</td></tr>
            ) : (
              pag.paged.map((item: any, i: number) => (
                <tr key={i}>
                  <td>{getLabel(item)}</td>
                  <td>{formatNumber(item.trips_count)}</td>
                  <td className="revenue-cell">{formatCurrency(item.revenue)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <TablePagination page={pag.page} lastPage={pag.lastPage} total={pag.total} perPage={PER_PAGE} onPageChange={pag.setPage} />
      </div>
    </div>
  );

  return (
    <div className="trip-reports">
      {/* Overview stats */}
      <div className="report-section">
        <h2 className="section-title"><span className="title-icon">📊</span>إحصائيات الرحلات العامة</h2>
        <div className="stats-grid">
          {[
            { bg: "#e3f2fd", icon: "🚗", val: formatNumber(overview.total_trips), label: "إجمالي الرحلات" },
            { bg: "#e8f5e9", icon: "✅", val: formatNumber(overview.completed_trips), label: "الرحلات المكتملة" },
            { bg: "#ffebee", icon: "❌", val: formatNumber(overview.cancelled_trips), label: "الرحلات الملغاة" },
            { bg: "#fff3e0", icon: "📉", val: overview.cancellation_rate, label: "معدل الإلغاء" },
            { bg: "#f3e5f5", icon: "⏱️", val: `${formatNumber(overview.average_trip_duration_minutes)} د`, label: "متوسط المدة" },
            { bg: "#e0f2f1", icon: "📏", val: `${formatNumber(overview.average_distance_km)} كم`, label: "متوسط المسافة" },
            { bg: "#fce4ec", icon: "💵", val: formatCurrency(overview.average_price), label: "متوسط السعر" },
            { bg: "#e8f5e9", icon: "💰", val: formatCurrency(overview.total_revenue), label: "الإيرادات" },
            { bg: "#ede7f6", icon: "📭", val: formatNumber(overview.open_trips), label: "رحلات مفتوحة" },
            { bg: "#e1f5fe", icon: "🤝", val: formatNumber(overview.accepted_trips), label: "رحلات مقبولة" },
            { bg: "#fff8e1", icon: "🚕", val: formatNumber(overview.started_trips), label: "رحلات بدأت" },
            { bg: "#fbe9e7", icon: "⌛", val: formatNumber(overview.expired_trips), label: "رحلات منتهية" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon-wrapper" style={{ background: s.bg }}><span className="stat-icon-emoji">{s.icon}</span></div>
              <div className="stat-details"><div className="stat-value">{s.val}</div><div className="stat-label">{s.label}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="report-section">
        <h2 className="section-title"><span className="title-icon">🔎</span>فلاتر التقارير</h2>
        <div className="trip-report-filters">
          <div className="filter-field">
            <label>من تاريخ</label>
            <input type="date" value={draftFilters.from_date || ""} onChange={(e) => onFilterChange("from_date", e.target.value)} />
          </div>
          <div className="filter-field">
            <label>إلى تاريخ</label>
            <input type="date" value={draftFilters.to_date || ""} onChange={(e) => onFilterChange("to_date", e.target.value)} />
          </div>
          <div className="filter-field">
            <label>نوع المركبة</label>
            <CustomSelect options={vehicleTypeOptions} value={draftFilters.vehicle_type || "all"} onChange={(v) => onFilterChange("vehicle_type", v)} />
          </div>
          <div className="filter-field">
            <label>الحالة</label>
            <CustomSelect options={statusOptions} value={draftFilters.status || "all"} onChange={(v) => onFilterChange("status", v)} />
          </div>
          <div className="filter-actions">
            <button type="button" className="filter-btn filter-btn-primary" onClick={applyFilters}>تطبيق الفلاتر</button>
            <button type="button" className="filter-btn filter-btn-secondary" onClick={resetFilters}>إعادة تعيين</button>
          </div>
        </div>
        {loading && <div className="highlight-box"><span className="highlight-text">جاري تحميل البيانات...</span></div>}
        {error && !loading && <div className="highlight-box"><span className="highlight-text">{error}</span></div>}
      </div>

      {/* Vehicle type table */}
      <div className="report-section">
        <h2 className="section-title"><span className="title-icon">🚙</span>تقرير حسب نوع المركبة</h2>
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr><th>نوع المركبة</th><th>عدد الرحلات</th><th>الإيرادات</th><th>متوسط السعر</th></tr>
            </thead>
            <tbody>
              {vehiclePag.paged.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: "center" }}>لا توجد بيانات</td></tr>
              ) : (
                vehiclePag.paged.map((type: any) => (
                  <tr key={type.vehicle_type_id ?? type.vehicle_type_name}>
                    <td className="vehicle-name">{type.vehicle_type_name}</td>
                    <td>{formatNumber(type.trips_count)}</td>
                    <td className="revenue-cell">{formatCurrency(type.revenue)}</td>
                    <td>{formatCurrency(type.average_price)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <TablePagination page={vehiclePag.page} lastPage={vehiclePag.lastPage} total={vehiclePag.total} perPage={PER_PAGE} onPageChange={vehiclePag.setPage} />
        </div>
        {mostRequested && (
          <div className="highlight-box">
            <span className="highlight-icon">🏆</span>
            <span className="highlight-text">النوع الأكثر طلباً: <strong>{mostRequested.vehicle_type_name}</strong> بـ {formatNumber(mostRequested.trips_count)} رحلة</span>
          </div>
        )}
      </div>

      {renderTimeTable(hourPag, "تقرير الرحلات حسب الساعة", "🕐", (item) => normalizeHourLabel((item as TripReportByHourItem).hour))}
      {renderTimeTable(dayPag, "تقرير الرحلات حسب اليوم", "📅", (item) => (item as TripReportByPeriodItem).label)}
      {renderTimeTable(monthPag, "تقرير الرحلات حسب الشهر", "📆", (item) => (item as TripReportByPeriodItem).label)}
    </div>
  );
}
