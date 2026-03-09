"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import CustomSelect from "../CustomSelect/CustomSelect";
import "./AddUserModal.css";

interface AddUserModalProps {
  onClose: () => void;
  onAddUser: (userData: any) => void;
}

export default function AddUserModal({ onClose, onAddUser }: AddUserModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "user",
    status: "active",
    agent_code: "",
    delegate_number: "",
    // Driver fields
    national_id_number: "",
    driver_license_expiry: "",
    expire_profile_at: "",
    verification_status: "pending",
    // Vehicle fields
    vehicle_type: "",
    vehicle_brand: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_license_number: "",
    vehicle_license_expiry: "",
    has_ac: true,
    // Rider fields
    reliability_percent: "100",
    preferred_vehicle_types: "",
    requires_ac: true,
    language: "ar",
  });

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
    
    // Validate required fields
    if (!formData.name || !formData.phone) {
      showToast("الرجاء إدخال الاسم ورقم الهاتف", "error");
      return;
    }

    const now = new Date().toISOString();
    
    // Create new user object
    const newUser: any = {
      id: Date.now(),
      name: formData.name,
      phone: formData.phone,
      email: formData.email || null,
      role: formData.role,
      status: formData.status,
      agent_code: formData.agent_code || null,
      delegate_number: formData.delegate_number || null,
      created_at: now,
      last_active_at: now,
      last_login_at: now,
    };

    // Add driver profile if driver or both
    if (formData.role === "driver" || formData.role === "both") {
      newUser.driver_profile = {
        national_id_number: formData.national_id_number,
        driver_license_expiry: formData.driver_license_expiry || now,
        expire_profile_at: formData.expire_profile_at || now,
        verification_status: formData.verification_status,
        online_status: false,
        rating_avg: 0,
        rating_count: 0,
        completed_trips_count: 0,
        cancelled_trips_count: 0,
      };

      if (formData.vehicle_type) {
        newUser.vehicle = {
          id: Date.now(),
          driver_user_id: newUser.id,
          type: formData.vehicle_type,
          brand: formData.vehicle_brand,
          model: formData.vehicle_model,
          year: parseInt(formData.vehicle_year) || new Date().getFullYear(),
          vehicle_license_number: formData.vehicle_license_number,
          vehicle_license_expiry: formData.vehicle_license_expiry || now,
          has_ac: formData.has_ac,
          is_active: true,
          created_at: now,
          updated_at: now,
        };
      }

      newUser.subscriptions = [];
      newUser.documents = [];
    }

    // Add rider profile if user or both
    if (formData.role === "user" || formData.role === "both") {
      newUser.rider_profile = {
        id: Date.now(),
        user_id: newUser.id,
        rating_avg: 0,
        rating_count: 0,
        reliability_percent: parseInt(formData.reliability_percent) || 100,
        completed_trips_count: 0,
        cancelled_trips_count: 0,
        preferences: {
          preferred_vehicle_types: formData.preferred_vehicle_types 
            ? formData.preferred_vehicle_types.split(',').map(t => t.trim())
            : [],
          requires_ac: formData.requires_ac,
          language: formData.language,
        },
        created_at: now,
        updated_at: now,
      };

      newUser.favorite_trips = [];
      newUser.received_ratings = [];
      newUser.sent_ratings = [];
    }

    newUser.devices = [];
    newUser.blocked_users = [];
    newUser.blocked_by_users = [];

    onAddUser(newUser);
    onClose();
  };

  const isDriver = formData.role === "driver" || formData.role === "both";
  const isRider = formData.role === "user" || formData.role === "both";

  return (
    <div className="add-user-overlay" onClick={onClose}>
      <div className="add-user-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span>➕</span>
            إضافة مستخدم جديد
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-user-form">
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
                  onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
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
                  onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
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
                    حالة التحقق
                  </label>
                  <CustomSelect
                    options={[
                      { value: "pending", label: "قيد المراجعة", icon: "⏳" },
                      { value: "approved", label: "موافق عليه", icon: "✅" },
                      { value: "rejected", label: "مرفوض", icon: "❌" },
                    ]}
                    value={formData.verification_status}
                    onChange={(value) => setFormData(prev => ({ ...prev, verification_status: value }))}
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
              إضافة المستخدم
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
