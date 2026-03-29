"use client";

import { useEffect, useState } from "react";
import { UserReportsService } from "@/services/userReportsService";
import { DriverReportsData, RiderReportsData, RegistrationMonth } from "@/models/UserReports";
import TablePagination from "@/components/shared/TablePagination/TablePagination";
import { usePagination } from "@/hooks/usePagination";
import "./UserReports.css";

const PER_PAGE = 10;

export default function UserReports() {
  const [drivers, setDrivers] = useState<DriverReportsData | null>(null);
  const [riders, setRiders] = useState<RiderReportsData | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationMonth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      UserReportsService.getDriverReports(),
      UserReportsService.getRiderReports(),
      UserReportsService.getRegistrations(),
    ])
      .then(([d, r, reg]) => { setDrivers(d); setRiders(r); setRegistrations(reg); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Pagination hooks — always called, guarded by empty arrays before data loads
  const driverRatedPag   = usePagination(drivers?.top_rated ?? [], PER_PAGE);
  const driverTripsPag   = usePagination(drivers?.most_trips ?? [], PER_PAGE);
  const driverCancelPag  = usePagination(drivers?.high_cancellation ?? [], PER_PAGE);
  const riderRatedPag    = usePagination(riders?.top_rated ?? [], PER_PAGE);
  const riderTripsPag    = usePagination(riders?.most_trips ?? [], PER_PAGE);
  const riderCancelPag   = usePagination(riders?.high_cancellation ?? [], PER_PAGE);
  const regPag           = usePagination(registrations, PER_PAGE);

  if (loading) {
    return (
      <div className="user-reports-loading">
        <div className="loading-spinner" />
        <span>جاري التحميل...</span>
      </div>
    );
  }

  if (error || !drivers || !riders) {
    return (
      <div className="user-reports-error">
        <span>⚠️ {error || "حدث خطأ أثناء تحميل البيانات"}</span>
      </div>
    );
  }

  const maxRegTotal = Math.max(...registrations.map((r) => r.total), 1);

  return (
    <div className="user-reports">
      {/* Driver Statistics */}
      <div className="report-section">
        <h2 className="section-title"><span className="title-icon">👨‍✈️</span>تقرير السائقين</h2>
        <div className="stats-grid-3">
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e3f2fd" }}><span className="stat-icon-emoji">👥</span></div>
            <div className="stat-details"><div className="stat-value">{drivers.total_drivers.toLocaleString()}</div><div className="stat-label">عدد السائقين الكلي</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e8f5e9" }}><span className="stat-icon-emoji">✅</span></div>
            <div className="stat-details"><div className="stat-value">{drivers.active_drivers.toLocaleString()}</div><div className="stat-label">السائقين النشطين</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#ffebee" }}><span className="stat-icon-emoji">⏸️</span></div>
            <div className="stat-details"><div className="stat-value">{drivers.inactive_drivers.toLocaleString()}</div><div className="stat-label">السائقين غير النشطين</div></div>
          </div>
        </div>

        <div className="tables-row">
          <div className="table-half">
            <h3 className="subsection-title">🌟 السائقين الأعلى تقييماً</h3>
            <div className="table-container">
              <table className="report-table">
                <thead><tr><th>#</th><th>الاسم</th><th>رقم الهاتف</th><th>التقييم</th><th>عدد التقييمات</th></tr></thead>
                <tbody>
                  {driverRatedPag.paged.map((driver, index) => (
                    <tr key={driver.user_id}>
                      <td className="rank-cell">{(driverRatedPag.page - 1) * PER_PAGE + index + 1}</td>
                      <td className="name-cell">{driver.name}</td>
                      <td className="phone-cell">{driver.phone}</td>
                      <td className="rating-cell">⭐ {driver.rating_avg}</td>
                      <td>{driver.rating_count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <TablePagination page={driverRatedPag.page} lastPage={driverRatedPag.lastPage} total={driverRatedPag.total} perPage={PER_PAGE} onPageChange={driverRatedPag.setPage} />
            </div>
          </div>

          <div className="table-half">
            <h3 className="subsection-title">🚗 السائقين الأكثر رحلات</h3>
            <div className="table-container">
              <table className="report-table">
                <thead><tr><th>#</th><th>الاسم</th><th>رقم الهاتف</th><th>الرحلات</th></tr></thead>
                <tbody>
                  {driverTripsPag.paged.map((driver, index) => (
                    <tr key={driver.user_id}>
                      <td className="rank-cell">{(driverTripsPag.page - 1) * PER_PAGE + index + 1}</td>
                      <td className="name-cell">{driver.name}</td>
                      <td className="phone-cell">{driver.phone}</td>
                      <td>{driver.trips_count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <TablePagination page={driverTripsPag.page} lastPage={driverTripsPag.lastPage} total={driverTripsPag.total} perPage={PER_PAGE} onPageChange={driverTripsPag.setPage} />
            </div>
          </div>
        </div>

        <div className="warning-section">
          <h3 className="subsection-title warning">⚠️ سائقين بمعدل إلغاء عالي</h3>
          <div className="table-container">
            <table className="report-table">
              <thead><tr><th>الاسم</th><th>رقم الهاتف</th><th>عدد الإلغاءات</th><th>معدل الإلغاء</th></tr></thead>
              <tbody>
                {driverCancelPag.paged.length === 0 ? (
                  <tr><td colSpan={4} className="empty-row">لا يوجد سائقين بمعدل إلغاء عالي</td></tr>
                ) : (
                  driverCancelPag.paged.map((driver) => (
                    <tr key={driver.user_id} className="warning-row">
                      <td className="name-cell">{driver.name}</td>
                      <td className="phone-cell">{driver.phone}</td>
                      <td className="cancel-count">{driver.cancellation_count}</td>
                      <td className="cancel-rate">{driver.cancellation_rate}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <TablePagination page={driverCancelPag.page} lastPage={driverCancelPag.lastPage} total={driverCancelPag.total} perPage={PER_PAGE} onPageChange={driverCancelPag.setPage} />
          </div>
        </div>
      </div>

      {/* Rider Statistics */}
      <div className="report-section">
        <h2 className="section-title"><span className="title-icon">👥</span>تقرير الركاب</h2>
        <div className="stats-grid-4">
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e3f2fd" }}><span className="stat-icon-emoji">👥</span></div>
            <div className="stat-details"><div className="stat-value">{riders.total_riders.toLocaleString()}</div><div className="stat-label">عدد الركاب الكلي</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#e8f5e9" }}><span className="stat-icon-emoji">✅</span></div>
            <div className="stat-details"><div className="stat-value">{riders.active_riders.toLocaleString()}</div><div className="stat-label">الركاب النشطين</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#ffebee" }}><span className="stat-icon-emoji">⏸️</span></div>
            <div className="stat-details"><div className="stat-value">{riders.inactive_riders.toLocaleString()}</div><div className="stat-label">الركاب غير النشطين</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "#fff3e0" }}><span className="stat-icon-emoji">⭐</span></div>
            <div className="stat-details"><div className="stat-value">{riders.average_rating}</div><div className="stat-label">متوسط التقييم</div></div>
          </div>
        </div>

        <div className="tables-row">
          <div className="table-half">
            <h3 className="subsection-title">🌟 الركاب الأعلى تقييماً</h3>
            <div className="table-container">
              <table className="report-table">
                <thead><tr><th>#</th><th>الاسم</th><th>رقم الهاتف</th><th>التقييم</th><th>عدد التقييمات</th></tr></thead>
                <tbody>
                  {riderRatedPag.paged.map((rider, index) => (
                    <tr key={rider.user_id}>
                      <td className="rank-cell">{(riderRatedPag.page - 1) * PER_PAGE + index + 1}</td>
                      <td className="name-cell">{rider.name}</td>
                      <td className="phone-cell">{rider.phone}</td>
                      <td className="rating-cell">⭐ {rider.avg_stars}</td>
                      <td>{rider.rating_count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <TablePagination page={riderRatedPag.page} lastPage={riderRatedPag.lastPage} total={riderRatedPag.total} perPage={PER_PAGE} onPageChange={riderRatedPag.setPage} />
            </div>
          </div>

          <div className="table-half">
            <h3 className="subsection-title">🚗 الركاب الأكثر رحلات</h3>
            <div className="table-container">
              <table className="report-table">
                <thead><tr><th>#</th><th>الاسم</th><th>رقم الهاتف</th><th>الرحلات</th></tr></thead>
                <tbody>
                  {riderTripsPag.paged.map((rider, index) => (
                    <tr key={rider.user_id}>
                      <td className="rank-cell">{(riderTripsPag.page - 1) * PER_PAGE + index + 1}</td>
                      <td className="name-cell">{rider.name}</td>
                      <td className="phone-cell">{rider.phone}</td>
                      <td>{rider.trips_count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <TablePagination page={riderTripsPag.page} lastPage={riderTripsPag.lastPage} total={riderTripsPag.total} perPage={PER_PAGE} onPageChange={riderTripsPag.setPage} />
            </div>
          </div>
        </div>

        <div className="warning-section">
          <h3 className="subsection-title warning">⚠️ ركاب بمعدل إلغاء عالي</h3>
          <div className="table-container">
            <table className="report-table">
              <thead><tr><th>الاسم</th><th>رقم الهاتف</th><th>عدد الإلغاءات</th><th>معدل الإلغاء</th></tr></thead>
              <tbody>
                {riderCancelPag.paged.length === 0 ? (
                  <tr><td colSpan={4} className="empty-row">لا يوجد ركاب بمعدل إلغاء عالي</td></tr>
                ) : (
                  riderCancelPag.paged.map((rider) => (
                    <tr key={rider.user_id} className="warning-row">
                      <td className="name-cell">{rider.name}</td>
                      <td className="phone-cell">{rider.phone}</td>
                      <td className="cancel-count">{rider.cancellation_count}</td>
                      <td className="cancel-rate">{rider.cancellation_rate}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <TablePagination page={riderCancelPag.page} lastPage={riderCancelPag.lastPage} total={riderCancelPag.total} perPage={PER_PAGE} onPageChange={riderCancelPag.setPage} />
          </div>
        </div>
      </div>

      {/* Registration Reports */}
      <div className="report-section">
        <h2 className="section-title"><span className="title-icon">📈</span>تقارير التسجيل الشهري</h2>
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr><th>الشهر</th><th>السنة</th><th>إجمالي التسجيلات</th><th>سائقين</th><th>ركاب</th></tr>
            </thead>
            <tbody>
              {regPag.paged.length === 0 ? (
                <tr><td colSpan={5} className="empty-row">لا توجد بيانات تسجيل</td></tr>
              ) : (
                regPag.paged.map((row, index) => (
                  <tr key={index} className={row.total > 0 ? "active-month-row" : ""}>
                    <td className="name-cell">{row.month_name_ar}</td>
                    <td>{row.year}</td>
                    <td>
                      <div className="reg-bar-cell">
                        <span className="reg-count">{row.total}</span>
                        {row.total > 0 && <div className="reg-bar-wrapper"><div className="reg-bar total-bar" style={{ width: `${(row.total / maxRegTotal) * 100}%` }} /></div>}
                      </div>
                    </td>
                    <td>
                      <div className="reg-bar-cell">
                        <span className="reg-count driver-count">{row.drivers}</span>
                        {row.drivers > 0 && <div className="reg-bar-wrapper"><div className="reg-bar driver-bar" style={{ width: `${(row.drivers / maxRegTotal) * 100}%` }} /></div>}
                      </div>
                    </td>
                    <td>
                      <div className="reg-bar-cell">
                        <span className="reg-count rider-count">{row.riders}</span>
                        {row.riders > 0 && <div className="reg-bar-wrapper"><div className="reg-bar rider-bar" style={{ width: `${(row.riders / maxRegTotal) * 100}%` }} /></div>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <TablePagination page={regPag.page} lastPage={regPag.lastPage} total={regPag.total} perPage={PER_PAGE} onPageChange={regPag.setPage} />
        </div>
      </div>
    </div>
  );
}
