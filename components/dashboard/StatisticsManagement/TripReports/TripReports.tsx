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
import "./TripReports.css";

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
  vehicle_type_report: {
    by_vehicle_type: [],
    most_requested_vehicle_type: null,
  },
  time_report: {
    by_hour: [],
    by_day: [],
    by_month: [],
  },
  filters_applied: {
    from_date: null,
    to_date: null,
    vehicle_type: null,
    status: null,
  },
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

function getMaxTrips(items: Array<{ trips_count: number }>): number {
  const maxValue = Math.max(...items.map((item) => item.trips_count), 0);
  return maxValue <= 0 ? 1 : maxValue;
}

export default function TripReports() {
  const [reportData, setReportData] = useState<TripReportsData>(emptyTripReportsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draftFilters, setDraftFilters] = useState<TripReportsQueryParams>({
    from_date: "",
    to_date: "",
    vehicle_type: "all",
    status: "all",
  });
  const [appliedFilters, setAppliedFilters] = useState<TripReportsQueryParams>({});

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardService.getTripReports(appliedFilters);
        if (active) {
          setReportData(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "حدث خطأ أثناء جلب تقارير الرحلات");
          setReportData(emptyTripReportsData);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [appliedFilters]);

  const overview = reportData.overview;
  const tripsByVehicleType = reportData.vehicle_type_report.by_vehicle_type;
  const tripsByHour = reportData.time_report.by_hour;
  const tripsByDay = reportData.time_report.by_day;
  const tripsByMonth = reportData.time_report.by_month;
  const mostRequested = useMemo(() => {
    if (reportData.vehicle_type_report.most_requested_vehicle_type) {
      return reportData.vehicle_type_report.most_requested_vehicle_type;
    }
    if (!tripsByVehicleType.length) return null;
    return tripsByVehicleType.reduce((prev, current) =>
      prev.trips_count > current.trips_count ? prev : current
    );
  }, [reportData.vehicle_type_report.most_requested_vehicle_type, tripsByVehicleType]);

  const vehicleTypeOptions = useMemo(() => {
    const set = new Set(
      tripsByVehicleType
        .map((type) => type.vehicle_type_name)
        .filter((name) => typeof name === "string" && name.trim())
    );
    if (
      draftFilters.vehicle_type &&
      draftFilters.vehicle_type.trim() &&
      draftFilters.vehicle_type !== "all"
    ) {
      set.add(draftFilters.vehicle_type);
    }
    return [
      { value: "all", label: "كل الأنواع", icon: "🚗" },
      ...Array.from(set).map((name) => ({
        value: name,
        label: name,
        icon: "🚙",
      })),
    ];
  }, [tripsByVehicleType, draftFilters.vehicle_type]);

  const statusOptions = useMemo(
    () => [
      { value: "all", label: "كل الحالات", icon: "📋" },
      { value: "open", label: "مفتوحة", icon: "🟡" },
      { value: "accepted", label: "مقبولة", icon: "🤝" },
      { value: "started", label: "بدأت", icon: "🚕" },
      { value: "completed", label: "مكتملة", icon: "✅" },
      { value: "cancelled", label: "ملغاة", icon: "❌" },
      { value: "expired", label: "منتهية", icon: "⌛" },
    ],
    []
  );

  const onFilterChange = (key: keyof TripReportsQueryParams, value: string) => {
    setDraftFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    setAppliedFilters({
      from_date: draftFilters.from_date || undefined,
      to_date: draftFilters.to_date || undefined,
      vehicle_type:
        draftFilters.vehicle_type && draftFilters.vehicle_type !== "all"
          ? draftFilters.vehicle_type
          : undefined,
      status:
        draftFilters.status && draftFilters.status !== "all"
          ? draftFilters.status
          : undefined,
    });
  };

  const resetFilters = () => {
    const cleared = {
      from_date: "",
      to_date: "",
      vehicle_type: "all",
      status: "all",
    };
    setDraftFilters(cleared);
    setAppliedFilters({});
  };

  const renderTimeChart = (
    items: TripReportByHourItem[] | TripReportByPeriodItem[],
    title: string,
    icon: string,
    getLabel: (item: TripReportByHourItem | TripReportByPeriodItem) => string,
    getKey: (item: TripReportByHourItem | TripReportByPeriodItem, index: number) => string
  ) => {
    const maxTrips = getMaxTrips(items);
    return (
      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">{icon}</span>
          {title}
        </h2>
        <div className="chart-container">
          {items.map((item, index) => {
            const percentage = (item.trips_count / maxTrips) * 100;
            return (
              <div key={getKey(item, index)} className="chart-bar-item">
                <div className="chart-label">{getLabel(item)}</div>
                <div className="chart-bar-wrapper">
                  <div className="chart-bar" style={{ width: `${percentage}%` }}>
                    <span className="chart-value">{formatNumber(item.trips_count)}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {!items.length && <div className="chart-bar-item">لا توجد بيانات</div>}
        </div>
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>الفترة</th>
                <th>عدد الرحلات</th>
                <th>الإيرادات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={`${getKey(item, index)}-details`}>
                  <td data-label="الفترة">{getLabel(item)}</td>
                  <td data-label="عدد الرحلات">{formatNumber(item.trips_count)}</td>
                  <td data-label="الإيرادات" className="revenue-cell">
                    {formatCurrency(item.revenue)}
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center" }}>
                    لا توجد بيانات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="trip-reports">
      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">📊</span>
          إحصائيات الرحلات العامة
        </h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e3f2fd" }}>
              <span className="stat-icon-emoji">🚗</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{formatNumber(overview.total_trips)}</div>
              <div className="stat-label">إجمالي الرحلات</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e8f5e9" }}>
              <span className="stat-icon-emoji">✅</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{formatNumber(overview.completed_trips)}</div>
              <div className="stat-label">الرحلات المكتملة</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#ffebee" }}>
              <span className="stat-icon-emoji">❌</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{formatNumber(overview.cancelled_trips)}</div>
              <div className="stat-label">الرحلات الملغاة</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#fff3e0" }}>
              <span className="stat-icon-emoji">📉</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{overview.cancellation_rate}</div>
              <div className="stat-label">معدل الإلغاء</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#f3e5f5" }}>
              <span className="stat-icon-emoji">⏱️</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{formatNumber(overview.average_trip_duration_minutes)} د</div>
              <div className="stat-label">متوسط المدة</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e0f2f1" }}>
              <span className="stat-icon-emoji">📏</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{formatNumber(overview.average_distance_km)} كم</div>
              <div className="stat-label">متوسط المسافة</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#fce4ec" }}>
              <span className="stat-icon-emoji">💵</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{formatCurrency(overview.average_price)}</div>
              <div className="stat-label">متوسط السعر</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e8f5e9" }}>
              <span className="stat-icon-emoji">💰</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{formatCurrency(overview.total_revenue)}</div>
              <div className="stat-label">الإيرادات</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#ede7f6" }}>
              <span className="stat-icon-emoji">📭</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{formatNumber(overview.open_trips)}</div>
              <div className="stat-label">رحلات مفتوحة</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e1f5fe" }}>
              <span className="stat-icon-emoji">🤝</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{formatNumber(overview.accepted_trips)}</div>
              <div className="stat-label">رحلات مقبولة</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#fff8e1" }}>
              <span className="stat-icon-emoji">🚕</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{formatNumber(overview.started_trips)}</div>
              <div className="stat-label">رحلات بدأت</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#fbe9e7" }}>
              <span className="stat-icon-emoji">⌛</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{formatNumber(overview.expired_trips)}</div>
              <div className="stat-label">رحلات منتهية</div>
            </div>
          </div>
        </div>
      </div>

      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">🔎</span>
          فلاتر التقارير
        </h2>
        <div className="trip-report-filters">
          <div className="filter-field">
            <label htmlFor="from-date">من تاريخ</label>
            <input
              id="from-date"
              type="date"
              value={draftFilters.from_date || ""}
              onChange={(event) => onFilterChange("from_date", event.target.value)}
            />
          </div>
          <div className="filter-field">
            <label htmlFor="to-date">إلى تاريخ</label>
            <input
              id="to-date"
              type="date"
              value={draftFilters.to_date || ""}
              onChange={(event) => onFilterChange("to_date", event.target.value)}
            />
          </div>
          <div className="filter-field">
            <label htmlFor="vehicle-type">نوع المركبة</label>
            <CustomSelect
              options={vehicleTypeOptions}
              value={draftFilters.vehicle_type || "all"}
              onChange={(value) => onFilterChange("vehicle_type", value)}
            />
          </div>
          <div className="filter-field">
            <label htmlFor="status">الحالة</label>
            <CustomSelect
              options={statusOptions}
              value={draftFilters.status || "all"}
              onChange={(value) => onFilterChange("status", value)}
            />
          </div>
          <div className="filter-actions">
            <button type="button" className="filter-btn filter-btn-primary" onClick={applyFilters}>
              تطبيق الفلاتر
            </button>
            <button type="button" className="filter-btn filter-btn-secondary" onClick={resetFilters}>
              إعادة تعيين
            </button>
          </div>
        </div>
        {loading && (
          <div className="highlight-box">
            <span className="highlight-text">جاري تحميل البيانات...</span>
          </div>
        )}
        {error && !loading && (
          <div className="highlight-box">
            <span className="highlight-text">{error}</span>
          </div>
        )}
      </div>

      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">🚙</span>
          تقرير حسب نوع المركبة
        </h2>
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>نوع المركبة</th>
                <th>عدد الرحلات</th>
                <th>الإيرادات</th>
                <th>متوسط السعر</th>
              </tr>
            </thead>
            <tbody>
              {tripsByVehicleType.map((type) => (
                <tr key={`${type.vehicle_type_id ?? type.vehicle_type_name}`}>
                  <td data-label="نوع المركبة" className="vehicle-name">{type.vehicle_type_name}</td>
                  <td data-label="عدد الرحلات">{formatNumber(type.trips_count)}</td>
                  <td data-label="الإيرادات" className="revenue-cell">{formatCurrency(type.revenue)}</td>
                  <td data-label="متوسط السعر">{formatCurrency(type.average_price)}</td>
                </tr>
              ))}
              {!tripsByVehicleType.length && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    لا توجد بيانات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {mostRequested && (
          <div className="highlight-box">
            <span className="highlight-icon">🏆</span>
            <span className="highlight-text">
              النوع الأكثر طلباً: <strong>{mostRequested.vehicle_type_name}</strong> بـ{" "}
              {formatNumber(mostRequested.trips_count)} رحلة
            </span>
          </div>
        )}
      </div>

      {renderTimeChart(
        tripsByHour,
        "تقرير الرحلات حسب الساعة (24 ساعة)",
        "🕐",
        (item) => normalizeHourLabel((item as TripReportByHourItem).hour),
        (item, index) => `${(item as TripReportByHourItem).hour}-${index}`
      )}

      {renderTimeChart(
        tripsByDay,
        "تقرير الرحلات حسب اليوم",
        "📅",
        (item) => (item as TripReportByPeriodItem).label,
        (item, index) => `${(item as TripReportByPeriodItem).label}-day-${index}`
      )}

      {renderTimeChart(
        tripsByMonth,
        "تقرير الرحلات حسب الشهر",
        "📆",
        (item) => (item as TripReportByPeriodItem).label,
        (item, index) => `${(item as TripReportByPeriodItem).label}-month-${index}`
      )}
    </div>
  );
}
