"use client";

import { useState } from "react";
import { User, VerificationStatus } from "@/models/User";
import ActivityLogModal from "../ActivityLogModal/ActivityLogModal";
import ReportsModal from "../ReportsModal/ReportsModal";
import "./UserDetailsModal.css";

interface UserDetailsModalProps {
  user: User;
  onClose: () => void;
  onVerificationChange?: (userId: number, status: VerificationStatus) => void;
  isVerificationUpdating?: boolean;
}

export default function UserDetailsModal({
  user,
  onClose,
  onVerificationChange,
  isVerificationUpdating = false,
}: UserDetailsModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showReports, setShowReports] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      user: "راكب",
      driver: "سائق",
      both: "كلاهما",
      admin: "إداري",
    };
    return labels[role] || role;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: "نشط",
      inactive: "غير نشط",
      blocked: "محظور",
    };
    return labels[status] || status;
  };

  const getVerificationLabel = (status: string) => {
    const labels: Record<string, string> = {
      approved: "موافق عليه",
      pending: "قيد المراجعة",
      rejected: "مرفوض",
    };
    return labels[status] || status;
  };

  const getSubscriptionStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: "نشط",
      pending: "قيد المراجعة",
      expired: "منتهي",
      rejected: "مرفوض",
    };
    return labels[status] || status;
  };

  const isDriver = user.role === "driver" || user.role === "both";
  const isRider = user.role === "user" || user.role === "both";
  const profileStatus =
    user.driver_profile?.profile_status ||
    user.driver_profile?.verification_status ||
    "pending";

  return (
    <div className="user-details-overlay" onClick={onClose}>
      <div className="user-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span>👤</span>
            تفاصيل المستخدم
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* User Header */}
          <div className="user-header-section">
            <div className="user-large-avatar">{user.name.charAt(0)}</div>
            <div className="user-header-info">
              <h2>{user.name}</h2>
              <div className="user-header-meta">
                <span className="meta-item">
                  <span>📱</span>
                  {user.phone}
                </span>
                {user.email && (
                  <span className="meta-item">
                    <span>📧</span>
                    {user.email}
                  </span>
                )}
                <span className="meta-item">
                  <span>👥</span>
                  {getRoleLabel(user.role)}
                </span>
                <span className="meta-item">
                  <span>📊</span>
                  {getStatusLabel(user.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="info-section">
            <h3 className="section-title">
              <span>ℹ️</span>
              المعلومات الأساسية
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">الاسم الكامل</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">رقم الهاتف</span>
                <span className="info-value">{user.phone}</span>
              </div>
              {user.agent_code && (
                <div className="info-item">
                  <span className="info-label">كود الوكيل</span>
                  <span className="info-value">{user.agent_code}</span>
                </div>
              )}
              {user.delegate_number && (
                <div className="info-item">
                  <span className="info-label">رقم المندوب</span>
                  <span className="info-value">{user.delegate_number}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">الحالة</span>
                <span className="info-value">{getStatusLabel(user.status)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">تاريخ التسجيل</span>
                <span className="info-value">{formatDate(user.created_at)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">آخر تسجيل دخول</span>
                <span className="info-value">
                  {formatDateTime(user.last_login_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Driver Information */}
          {isDriver && user.driver_profile && (
            <>
              <div className="info-section">
                <h3 className="section-title">
                  <span>🚗</span>
                  معلومات السائق
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">رقم الهوية</span>
                    <span className="info-value">
                      {user.driver_profile.national_id_number}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">تاريخ انتهاء رخصة القيادة</span>
                    <span className="info-value">
                      {formatDate(user.driver_profile.driver_license_expiry)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">تاريخ انتهاء صلاحية الملف</span>
                    <span className="info-value">
                      {formatDate(user.driver_profile.expire_profile_at)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">حالة البروفايل</span>
                    {onVerificationChange ? (
                      <select
                        className={`verification-select ${profileStatus}`}
                        value={profileStatus}
                        disabled={isVerificationUpdating}
                        onChange={(e) =>
                          onVerificationChange(
                            user.id,
                            e.target.value as VerificationStatus
                          )
                        }
                      >
                        <option value="approved">موافق عليه</option>
                        <option value="pending">قيد المراجعة</option>
                        <option value="rejected">مرفوض</option>
                      </select>
                    ) : (
                      <span className="info-value">
                        {getVerificationLabel(profileStatus)}
                      </span>
                    )}
                    {isVerificationUpdating && (
                      <span
                        className="info-value"
                        style={{ display: "block", marginTop: "8px", color: "#888", fontSize: "12px" }}
                      >
                        جاري حفظ الحالة...
                      </span>
                    )}
                  </div>
                  <div className="info-item">
                    <span className="info-label">الحالة الحالية</span>
                    <span
                      className={`online-indicator ${
                        user.driver_profile.online_status ? "online" : "offline"
                      }`}
                    >
                      <span className="pulse-dot"></span>
                      {user.driver_profile.online_status
                        ? "متصل الآن"
                        : "غير متصل"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">التقييم</span>
                    <div className="rating-display">
                      <span className="stars">⭐</span>
                      <span>{user.driver_profile.rating_avg.toFixed(1)}</span>
                      <span className="rating-count">
                        ({user.driver_profile.rating_count} تقييم)
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-label">الرحلات المكتملة</span>
                    <span className="info-value">
                      {user.driver_profile.completed_trips_count}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">الرحلات الملغاة</span>
                    <span className="info-value">
                      {user.driver_profile.cancelled_trips_count}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              {user.vehicle && (
                <div className="info-section">
                  <h3 className="section-title">
                    <span>🚙</span>
                    معلومات المركبة
                  </h3>
                  <div className="vehicle-card">
                    <div className="vehicle-header">
                      <span className="vehicle-type">{user.vehicle.type}</span>
                      {user.vehicle.has_ac && (
                        <span className="ac-badge">❄️ يوجد تكييف</span>
                      )}
                      {user.vehicle.is_active ? (
                        <span className="ac-badge" style={{background: '#e8f5e9', color: '#2e7d32'}}>✓ نشط</span>
                      ) : (
                        <span className="ac-badge" style={{background: '#ffebee', color: '#c62828'}}>✗ غير نشط</span>
                      )}
                    </div>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">الماركة</span>
                        <span className="info-value">{user.vehicle.brand}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">الموديل</span>
                        <span className="info-value">{user.vehicle.model}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">السنة</span>
                        <span className="info-value">{user.vehicle.year}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">رقم الرخصة</span>
                        <span className="info-value">
                          {user.vehicle.vehicle_license_number}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">تاريخ انتهاء الرخصة</span>
                        <span className="info-value">
                          {formatDate(user.vehicle.vehicle_license_expiry)}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">تاريخ الإضافة</span>
                        <span className="info-value">
                          {formatDate(user.vehicle.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Vehicle Type Details */}
                    {user.vehicle.vehicle_type && (
                      <>
                        <h4 style={{marginTop: '20px', marginBottom: '12px', fontSize: '16px', fontWeight: '600'}}>
                          تفاصيل نوع المركبة
                        </h4>
                        <div className="info-grid">
                          <div className="info-item">
                            <span className="info-label">النوع بالعربي</span>
                            <span className="info-value">{user.vehicle.vehicle_type.name_ar}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">النوع بالإنجليزي</span>
                            <span className="info-value">{user.vehicle.vehicle_type.name_en}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">السعر الأساسي</span>
                            <span className="info-value">{user.vehicle.vehicle_type.base_fare} ج.م</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">السعر لكل كم</span>
                            <span className="info-value">{user.vehicle.vehicle_type.price_per_km} ج.م</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">يتطلب اشتراك</span>
                            <span className="info-value">
                              {user.vehicle.vehicle_type.requires_subscription ? 'نعم' : 'لا'}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">وقت الانتظار</span>
                            <span className="info-value">
                              {user.vehicle.vehicle_type.wait_time_seconds} ثانية
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">نطاق البحث الأقصى</span>
                            <span className="info-value">
                              {user.vehicle.vehicle_type.max_search_radius_km} كم
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">الحالة</span>
                            <span className="info-value">
                              {user.vehicle.vehicle_type.active ? 'نشط' : 'غير نشط'}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Subscriptions */}
              {user.subscriptions && user.subscriptions.length > 0 && (
                <div className="info-section">
                  <h3 className="section-title">
                    <span>📋</span>
                    الاشتراكات
                  </h3>
                  <table className="subscriptions-table">
                    <thead>
                      <tr>
                        <th>المرجع</th>
                        <th>نوع المركبة</th>
                        <th>المدة</th>
                        <th>تاريخ البداية</th>
                        <th>تاريخ النهاية</th>
                        <th>المبلغ الإجمالي</th>
                        <th>المبلغ المدفوع</th>
                        <th>الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.subscriptions.map((sub, index) => (
                        <tr
                          key={sub.id}
                          className={index === 0 ? "active-subscription" : ""}
                        >
                          <td>{sub.reference || '-'}</td>
                          <td>{sub.vehicle_type}</td>
                          <td>{sub.months} شهر</td>
                          <td>{formatDate(sub.start_date)}</td>
                          <td>{formatDate(sub.end_date)}</td>
                          <td>{sub.total_price} ج.م</td>
                          <td>{sub.paid_amount} ج.م</td>
                          <td>
                            <span
                              className={`subscription-status ${sub.status}`}
                            >
                              {getSubscriptionStatusLabel(sub.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Documents */}
              {user.documents && user.documents.length > 0 && (
                <div className="info-section">
                  <h3 className="section-title">
                    <span>📄</span>
                    المستندات ({user.documents.length})
                  </h3>
                  <div className="documents-grid">
                    {user.documents.map((doc) => (
                      <div 
                        key={doc.id} 
                        className="document-card"
                        onClick={() => setSelectedImage(doc.file_url)}
                        style={{cursor: 'pointer'}}
                      >
                        <div className="document-icon">
                          {doc.type.includes('photo') ? '📷' : 
                           doc.type === 'national_id_front' ? '🆔' :
                           doc.type === 'national_id_back' ? '🔖' :
                           doc.type.includes('driver_license') ? '🚗' :
                           doc.type.includes('vehicle_license') ? '📋' : '📄'}
                        </div>
                        <div className="document-name">
                          {doc.type === 'driver_photo' ? 'صورة السائق' :
                           doc.type === 'national_id_front' ? 'الهوية (أمامي)' :
                           doc.type === 'national_id_back' ? 'الهوية (خلفي)' :
                           doc.type === 'driver_license_front' ? 'رخصة القيادة (أمامي)' :
                           doc.type === 'driver_license_back' ? 'رخصة القيادة (خلفي)' :
                           doc.type === 'vehicle_license_front' ? 'رخصة المركبة (أمامي)' :
                           doc.type === 'vehicle_license_back' ? 'رخصة المركبة (خلفي)' : doc.type}
                        </div>
                        <div style={{fontSize: '11px', color: '#888', marginTop: '4px'}}>
                          {doc.status === 'approved' ? '✓ موافق عليه' : 
                           doc.status === 'pending' ? '⏳ قيد المراجعة' : 
                           doc.status === 'rejected' ? '✗ مرفوض' : doc.status}
                        </div>
                        {doc.expires_at && (
                          <div style={{fontSize: '11px', color: '#f57c00', marginTop: '4px'}}>
                            ينتهي: {formatDate(doc.expires_at)}
                          </div>
                        )}
                        <div style={{fontSize: '11px', color: '#FDB913', marginTop: '8px', fontWeight: '600'}}>
                          اضغط للعرض
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Rider Information */}
          {isRider && user.rider_profile && (
            <>
              <div className="info-section">
                <h3 className="section-title">
                  <span>🚶</span>
                  معلومات الراكب
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">التقييم</span>
                    <div className="rating-display">
                      <span className="stars">⭐</span>
                      <span>{user.rider_profile.rating_avg.toFixed(1)}</span>
                      <span className="rating-count">
                        ({user.rider_profile.rating_count} تقييم)
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-label">نسبة الموثوقية</span>
                    <span className="info-value">
                      {user.rider_profile.reliability_percent}%
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">الرحلات المكتملة</span>
                    <span className="info-value">
                      {user.rider_profile.completed_trips_count}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">الرحلات الملغاة</span>
                    <span className="info-value">
                      {user.rider_profile.cancelled_trips_count}
                    </span>
                  </div>
                </div>

                {/* Preferences */}
                {user.rider_profile.preferences && (
                  <>
                    <h4 style={{marginTop: '20px', marginBottom: '12px', fontSize: '16px', fontWeight: '600'}}>
                      التفضيلات
                    </h4>
                    <div className="info-grid">
                      {user.rider_profile.preferences.preferred_vehicle_types && (
                        <div className="info-item">
                          <span className="info-label">أنواع المركبات المفضلة</span>
                          <span className="info-value">
                            {user.rider_profile.preferences.preferred_vehicle_types.join(', ')}
                          </span>
                        </div>
                      )}
                      {user.rider_profile.preferences.requires_ac !== undefined && (
                        <div className="info-item">
                          <span className="info-label">يفضل التكييف</span>
                          <span className="info-value">
                            {user.rider_profile.preferences.requires_ac ? 'نعم' : 'لا'}
                          </span>
                        </div>
                      )}
                      {user.rider_profile.preferences.language && (
                        <div className="info-item">
                          <span className="info-label">اللغة المفضلة</span>
                          <span className="info-value">
                            {user.rider_profile.preferences.language === 'ar' ? 'العربية' : 'English'}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Favorite Trips */}
              {user.favorite_trips && user.favorite_trips.length > 0 && (
                <div className="info-section">
                  <h3 className="section-title">
                    <span>⭐</span>
                    الرحلات المفضلة ({user.favorite_trips.length})
                  </h3>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    {user.favorite_trips.map((trip) => (
                      <div key={trip.id} className="vehicle-card">
                        <div className="vehicle-header">
                          <span className="vehicle-type">{trip.title}</span>
                          <span style={{fontSize: '13px', color: '#888'}}>
                            استخدم {trip.usage_count} مرة
                          </span>
                        </div>
                        <div className="info-grid">
                          <div className="info-item">
                            <span className="info-label">من (Lat, Lng)</span>
                            <span className="info-value" style={{fontSize: '12px'}}>
                              {trip.from_lat.toFixed(4)}, {trip.from_lng.toFixed(4)}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">إلى (Lat, Lng)</span>
                            <span className="info-value" style={{fontSize: '12px'}}>
                              {trip.to_lat.toFixed(4)}, {trip.to_lng.toFixed(4)}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">يتطلب تكييف</span>
                            <span className="info-value">
                              {trip.requires_ac ? 'نعم' : 'لا'}
                            </span>
                          </div>
                          {trip.last_estimated_price && (
                            <div className="info-item">
                              <span className="info-label">آخر سعر تقديري</span>
                              <span className="info-value">
                                {trip.last_estimated_price} ج.م
                              </span>
                            </div>
                          )}
                          {trip.last_estimated_at && (
                            <div className="info-item">
                              <span className="info-label">آخر تقدير</span>
                              <span className="info-value" style={{fontSize: '12px'}}>
                                {formatDateTime(trip.last_estimated_at)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="action-button activity-btn"
              onClick={() => setShowActivityLog(true)}
            >
              <span>📊</span>
              سجل النشاط (آخر 10 رحلات)
            </button>
            <button 
              className="action-button complaints-btn"
              onClick={() => setShowReports(true)}
            >
              <span>⚠️</span>
              الشكاوى
            </button>
          </div>
        </div>
      </div>

      {/* Activity Log Modal */}
      {showActivityLog && (
        <ActivityLogModal
          userId={user.id}
          userName={user.name}
          onClose={() => setShowActivityLog(false)}
        />
      )}

      {/* Reports Modal */}
      {showReports && (
        <ReportsModal
          userId={user.id}
          userName={user.name}
          onClose={() => setShowReports(false)}
        />
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="image-preview-overlay" 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedImage(null);
          }}
        >
          <div className="image-preview-container">
            <button 
              className="image-preview-close" 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              ×
            </button>
            <img 
              src={selectedImage} 
              alt="Document Preview" 
              className="image-preview"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
