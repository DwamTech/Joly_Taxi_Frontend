"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import "./NotificationTemplates.css";

interface Template {
  id: number;
  name: string;
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
  type: string;
}

interface NotificationTemplatesProps {
  templates: Template[];
  onAddTemplate: (template: Template) => void;
  onEditTemplate: (template: Template) => void;
  onDeleteTemplate: (id: number) => void;
  onUseTemplate: (template: Template) => void;
}

export default function NotificationTemplates({
  templates,
  onAddTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onUseTemplate,
}: NotificationTemplatesProps) {
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: number; name: string }>({
    show: false,
    id: 0,
    name: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    title_ar: "",
    title_en: "",
    body_ar: "",
    body_en: "",
    type: "info",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.title_ar || !formData.title_en || !formData.body_ar || !formData.body_en) {
      showToast("يرجى ملء جميع الحقول", "error");
      return;
    }

    const templateData: Template = {
      id: editingTemplate ? editingTemplate.id : Date.now(),
      ...formData,
    };

    if (editingTemplate) {
      onEditTemplate(templateData);
      showToast("تم تحديث القالب بنجاح", "success");
    } else {
      onAddTemplate(templateData);
      showToast("تم إضافة القالب بنجاح", "success");
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      title_ar: "",
      title_en: "",
      body_ar: "",
      body_en: "",
      type: "info",
    });
    setShowAddModal(false);
    setEditingTemplate(null);
  };

  const handleEdit = (template: Template) => {
    setFormData({
      name: template.name,
      title_ar: template.title_ar,
      title_en: template.title_en,
      body_ar: template.body_ar,
      body_en: template.body_en,
      type: template.type,
    });
    setEditingTemplate(template);
    setShowAddModal(true);
  };

  const handleDelete = (template: Template) => {
    setDeleteConfirm({ show: true, id: template.id, name: template.name });
  };

  const confirmDelete = () => {
    onDeleteTemplate(deleteConfirm.id);
    setDeleteConfirm({ show: false, id: 0, name: "" });
    showToast("تم حذف القالب بنجاح", "success");
  };

  const getTypeIcon = (type: string) => {
    const icons: any = {
      info: "ℹ️",
      warning: "⚠️",
      urgent: "🚨",
    };
    return icons[type] || "ℹ️";
  };

  return (
    <div className="notification-templates">
      <div className="templates-header">
        <h2>قوالب الإشعارات</h2>
        {/*<button className="add-template-btn" onClick={() => setShowAddModal(true)}>
          ➕ إضافة قالب جديد
        </button>*/}
      </div>

      <div className="templates-grid">
        {templates.map((template) => (
          <div key={template.id} className="template-card">
            <div className="template-header">
              <div className="template-icon">{getTypeIcon(template.type)}</div>
              <h3 className="template-name">{template.name}</h3>
            </div>
            <div className="template-content">
              <div className="template-title">
                <strong>العنوان:</strong> {template.title_ar}
              </div>
              <div className="template-body">{template.body_ar}</div>
            </div>
            <div className="template-actions">
              <button
                className="template-action-btn use-btn"
                onClick={() => onUseTemplate(template)}
              >
                استخدام
              </button>
              <button
                className="template-action-btn edit-btn"
                onClick={() => handleEdit(template)}
              >
                تعديل
              </button>
              {/*<button
                className="template-action-btn delete-btn"
                onClick={() => handleDelete(template)}
              >
                حذف
              </button>*/}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTemplate ? "تعديل القالب" : "إضافة قالب جديد"}</h3>
              <button className="modal-close" onClick={resetForm}>
                ×
              </button>
            </div>
            <form className="template-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">اسم القالب</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="مثال: ترحيب بمستخدم جديد"
                />
              </div>

              <div className="form-group">
                <label className="form-label">العنوان بالعربية</label>
                <input
                  type="text"
                  name="title_ar"
                  className="form-input"
                  value={formData.title_ar}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">العنوان بالإنجليزية</label>
                <input
                  type="text"
                  name="title_en"
                  className="form-input"
                  value={formData.title_en}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">النص بالعربية</label>
                <textarea
                  name="body_ar"
                  className="form-textarea"
                  value={formData.body_ar}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">النص بالإنجليزية</label>
                <textarea
                  name="body_en"
                  className="form-textarea"
                  value={formData.body_en}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">نوع الإشعار</label>
                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="info">معلومة</option>
                  <option value="warning">تحذير</option>
                  <option value="urgent">عاجل</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingTemplate ? "تحديث" : "إضافة"}
                </button>
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm.show && (
        <ConfirmDialog
          title="تأكيد الحذف"
          message={`هل أنت متأكد من حذف القالب "${deleteConfirm.name}"؟`}
          confirmText="حذف"
          cancelText="إلغاء"
          type="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm({ show: false, id: 0, name: "" })}
        />
      )}
    </div>
  );
}
