"use client";

import { useState, useEffect, useCallback } from "react";
import PermissionsHero from "../PermissionsHero/PermissionsHero";
import PermissionsFilters, { FilterValues } from "../PermissionsFilters/PermissionsFilters";
import AdminsTable from "../AdminsTable/AdminsTable";
import AdminModal from "../AdminModal/AdminModal";
import RolePermissionsModal from "../RolePermissionsModal/RolePermissionsModal";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import { useToast } from "@/components/Toast/ToastContainer";
import { PermissionsService } from "@/services/permissionsService";
import { AdminApi, AdminListPagination } from "@/models/Permission";
import "./PermissionsManagementContent.css";

const DEFAULT_PAGINATION: AdminListPagination = {
  current_page: 1,
  last_page: 1,
  per_page: 20,
  total: 0,
};

export default function PermissionsManagementContent() {
  const [admins, setAdmins] = useState<AdminApi[]>([]);
  const [pagination, setPagination] = useState<AdminListPagination>(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<FilterValues>({ search: "", email: "", role: "all", status: "all" });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedAdmin, setSelectedAdmin] = useState<AdminApi | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [adminForPermissions, setAdminForPermissions] = useState<AdminApi | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<AdminApi | null>(null);
  const { showToast } = useToast();

  const fetchAdmins = useCallback(async (page: number, f: FilterValues) => {
    setLoading(true);
    setError(null);
    try {
      const result = await PermissionsService.getAdmins({
        search:   f.search   || undefined,
        email:    f.email    || undefined,
        role:     f.role     !== "all" ? f.role   : undefined,
        status:   f.status   !== "all" ? f.status : undefined,
        page,
        per_page: 20,
      });
      setAdmins(result.admins);
      setPagination(result.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins(currentPage, filters);
  }, [currentPage, filters, fetchAdmins]);

  const handleFilterChange = (f: FilterValues) => {
    setFilters(f);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const handleSavePermissions = (updatedAdmin: AdminApi) => {
    setAdmins((prev) => prev.map((a) => a.id === updatedAdmin.id ? updatedAdmin : a));
    showToast(`تم تحديث صلاحيات "${updatedAdmin.name}" بنجاح`, "success");
    setShowPermissionsModal(false);
    setAdminForPermissions(null);
  };

  const handleSaveAdmin = (updatedAdmin: AdminApi) => {
    if (selectedAdmin) {
      setAdmins((prev) => prev.map((a) => a.id === updatedAdmin.id ? updatedAdmin : a));
      showToast("تم تحديث بيانات المسؤول بنجاح", "success");
    } else {
      setAdmins((prev) => [updatedAdmin, ...prev]);
      setPagination((prev) => ({ ...prev, total: prev.total + 1 }));
      showToast("تم إضافة المسؤول بنجاح", "success");
    }
    setShowModal(false);
  };

  const handleToggleStatus = async (admin: AdminApi) => {
    const newStatus: "active" | "inactive" = admin.status === "active" ? "inactive" : "active";
    setAdmins((prev) => prev.map((a) => a.id === admin.id ? { ...a, status: newStatus } : a));
    try {
      await PermissionsService.updateAdminStatus(admin.id, newStatus);
      showToast(`تم ${newStatus === "active" ? "تفعيل" : "تعطيل"} المسؤول بنجاح`, "success");
    } catch (err: any) {
      setAdmins((prev) => prev.map((a) => a.id === admin.id ? { ...a, status: admin.status } : a));
      showToast(err.message || "فشل تحديث الحالة", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!adminToDelete) return;
    try {
      await PermissionsService.deleteAdmin(adminToDelete.id);
      setAdmins((prev) => prev.filter((a) => a.id !== adminToDelete.id));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      showToast("تم حذف المسؤول بنجاح", "success");
    } catch (err: any) {
      showToast(err.message || "فشل حذف المسؤول", "error");
    } finally {
      setShowDeleteDialog(false);
      setAdminToDelete(null);
    }
  };

  // Stats from current page + pagination total
  const activeAdmins   = admins.filter((a) => a.status === "active").length;
  const disabledAdmins = admins.filter((a) => a.status === "disabled").length;
  const superAdmins    = admins.filter((a) => a.role === "super_admin").length;

  return (
    <div className="permissions-management-content">
      <PermissionsHero
        totalAdmins={pagination.total}
        activeAdmins={activeAdmins}
        disabledAdmins={disabledAdmins}
        superAdmins={superAdmins}
      />

      <div className="permissions-content-wrapper">
        <div className="permissions-actions">
          <button className="add-admin-btn" onClick={() => { setSelectedAdmin(null); setShowModal(true); }}>
            ➕ إضافة مسؤول جديد
          </button>
        </div>

        <PermissionsFilters
          onFilterChange={handleFilterChange}
          resultsCount={pagination.total}
        />

        {loading && (
          <div className="permissions-loading">
            <div className="loading-spinner" />
            <span>جاري التحميل...</span>
          </div>
        )}

        {error && !loading && (
          <div className="permissions-error">
            ⚠️ {error}
            <button onClick={() => fetchAdmins(currentPage, filters)}>إعادة المحاولة</button>
          </div>
        )}

        {!loading && !error && (
          <AdminsTable
            admins={admins}
            pagination={pagination}
            onPageChange={handlePageChange}
            onEdit={(admin) => { setSelectedAdmin(admin); setShowModal(true); }}
            onToggleStatus={handleToggleStatus}
            onDelete={(admin) => { setAdminToDelete(admin); setShowDeleteDialog(true); }}
            onViewPermissions={(admin) => { setAdminForPermissions(admin); setShowPermissionsModal(true); }}
          />
        )}
      </div>

      {showModal && (
        <AdminModal
          admin={selectedAdmin as any}
          onClose={() => setShowModal(false)}
          onSave={handleSaveAdmin as any}
        />
      )}

      {showPermissionsModal && (
        <RolePermissionsModal
          admin={adminForPermissions as any}
          onClose={() => { setShowPermissionsModal(false); setAdminForPermissions(null); }}
          onSave={handleSavePermissions}
        />
      )}

      {showDeleteDialog && (
        <ConfirmDialog
          title="تأكيد الحذف"
          message={`هل أنت متأكد من حذف المسؤول "${adminToDelete?.name}"؟`}
          confirmText="حذف"
          cancelText="إلغاء"
          onConfirm={handleConfirmDelete}
          onCancel={() => { setShowDeleteDialog(false); setAdminToDelete(null); }}
        />
      )}
    </div>
  );
}
