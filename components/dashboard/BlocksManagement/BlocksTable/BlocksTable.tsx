"use client";

import { UserBlockItem } from "@/models/Block";
import "./BlocksTable.css";

interface BlocksTableProps {
  blocks: UserBlockItem[];
  onViewBlock: (block: UserBlockItem) => void;
  onUnblock: (id: number) => void;
}

export default function BlocksTable({
  blocks,
  onViewBlock,
  onUnblock,
}: BlocksTableProps) {
  const formatDateTimeParts = (dateValue: string) => {
    const date = new Date(dateValue.replace(" ", "T"));
    const dateText = date.toLocaleDateString("ar-EG");
    const timeText = date.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { dateText, timeText };
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <span className="status-badge status-active">🚫 نشط</span>;
    }
    return <span className="status-badge status-cancelled">✅ ملغي</span>;
  };

  const getUserTypeBadge = (type: string) => {
    if (type === "driver") {
      return <span className="user-type-badge driver">🚗 سائق</span>;
    }
    if (type === "user" || type === "rider") {
      return <span className="user-type-badge rider">👤 راكب</span>;
    }
    return <span className="user-type-badge rider">👥 {type}</span>;
  };

  if (blocks.length === 0) {
    return (
      <div className="blocks-table-container">
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <p>لا توجد حالات حظر مطابقة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blocks-table-container">
      <table className="blocks-table">
        <thead>
          <tr>
            <th>الرقم</th>
            <th>الحاظر</th>
            <th>المحظور</th>
            <th>السبب</th>
            <th>الحالة</th>
            <th>تاريخ الحظر</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((block) => {
            const createdAt = formatDateTimeParts(block.created_at);
            return (
            <tr key={block.id}>
              <td data-label="الرقم">#{block.id}</td>
              <td data-label="الحاظر">
                <div className="user-cell">
                  <div className="user-name">{block.blocker.name}</div>
                  <div className="user-badges">
                    {getUserTypeBadge(block.blocker.role)}
                  </div>
                </div>
              </td>
              <td data-label="المحظور">
                <div className="user-cell">
                  <div className="user-name">{block.blocked.name}</div>
                  <div className="user-badges">
                    {getUserTypeBadge(block.blocked.role)}
                  </div>
                </div>
              </td>
              <td data-label="السبب">
                <div className="reason-cell">{block.reason}</div>
              </td>
              <td data-label="الحالة">{getStatusBadge(block.status)}</td>
              <td data-label="تاريخ الحظر">
                <div className="date-time-cell">
                  <span className="date-line">{createdAt.dateText}</span>
                  <span className="time-line">{createdAt.timeText}</span>
                </div>
              </td>
              <td data-label="الإجراءات">
                <div className="action-buttons">
                  <button
                    className="action-btn view-btn"
                    onClick={() => onViewBlock(block)}
                    title="عرض التفاصيل"
                  >
                    👁️
                  </button>
                  {/*{block.status === "active" && (
                   <button
                      className="action-btn unblock-btn"
                      onClick={() => onUnblock(block.id)}
                      title="إلغاء الحظر"
                    >
                      ✅
                    </button>
                  )}*/}
                </div>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
