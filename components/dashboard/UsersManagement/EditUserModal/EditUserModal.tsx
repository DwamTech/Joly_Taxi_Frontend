"use client";

import { useState } from "react";
import { User, UserRole, UserStatus, VerificationStatus } from "@/models/User";
import { useToast } from "@/components/Toast/ToastContainer";
import CustomSelect from "../CustomSelect/CustomSelect";
import "./EditUserModal.css";

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onUpdateUser: (userData: User) => void;
}

export default function EditUserModal({ user, onClose, onUpdateUser }: EditUserModalProps) {
  const { showToast } = useToast();
  const formatDateForInput = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };
  const parsePreferredVehicleTypes = (value: string) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone,
    email: user.email || "",
    role: user.role,
    status: user.status,
    agent_code: user.agent_code || "",
    delegate_number: user.delegate_number || "",
    // Driver fields
    national_id_number: user.driver_profile?.national_id_number || "",
    driver_license_expiry: formatDateForInput(user.driver_profile?.driver_license_expiry),
    expire_profile_at: formatDateForInput(user.driver_profile?.expire_profile_at),
    verification_status: user.driver_profile?.profile_status || user.driver_profile?.verification_status || "pending",
    // Vehicle fields
    vehicle_type: user.vehicle?.type || "",
    vehicle_brand: user.vehicle?.brand || "",
    vehicle_model: user.vehicle?.model || "",
    vehicle_year: user.vehicle?.year?.toString() || "",
    vehicle_license_number: user.vehicle?.vehicle_license_number || "",
    vehicle_license_expiry: formatDateForInput(user.vehicle?.vehicle_license_expiry),
    has_ac: user.vehicle?.has_ac ?? true,
    // Rider fields
    reliability_percent: user.rider_profile?.reliability_percent?.toString() || "100",
    preferred_vehicle_types: user.rider_profile?.preferences?.preferred_vehicle_types?.join(', ') || "",
    requires_ac: user.rider_profile?.preferences?.requires_ac ?? true,
    language: user.rider_profile?.preferences?.language || "ar",
  });

  const [documents, setDocuments] = useState(user.documents || []);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      showToast("الرجاء إدخال الاسم ورقم الهاتف", "error");
      return;
    }

    const now = new Date().toISOString();
    
    // Create updated user object
    const updatedUser: User = {
      ...user,
      name: formData.name,
      phone: formData.phone,
      email: formData.email || null,
      role: formData.role as any,
      status: formData.status as any,
      agent_code: formData.agent_code || null,
      delegate_number: formData.delegate_number || null,
    };

    // Update driver profile if driver or both
    if (formData.role === "driver" || formData.role === "both") {
      updatedUser.driver_profile = {
        ...(user.driver_profile || {}),
        national_id_number: formData.national_id_number,
        driver_license_expiry: formData.driver_license_expiry || now,
        expire_profile_at: formData.expire_profile_at || now,
        verification_status: formData.verification_status as any,
        profile_status: formData.verification_status as any,
        online_status: user.driver_profile?.online_status ?? false,
        rating_avg: user.driver_profile?.rating_avg ?? 0,
        rating_count: user.driver_profile?.rating_count ?? 0,
        completed_trips_count: user.driver_profile?.completed_trips_count ?? 0,
        cancelled_trips_count: user.driver_profile?.cancelled_trips_count ?? 0,
      };

      if (formData.vehicle_type) {
        updatedUser.vehicle = {
          ...(user.vehicle || {}),
          id: user.vehicle?.id || Date.now(),
          driver_user_id: user.id,
          type: formData.vehicle_type,
          brand: formData.vehicle_brand,
          model: formData.vehicle_model,
          year: parseInt(formData.vehicle_year) || new Date().getFullYear(),
          vehicle_license_number: formData.vehicle_license_number,
          vehicle_license_expiry: formData.vehicle_license_expiry || now,
          has_ac: formData.has_ac,
          is_active: user.vehicle?.is_active ?? true,
          created_at: user.vehicle?.created_at || now,
          updated_at: now,
        } as any;
      }

      // Update documents
      updatedUser.documents = documents;
    } else {
      // Remove driver data if role changed
      delete updatedUser.driver_profile;
      delete updatedUser.vehicle;
      delete updatedUser.subscriptions;
      delete updatedUser.documents;
    }

    // Update rider profile if user or both
    if (formData.role === "user" || formData.role === "both") {
      updatedUser.rider_profile = {
        ...(user.rider_profile || {}),
        id: user.rider_profile?.id || Date.now(),
        user_id: user.id,
        rating_avg: user.rider_profile?.rating_avg ?? 0,
        rating_count: user.rider_profile?.rating_count ?? 0,
        reliability_percent: parseInt(formData.reliability_percent) || 100,
        completed_trips_count: user.rider_profile?.completed_trips_count ?? 0,
        cancelled_trips_count: user.rider_profile?.cancelled_trips_count ?? 0,
        preferences: {
          preferred_vehicle_types: formData.preferred_vehicle_types
            ? parsePreferredVehicleTypes(formData.preferred_vehicle_types)
            : [],
          requires_ac: formData.requires_ac,
          language: formData.language,
        },
        created_at: user.rider_profile?.created_at || now,
        updated_at: now,
      } as any;
    } else {
      // Remove rider data if role changed
      delete updatedUser.rider_profile;
      delete updatedUser.favorite_trips;
    }

    onUpdateUser(updatedUser);
    onClose();
  };

  const handleFileChange = (docType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a temporary URL for preview
    const fileUrl = URL.createObjectURL(file);

    // Update or add document
    setDocuments(prev => {
      const existingIndex = prev.findIndex(doc => doc.type === docType);
      const newDoc = {
        id: existingIndex >= 0 ? prev[existingIndex].id : Date.now(),
        driver_user_id: user.id,
        type: docType,
        file_path: `/uploads/docs/${file.name}`,
        file_url: fileUrl,
        expires_at: null,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newDoc as any;
        return updated;
      } else {
        return [...prev, newDoc as any];
      }
    });

    showToast("تم رفع الصورة بنجاح", "success");
    // TODO: Upload file to server
    console.log("Upload file:", file, "for document type:", docType);
  };

  const getDocumentByType = (type: string) => {
    return documents.find(doc => doc.type === type);
  };

  const getDocumentLabel = (type: string) => {
    const labels: Record<string, string> = {
      driver_photo: "صورة السائق",
      national_id_front: "الهوية (أمامي)",
      national_id_back: "الهوية (خلفي)",
      driver_license_front: "رخصة القيادة (أمامي)",
      driver_license_back: "رخصة القيادة (خلفي)",
      vehicle_license_front: "رخصة المركبة (أمامي)",
      vehicle_license_back: "رخصة المركبة (خلفي)",
    };
    return labels[type] || type;
  };

  const getDocumentIcon = (type: string) => {
    if (type.includes('photo')) return '📷';
    if (type === 'national_id_front') return '🆔';
    if (type === 'national_id_back') return '🔖';
    if (type.includes('driver_license')) return '🚗';
    if (type.includes('vehicle_license')) return '📋';
    return '📄';
  };

  const isDriver = formData.role === "driver" || formData.role === "both";
  const isRider = formData.role === "user" || formData.role === "both";

  return (
    <div className="edit-user-overlay" onClick={onClose}>
      <div className="edit-user-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span>✏️</span>
            تعديل بيانات المستخدم
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-user-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3 className="section-title">
              <span>ℹ️</span>
              المعلومات الأساسية
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <span>👤</span>
                  الاسم الكامل
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="أدخل الاسم الكامل"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>📱</span>
                  رقم الهاتف
                  <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="01xxxxxxxxx"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>📧</span>
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="example@email.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>👥</span>
                  النوع
                </label>
                <CustomSelect
                  options={[
                    { value: "user", label: "راكب", icon: "🚶" },
                    { value: "driver", label: "سائق", icon: "🚗" },
                    { value: "both", label: "كلاهما", icon: "👥" },
                    { value: "admin", label: "إداري", icon: "👔" },
                  ]}
                  value={formData.role}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, role: value as UserRole }))
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>📊</span>
                  الحالة
                </label>
                <CustomSelect
                  options={[
                    { value: "active", label: "نشط", icon: "✅" },
                    { value: "inactive", label: "غير نشط", icon: "⏸️" },
                    { value: "blocked", label: "محظور", icon: "🚫" },
                  ]}
                  value={formData.status}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value as UserStatus }))
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>🔢</span>
                  كود الوكيل
                </label>
                <input
                  type="text"
                  name="agent_code"
                  value={formData.agent_code}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="AG001"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>🔢</span>
                  رقم المندوب
                </label>
                <input
                  type="text"
                  name="delegate_number"
                  value={formData.delegate_number}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="DEL123"
                />
              </div>
            </div>
          </div>

          {/* Driver Information */}
          {isDriver && (
            <div className="form-section">
              <h3 className="section-title">
                <span>🚗</span>
                معلومات السائق
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <span>🪪</span>
                    رقم الهوية
                  </label>
                  <input
                    type="text"
                    name="national_id_number"
                    value={formData.national_id_number}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="29501011234567"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>📅</span>
                    تاريخ انتهاء رخصة القيادة
                  </label>
                  <input
                    type="date"
                    name="driver_license_expiry"
                    value={formData.driver_license_expiry}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>📅</span>
                    تاريخ انتهاء صلاحية الملف
                  </label>
                  <input
                    type="date"
                    name="expire_profile_at"
                    value={formData.expire_profile_at}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>✓</span>
                    حالة البروفايل
                  </label>
                  <CustomSelect
                    options={[
                      { value: "pending", label: "قيد المراجعة", icon: "⏳" },
                      { value: "approved", label: "موافق عليه", icon: "✅" },
                      { value: "rejected", label: "مرفوض", icon: "❌" },
                    ]}
                    value={formData.verification_status}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        verification_status: value as VerificationStatus,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Vehicle Information */}
              <h4 className="subsection-title">معلومات المركبة</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <span>🚙</span>
                    نوع المركبة
                  </label>
                  <input
                    type="text"
                    name="vehicle_type"
                    value={formData.vehicle_type}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="سيدان، SUV، فان..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>🏭</span>
                    الماركة
                  </label>
                  <input
                    type="text"
                    name="vehicle_brand"
                    value={formData.vehicle_brand}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="تويوتا، هيونداي..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>🚗</span>
                    الموديل
                  </label>
                  <input
                    type="text"
                    name="vehicle_model"
                    value={formData.vehicle_model}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="كورولا، توسان..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>📅</span>
                    السنة
                  </label>
                  <input
                    type="number"
                    name="vehicle_year"
                    value={formData.vehicle_year}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="2023"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>🔢</span>
                    رقم رخصة المركبة
                  </label>
                  <input
                    type="text"
                    name="vehicle_license_number"
                    value={formData.vehicle_license_number}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="أ ب ج 1234"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>📅</span>
                    تاريخ انتهاء رخصة المركبة
                  </label>
                  <input
                    type="date"
                    name="vehicle_license_expiry"
                    value={formData.vehicle_license_expiry}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label checkbox-label">
                    <input
                      type="checkbox"
                      name="has_ac"
                      checked={formData.has_ac}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    <span>❄️ يوجد تكييف</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Documents Section */}
          {isDriver && (
            <div className="form-section">
              <h3 className="section-title">
                <span>📄</span>
                المستندات
              </h3>
              <div className="documents-upload-grid">
                {[
                  'driver_photo',
                  'national_id_front',
                  'national_id_back',
                  'driver_license_front',
                  'driver_license_back',
                  'vehicle_license_front',
                  'vehicle_license_back',
                ].map((docType) => {
                  const doc = getDocumentByType(docType);
                  return (
                    <div key={docType} className="document-upload-card">
                      <div className="document-upload-header">
                        <span className="document-upload-icon">
                          {getDocumentIcon(docType)}
                        </span>
                        <span className="document-upload-label">
                          {getDocumentLabel(docType)}
                        </span>
                      </div>
                      
                      {doc && (
                        <div 
                          className="document-preview"
                          onClick={() => setSelectedImage(doc.file_url)}
                        >
                          <img 
                            src={doc.file_url} 
                            alt={getDocumentLabel(docType)}
                            className="document-preview-img"
                          />
                          <div className="document-preview-overlay">
                            <span>👁️ عرض</span>
                          </div>
                        </div>
                      )}

                      <label className="document-upload-btn">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(docType, e)}
                          style={{ display: 'none' }}
                        />
                        <span>📤</span>
                        <span>{doc ? 'تغيير الصورة' : 'رفع الصورة'}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rider Information */}
          {isRider && (
            <div className="form-section">
              <h3 className="section-title">
                <span>🚶</span>
                معلومات الراكب
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <span>📊</span>
                    نسبة الموثوقية (%)
                  </label>
                  <input
                    type="number"
                    name="reliability_percent"
                    value={formData.reliability_percent}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="100"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>🚗</span>
                    أنواع المركبات المفضلة
                  </label>
                  <input
                    type="text"
                    name="preferred_vehicle_types"
                    value={formData.preferred_vehicle_types}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="سيدان, SUV (افصل بفاصلة)"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label checkbox-label">
                    <input
                      type="checkbox"
                      name="requires_ac"
                      checked={formData.requires_ac}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    <span>❄️ يفضل التكييف</span>
                  </label>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>🌐</span>
                    اللغة المفضلة
                  </label>
                  <CustomSelect
                    options={[
                      { value: "ar", label: "العربية", icon: "🇪🇬" },
                      { value: "en", label: "English", icon: "🇬🇧" },
                    ]}
                    value={formData.language}
                    onChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              إلغاء
            </button>
            <button type="submit" className="btn-submit">
              <span>✓</span>
              حفظ التعديلات
            </button>
          </div>
        </form>

        {/* Image Preview Modal */}
        {selectedImage && (
          <div 
            className="image-preview-overlay" 
            onClick={() => setSelectedImage(null)}
          >
            <div className="image-preview-container">
              <button 
                className="image-preview-close" 
                onClick={() => setSelectedImage(null)}
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
    </div>
  );
}
