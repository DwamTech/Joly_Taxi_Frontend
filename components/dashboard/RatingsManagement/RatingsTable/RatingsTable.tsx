"use client";

import { Rating } from "@/models/Rating";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import { formatDisplayValue } from "@/utils/formatters";
import { useState } from "react";
import "./RatingsTable.css";

interface RatingsTableProps {
  ratings: Rating[];
  onViewDetails: (rating: Rating) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

export default function RatingsTable({ ratings, onViewDetails, onDelete, loading = false }: RatingsTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<{ 
    show: boolean; 
    id: number; 
    tripId: number;
    raterName?: string;
    ratedName?: string;
  }>({
    show: false,
    id: 0,
    tripId: 0,
  });

  const renderStars = (stars: number) => {
    return "⭐".repeat(stars);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteClick = (id: number, tripId: number) => {
    // البحث عن التقييم للحصول على معلومات إضافية
    const rating = ratings.find(r => r.id === id);
    const raterName = rating?.rater_name || 'غير محدد';
    const ratedName = rating?.rated_name || 'غير محدد';
    
    setDeleteConfirm({ 
      show: true, 
      id, 
      tripId,
      raterName,
      ratedName
    });
  };

  const confirmDelete = () => {
    onDelete(deleteConfirm.id);
    setDeleteConfirm({ show: false, id: 0, tripId: 0 });
  };

  return (
    <>
      <div className="ratings-table-container">
        <table className="ratings-table">
          <thead>
            <tr>
              <th>رقم التقييم</th>
              <th>رقم الرحلة</th>
              <th>المُقيِّم</th>
              <th>المُقيَّم</th>
              <th>التقييم</th>
              <th>الوسوم</th>
              <th>التاريخ</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((rating) => (
              <tr key={rating.id}>
                <td data-label="رقم التقييم" className="rating-id">#{rating.id}</td>
                <td data-label="رقم الرحلة" className="trip-id">#{rating.trip_request_id}</td>
                <td data-label="المُقيِّم">
                  <div className="user-cell">
                    <span className="user-name">{formatDisplayValue(rating.rater_name)}</span>
                    <span className={`user-type ${rating.rater_type}`}>
                      {rating.rater_type === "driver" ? "سائق" : "راكب"}
                    </span>
                  </div>
                </td>
                <td data-label="المُقيَّم">
                  <div className="user-cell">
                    <span className="user-name">{formatDisplayValue(rating.rated_name)}</span>
                    <span className={`user-type ${rating.rated_type}`}>
                      {rating.rated_type === "driver" ? "سائق" : "راكب"}
                    </span>
                  </div>
                </td>
                <td data-label="التقييم" className="stars-cell">{renderStars(rating.stars)}</td>
                <td data-label="الوسوم">
                  <div className="tags-cell">
                    {rating.tags && rating.tags.length > 0 ? (
                      <>
                        {rating.tags.slice(0, 2).map((tag) => (
                          <span key={tag.id} className={`tag ${tag.is_positive ? "positive" : "negative"}`}>
                            {formatDisplayValue(tag.label)}
                          </span>
                        ))}
                        {rating.tags.length > 2 && <span className="tag-more">+{rating.tags.length - 2}</span>}
                      </>
                    ) : (
                      <span className="no-tags">لا توجد وسوم</span>
                    )}
                  </div>
                </td>
                <td data-label="التاريخ" className="date-cell">{formatDate(rating.created_at)}</td>
                <td data-label="الإجراءات">
                  <div className="actions-cell">
                    <button className="action-btn view" onClick={() => onViewDetails(rating)} title="عرض التفاصيل">
                      <span style={{ fontSize: '16px' }}>📄</span>
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteClick(rating.id, rating.trip_request_id)}
                      disabled={loading}
                      title={loading ? "جاري الحذف..." : "حذف"}
                    >
                      {loading ? (
                        <span style={{ color: '#fff', fontSize: '14px' }}>⏳</span>
                      ) : (
                        <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>✕</span>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {ratings.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>لا توجد تقييمات</p>
          </div>
        )}
      </div>

      {deleteConfirm.show && (
        <ConfirmDialog
          title="تأكيد حذف التقييم"
          message={
            `هل أنت متأكد من حذف التقييم #${deleteConfirm.id} للرحلة #${deleteConfirm.tripId}؟\n\n` +
            `المُقيِّم: ${deleteConfirm.raterName || 'غير محدد'}\n` +
            `المُقيَّم: ${deleteConfirm.ratedName || 'غير محدد'}\n\n` +
            `⚠️ تحذير: سيتم حذف التقييم نهائياً ولا يمكن استرداده، وسيؤثر ذلك على التقييم الإجمالي للمستخدم.`
          }
          confirmText="حذف نهائياً"
          cancelText="إلغاء"
          type="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm({ show: false, id: 0, tripId: 0 })}
        />
      )}
    </>
  );
}
