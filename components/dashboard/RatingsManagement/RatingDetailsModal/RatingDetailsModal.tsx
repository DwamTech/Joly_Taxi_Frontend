"use client";

import { useState, useEffect } from "react";
import { Rating } from "@/models/Rating";
import { getRatingDetails, DetailedRating } from "@/services/ratingsService";
import { formatDisplayValue } from "@/utils/formatters";
import "./RatingDetailsModal.css";

interface RatingDetailsModalProps {
  rating: Rating;
  onClose: () => void;
}

export default function RatingDetailsModal({ rating, onClose }: RatingDetailsModalProps) {
  const [detailedRating, setDetailedRating] = useState<DetailedRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatingDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await getRatingDetails(rating.id);
        setDetailedRating(details);
      } catch (err: any) {
        console.error('Error fetching rating details:', err);
        setError(err.message || 'فشل في جلب تفاصيل التقييم');
      } finally {
        setLoading(false);
      }
    };

    fetchRatingDetails();
  }, [rating.id]);

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

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} جنيه`;
  };

  const formatPercentage = (percent: number) => {
    return `${percent}%`;
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

          {detailedRating && (
            <>
              {/* معلومات الرحلة */}
              <div className="detail-section">
                <h3 className="section-title">معلومات الرحلة</h3>
                <div className="detail-row">
                  <span className="detail-label">رقم الرحلة:</span>
                  <span className="detail-value">#{detailedRating.tripRequest.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">من:</span>
                  <span className="detail-value">{formatDisplayValue(detailedRating.tripRequest.fromAddress)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">إلى:</span>
                  <span className="detail-value">{formatDisplayValue(detailedRating.tripRequest.toAddress)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">حالة الرحلة:</span>
                  <span className={`status-badge ${detailedRating.tripRequest.status}`}>
                    {formatDisplayValue(detailedRating.tripRequest.statusName)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">السعر النهائي:</span>
                  <span className="detail-value price">{formatPrice(detailedRating.tripRequest.finalPrice)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">السعر المقترح:</span>
                  <span className="detail-value price">{formatPrice(detailedRating.tripRequest.suggestedPrice)}</span>
                </div>
                {detailedRating.tripRequest.cancelledByName && (
                  <div className="detail-row">
                    <span className="detail-label">ألغيت بواسطة:</span>
                    <span className="detail-value">{formatDisplayValue(detailedRating.tripRequest.cancelledByName)}</span>
                  </div>
                )}
              </div>

              {/* معلومات المُقيِّم */}
              <div className="detail-section">
                <h3 className="section-title">المُقيِّم</h3>
                <div className="detail-row">
                  <span className="detail-label">الاسم:</span>
                  <span className="detail-value">{formatDisplayValue(detailedRating.rater.name)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">رقم الهاتف:</span>
                  <span className="detail-value">{formatDisplayValue(detailedRating.rater.phone)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">النوع:</span>
                  <span className={`user-badge ${detailedRating.raterType}`}>
                    {formatDisplayValue(detailedRating.raterTypeName)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">الدور:</span>
                  <span className="detail-value">{formatDisplayValue(detailedRating.rater.roleName)}</span>
                </div>
              </div>

              {/* معلومات المُقيَّم */}
              <div className="detail-section">
                <h3 className="section-title">المُقيَّم</h3>
                <div className="detail-row">
                  <span className="detail-label">الاسم:</span>
                  <span className="detail-value">{formatDisplayValue(detailedRating.ratedUser.name)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">رقم الهاتف:</span>
                  <span className="detail-value">{formatDisplayValue(detailedRating.ratedUser.phone)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">الدور:</span>
                  <span className="detail-value">{formatDisplayValue(detailedRating.ratedUser.roleName)}</span>
                </div>

                {/* إحصائيات التقييم للمستخدم المُقيَّم */}
                {detailedRating.ratedUser.ratingStats && (
                  <>
                    <div className="detail-row">
                      <span className="detail-label">متوسط التقييم:</span>
                      <span className="detail-value rating-avg">
                        {detailedRating.ratedUser.ratingStats.ratingAvg} ⭐
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">عدد التقييمات:</span>
                      <span className="detail-value">{detailedRating.ratedUser.ratingStats.ratingCount}</span>
                    </div>
                  </>
                )}

                {/* معلومات السائق إذا كان المُقيَّم سائق */}
                {detailedRating.ratedUser.driverProfile && (
                  <div className="driver-profile-section">
                    <h4 className="subsection-title">معلومات السائق</h4>
                    <div className="detail-row">
                      <span className="detail-label">رقم الهوية:</span>
                      <span className="detail-value">{formatDisplayValue(detailedRating.ratedUser.driverProfile.nationalIdNumber)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">حالة التحقق:</span>
                      <span className={`verification-badge ${detailedRating.ratedUser.driverProfile.verificationStatus}`}>
                        {formatDisplayValue(detailedRating.ratedUser.driverProfile.verificationStatusName)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">نسبة الموثوقية:</span>
                      <span className="detail-value reliability">{formatPercentage(detailedRating.ratedUser.driverProfile.reliabilityPercent)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">الرحلات المكتملة:</span>
                      <span className="detail-value">{detailedRating.ratedUser.driverProfile.completedTripsCount}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">الرحلات الملغاة:</span>
                      <span className="detail-value">{detailedRating.ratedUser.driverProfile.cancelledTripsCount}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">الحالة الحالية:</span>
                      <span className={`online-status ${detailedRating.ratedUser.driverProfile.onlineStatus}`}>
                        {detailedRating.ratedUser.driverProfile.onlineStatus === 'online' ? 'متصل' : 'غير متصل'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">انتهاء الرخصة:</span>
                      <span className="detail-value">{formatDate(detailedRating.ratedUser.driverProfile.driverLicenseExpiry)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">انتهاء الملف الشخصي:</span>
                      <span className="detail-value">{formatDate(detailedRating.ratedUser.driverProfile.expireProfileAt)}</span>
                    </div>
                    {detailedRating.ratedUser.driverProfile.lastLocationAt && (
                      <div className="detail-row">
                        <span className="detail-label">آخر موقع:</span>
                        <span className="detail-value">
                          {formatDate(detailedRating.ratedUser.driverProfile.lastLocationAt)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* التقييم */}
              <div className="detail-section">
                <h3 className="section-title">التقييم</h3>
                <div className="stars-display">{renderStars(detailedRating.stars)}</div>
                <div className="stars-number">{detailedRating.stars} من 5</div>
                <div className="detail-row">
                  <span className="detail-label">تاريخ التقييم:</span>
                  <span className="detail-value">{formatDate(detailedRating.createdAt)}</span>
                </div>
                {detailedRating.updatedAt !== detailedRating.createdAt && (
                  <div className="detail-row">
                    <span className="detail-label">آخر تحديث:</span>
                    <span className="detail-value">{formatDate(detailedRating.updatedAt)}</span>
                  </div>
                )}
              </div>

              {/* الوسوم */}
              {detailedRating.tags.length > 0 && (
                <div className="detail-section">
                  <h3 className="section-title">الوسوم</h3>
                  <div className="tags-display">
                    {detailedRating.tags.map((tag) => (
                      <div key={tag.id} className="tag-item">
                        <span className={`tag-badge ${tag.isPositive ? "positive" : "negative"}`}>
                          {formatDisplayValue(tag.label)}
                        </span>
                        <div className="tag-details">
                          <small>العربية: {formatDisplayValue(tag.labelAr)}</small>
                          <small>الإنجليزية: {formatDisplayValue(tag.labelEn)}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* التعليق */}
              {detailedRating.comment && (
                <div className="detail-section">
                  <h3 className="section-title">التعليق</h3>
                  <div className="comment-box">{detailedRating.comment}</div>
                </div>
              )}
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
