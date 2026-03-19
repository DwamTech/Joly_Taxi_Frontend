"use client";

import { ActivityLog } from "@/models/ActivityLog";
import "./ActivityLogTable.css";

interface ActivityLogTableProps {
  activities: ActivityLog[];
}

export default function ActivityLogTable({ activities }: ActivityLogTableProps) {
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
            <th>الكيان المتأثر</th>
            <th>التفاصيل</th>
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
                    style={{ backgroundColor: getActionColor(activity.action_type) }}
                  >
                    {activity.action}
                  </span>
                </div>
              </td>
              <td data-label="الكيان المتأثر">
                <div className="entity-cell">
                  <span className="entity-type">{activity.entity_type}</span>
                  <span className="entity-id">{activity.entity_id}</span>
                </div>
              </td>
              <td data-label="التفاصيل" className="details-cell">
                {activity.details}
              </td>
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
    </div>
  );
}
