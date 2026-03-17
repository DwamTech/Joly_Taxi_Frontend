"use client";

import { Trip } from "@/models/Trip";
import "./TripDetailsModal.css";

interface TripDetailsModalProps {
  trip: Trip;
  onClose: () => void;
}

export default function TripDetailsModal({
  trip,
  onClose,
}: TripDetailsModalProps) {
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      open: "مفتوحة",
      accepted: "مقبولة",
      started: "جارية",
      ended: "منتهية",
      cancelled: "ملغاة",
      
    };
    return labels[status] || status;
  };

  const getPaymentMethodLabel = (method?: string) => {
    const labels: Record<string, string> = {
      cash: "نقدي",
      card: "بطاقة",
      wallet: "محفظة",
    };
    return method ? labels[method] || method : "-";
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatETA = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} ساعة و ${remainingMinutes} دقيقة`;
  };

  return (
    <div className="trip-details-overlay" onClick={onClose}>
      <div className="trip-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="trip-details-header">
          <h2>تفاصيل الرحلة</h2>
          <button className="trip-details-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="trip-details-body">
          <div className="trip-details-section">
            <h3 className="trip-details-section-title">
              <span>📋</span>
              معلومات الرحلة
            </h3>
            <div className="trip-details-grid">
              <div className="trip-details-item">
                <span className="trip-details-label">رقم الرحلة:</span>
                <span className="trip-details-value trip-details-trip-number">
                  TRIP-{trip.id}
                </span>
              </div>
              <div className="trip-details-item">
                <span className="trip-details-label">الحالة:</span>
                <span className={`trip-details-status-badge trip-details-status-${trip.status}`}>
                  {trip.status_name || getStatusLabel(trip.status)}
                </span>
              </div>
              <div className="trip-details-item">
                <span className="trip-details-label">المسافة:</span>
                <span className="trip-details-value">{trip.distance_km} كم</span>
              </div>
              <div className="trip-details-item">
                <span className="trip-details-label">الوقت المتوقع:</span>
                <span className="trip-details-value">{formatETA(trip.eta_seconds)}</span>
              </div>
              <div className="trip-details-item">
                <span className="trip-details-label">السعر لكل كم:</span>
                <span className="trip-details-value">{trip.price_per_km_snapshot} جنيه</span>
              </div>
              <div className="trip-details-item">
                <span className="trip-details-label">السعر المقترح:</span>
                <span className="trip-details-value">{trip.suggested_price} جنيه</span>
              </div>
              {trip.final_price && (
                <div className="trip-details-item">
                  <span className="trip-details-label">السعر النهائي:</span>
                  <span className="trip-details-value trip-details-price-highlight">
                    {trip.final_price} جنيه
                  </span>
                </div>
              )}
              <div className="trip-details-item">
                <span className="trip-details-label">يتطلب تكييف:</span>
                <span className="trip-details-value">
                  {trip.requires_ac ? "نعم ❄️" : "لا"}
                </span>
              </div>
            </div>
          </div>

          <div className="trip-details-section">
            <h3 className="trip-details-section-title">
              <span>👤</span>
              معلومات الراكب
            </h3>
            <div className="trip-details-grid">
              <div className="trip-details-item">
                <span className="trip-details-label">الاسم:</span>
                <span className="trip-details-value">{trip.rider_name}</span>
              </div>
              <div className="trip-details-item">
                <span className="trip-details-label">رقم الهاتف:</span>
                <span className="trip-details-value">{trip.rider_phone}</span>
              </div>
            </div>
          </div>

          {trip.driver_name && (
            <div className="trip-details-section">
              <h3 className="trip-details-section-title">
                <span>🚗</span>
                معلومات السائق
              </h3>
              <div className="trip-details-grid">
                <div className="trip-details-item">
                  <span className="trip-details-label">الاسم:</span>
                  <span className="trip-details-value">{trip.driver_name}</span>
                </div>
                <div className="trip-details-item">
                  <span className="trip-details-label">رقم الهاتف:</span>
                  <span className="trip-details-value">{trip.driver_phone}</span>
                </div>
                {trip.driver_rating && (
                  <div className="trip-details-item">
                    <span className="trip-details-label">التقييم:</span>
                    <span className="trip-details-value trip-details-rating">
                      ⭐ {trip.driver_rating}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="trip-details-section">
            <h3 className="trip-details-section-title">
              <span>🚕</span>
              معلومات المركبة
            </h3>
            <div className="trip-details-grid">
              {trip.vehicle_type_icon && (
                <div className="trip-details-item">
                  <span className="trip-details-label">الصورة:</span>
                  <span className="trip-details-value">
                    <img src={trip.vehicle_type_icon} alt="نوع المركبة" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} />
                  </span>
                </div>
              )}
              <div className="trip-details-item">
                <span className="trip-details-label">النوع:</span>
                <span className="trip-details-value">{trip.vehicle_type}</span>
              </div>
              {typeof trip.vehicle_base_fare !== "undefined" && (
                <div className="trip-details-item">
                  <span className="trip-details-label">الأجرة الأساسية:</span>
                  <span className="trip-details-value">{trip.vehicle_base_fare} جنيه</span>
                </div>
              )}
              {typeof trip.vehicle_price_per_km !== "undefined" && (
                <div className="trip-details-item">
                  <span className="trip-details-label">سعر للكم (نوع المركبة):</span>
                  <span className="trip-details-value">{trip.vehicle_price_per_km} جنيه</span>
                </div>
              )}
              {typeof trip.vehicle_wait_time_seconds !== "undefined" && (
                <div className="trip-details-item">
                  <span className="trip-details-label">وقت الانتظار:</span>
                  <span className="trip-details-value">{trip.vehicle_wait_time_seconds} ثانية</span>
                </div>
              )}
              {typeof trip.vehicle_requires_subscription !== "undefined" && (
                <div className="trip-details-item">
                  <span className="trip-details-label">يتطلب اشتراك:</span>
                  <span className="trip-details-value">{trip.vehicle_requires_subscription ? "نعم" : "لا"}</span>
                </div>
              )}
              {typeof trip.vehicle_active !== "undefined" && (
                <div className="trip-details-item">
                  <span className="trip-details-label">نشط:</span>
                  <span className="trip-details-value">{trip.vehicle_active ? "نعم" : "لا"}</span>
                </div>
              )}
              {typeof trip.vehicle_sort_order !== "undefined" && (
                <div className="trip-details-item">
                  <span className="trip-details-label">الترتيب:</span>
                  <span className="trip-details-value">{trip.vehicle_sort_order}</span>
                </div>
              )}
              {typeof trip.vehicle_max_search_radius_km !== "undefined" && (
                <div className="trip-details-item">
                  <span className="trip-details-label">أقصى نصف قطر بحث:</span>
                  <span className="trip-details-value">{trip.vehicle_max_search_radius_km} كم</span>
                </div>
              )}
              {trip.vehicle_brand && (
                <div className="trip-details-item">
                  <span className="trip-details-label">الماركة:</span>
                  <span className="trip-details-value">{trip.vehicle_brand}</span>
                </div>
              )}
              {trip.vehicle_model && (
                <div className="trip-details-item">
                  <span className="trip-details-label">الموديل:</span>
                  <span className="trip-details-value">{trip.vehicle_model}</span>
                </div>
              )}
              {trip.vehicle_license && (
                <div className="trip-details-item">
                  <span className="trip-details-label">رقم اللوحة:</span>
                  <span className="trip-details-value">{trip.vehicle_license}</span>
                </div>
              )}
              <div className="trip-details-item">
                <span className="trip-details-label">يتطلب تكييف:</span>
                <span className="trip-details-value">
                  {trip.requires_ac ? "نعم ❄️" : "لا"}
                </span>
              </div>
            </div>
          </div>

          <div className="trip-details-section">
            <h3 className="trip-details-section-title">
              <span>📍</span>
              المواقع
            </h3>
            <div className="trip-details-location-details">
              <div className="trip-details-location-item">
                <div className="trip-details-location-icon">📍</div>
                <div className="trip-details-location-info">
                  <span className="trip-details-location-label">من:</span>
                  <span className="trip-details-location-address">
                    {trip.from_address}
                  </span>
                  <span className="trip-details-location-coords">
                    ({trip.from_lat.toFixed(4)}, {trip.from_lng.toFixed(4)})
                  </span>
                </div>
              </div>
              <div className="trip-details-location-item">
                <div className="trip-details-location-icon">🎯</div>
                <div className="trip-details-location-info">
                  <span className="trip-details-location-label">إلى:</span>
                  <span className="trip-details-location-address">
                    {trip.to_address}
                  </span>
                  <span className="trip-details-location-coords">
                    ({trip.to_lat.toFixed(4)}, {trip.to_lng.toFixed(4)})
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="trip-details-section">
            <h3 className="trip-details-section-title">
              <span>⏰</span>
              التوقيتات
            </h3>
            <div className="trip-details-grid">
              <div className="trip-details-item">
                <span className="trip-details-label">تاريخ الإنشاء:</span>
                <span className="trip-details-value">
                  {formatDateTime(trip.created_at)}
                </span>
              </div>
              <div className="trip-details-item">
                <span className="trip-details-label">آخر تحديث:</span>
                <span className="trip-details-value">
                  {formatDateTime(trip.updated_at)}
                </span>
              </div>
            </div>
          </div>

          {trip.status === "cancelled" && (
            <div className="trip-details-section trip-details-cancellation-section">
              <h3 className="trip-details-section-title">
                <span>❌</span>
                معلومات الإلغاء
              </h3>
              <div className="trip-details-grid">
                {trip.cancelled_by && (
                  <div className="trip-details-item">
                    <span className="trip-details-label">تم الإلغاء بواسطة:</span>
                    <span className="trip-details-value">
                      {trip.cancelled_by === "rider"
                        ? "الراكب"
                        : trip.cancelled_by === "driver"
                        ? "السائق"
                        : "النظام"}
                    </span>
                  </div>
                )}
                  {trip.cancelled_by_name && (
                    <div className="trip-details-item">
                      <span className="trip-details-label">اسم المُلغي:</span>
                      <span className="trip-details-value">
                        {trip.cancelled_by_name}
                      </span>
                    </div>
                  )}
                {trip.cancellation_reason && (
                  <div className="trip-details-item trip-details-item-full-width">
                    <span className="trip-details-label">سبب الإلغاء:</span>
                    <span className="trip-details-value">
                      {trip.cancellation_reason}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {trip.notes && (
            <div className="trip-details-section">
              <h3 className="trip-details-section-title">
                <span>📝</span>
                ملاحظات
              </h3>
              <p className="trip-details-notes-text">{trip.notes}</p>
            </div>
          )}

          {Array.isArray(trip.offers) && trip.offers.length > 0 && (
            <div className="trip-details-section">
              <h3 className="trip-details-section-title">
                <span>💰</span>
                العروض
              </h3>
              <div className="trip-details-grid">
                {trip.offers.map((offer) => (
                  <div key={offer.id} className="trip-details-item">
                    <span className="trip-details-label">السعر المقدم:</span>
                    <span className="trip-details-value">{offer.offered_price} جنيه</span>
                    {typeof offer.original_offered_price !== "undefined" && (
                      <>
                        <span className="trip-details-label">السعر الأصلي:</span>
                        <span className="trip-details-value">{offer.original_offered_price} جنيه</span>
                      </>
                    )}
                    <span className="trip-details-label">الحالة:</span>
                    <span className="trip-details-value">{offer.status_name || offer.status}</span>
                    <span className="trip-details-label">تاريخ الإنشاء:</span>
                    <span className="trip-details-value">{formatDateTime(offer.created_at)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(trip.timelines) && trip.timelines.length > 0 && (
            <div className="trip-details-section">
              <h3 className="trip-details-section-title">
                <span>🕘</span>
                سجل الأحداث
              </h3>
              <div className="trip-details-grid">
                {trip.timelines.map((t) => (
                  <div key={t.id} className="trip-details-item">
                    <span className="trip-details-label">النوع:</span>
                    <span className="trip-details-value">{t.event_type}</span>
                    <span className="trip-details-label">الوقت:</span>
                    <span className="trip-details-value">{formatDateTime(t.created_at)}</span>
                    {t.event_type === "status_change" && t.payload && (
                      <>
                        <span className="trip-details-label">من الحالة:</span>
                        <span className="trip-details-value">{t.payload.from_status}</span>
                        <span className="trip-details-label">إلى الحالة:</span>
                        <span className="trip-details-value">{t.payload.to_status}</span>
                      </>
                    )}
                    {t.event_type === "arrival_update" && t.payload && (
                      <>
                        <span className="trip-details-label">المسافة:</span>
                        <span className="trip-details-value">{t.payload.distance}</span>
                        <span className="trip-details-label">المدة:</span>
                        <span className="trip-details-value">{t.payload.duration}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(trip.ratings) && trip.ratings.length > 0 && (
            <div className="trip-details-section">
              <h3 className="trip-details-section-title">
                <span>🌟</span>
                التقييمات
              </h3>
              <div className="trip-details-grid">
                {trip.ratings.map((r) => (
                  <div key={r.id} className="trip-details-item">
                    <span className="trip-details-label">عدد النجوم:</span>
                    <span className="trip-details-value">⭐ {r.stars}</span>
                    {r.comment && (
                      <>
                        <span className="trip-details-label">التعليق:</span>
                        <span className="trip-details-value">{r.comment}</span>
                      </>
                    )}
                    {r.rater && (
                      <>
                        <span className="trip-details-label">المقيم:</span>
                        <span className="trip-details-value">{r.rater.name}</span>
                      </>
                    )}
                    {Array.isArray(r.tags) && r.tags.length > 0 && (
                      <>
                        <span className="trip-details-label">الوسوم:</span>
                        <span className="trip-details-value">
                          {r.tags.map((tag) => tag.label || tag.label_ar || tag.label_en).filter(Boolean).join("، ")}
                        </span>
                      </>
                    )}
                    <span className="trip-details-label">التاريخ:</span>
                    <span className="trip-details-value">{formatDateTime(r.created_at)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="trip-details-footer">
          <button className="trip-details-close-modal-btn" onClick={onClose}>
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
