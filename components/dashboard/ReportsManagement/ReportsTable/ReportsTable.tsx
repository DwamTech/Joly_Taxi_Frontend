"use client";

import { TripReport } from "@/models/TripReport";
import "./ReportsTable.css";

interface ReportsTableProps {
  reports: TripReport[];
  onViewReport: (report: TripReport) => void;
  onResolveReport: (reportId: number) => void;
  onDeleteReport: (reportId: number) => void;
}

export default function ReportsTable({
  reports,
  onViewReport,
  onResolveReport,
  onDeleteReport,
}: ReportsTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      high: { text: "عالية", class: "priority-high" },
      medium: { text: "متوسطة", class: "priority-medium" },
      low: { text: "منخفضة", class: "priority-low" },
    };
    return badges[priority as keyof typeof badges] || badges.medium;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { text: "معلق", class: "status-pending" },
      resolved: { text: "محلول", class: "status-resolved" },
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  if (reports.length === 0) {
    return (
      <div className="reports-table-container">
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>لا توجد بلاغات</h3>
          <p>لم يتم العثور على أي بلاغات تطابق معايير البحث</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-table-container">
      <div className="table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>رقم البلاغ</th>
              <th>الرحلة</th>
              <th>المُبلِّغ</th>
              <th>المُبلَّغ عنه</th>
              <th>السبب</th>
              <th>الحالة</th>
              <th>الأولوية</th>
              <th>تاريخ البلاغ</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => {
              const priorityBadge = getPriorityBadge(report.priority);
              const statusBadge = getStatusBadge(report.status);

              return (
                <tr key={report.id}>
                  <td data-label="رقم البلاغ">
                    <span className="report-id">#{report.id}</span>
                  </td>
                  <td data-label="الرحلة">
                    <a
                      href={`/dashboard/trips?id=${report.trip_request_id}`}
                      className="trip-link"
                    >
                      #{report.trip_request_id}
                    </a>
                  </td>
                  <td data-label="المُبلِّغ">
                    <div className="user-info">
                      <div className="user-name">{report.reporter?.name}</div>
                      <div className="user-type">
                        {report.reporter?.type === "rider" ? "راكب" : "سائق"}
                      </div>
                    </div>
                  </td>
                  <td data-label="المُبلَّغ عنه">
                    <div className="user-info">
                      <div className="user-name">{report.reported?.name}</div>
                      <div className="user-type">
                        {report.reported?.type === "rider" ? "راكب" : "سائق"}
                      </div>
                    </div>
                  </td>
                  <td data-label="السبب">
                    <span className="reason-text">{report.reason}</span>
                  </td>
                  <td data-label="الحالة">
                    <span className={`status-badge ${statusBadge.class}`}>
                      {statusBadge.text}
                    </span>
                  </td>
                  <td data-label="الأولوية">
                    <span className={`priority-badge ${priorityBadge.class}`}>
                      {priorityBadge.text}
                    </span>
                  </td>
                  <td data-label="تاريخ البلاغ" className="date-cell">
                    {formatDate(report.created_at)}
                  </td>
                  <td data-label="الإجراءات" className="actions-cell">
                    <button
                      className="action-btn view-btn"
                      onClick={() => onViewReport(report)}
                      title="عرض التفاصيل"
                    >
                      📄
                    </button>
                    {report.status === "pending" && (
                      <button
                        className="action-btn resolve-btn"
                        onClick={() => onResolveReport(report.id)}
                        title="وضع علامة كمحلول"
                      >
                        ✅
                      </button>
                    )}
                    <button
                      className="action-btn delete-btn"
                      onClick={() => onDeleteReport(report.id)}
                      title="حذف"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
