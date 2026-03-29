"use client";

import { AuditLog, AuditLogPagination } from "@/models/AuditLog";
import "./ActivityLogTable.css";

interface ActivityLogTableProps {
  activities: AuditLog[];
  pagination: AuditLogPagination;
  onPageChange: (page: number) => void;
}

export default function ActivityLogTable({
  activities,
  pagination,
  onPageChange,
}: ActivityLogTableProps) {
  const getActionColor = (actionType: string) => {
    const colors: Record<string, string> = {
      login: "#3498db",
      logout: "#95a5a6",
      create: "#27ae60",
      update: "#f39c12",
      delete: "#e74c3c",
      block: "#c0392b",
      unblock: "#16a085",
      approve: "#2ecc71",
      reject: "#e67e22",
      send: "#9b59b6",
      settings: "#34495e",
    };
    return colors[actionType] || "#7f8c8d";
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const { current_page, last_page, total, per_page } = pagination;
  const from = (current_page - 1) * per_page + 1;
  const to = Math.min(current_page * per_page, total);

  if (activities.length === 0) {
    return (
      <div className="activity-log-table-container">
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <p>لا توجد نتائج</p>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-log-table-container">
      <table className="activity-log-table">
        <thead>
          <tr>
            <th>المسؤول</th>
            <th>الإجراء</th>
            {/* <th>الكيان المتأثر</th>
            <th>التفاصيل</th> */}
            <th>عنوان IP</th>
            <th>التاريخ والوقت</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td data-label="المسؤول">
                <div className="admin-cell">
                  <div className="admin-avatar-small">
                    {activity.admin_name.charAt(0)}
                  </div>
                  <span className="admin-name-small">{activity.admin_name}</span>
                </div>
              </td>
              <td data-label="الإجراء">
                <div className="action-cell">
                  <span
                    className="action-badge"
                    style={{
                      backgroundColor: getActionColor(activity.action_type),
                    }}
                  >
                    {activity.action}
                  </span>
                </div>
              </td>
              {/* <td data-label="الكيان المتأثر">
                <div className="entity-cell">
                  <span className="entity-type">{activity.entity_type}</span>
                  <span className="entity-id">{activity.entity_id}</span>
                </div>
              </td>
              <td data-label="التفاصيل" className="details-cell">
                {activity.details}
              </td> */}
              <td data-label="عنوان IP" className="ip-cell">
                {activity.ip_address}
              </td>
              <td data-label="التاريخ والوقت" className="date-cell">
                {formatDateTime(activity.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination-container">
        <span className="pagination-info">
          عرض {from}–{to} من {total} نشاط
        </span>
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => onPageChange(1)}
            disabled={current_page === 1}
            aria-label="الصفحة الأولى"
          >
            «
          </button>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(current_page - 1)}
            disabled={current_page === 1}
            aria-label="الصفحة السابقة"
          >
            ‹
          </button>

          {Array.from({ length: last_page }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === last_page ||
                Math.abs(p - current_page) <= 2
            )
            .reduce<(number | "...")[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((item, idx) =>
              item === "..." ? (
                <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  className={`pagination-btn${item === current_page ? " active" : ""}`}
                  onClick={() => onPageChange(item as number)}
                >
                  {item}
                </button>
              )
            )}

          <button
            className="pagination-btn"
            onClick={() => onPageChange(current_page + 1)}
            disabled={current_page === last_page}
            aria-label="الصفحة التالية"
          >
            ›
          </button>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(last_page)}
            disabled={current_page === last_page}
            aria-label="الصفحة الأخيرة"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
