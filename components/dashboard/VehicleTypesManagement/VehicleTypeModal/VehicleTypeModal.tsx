"use client";

import { useState, useEffect } from "react";
import { VehicleType } from "@/models/VehicleType";
import "./VehicleTypeModal.css";

interface VehicleTypeModalProps {
  vehicleType: VehicleType | null;
  onClose: () => void;
  onSave: (vehicleType: VehicleType) => void;
}

export default function VehicleTypeModal({
  vehicleType,
  onClose,
  onSave,
}: VehicleTypeModalProps) {
  const [formData, setFormData] = useState<Partial<VehicleType>>({
    name_ar: "",
    name_en: "",
    icon: null,
    base_fare: 0,
    price_per_km: 0,
    wait_time_seconds: 300,
    max_search_radius_km: 5,
    active: true,
    sort_order: 1,
    requires_subscription: false,
  });

  useEffect(() => {
    if (vehicleType) {
      setFormData(vehicleType);
    }
  }, [vehicleType]);

  const handleChange = (field: keyof VehicleType, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as VehicleType);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{vehicleType ? "تعديل نوع المركبة" : "إضافة نوع مركبة جديد"}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>الاسم بالعربية *</label>
              <input
                type="text"
                value={formData.name_ar}
                onChange={(e) => handleChange("name_ar", e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>الاسم بالإنجليزية *</label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => handleChange("name_en", e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>الأجرة الأساسية (ر.س) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.base_fare}
                onChange={(e) => handleChange("base_fare", parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label>السعر لكل كم (ر.س) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price_per_km}
                onChange={(e) => handleChange("price_per_km", parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label>وقت الانتظار (ثواني)</label>
              <input
                type="number"
                value={formData.wait_time_seconds}
                onChange={(e) => handleChange("wait_time_seconds", parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>نطاق البحث الأقصى (كم) *</label>
              <input
                type="number"
                step="0.1"
                value={formData.max_search_radius_km}
                onChange={(e) => handleChange("max_search_radius_km", parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label>ترتيب العرض</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => handleChange("sort_order", parseInt(e.target.value))}
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => handleChange("active", e.target.checked)}
                />
                <span>نشط</span>
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.requires_subscription}
                  onChange={(e) => handleChange("requires_subscription", e.target.checked)}
                />
                <span>يتطلب اشتراك</span>
              </label>
            </div>
          </div>

          {vehicleType && (
            <div className="stats-section">
              <h3>📊 إحصائيات النوع</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">المركبات المسجلة</span>
                  <span className="stat-value">{vehicleType.registered_vehicles || 0}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">السائقين النشطين</span>
                  <span className="stat-value">{vehicleType.active_drivers || 0}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">إجمالي الرحلات</span>
                  <span className="stat-value">{vehicleType.total_trips || 0}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">رحلات هذا الشهر</span>
                  <span className="stat-value">{vehicleType.monthly_trips || 0}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">متوسط السعر</span>
                  <span className="stat-value">{vehicleType.avg_trip_price || 0} ر.س</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">إجمالي الإيرادات</span>
                  <span className="stat-value">{vehicleType.total_revenue?.toLocaleString() || 0} ر.س</span>
                </div>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              إلغاء
            </button>
            <button type="submit" className="save-btn">
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
