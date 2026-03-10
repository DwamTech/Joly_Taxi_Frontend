"use client";

import statisticsData from "@/data/statistics/statistics-data.json";
import "./UserReports.css";

export default function UserReports() {
  const {
    driverStatistics,
    topDriversByRating,
    topDriversByTrips,
    driversWithHighCancellation,
    riderStatistics,
    topRidersByRating,
    topRidersByTrips,
    ridersWithHighCancellation,
    userGrowth
  } = statisticsData;

  return (
    <div className="user-reports">
      {/* Driver Statistics */}
      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">👨‍✈️</span>
          تقرير السائقين
        </h2>
        <div className="stats-grid-3">
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e3f2fd" }}>
              <span className="stat-icon-emoji">👥</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{driverStatistics.total_drivers.toLocaleString()}</div>
              <div className="stat-label">عدد السائقين الكلي</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e8f5e9" }}>
              <span className="stat-icon-emoji">✅</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{driverStatistics.active_drivers.toLocaleString()}</div>
              <div className="stat-label">السائقين النشطين</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#ffebee" }}>
              <span className="stat-icon-emoji">⏸️</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{driverStatistics.inactive_drivers.toLocaleString()}</div>
              <div className="stat-label">السائقين غير النشطين</div>
            </div>
          </div>
        </div>

        <div className="tables-row">
          <div className="table-half">
            <h3 className="subsection-title">🌟 السائقين الأعلى تقييماً (Top 10)</h3>
            <div className="table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>الاسم</th>
                    <th>التقييم</th>
                    <th>الرحلات</th>
                  </tr>
                </thead>
                <tbody>
                  {topDriversByRating.map((driver, index) => (
                    <tr key={driver.id}>
                      <td className="rank-cell">{index + 1}</td>
                      <td className="name-cell">{driver.name}</td>
                      <td className="rating-cell">⭐ {driver.rating}</td>
                      <td>{driver.trip_count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="table-half">
            <h3 className="subsection-title">🚗 السائقين الأكثر رحلات (Top 10)</h3>
            <div className="table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>الاسم</th>
                    <th>الرحلات</th>
                    <th>الإيرادات</th>
                  </tr>
                </thead>
                <tbody>
                  {topDriversByTrips.map((driver, index) => (
                    <tr key={driver.id}>
                      <td className="rank-cell">{index + 1}</td>
                      <td className="name-cell">{driver.name}</td>
                      <td>{driver.trip_count.toLocaleString()}</td>
                      <td className="revenue-cell">{driver.total_revenue?.toLocaleString()} ج.م</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="warning-section">
          <h3 className="subsection-title warning">⚠️ سائقين بمعدل إلغاء عالي</h3>
          <div className="table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>رقم الهاتف</th>
                  <th>عدد الإلغاءات</th>
                  <th>معدل الإلغاء</th>
                </tr>
              </thead>
              <tbody>
                {driversWithHighCancellation.map((driver) => (
                  <tr key={driver.id} className="warning-row">
                    <td className="name-cell">{driver.name}</td>
                    <td>{driver.phone}</td>
                    <td className="cancel-count">{driver.cancellation_count}</td>
                    <td className="cancel-rate">{driver.cancellation_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Rider Statistics */}
      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">👥</span>
          تقرير الركاب
        </h2>
        <div className="stats-grid-4">
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e3f2fd" }}>
              <span className="stat-icon-emoji">👥</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{riderStatistics.total_riders.toLocaleString()}</div>
              <div className="stat-label">عدد الركاب الكلي</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e8f5e9" }}>
              <span className="stat-icon-emoji">✅</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{riderStatistics.active_riders.toLocaleString()}</div>
              <div className="stat-label">الركاب النشطين</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#ffebee" }}>
              <span className="stat-icon-emoji">⏸️</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{riderStatistics.inactive_riders.toLocaleString()}</div>
              <div className="stat-label">الركاب غير النشطين</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#fff3e0" }}>
              <span className="stat-icon-emoji">⭐</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{riderStatistics.avg_rating}</div>
              <div className="stat-label">متوسط التقييم</div>
            </div>
          </div>
        </div>

        <div className="tables-row">
          <div className="table-half">
            <h3 className="subsection-title">🌟 الركاب الأعلى تقييماً (Top 10)</h3>
            <div className="table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>الاسم</th>
                    <th>التقييم</th>
                    <th>الرحلات</th>
                  </tr>
                </thead>
                <tbody>
                  {topRidersByRating.map((rider, index) => (
                    <tr key={rider.id}>
                      <td className="rank-cell">{index + 1}</td>
                      <td className="name-cell">{rider.name}</td>
                      <td className="rating-cell">⭐ {rider.rating}</td>
                      <td>{rider.trip_count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="table-half">
            <h3 className="subsection-title">🚗 الركاب الأكثر رحلات (Top 10)</h3>
            <div className="table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>الاسم</th>
                    <th>التقييم</th>
                    <th>الرحلات</th>
                  </tr>
                </thead>
                <tbody>
                  {topRidersByTrips.map((rider, index) => (
                    <tr key={rider.id}>
                      <td className="rank-cell">{index + 1}</td>
                      <td className="name-cell">{rider.name}</td>
                      <td className="rating-cell">⭐ {rider.rating}</td>
                      <td>{rider.trip_count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="warning-section">
          <h3 className="subsection-title warning">⚠️ ركاب بمعدل إلغاء عالي</h3>
          <div className="table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>رقم الهاتف</th>
                  <th>عدد الإلغاءات</th>
                  <th>معدل الإلغاء</th>
                </tr>
              </thead>
              <tbody>
                {ridersWithHighCancellation.map((rider) => (
                  <tr key={rider.id} className="warning-row">
                    <td className="name-cell">{rider.name}</td>
                    <td>{rider.phone}</td>
                    <td className="cancel-count">{rider.cancellation_count}</td>
                    <td className="cancel-rate">{rider.cancellation_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Growth */}
      <div className="report-section">
        <h2 className="section-title">
          <span className="title-icon">📈</span>
          معدل نمو المستخدمين
        </h2>
        <div className="chart-container">
          {userGrowth.map((month) => {
            const maxValue = Math.max(...userGrowth.map(m => m.total_users));
            const percentage = (month.total_users / maxValue) * 100;
            return (
              <div key={month.month} className="growth-chart-item">
                <div className="chart-label">{month.month}</div>
                <div className="growth-bars">
                  <div className="growth-bar-row">
                    <span className="bar-label">سائقين:</span>
                    <div className="bar-wrapper">
                      <div className="bar driver-bar" style={{ width: `${(month.new_drivers / maxValue) * 100}%` }}>
                        <span className="bar-value">{month.new_drivers}</span>
                      </div>
                    </div>
                  </div>
                  <div className="growth-bar-row">
                    <span className="bar-label">ركاب:</span>
                    <div className="bar-wrapper">
                      <div className="bar rider-bar" style={{ width: `${(month.new_riders / maxValue) * 100}%` }}>
                        <span className="bar-value">{month.new_riders}</span>
                      </div>
                    </div>
                  </div>
                  <div className="growth-bar-row total">
                    <span className="bar-label">الإجمالي:</span>
                    <div className="bar-wrapper">
                      <div className="bar total-bar" style={{ width: `${percentage}%` }}>
                        <span className="bar-value">{month.total_users}</span>
                      </div>
                    </div>
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
