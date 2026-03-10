"use client";

import statisticsData from "@/data/statistics/statistics-data.json";
import "./TripReports.css";

export default function TripReports() {
  const { tripStatistics, tripsByVehicleType, tripsByHour, tripsByDay, tripsByMonth } = statisticsData;

  // Find most requested vehicle type
  const mostRequested = tripsByVehicleType.reduce((prev, current) => 
    (prev.trip_count > current.trip_count) ? prev : current
  );

  return (
    <div className="trip-reports">
      {/* Overall Statistics */}
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
              <div className="stat-value">{tripStatistics.total_trips.toLocaleString()}</div>
              <div className="stat-label">إجمالي الرحلات</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e8f5e9" }}>
              <span className="stat-icon-emoji">✅</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{tripStatistics.completed_trips.toLocaleString()}</div>
              <div className="stat-label">الرحلات المكتملة</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#ffebee" }}>
              <span className="stat-icon-emoji">❌</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{tripStatistics.cancelled_trips.toLocaleString()}</div>
              <div className="stat-label">الرحلات الملغاة</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#fff3e0" }}>
              <span className="stat-icon-emoji">📉</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{tripStatistics.cancellation_rate}%</div>
              <div className="stat-label">معدل الإلغاء</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#f3e5f5" }}>
              <span className="stat-icon-emoji">⏱️</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{tripStatistics.avg_duration_minutes} د</div>
              <div className="stat-label">متوسط المدة</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e0f2f1" }}>
              <span className="stat-icon-emoji">📏</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{tripStatistics.avg_distance_km} كم</div>
              <div className="stat-label">متوسط المسافة</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#fce4ec" }}>
              <span className="stat-icon-emoji">💵</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{tripStatistics.avg_price} ج.م</div>
              <div className="stat-label">متوسط السعر</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e8f5e9" }}>
              <span className="stat-icon-emoji">💰</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{tripStatistics.total_revenue.toLocaleString()} ج.م</div>
              <div className="stat-label">الإيرادات</div>
            </div>
          </div>
        </div>
      </div>

      {/* By Vehicle Type */}
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
                <tr key={type.vehicle_type_id}>
                  <td data-label="نوع المركبة" className="vehicle-name">{type.vehicle_type_name}</td>
                  <td data-label="عدد الرحلات">{type.trip_count.toLocaleString()}</td>
                  <td data-label="الإيرادات" className="revenue-cell">{type.revenue.toLocaleString()} ج.م</td>
                  <td data-label="متوسط السعر">{type.avg_price} ج.م</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="highlight-box">
          <span className="highlight-icon">🏆</span>
          <span className="highlight-text">
            النوع الأكثر طلباً: <strong>{mostRequested.vehicle_type_name}</strong> بـ {mostRequested.trip_count.toLocaleString()} رحلة
          </span>
        </div>
      </div>

      {/* By Time - Hour */}
      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">🕐</span>
          تقرير الرحلات حسب الساعة (24 ساعة)
        </h2>
        <div className="chart-container">
          {tripsByHour.map((hour) => {
            const percentage = (hour.trip_count / Math.max(...tripsByHour.map(h => h.trip_count))) * 100;
            const hourLabel = hour.hour === 0 ? "12 ص" : 
                             hour.hour < 12 ? `${hour.hour} ص` : 
                             hour.hour === 12 ? "12 م" : 
                             `${hour.hour - 12} م`;
            return (
              <div key={hour.hour} className="chart-bar-item">
                <div className="chart-label">{hourLabel}</div>
                <div className="chart-bar-wrapper">
                  <div 
                    className="chart-bar" 
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="chart-value">{hour.trip_count.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* By Time - Day */}
      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">📅</span>
          تقرير الرحلات حسب اليوم
        </h2>
        <div className="chart-container">
          {tripsByDay.map((day) => {
            const percentage = (day.trip_count / Math.max(...tripsByDay.map(d => d.trip_count))) * 100;
            return (
              <div key={day.day} className="chart-bar-item">
                <div className="chart-label">{day.day}</div>
                <div className="chart-bar-wrapper">
                  <div 
                    className="chart-bar" 
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="chart-value">{day.trip_count.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* By Time - Month */}
      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">📆</span>
          تقرير الرحلات حسب الشهر
        </h2>
        <div className="chart-container">
          {tripsByMonth.map((month) => {
            const percentage = (month.trip_count / Math.max(...tripsByMonth.map(m => m.trip_count))) * 100;
            return (
              <div key={month.month} className="chart-bar-item">
                <div className="chart-label">{month.month}</div>
                <div className="chart-bar-wrapper">
                  <div 
                    className="chart-bar" 
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="chart-value">{month.trip_count.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
