"use client";

import { useState, useEffect } from "react";
import { Admin } from "@/models/Permission";
import CustomSelect from "@/components/shared/CustomSelect/CustomSelect";
import "./AdminModal.css";

interface AdminModalProps {
  admin: Admin | null;
  onClose: () => void;
  onSave: (admin: Partial<Admin>) => void;
}

export default function AdminModal({ admin, onClose, onSave }: AdminModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "moderator" as "super_admin" | "admin" | "moderator",
    status: "active" as "active" | "disabled",
  });

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        status: admin.status,
      });
    }
  }, [admin]);

  const roleOptions = [
    { value: "super_admin", label: "مدير عام", icon: "⭐" },
    { value: "admin", label: "مدير", icon: "👨‍💼" },
    { value: "moderator", label: "مشرف", icon: "👤" },
  ];

  const statusOptions = [
    { value: "active", label: "نشط", icon: "✅" },
    { value: "disabled", label: "معطل", icon: "🚫" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">
            {admin ? "✏️ تعديل مسؤول" : "➕ إضافة مسؤول جديد"}
          </h2>
          <button className="admin-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="admin-form">
              <div className="form-group">
                <label className="form-label">
                  <span>👤</span>
                  الاسم
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="أدخل الاسم الكامل"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
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
                  className="form-input"
                  placeholder="example@jollytaxi.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>📱</span>
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="01xxxxxxxxx"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>🎭</span>
                  الدور
                </label>
                <CustomSelect
                  options={roleOptions}
                  value={formData.role}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      role: value as "super_admin" | "admin" | "moderator",
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>📊</span>
                  الحالة
                </label>
                <CustomSelect
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as "active" | "disabled",
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={onClose}
            >
              إلغاء
            </button>
            <button type="submit" className="modal-btn modal-btn-save">
              {admin ? "حفظ التعديلات" : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
