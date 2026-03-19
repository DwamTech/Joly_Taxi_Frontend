"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import { CreateAdminUserPayload } from "@/services/usersService";
import CustomSelect from "../CustomSelect/CustomSelect";
import "./AddUserModal.css";

interface AddUserModalProps {
  onClose: () => void;
  onAddUser: (userData: CreateAdminUserPayload) => Promise<void>;
}

export default function AddUserModal({ onClose, onAddUser }: AddUserModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "rider" as CreateAdminUserPayload["role"],
    status: "active",
    agent_code: "",
    national_id_number: "",
    driver_license_expiry: "",
    vehicle_type_id: "",
    brand_id: "",
    model_id: "",
    vehicle_year_id: "",
    brand: "",
    model: "",
    year: "",
    vehicle_license_number: "",
    vehicle_license_expiry: "",
    has_ac: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<{
    driver_photo: File | null;
    national_id_front: File | null;
    national_id_back: File | null;
    driver_license_front: File | null;
    driver_license_back: File | null;
    vehicle_license_front: File | null;
    vehicle_license_back: File | null;
  }>({
    driver_photo: null,
    national_id_front: null,
    national_id_back: null,
    driver_license_front: null,
    driver_license_back: null,
    vehicle_license_front: null,
    vehicle_license_back: null,
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

  const handleFileChange = (field: keyof typeof files, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
  };

  const normalizeNumber = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast("الرجاء إدخال الاسم ورقم الهاتف", "error");
      return;
    }

    if (!/^\+\d{7,15}$/.test(formData.phone.trim())) {
      showToast("رقم الهاتف يجب أن يبدأ بـ + ويتكون من 7 إلى 15 رقمًا", "error");
      return;
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      showToast("صيغة البريد الإلكتروني غير صحيحة", "error");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      showToast("كلمة المرور يجب أن تكون 6 أحرف على الأقل", "error");
      return;
    }

    const isDriver = formData.role === "driver";
    const vehicleTypeId = normalizeNumber(formData.vehicle_type_id);
    const brandId = normalizeNumber(formData.brand_id);
    const modelId = normalizeNumber(formData.model_id);
    const vehicleYearId = normalizeNumber(formData.vehicle_year_id);
    const yearNumber = normalizeNumber(formData.year);
    const agentCode = normalizeNumber(formData.agent_code);

    if (isDriver) {
      if (!formData.national_id_number.trim()) {
        showToast("رقم الهوية مطلوب للسائق", "error");
        return;
      }
      if (!formData.driver_license_expiry) {
        showToast("تاريخ انتهاء رخصة القيادة مطلوب للسائق", "error");
        return;
      }
      if (vehicleTypeId === undefined) {
        showToast("رقم نوع المركبة مطلوب للسائق", "error");
        return;
      }
      if (!brandId && !formData.brand.trim()) {
        showToast("يجب إدخال معرف الماركة أو اسم الماركة", "error");
        return;
      }
      if (!modelId && !formData.model.trim()) {
        showToast("يجب إدخال معرف الموديل أو اسم الموديل", "error");
        return;
      }
      if (!vehicleYearId && !yearNumber) {
        showToast("يجب إدخال معرف سنة المركبة أو السنة", "error");
        return;
      }
      if (!formData.vehicle_license_number.trim()) {
        showToast("رقم رخصة المركبة مطلوب للسائق", "error");
        return;
      }
      if (!formData.vehicle_license_expiry) {
        showToast("تاريخ انتهاء رخصة المركبة مطلوب للسائق", "error");
        return;
      }
    }

    if (yearNumber !== undefined) {
      const maxYear = new Date().getFullYear() + 1;
      if (yearNumber < 1990 || yearNumber > maxYear) {
        showToast(`السنة يجب أن تكون بين 1990 و ${maxYear}`, "error");
        return;
      }
    }

    const payload: CreateAdminUserPayload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      role: formData.role,
      status: formData.status as "active" | "blocked",
      email: formData.email.trim() || undefined,
      agent_code: agentCode,
      national_id_number: formData.national_id_number.trim() || undefined,
      driver_license_expiry: formData.driver_license_expiry || undefined,
      vehicle_type_id: vehicleTypeId,
      brand_id: brandId,
      model_id: modelId,
      vehicle_year_id: vehicleYearId,
      brand: formData.brand.trim() || undefined,
      model: formData.model.trim() || undefined,
      year: yearNumber,
      has_ac: formData.has_ac,
      vehicle_license_number: formData.vehicle_license_number.trim() || undefined,
      vehicle_license_expiry: formData.vehicle_license_expiry || undefined,
      driver_photo: files.driver_photo,
      national_id_front: files.national_id_front,
      national_id_back: files.national_id_back,
      driver_license_front: files.driver_license_front,
      driver_license_back: files.driver_license_back,
      vehicle_license_front: files.vehicle_license_front,
      vehicle_license_back: files.vehicle_license_back,
    };

    try {
      setIsSubmitting(true);
      await onAddUser(payload);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDriver = formData.role === "driver";

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
                  placeholder="+201001234567"
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
                  <span>🔐</span>
                  كلمة المرور
                  <span className="required">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="6 أحرف على الأقل"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>👥</span>
                  النوع
                </label>
                <CustomSelect
                  options={[
                    { value: "rider", label: "راكب", icon: "🚶" },
                    { value: "driver", label: "سائق", icon: "🚗" },
                    { value: "admin", label: "إداري", icon: "👔" },
                  ]}
                  value={formData.role}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      role: value as CreateAdminUserPayload["role"],
                    }))
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
                  type="number"
                  name="agent_code"
                  value={formData.agent_code}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="مثال: 12"
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
                    <span className="required">*</span>
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
                    <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    name="driver_license_expiry"
                    value={formData.driver_license_expiry}
                    onChange={handleChange}
                    className="form-input"
                    required={isDriver}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>🚙</span>
                    معرف نوع المركبة
                    <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    name="vehicle_type_id"
                    value={formData.vehicle_type_id}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="مثال: 1"
                    min="1"
                    required={isDriver}
                  />
                </div>
              </div>

              <h4 className="subsection-title">معلومات المركبة</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <span>#</span>
                    معرف الماركة
                  </label>
                  <input
                    type="number"
                    name="brand_id"
                    value={formData.brand_id}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="اختياري"
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>🏭</span>
                    اسم الماركة
                    {!formData.brand_id && <span className="required">*</span>}
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="تويوتا، هيونداي..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>#</span>
                    معرف الموديل
                  </label>
                  <input
                    type="number"
                    name="model_id"
                    value={formData.model_id}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="اختياري"
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>🚗</span>
                    اسم الموديل
                    {!formData.model_id && <span className="required">*</span>}
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="كورولا، توسان..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>#</span>
                    معرف سنة المركبة
                  </label>
                  <input
                    type="number"
                    name="vehicle_year_id"
                    value={formData.vehicle_year_id}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="اختياري"
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>📅</span>
                    السنة
                    {!formData.vehicle_year_id && <span className="required">*</span>}
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="2024"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>🔢</span>
                    رقم رخصة المركبة
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicle_license_number"
                    value={formData.vehicle_license_number}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="أ ب ج 1234"
                    required={isDriver}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>📅</span>
                    تاريخ انتهاء رخصة المركبة
                    <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    name="vehicle_license_expiry"
                    value={formData.vehicle_license_expiry}
                    onChange={handleChange}
                    className="form-input"
                    required={isDriver}
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

              <h4 className="subsection-title">المستندات</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <span>📎</span>
                    صورة السائق
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileChange("driver_photo", e.target.files?.[0] || null)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>📎</span>
                    الهوية (أمام)
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) =>
                      handleFileChange("national_id_front", e.target.files?.[0] || null)
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>📎</span>
                    الهوية (خلف)
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileChange("national_id_back", e.target.files?.[0] || null)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>📎</span>
                    رخصة القيادة (أمام)
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) =>
                      handleFileChange("driver_license_front", e.target.files?.[0] || null)
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>📎</span>
                    رخصة القيادة (خلف)
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) =>
                      handleFileChange("driver_license_back", e.target.files?.[0] || null)
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>📎</span>
                    رخصة المركبة (أمام)
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) =>
                      handleFileChange("vehicle_license_front", e.target.files?.[0] || null)
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>📎</span>
                    رخصة المركبة (خلف)
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) =>
                      handleFileChange("vehicle_license_back", e.target.files?.[0] || null)
                    }
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              إلغاء
            </button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              <span>✓</span>
              {isSubmitting ? "جاري الإضافة..." : "إضافة المستخدم"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
