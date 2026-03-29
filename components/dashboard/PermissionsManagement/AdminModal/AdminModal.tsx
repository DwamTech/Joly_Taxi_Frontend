"use client";

import { useState, useEffect } from "react";
import { AdminApi } from "@/models/Permission";
import { PermissionsService } from "@/services/permissionsService";
import CustomSelect from "@/components/shared/CustomSelect/CustomSelect";
import "./AdminModal.css";

interface AdminModalProps {
  admin: AdminApi | null;
  onClose: () => void;
  onSave: (admin: AdminApi) => void;
}

export default function AdminModal({ admin, onClose, onSave }: AdminModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "moderator" as "super_admin" | "admin" | "moderator",
    password: "",
  });  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name,
        email: admin.email,
        phone: admin.phone ?? "",
        role: admin.role,
        password: "",
      });
    }
  }, [admin]);

  const roleOptions = [
    { value: "super_admin", label: "مدير عام", icon: "⭐" },
    { value: "admin",       label: "مدير",     icon: "👨‍💼" },
    { value: "moderator",   label: "مشرف",     icon: "👤" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let result: AdminApi;
      if (admin) {
        result = await PermissionsService.updateAdmin(admin.id, {
          name:  formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          role:  formData.role,
        });
      } else {
        result = await PermissionsService.createAdmin({
          name:     formData.name,
          email:    formData.email,
          phone:    formData.phone || undefined,
          role:     formData.role,
          password: formData.password,
        });
      }
      onSave(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">
            {admin ? "✏️ تعديل مسؤول" : "➕ إضافة مسؤول جديد"}
          </h2>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            {error && <div className="admin-modal-error">⚠️ {error}</div>}

            <div className="admin-form">
              <div className="form-group">
                <label className="form-label"><span>👤</span>الاسم</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="أدخل الاسم الكامل"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label"><span>📧</span>البريد الإلكتروني</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="example@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label"><span>📱</span>رقم الهاتف</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="01xxxxxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label"><span>🎭</span>الدور</label>
                <CustomSelect
                  options={roleOptions}
                  value={formData.role}
                  onChange={(value) =>
                    setFormData({ ...formData, role: value as "super_admin" | "admin" | "moderator" })
                  }
                />
              </div>

              {!admin && (
                <div className="form-group">
                  <label className="form-label"><span>🔒</span>كلمة المرور</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="أدخل كلمة المرور"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div className="admin-modal-footer">
            <button type="button" className="modal-btn modal-btn-cancel" onClick={onClose}>
              إلغاء
            </button>
            <button type="submit" className="modal-btn modal-btn-save" disabled={saving}>
              {saving ? "جاري الحفظ..." : admin ? "حفظ التعديلات" : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
