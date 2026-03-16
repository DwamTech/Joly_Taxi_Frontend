"use client";

import { useState, useEffect } from "react";
import { RatingTagManagement } from "@/models/Rating";
import { getAllRatingTags, toggleRatingTagStatus, forceDeleteRatingTag, createRatingTag, CreateRatingTagRequest, updateRatingTag, UpdateRatingTagRequest } from "@/services/ratingTagsService";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import Toast from "@/components/Toast/Toast";
import Pagination from "@/components/Pagination/Pagination";
import TagDetailsModal from "../TagDetailsModal/TagDetailsModal";
import TagsFilters, { TagFilterValues } from "../TagsFilters/TagsFilters";
import "./TagsManagement.css";

interface ExtendedRatingTag extends RatingTagManagement {
  created_at?: string;
  updated_at?: string;
  label?: string;
}

interface TagFormData {
  id?: number;
  label_ar: string;
  label_en: string;
  applies_to: "driver" | "both" | "rider";
  min_stars: number;
  max_stars: number;
  is_positive: boolean;
  is_active: boolean;
}

export default function TagsManagement() {
  const [tags, setTags] = useState<ExtendedRatingTag[]>([]);
  const [filteredTags, setFilteredTags] = useState<ExtendedRatingTag[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<TagFormData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: number; label: string }>({
    show: false,
    id: 0,
    label: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;
  const [formData, setFormData] = useState<TagFormData>({
    label_ar: "",
    label_en: "",
    applies_to: "both",
    min_stars: 1,
    max_stars: 5,
    is_positive: true,
    is_active: true,
  });

  // جلب البيانات من الـ API
  const fetchTags = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      const tagsData = await getAllRatingTags();
      setTags(tagsData);
      setFilteredTags(tagsData);
      
      // حساب معلومات الصفحات
      setTotalItems(tagsData.length);
      setTotalPages(Math.ceil(tagsData.length / itemsPerPage));
      
    } catch (err: any) {
      console.error('Error fetching tags:', err);
      setError(err.message || 'فشل في جلب وسوم التقييمات');
    } finally {
      setInitialLoading(false);
    }
  };

  // تطبيق الفلاتر
  const applyFilters = (filters: TagFilterValues) => {
    let filtered = [...tags];

    // فلتر البحث
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(tag => 
        tag.label_ar.toLowerCase().includes(searchTerm) ||
        tag.label_en.toLowerCase().includes(searchTerm)
      );
    }

    // فلتر ينطبق على
    if (filters.appliesTo !== "all") {
      filtered = filtered.filter(tag => {
        if (filters.appliesTo === "both") {
          return tag.applies_to === "both";
        }
        return tag.applies_to === filters.appliesTo;
      });
    }

    // فلتر النوع
    if (filters.type !== "all") {
      filtered = filtered.filter(tag => {
        if (filters.type === "positive") {
          return tag.is_positive === true;
        } else if (filters.type === "negative") {
          return tag.is_positive === false;
        }
        return true;
      });
    }

    // فلتر الحالة
    if (filters.status !== "all") {
      filtered = filtered.filter(tag => {
        if (filters.status === "active") {
          return tag.is_active === true;
        } else if (filters.status === "inactive") {
          return tag.is_active === false;
        }
        return true;
      });
    }

    // فلتر نطاق النجوم
    if (filters.starsRange !== "all") {
      filtered = filtered.filter(tag => {
        const range = filters.starsRange;
        if (range === "1") return tag.min_stars <= 1 && tag.max_stars >= 1;
        if (range === "2") return tag.min_stars <= 2 && tag.max_stars >= 2;
        if (range === "3") return tag.min_stars <= 3 && tag.max_stars >= 3;
        if (range === "4") return tag.min_stars <= 4 && tag.max_stars >= 4;
        if (range === "5") return tag.min_stars <= 5 && tag.max_stars >= 5;
        if (range === "1-2") return tag.min_stars <= 2 && tag.max_stars >= 1;
        if (range === "3-4") return tag.min_stars <= 4 && tag.max_stars >= 3;
        if (range === "4-5") return tag.min_stars <= 5 && tag.max_stars >= 4;
        return true;
      });
    }

    // الترتيب
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "oldest":
          return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
        case "name_ar":
          return a.label_ar.localeCompare(b.label_ar, 'ar');
        case "name_en":
          return a.label_en.localeCompare(b.label_en, 'en');
        case "stars_asc":
          return a.min_stars - b.min_stars;
        case "stars_desc":
          return b.max_stars - a.max_stars;
        case "newest":
        default:
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
    });

    setFilteredTags(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // إعادة تعيين الصفحة للأولى عند تطبيق فلاتر جديدة
  };

  // معالج تغيير الفلاتر
  const handleFilterChange = (filters: TagFilterValues) => {
    applyFilters(filters);
  };

  // الحصول على البيانات للصفحة الحالية
  const getCurrentPageTags = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTags.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const getAppliesTo = (type: string) => {
    const labels: Record<string, string> = {
      driver: "سائق",
      rider: "راكب",
      both: "كلاهما",
    };
    return labels[type] || type;
  };

  const handleAddTag = () => {
    setEditingTag(null);
    setFormData({
      label_ar: "",
      label_en: "",
      applies_to: "both",
      min_stars: 1,
      max_stars: 5,
      is_positive: true,
      is_active: true,
    });
    setShowModal(true);
  };

  const handleViewDetails = (tagId: number) => {
    setSelectedTagId(tagId);
  };

  const handleEditTag = (tag: ExtendedRatingTag) => {
    setEditingTag({
      id: tag.id,
      label_ar: tag.label_ar,
      label_en: tag.label_en,
      applies_to: tag.applies_to,
      min_stars: tag.min_stars,
      max_stars: tag.max_stars,
      is_positive: tag.is_positive,
      is_active: tag.is_active,
    });
    setFormData({
      id: tag.id,
      label_ar: tag.label_ar,
      label_en: tag.label_en,
      applies_to: tag.applies_to,
      min_stars: tag.min_stars,
      max_stars: tag.max_stars,
      is_positive: tag.is_positive,
      is_active: tag.is_active,
    });
    setShowModal(true);
  };

  const handleToggleActive = async (id: number) => {
    try {
      setLoading(true);
      const message = await toggleRatingTagStatus(id);
      
      // إعادة تحميل البيانات للحصول على أحدث حالة
      await fetchTags();
      
      // إظهار رسالة نجاح
      setToast({
        message: `✅ ${message}`,
        type: 'success'
      });
      
    } catch (error: any) {
      console.error('Error toggling tag status:', error);
      setToast({
        message: `❌ ${error.message || 'فشل في تغيير حالة الوسم'}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number, label: string) => {
    setDeleteConfirm({ show: true, id, label });
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const message = await forceDeleteRatingTag(deleteConfirm.id);
      
      // إعادة تحميل البيانات للحصول على أحدث حالة
      await fetchTags();
      
      // إظهار رسالة نجاح
      setToast({
        message: `✅ ${message}`,
        type: 'success'
      });
      
      setDeleteConfirm({ show: false, id: 0, label: "" });
      
    } catch (error: any) {
      console.error('Error deleting tag:', error);
      setToast({
        message: `❌ ${error.message || 'فشل في حذف الوسم'}`,
        type: 'error'
      });
      setDeleteConfirm({ show: false, id: 0, label: "" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (editingTag) {
        // تعديل وسم موجود عبر API
        const updateData: UpdateRatingTagRequest = {
          label_ar: formData.label_ar,
          label_en: formData.label_en,
          applicable_to: formData.applies_to,
          min_stars: formData.min_stars,
          max_stars: formData.max_stars,
          is_positive: formData.is_positive,
          active: formData.is_active,
        };
        
        const updatedTag = await updateRatingTag(editingTag.id!, updateData);
        
        // إعادة تحميل البيانات للحصول على أحدث حالة
        await fetchTags();
        
        // إعادة تطبيق الفلاتر الحالية
        const savedFiltersAfterUpdate = localStorage.getItem("tagsFilters");
        if (savedFiltersAfterUpdate) {
          try {
            const parsed = JSON.parse(savedFiltersAfterUpdate);
            applyFilters(parsed);
          } catch (error) {
            console.error("Error applying filters after update:", error);
          }
        }
        
        setToast({
          message: '✅ تم تحديث الوسم بنجاح',
          type: 'success'
        });
      } else {
        // إضافة وسم جديد عبر API
        const newTagData: CreateRatingTagRequest = {
          label_ar: formData.label_ar,
          label_en: formData.label_en,
          applicable_to: formData.applies_to,
          min_stars: formData.min_stars,
          max_stars: formData.max_stars,
          is_positive: formData.is_positive,
          active: formData.is_active,
        };
        
        const createdTag = await createRatingTag(newTagData);
        
        // إعادة تحميل البيانات للحصول على أحدث حالة
        await fetchTags();
        
        // إعادة تطبيق الفلاتر الحالية
        const savedFiltersAfterCreate = localStorage.getItem("tagsFilters");
        if (savedFiltersAfterCreate) {
          try {
            const parsed = JSON.parse(savedFiltersAfterCreate);
            applyFilters(parsed);
          } catch (error) {
            console.error("Error applying filters after create:", error);
          }
        }
        
        setToast({
          message: '✅ تم إنشاء الوسم بنجاح',
          type: 'success'
        });
      }
      
      setShowModal(false);
      
    } catch (error: any) {
      console.error('Error saving tag:', error);
      setToast({
        message: `❌ ${error.message || 'فشل في حفظ الوسم'}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="tags-management">
        <div className="tags-header">
          <h2 className="tags-title"> إدارة وسوم التقييمات</h2>
          <button className="btn-add-tag" onClick={handleAddTag}>
            + إضافة وسم جديد
          </button>
        </div>

        {initialLoading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>جاري تحميل الوسوم...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchTags}>
              إعادة المحاولة
            </button>
          </div>
        )}

        {!initialLoading && !error && (
          <>
            {/* إضافة مكون الفلاتر */}
            <TagsFilters
              onFilterChange={handleFilterChange}
              resultsCount={filteredTags.length}
            />

            <div className="tags-table-container">
              <table className="tags-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>النص بالعربية</th>
                    <th>النص بالإنجليزية</th>
                    <th>ينطبق على</th>
                    <th>النجوم</th>
                    <th>النوع</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageTags().map((tag) => (
                    <tr key={tag.id}>
                      <td className="tag-id">#{tag.id}</td>
                      <td className="tag-label">{tag.label_ar}</td>
                      <td className="tag-label-en">{tag.label_en}</td>
                      <td>
                        <span className={`applies-badge ${tag.applies_to}`}>
                          {getAppliesTo(tag.applies_to)}
                        </span>
                      </td>
                      <td className="stars-range">
                        {tag.min_stars} - {tag.max_stars} ⭐
                      </td>
                      <td>
                        <span className={`type-badge ${tag.is_positive ? "positive" : "negative"}`}>
                          {tag.is_positive ? "إيجابي" : "سلبي"}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${tag.is_active ? "active" : "inactive"}`}>
                          {tag.is_active ? "نشط" : "غير نشط"}
                        </span>
                      </td>
                      <td>
                        <div className="tag-actions">
                          <button 
                            className="tag-action-btn view" 
                            title="عرض التفاصيل"
                            onClick={() => handleViewDetails(tag.id)}
                          >
                            📄
                          </button>
                          <button 
                            className="tag-action-btn edit" 
                            title="تعديل"
                            onClick={() => handleEditTag(tag)}
                          >
                            ✏️
                          </button>
                          <button 
                            className={`tag-action-btn toggle ${tag.is_active ? 'active' : 'inactive'}`}
                            title={loading ? "جاري التحديث..." : (tag.is_active ? "تعطيل الوسم" : "تفعيل الوسم")}
                            onClick={() => handleToggleActive(tag.id)}
                            disabled={loading}
                          >
                            {loading ? "⏳" : (tag.is_active ? "⏸️" : "▶️")}
                          </button>
                          <button 
                            className="tag-action-btn delete" 
                            title={loading ? "جاري الحذف..." : "حذف نهائي"}
                            onClick={() => handleDeleteClick(tag.id, tag.label_ar)}
                            disabled={loading}
                          >
                            {loading ? (
                              <span style={{ color: '#fff', fontSize: '14px' }}>⏳</span>
                            ) : (
                              <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>✕</span>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTags.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">📭</span>
                  <p>لا توجد وسوم</p>
                </div>
              )}
            </div>

            {/* Card View for Mobile */}
            <div className="tags-cards-container">
              {getCurrentPageTags().map((tag) => (
                <div key={tag.id} className="tag-card">
                  <div className="tag-card-header">
                    <div className="tag-card-id">#{tag.id}</div>
                    <div className="tag-card-status">
                      <span className={`status-badge ${tag.is_active ? "active" : "inactive"}`}>
                        {tag.is_active ? "نشط" : "غير نشط"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="tag-card-content">
                    <div className="tag-card-labels">
                      <div className="tag-label-ar">{tag.label_ar}</div>
                      <div className="tag-label-en">{tag.label_en}</div>
                    </div>
                    
                    <div className="tag-card-details">
                      <div className="tag-detail-item">
                        <span className="detail-label">ينطبق على:</span>
                        <span className={`applies-badge ${tag.applies_to}`}>
                          {getAppliesTo(tag.applies_to)}
                        </span>
                      </div>
                      
                      <div className="tag-detail-item">
                        <span className="detail-label">النجوم:</span>
                        <span className="stars-range">{tag.min_stars} - {tag.max_stars} ⭐</span>
                      </div>
                      
                      <div className="tag-detail-item">
                        <span className="detail-label">النوع:</span>
                        <span className={`type-badge ${tag.is_positive ? "positive" : "negative"}`}>
                          {tag.is_positive ? "إيجابي" : "سلبي"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="tag-card-actions">
                    <button 
                      className="tag-action-btn view" 
                      title="عرض التفاصيل"
                      onClick={() => handleViewDetails(tag.id)}
                    >
                      📄
                    </button>
                    <button 
                      className="tag-action-btn edit" 
                      title="تعديل"
                      onClick={() => handleEditTag(tag)}
                    >
                      ✏️
                    </button>
                    <button 
                      className={`tag-action-btn toggle ${tag.is_active ? 'active' : 'inactive'}`}
                      title={loading ? "جاري التحديث..." : (tag.is_active ? "تعطيل الوسم" : "تفعيل الوسم")}
                      onClick={() => handleToggleActive(tag.id)}
                      disabled={loading}
                    >
                      {loading ? "⏳" : (tag.is_active ? "⏸️" : "▶️")}
                    </button>
                    <button 
                      className="tag-action-btn delete" 
                      title={loading ? "جاري الحذف..." : "حذف نهائي"}
                      onClick={() => handleDeleteClick(tag.id, tag.label_ar)}
                      disabled={loading}
                    >
                      {loading ? (
                        <span style={{ color: '#fff', fontSize: '14px' }}>⏳</span>
                      ) : (
                        <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>✕</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {filteredTags.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">📭</span>
                  <p>لا توجد وسوم</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />
            )}
          </>
        )}
      </div>

      {/* Modal لإضافة/تعديل وسم */}
      {showModal && (
        <div className="tag-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="tag-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tag-modal-header">
              <h3>{editingTag ? "تعديل وسم" : "إضافة وسم جديد"}</h3>
              <button className="tag-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="tag-form">
              <div className="form-row">
                <div className="form-group">
                  <label>النص بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={formData.label_ar}
                    onChange={(e) => setFormData({ ...formData, label_ar: e.target.value })}
                    placeholder="مثال: خدمة ممتازة"
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>النص بالإنجليزية *</label>
                  <input
                    type="text"
                    required
                    value={formData.label_en}
                    onChange={(e) => setFormData({ ...formData, label_en: e.target.value })}
                    placeholder="Example: Excellent Service"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ينطبق على *</label>
                  <select
                    value={formData.applies_to}
                    onChange={(e) => setFormData({ ...formData, applies_to: e.target.value as "driver" | "both" | "rider" })}
                    disabled={loading}
                  >
                    <option value="both">كلاهما</option>
                    <option value="driver">سائق</option>
                    <option value="rider">راكب</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>النوع *</label>
                  <select
                    value={formData.is_positive ? "positive" : "negative"}
                    onChange={(e) => setFormData({ ...formData, is_positive: e.target.value === "positive" })}
                    disabled={loading}
                  >
                    <option value="positive">إيجابي</option>
                    <option value="negative">سلبي</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>الحد الأدنى للنجوم *</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    required
                    value={formData.min_stars}
                    onChange={(e) => setFormData({ ...formData, min_stars: parseInt(e.target.value) })}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>الحد الأقصى للنجوم *</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    required
                    value={formData.max_stars}
                    onChange={(e) => setFormData({ ...formData, max_stars: parseInt(e.target.value) })}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    disabled={loading}
                  />
                  <span>نشط</span>
                </label>
              </div>

              <div className="tag-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)} disabled={loading}>
                  إلغاء
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span>⏳</span>
                      {editingTag ? "جاري الحفظ..." : "جاري الإنشاء..."}
                    </>
                  ) : (
                    editingTag ? "حفظ التعديلات" : "إضافة الوسم"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog تأكيد الحذف */}
      {deleteConfirm.show && (
        <ConfirmDialog
          title="تأكيد الحذف النهائي"
          message={
            `هل أنت متأكد من حذف الوسم "${deleteConfirm.label}" نهائياً؟\n\n` +
            `⚠️ تحذير: هذا حذف نهائي ولا يمكن التراجع عنه!\n\n` +
            `سيتم حذف الوسم من النظام بالكامل وإزالة جميع الارتباطات المتعلقة به.\n` +
            `هذا الإجراء لا يمكن استرداده.`
          }
          confirmText="حذف نهائياً"
          cancelText="إلغاء"
          type="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm({ show: false, id: 0, label: "" })}
        />
      )}

      {/* نافذة تفاصيل الوسم */}
      {selectedTagId && (
        <TagDetailsModal
          tagId={selectedTagId}
          onClose={() => setSelectedTagId(null)}
        />
      )}

      {/* Toast للرسائل */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}