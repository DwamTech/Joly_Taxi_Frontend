"use client";

import { useEffect, useState } from "react";
import { UserReportsService } from "@/services/userReportsService";
import { DriverRevenueData } from "@/models/UserReports";
import "./DriverRevenueModal.css";

interface Props {
  driverId: number;
  driverName: string;
  onClose: () => void;
}

export default function DriverRevenueModal({ driverId, driverName, onClose }: Props) {
  const [data, setData] = useState<DriverRevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    UserReportsService.getDriverRevenue(driverId)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [driverId]);

  return (
    <div className="drm-overlay" onClick={onClose}>
      <div className="drm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="drm-header">
          <div className="drm-title">
            <span className="drm-icon">👨‍✈️</span>
            <div>
              <h2>{driverName}</h2>
              <span className="drm-subtitle">تقرير الإيرادات</span>
            </div>
          </div>
          <button className="drm-close" onClick={onClose} aria-label="إغلاق">✕</button>
        </div>

        <div className="drm-body">
          {loading && (
            <div className="drm-loading">
              <div className="drm-spinner" />
              <span>جاري التحميل...</span>
            </div>
          )}

          {error && !loading && (
            <div className="drm-error">⚠️ {error}</div>
          )}

          {data && !loading && (
            <>
              {/* Summary cards */}
              <div className="drm-stats">
                <div className="drm-stat-card">
                  <span className="drm-stat-icon">🚗</span>
                  <div>
                    <div className="drm-stat-value">{data.trips_revenue.toLocaleString()} ج.م</div>
                    <div className="drm-stat-label">إيرادات الرحلات</div>
                  </div>
                </div>
                <div className="drm-stat-card">
                  <span className="drm-stat-icon">📋</span>
                  <div>
                    <div className="drm-stat-value">{data.subscriptions_revenue.toLocaleString()} ج.م</div>
                    <div className="drm-stat-label">إيرادات الاشتراكات</div>
                  </div>
                </div>
                <div className="drm-stat-card highlight">
                  <span className="drm-stat-icon">💎</span>
                  <div>
                    <div className="drm-stat-value">{data.total_revenue.toLocaleString()} ج.م</div>
                    <div className="drm-stat-label">إجمالي الإيرادات</div>
                  </div>
                </div>
                <div className="drm-stat-card">
                  <span className="drm-stat-icon">🔢</span>
                  <div>
                    <div className="drm-stat-value">{data.trips_count.toLocaleString()}</div>
                    <div className="drm-stat-label">عدد الرحلات</div>
                  </div>
                </div>
              </div>

              {/* Monthly breakdown */}
              <h3 className="drm-section-title">📅 التفاصيل الشهرية</h3>
              <div className="drm-table-wrapper">
                <table className="drm-table">
                  <thead>
                    <tr>
                      <th>الشهر</th>
                      <th>عدد الرحلات</th>
                      <th>الإيرادات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.monthly_breakdown.length === 0 ? (
                      <tr><td colSpan={3} className="drm-empty">لا توجد بيانات</td></tr>
                    ) : (
                      data.monthly_breakdown.map((m, i) => (
                        <tr key={i} className={m.revenue > 0 ? "drm-active-row" : ""}>
                          <td>{m.month_name_ar}</td>
                          <td>{m.trips_count.toLocaleString()}</td>
                          <td className="drm-revenue">{m.revenue.toLocaleString()} ج.م</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
