"use client";

import { useState } from "react";
import PermissionsHero from "../PermissionsHero/PermissionsHero";
import PermissionsFilters, {
  FilterValues,
} from "../PermissionsFilters/PermissionsFilters";
import AdminsTable from "../AdminsTable/AdminsTable";
import AdminModal from "../AdminModal/AdminModal";
import RolePermissionsModal from "../RolePermissionsModal/RolePermissionsModal";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import { useToast } from "@/components/Toast/ToastContainer";
import permissionsData from "@/data/permissions/permissions-data.json";
import { Admin } from "@/models/Permission";
import "./PermissionsManagementContent.css";

export default function PermissionsManagementContent() {
  const [admins, setAdmins] = useState<Admin[]>(permissionsData.admins as Admin[]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>(
    permissionsData.admins as Admin[]
  );
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [adminForPermissions, setAdminForPermissions] = useState<Admin | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const { showToast } = useToast();

  const handleFilterChange = (filters: FilterValues) => {
    let filtered = [...admins];

    if (filters.search) {
      filtered = filtered.filter((admin) =>
        admin.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.email) {
      filtered = filtered.filter((admin) =>
        admin.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }

    if (filters.role !== "all") {
      filtered = filtered.filter((admin) => admin.role === filters.role);
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((admin) => admin.status === filters.status);
    }

    setFilteredAdmins(filtered);
  };

  const handleAddAdmin = () => {
    setSelectedAdmin(null);
    setShowModal(true);
  };

  const handleEditAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowModal(true);
  };

  const handleViewPermissions = (admin: Admin) => {
    setAdminForPermissions(admin);
    setShowPermissionsModal(true);
  };

  const handleSavePermissions = (role: string, permissions: Record<string, boolean>) => {
    // Here you would typically save to backend/database
    // For now, we'll just show a success message
    showToast(`تم تحديث صلاحيات دور "${getRoleLabel(role)}" بنجاح`, "success");
    console.log("Updated permissions for role:", role, permissions);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin":
        return "مدير عام";
      case "admin":
        return "مدير";
      case "moderator":
        return "مشرف";
      default:
        return role;
    }
  };

  const handleSaveAdmin = (adminData: Partial<Admin>) => {
    if (selectedAdmin) {
      // Edit existing admin
      const updatedAdmins = admins.map((admin) =>
        admin.id === selectedAdmin.id ? { ...admin, ...adminData } : admin
      );
      setAdmins(updatedAdmins);
      setFilteredAdmins(updatedAdmins);
      showToast("تم تحديث بيانات المسؤول بنجاح", "success");
    } else {
      // Add new admin
      const newAdmin: Admin = {
        id: String(admins.length + 1),
        name: adminData.name!,
        email: adminData.email!,
        phone: adminData.phone!,
        role: adminData.role!,
        status: adminData.status!,
        created_at: new Date().toISOString().split("T")[0],
        last_login: "-",
      };
      const updatedAdmins = [...admins, newAdmin];
      setAdmins(updatedAdmins);
      setFilteredAdmins(updatedAdmins);
      showToast("تم إضافة المسؤول بنجاح", "success");
    }
    setShowModal(false);
  };

  const handleToggleStatus = (admin: Admin) => {
    const newStatus = admin.status === "active" ? "disabled" : "active";
    const updatedAdmins = admins.map((a) =>
      a.id === admin.id ? { ...a, status: newStatus } : a
    );
    setAdmins(updatedAdmins as Admin[]);
    setFilteredAdmins(updatedAdmins as Admin[]);
    showToast(
      `تم ${newStatus === "active" ? "تفعيل" : "تعطيل"} المسؤول بنجاح`,
      "success"
    );
  };

  const handleDeleteClick = (admin: Admin) => {
    setAdminToDelete(admin);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (adminToDelete) {
      const updatedAdmins = admins.filter((a) => a.id !== adminToDelete.id);
      setAdmins(updatedAdmins);
      setFilteredAdmins(updatedAdmins);
      showToast("تم حذف المسؤول بنجاح", "success");
      setShowDeleteDialog(false);
      setAdminToDelete(null);
    }
  };

  const stats = {
    total_admins: admins.length,
    active_admins: admins.filter((a) => a.status === "active").length,
    disabled_admins: admins.filter((a) => a.status === "disabled").length,
    super_admins: admins.filter((a) => a.role === "super_admin").length,
  };

  return (
    <div className="permissions-management-content">
      <PermissionsHero
        totalAdmins={stats.total_admins}
        activeAdmins={stats.active_admins}
        disabledAdmins={stats.disabled_admins}
        superAdmins={stats.super_admins}
      />

      <div className="permissions-content-wrapper">
        <div className="permissions-actions">
          <button className="add-admin-btn" onClick={handleAddAdmin}>
            ➕ إضافة مسؤول جديد
          </button>
        </div>

        <PermissionsFilters
          onFilterChange={handleFilterChange}
          resultsCount={filteredAdmins.length}
        />

        <AdminsTable
          admins={filteredAdmins}
          onEdit={handleEditAdmin}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteClick}
          onViewPermissions={handleViewPermissions}
        />
      </div>

      {showModal && (
        <AdminModal
          admin={selectedAdmin}
          onClose={() => setShowModal(false)}
          onSave={handleSaveAdmin}
        />
      )}

      {showPermissionsModal && (
        <RolePermissionsModal
          admin={adminForPermissions}
          onClose={() => {
            setShowPermissionsModal(false);
            setAdminForPermissions(null);
          }}
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
          onCancel={() => {
            setShowDeleteDialog(false);
            setAdminToDelete(null);
          }}
        />
      )}
    </div>
  );
}
