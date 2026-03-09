"use client";

import { Rating } from "@/models/Rating";
import "./RatingDetailsModal.css";

interface RatingDetailsModalProps {
  rating: Rating;
  onClose: () => void;
}

export default function RatingDetailsModal({ rating, onClose }: RatingDetailsModalProps) {
  const renderStars = (stars: number) => "⭐".repeat(stars);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="rating-details-overlay" onClick={onClose}>
      <div className="rating-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span>⭐</span>
            تفاصيل التقييم #{rating.id}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h3 className="section-title">معلومات الرحلة</h3>
            <div className="detail-row">
              <span className="detail-label">رقم الرحلة:</span>
              <span className="detail-value">#{rating.trip_request_id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">تاريخ التقييم:</span>
              <span className="detail-value">{formatDate(rating.created_at)}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-title">المُقيِّم</h3>
            <div className="detail-row">
              <span className="detail-label">الاسم:</span>
              <span className="detail-value">{rating.rater_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">النوع:</span>
              <span className={`user-badge ${rating.rater_type}`}>
                {rating.rater_type === "driver" ? "سائق" : "راكب"}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-title">المُقيَّم</h3>
            <div className="detail-row">
              <span className="detail-label">الاسم:</span>
              <span className="detail-value">{rating.rated_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">النوع:</span>
              <span className={`user-badge ${rating.rated_type}`}>
                {rating.rated_type === "driver" ? "سائق" : "راكب"}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-title">التقييم</h3>
            <div className="stars-display">{renderStars(rating.stars)}</div>
            <div className="stars-number">{rating.stars} من 5</div>
          </div>

          {rating.tags.length > 0 && (
            <div className="detail-section">
              <h3 className="section-title">الوسوم</h3>
              <div className="tags-display">
                {rating.tags.map((tag) => (
                  <span key={tag.id} className={`tag-badge ${tag.is_positive ? "positive" : "negative"}`}>
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {rating.comment && (
            <div className="detail-section">
              <h3 className="section-title">التعليق</h3>
              <div className="comment-box">{rating.comment}</div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
}
