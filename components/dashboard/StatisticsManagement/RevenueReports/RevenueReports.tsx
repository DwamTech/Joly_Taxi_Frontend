"use client";

import statisticsData from "@/data/statistics/statistics-data.json";
import "./RevenueReports.css";

export default function RevenueReports() {
  const {
    revenueStatistics,
    revenueByDay,
    revenueByWeek,
    revenueByMonth,
    revenueByYear,
    tripsByVehicleType
  } = statisticsData;

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
              <div className="stat-value">{revenueStatistics.trip_revenue.toLocaleString()} ج.م</div>
              <div className="stat-label">إيرادات الرحلات</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e3f2fd" }}>
              <span className="stat-icon-emoji">📋</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{revenueStatistics.subscription_revenue.toLocaleString()} ج.م</div>
              <div className="stat-label">إيرادات الاشتراكات</div>
            </div>
          </div>

          <div className="stat-card highlight-card">
            <div className="stat-icon-wrapper" style={{ background: "#fff3e0" }}>
              <span className="stat-icon-emoji">💎</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{revenueStatistics.total_revenue.toLocaleString()} ج.م</div>
              <div className="stat-label">إجمالي الإيرادات</div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Period */}
      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">📅</span>
          الإيرادات اليومية
        </h2>
        <div className="chart-container">
          {revenueByDay.map((day) => {
            const percentage = (day.revenue / Math.max(...revenueByDay.map(d => d.revenue))) * 100;
            return (
              <div key={day.period} className="chart-bar-item">
                <div className="chart-label">{day.period}</div>
                <div className="chart-bar-wrapper">
                  <div 
                    className="chart-bar revenue-bar" 
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="chart-value">{day.revenue.toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">📊</span>
          الإيرادات الأسبوعية
        </h2>
        <div className="chart-container">
          {revenueByWeek.map((week) => {
            const percentage = (week.revenue / Math.max(...revenueByWeek.map(w => w.revenue))) * 100;
            return (
              <div key={week.period} className="chart-bar-item">
                <div className="chart-label">{week.period}</div>
                <div className="chart-bar-wrapper">
                  <div 
                    className="chart-bar revenue-bar" 
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="chart-value">{week.revenue.toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">📆</span>
          الإيرادات الشهرية
        </h2>
        <div className="chart-container">
          {revenueByMonth.map((month) => {
            const percentage = (month.revenue / Math.max(...revenueByMonth.map(m => m.revenue))) * 100;
            return (
              <div key={month.period} className="chart-bar-item">
                <div className="chart-label">{month.period}</div>
                <div className="chart-bar-wrapper">
                  <div 
                    className="chart-bar revenue-bar" 
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="chart-value">{month.revenue.toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">📈</span>
          الإيرادات السنوية
        </h2>
        <div className="chart-container">
          {revenueByYear.map((year) => {
            const percentage = (year.revenue / Math.max(...revenueByYear.map(y => y.revenue))) * 100;
            return (
              <div key={year.period} className="chart-bar-item">
                <div className="chart-label">{year.period}</div>
                <div className="chart-bar-wrapper">
                  <div 
                    className="chart-bar revenue-bar" 
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="chart-value">{year.revenue.toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>
            );
          })}
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
                <th>متوسط السعر</th>
                <th>النسبة من الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {tripsByVehicleType.map((type) => {
                const percentage = ((type.revenue / revenueStatistics.trip_revenue) * 100).toFixed(1);
                return (
                  <tr key={type.vehicle_type_id}>
                    <td className="vehicle-name">{type.vehicle_type_name}</td>
                    <td>{type.trip_count.toLocaleString()}</td>
                    <td className="revenue-cell">{type.revenue.toLocaleString()} ج.م</td>
                    <td>{type.avg_price} ج.م</td>
                    <td className="percentage-cell">{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
