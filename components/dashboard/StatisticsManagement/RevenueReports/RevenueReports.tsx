"use client";

import { useEffect, useState } from "react";
import { RevenueReportsService } from "@/services/revenueReportsService";
import { RevenueReportsData } from "@/models/RevenueReports";
import TablePagination from "@/components/shared/TablePagination/TablePagination";
import { usePagination } from "@/hooks/usePagination";
import "./RevenueReports.css";

const PER_PAGE = 10;

export default function RevenueReports() {
  const [data, setData] = useState<RevenueReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    RevenueReportsService.getRevenueReports()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const periodPag  = usePagination(data?.by_period ?? [], PER_PAGE);
  const vehiclePag = usePagination(data?.by_vehicle_type ?? [], PER_PAGE);

  if (loading) {
    return (
      <div className="revenue-reports-loading">
        <div className="loading-spinner" />
        <span>جاري التحميل...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="revenue-reports-error">
        <span>⚠️ {error || "حدث خطأ أثناء تحميل البيانات"}</span>
      </div>
    );
  }

  const maxPeriodRevenue = Math.max(...(data?.by_period ?? []).map((p) => p.revenue), 1);
  const maxVehicleRevenue = Math.max(...(data?.by_vehicle_type ?? []).map((v) => v.revenue), 1);

  return (
    <div className="revenue-reports">
      {/* Overall Revenue */}
      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">💰</span>
          الإيرادات الإجمالية
        </h2>
        <div className="stats-grid-3">
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e8f5e9" }}>
              <span className="stat-icon-emoji">🚗</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{data.trips_revenue.toLocaleString()} ج.م</div>
              <div className="stat-label">إيرادات الرحلات</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e3f2fd" }}>
              <span className="stat-icon-emoji">📋</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{data.subscriptions_revenue.toLocaleString()} ج.م</div>
              <div className="stat-label">إيرادات الاشتراكات</div>
            </div>
          </div>

          <div className="stat-card highlight-card">
            <div className="stat-icon-wrapper" style={{ background: "#fff3e0" }}>
              <span className="stat-icon-emoji">💎</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{data.total_revenue.toLocaleString()} ج.م</div>
              <div className="stat-label">إجمالي الإيرادات</div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Period */}
      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">📆</span>
          الإيرادات الشهرية
        </h2>
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>الشهر</th>
                <th>السنة</th>
                <th>عدد الرحلات</th>
                <th>الإيرادات</th>
                <th>التوزيع</th>
              </tr>
            </thead>
            <tbody>
              {periodPag.paged.map((period, index) => {
                const barWidth = (period.revenue / maxPeriodRevenue) * 100;
                return (
                  <tr key={index} className={period.revenue > 0 ? "active-period-row" : ""}>
                    <td className="name-cell">{period.month_name_ar}</td>
                    <td>{period.year}</td>
                    <td>{period.trips_count.toLocaleString()}</td>
                    <td className="revenue-cell">{period.revenue.toLocaleString()} ج.م</td>
                    <td>
                      <div className="vehicle-bar-wrapper">
                        <div className="vehicle-bar" style={{ width: `${barWidth}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <TablePagination page={periodPag.page} lastPage={periodPag.lastPage} total={periodPag.total} perPage={PER_PAGE} onPageChange={periodPag.setPage} />
        </div>
      </div>

      {/* Revenue by Vehicle Type */}
      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">🚙</span>
          الإيرادات حسب نوع المركبة
        </h2>
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>نوع المركبة</th>
                <th>عدد الرحلات</th>
                <th>الإيرادات</th>
                <th>النسبة من الإجمالي</th>
                <th>التوزيع</th>
              </tr>
            </thead>
            <tbody>
              {vehiclePag.paged.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#95a5a6", padding: "1.5rem" }}>لا توجد بيانات</td>
                </tr>
              ) : (
                vehiclePag.paged.map((type) => {
                  const pct = data!.trips_revenue > 0
                    ? ((type.revenue / data!.trips_revenue) * 100).toFixed(1)
                    : "0.0";
                  const barWidth = (type.revenue / maxVehicleRevenue) * 100;
                  return (
                    <tr key={type.vehicle_type_id}>
                      <td className="vehicle-name">{type.vehicle_type_name_ar}</td>
                      <td>{type.trips_count.toLocaleString()}</td>
                      <td className="revenue-cell">{type.revenue.toLocaleString()} ج.م</td>
                      <td className="percentage-cell">{pct}%</td>
                      <td>
                        <div className="vehicle-bar-wrapper">
                          <div className="vehicle-bar" style={{ width: `${barWidth}%` }} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <TablePagination page={vehiclePag.page} lastPage={vehiclePag.lastPage} total={vehiclePag.total} perPage={PER_PAGE} onPageChange={vehiclePag.setPage} />
        </div>
      </div>
    </div>
  );
}
