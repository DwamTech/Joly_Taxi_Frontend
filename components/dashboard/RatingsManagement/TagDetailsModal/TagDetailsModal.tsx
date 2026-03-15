"use client";

import { useState, useEffect } from "react";
import { RatingTagManagement } from "@/models/Rating";
import { getRatingTagDetails } from "@/services/ratingTagsService";
import { formatDisplayValue } from "@/utils/formatters";
import "./TagDetailsModal.css";

interface ExtendedRatingTag extends RatingTagManagement {
  created_at?: string;
  updated_at?: string;
  label?: string;
}

interface TagDetailsModalProps {
  tagId: number;
  onClose: () => void;
}

export default function TagDetailsModal({ tagId, onClose }: TagDetailsModalProps) {
  const [tagDetails, setTagDetails] = useState<ExtendedRatingTag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTagDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await getRatingTagDetails(tagId);
        setTagDetails(details);
      } catch (err: any) {
        console.error('Error fetching tag details:', err);
        setError(err.message || 'فشل في جلب تفاصيل الوسم');
      } finally {
        setLoading(false);
      }
    };

    fetchTagDetails();
  }, [tagId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAppliesTo = (type: string) => {
    const labels: Record<string, string> = {
      driver: "سائق",
      rider: "راكب",
      both: "كلاهما",
    };
    return labels[type] || type;
  };

  return (
    <div className="tag-details-overlay" onClick={onClose}>
      <div className="tag-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span>🏷️</span>
            تفاصيل الوسم #{tagId}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>جاري تحميل التفاصيل...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {tagDetails && (
            <>
              {/* معلومات الوسم الأساسية */}
              <div className="detail-section">
                <h3 className="section-title">المعلومات الأساسية</h3>
                <div className="detail-row">
                  <span className="detail-label">معرف الوسم:</span>
                  <span className="detail-value tag-id">#{tagDetails.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">النص بالعربية:</span>
                  <span className="detail-value">{formatDisplayValue(tagDetails.label_ar)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">النص بالإنجليزية:</span>
                  <span className="detail-value english-text">{formatDisplayValue(tagDetails.label_en)}</span>
                </div>
                {tagDetails.label && (
                  <div className="detail-row">
                    <span className="detail-label">التسمية المعروضة:</span>
                    <span className="detail-value">{formatDisplayValue(tagDetails.label)}</span>
                  </div>
                )}
              </div>

              {/* إعدادات الوسم */}
              <div className="detail-section">
                <h3 className="section-title">إعدادات الوسم</h3>
                <div className="detail-row">
                  <span className="detail-label">ينطبق على:</span>
                  <span className={`applies-badge ${tagDetails.applies_to}`}>
                    {getAppliesTo(tagDetails.applies_to)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">نطاق النجوم:</span>
                  <span className="detail-value stars-range">
                    {tagDetails.min_stars} - {tagDetails.max_stars} ⭐
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">نوع التقييم:</span>
                  <span className={`type-badge ${tagDetails.is_positive ? "positive" : "negative"}`}>
                    {tagDetails.is_positive ? "إيجابي" : "سلبي"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">الحالة:</span>
                  <span className={`status-badge ${tagDetails.is_active ? "active" : "inactive"}`}>
                    {tagDetails.is_active ? "نشط" : "غير نشط"}
                  </span>
                </div>
              </div>

              {/* معلومات إضافية */}
              <div className="detail-section">
                <h3 className="section-title">معلومات إضافية</h3>
                {tagDetails.created_at && (
                  <div className="detail-row">
                    <span className="detail-label">تاريخ الإنشاء:</span>
                    <span className="detail-value">{formatDate(tagDetails.created_at)}</span>
                  </div>
                )}
                {tagDetails.updated_at && (
                  <div className="detail-row">
                    <span className="detail-label">آخر تحديث:</span>
                    <span className="detail-value">{formatDate(tagDetails.updated_at)}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">عدد الاستخدامات:</span>
                  <span className="detail-value usage-count">{tagDetails.usage_count}</span>
                </div>
                {tagDetails.created_at && tagDetails.updated_at && tagDetails.created_at !== tagDetails.updated_at && (
                  <div className="detail-row">
                    <span className="detail-label">تم التعديل:</span>
                    <span className="detail-value modified-badge">نعم</span>
                  </div>
                )}
              </div>

              {/* وصف الاستخدام */}
              <div className="detail-section">
                <h3 className="section-title">وصف الاستخدام</h3>
                <div className="usage-description">
                  <p>
                    هذا الوسم يُستخدم لتقييم <strong>{getAppliesTo(tagDetails.applies_to)}</strong> 
                    {" "}عندما يكون التقييم بين <strong>{tagDetails.min_stars}</strong> و 
                    <strong>{tagDetails.max_stars}</strong> نجوم.
                  </p>
                  <p>
                    نوع التقييم: <strong>{tagDetails.is_positive ? "إيجابي" : "سلبي"}</strong>
                    {" "}والحالة الحالية: <strong>{tagDetails.is_active ? "نشط" : "غير نشط"}</strong>.
                  </p>
                  {!tagDetails.is_active && (
                    <div className="warning-note">
                      <span className="warning-icon">⚠️</span>
                      <span>هذا الوسم غير نشط حالياً ولن يظهر في خيارات التقييم.</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
}