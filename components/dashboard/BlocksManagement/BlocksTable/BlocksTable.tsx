"use client";

import "./BlocksTable.css";

interface Block {
  id: number;
  blocker_name: string;
  blocker_type: string;
  blocked_name: string;
  blocked_type: string;
  reason: string;
  status: string;
  created_at: string;
}

interface BlocksTableProps {
  blocks: Block[];
  onViewBlock: (block: Block) => void;
  onUnblock: (id: number) => void;
}

export default function BlocksTable({
  blocks,
  onViewBlock,
  onUnblock,
}: BlocksTableProps) {
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
    return <span className="user-type-badge rider">👤 راكب</span>;
  };

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
          {blocks.map((block) => (
            <tr key={block.id}>
              <td>#{block.id}</td>
              <td>
                <div className="user-cell">
                  <div className="user-name">{block.blocker_name}</div>
                  {getUserTypeBadge(block.blocker_type)}
                </div>
              </td>
              <td>
                <div className="user-cell">
                  <div className="user-name">{block.blocked_name}</div>
                  {getUserTypeBadge(block.blocked_type)}
                </div>
              </td>
              <td>
                <div className="reason-cell">{block.reason}</div>
              </td>
              <td>{getStatusBadge(block.status)}</td>
              <td>{new Date(block.created_at).toLocaleString("ar-EG")}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="action-btn view-btn"
                    onClick={() => onViewBlock(block)}
                    title="عرض التفاصيل"
                  >
                    👁️
                  </button>
                  {block.status === "active" && (
                    <button
                      className="action-btn unblock-btn"
                      onClick={() => onUnblock(block.id)}
                      title="إلغاء الحظر"
                    >
                      ✅
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
