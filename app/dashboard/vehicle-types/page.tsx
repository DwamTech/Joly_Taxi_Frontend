"use client";

import { useState, useEffect } from "react";
import VehicleTypesHero from "@/components/dashboard/VehicleTypesManagement/VehicleTypesHero/VehicleTypesHero";
import VehicleTypesTable from "@/components/dashboard/VehicleTypesManagement/VehicleTypesTable/VehicleTypesTable";
import VehicleTypeModal from "@/components/dashboard/VehicleTypesManagement/VehicleTypeModal/VehicleTypeModal";
import Toast, { ToastType } from "@/components/Toast/Toast";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import { VehicleType } from "@/models/VehicleType";
import {
  changeAdminVehicleTypesOrder,
  createAdminVehicleType,
  getAdminVehicleTypeById,
  getAdminVehicleTypes,
  toggleAdminVehicleTypeActive,
  updateAdminVehicleType,
} from "@/services/vehicleTypesService";
import "./vehicle-types.css";

interface ToastState {
  show: boolean;
  message: string;
  type: ToastType;
}

interface ConfirmState {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

export default function VehicleTypesPage() {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [filteredVehicleTypes, setFilteredVehicleTypes] = useState<VehicleType[]>([]);
  const [acFilter, setAcFilter] = useState<"all" | "ac" | "non-ac">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | null>(null);
  const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "success" });
  const [confirm, setConfirm] = useState<ConfirmState>({
    show: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Apply filter whenever vehicleTypes or acFilter changes
  const applyFilter = () => {
    if (acFilter === "all") {
      setFilteredVehicleTypes(vehicleTypes);
    } else if (acFilter === "ac") {
      setFilteredVehicleTypes(vehicleTypes.filter(vt => vt.has_ac));
    } else {
      setFilteredVehicleTypes(vehicleTypes.filter(vt => !vt.has_ac));
    }
  };

  // Load data from API
  useEffect(() => {
    const load = async () => {
      try {
        const types = await getAdminVehicleTypes();
        setVehicleTypes(types);
        setFilteredVehicleTypes(types);
      } catch (error: any) {
        setToast({ show: true, message: error?.message || "فشل في جلب أنواع المركبات", type: "error" });
      }
    };
    load();
  }, []);
  
  // Re-apply filter when data or filter changes
  useEffect(() => {
    applyFilter();
  }, [vehicleTypes, acFilter]);

  const handleFilterChange = (filter: "all" | "ac" | "non-ac") => {
    setAcFilter(filter);
    if (filter === "all") {
      setFilteredVehicleTypes(vehicleTypes);
    } else if (filter === "ac") {
      setFilteredVehicleTypes(vehicleTypes.filter(vt => vt.has_ac));
    } else {
      setFilteredVehicleTypes(vehicleTypes.filter(vt => !vt.has_ac));
    }
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
  };

  const handleAddNew = () => {
    setSelectedVehicleType(null);
    setIsModalOpen(true);
  };

  const handleEdit = async (vehicleType: VehicleType) => {
    setSelectedVehicleType(vehicleType);
    setIsModalOpen(true);
    try {
      const details = await getAdminVehicleTypeById(vehicleType.id);
      setSelectedVehicleType(details);
    } catch (error: any) {
      showToast(error?.message || "فشل في جلب تفاصيل نوع المركبة", "error");
    }
  };

  const handleDelete = (id: number) => {
    const vehicleType = vehicleTypes.find((vt) => vt.id === id);
    setConfirm({
      show: true,
      title: "تأكيد الحذف",
      message: `هل أنت متأكد من حذف "${vehicleType?.name_ar}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      onConfirm: () => {
        const updatedTypes = vehicleTypes.filter((vt) => vt.id !== id);
        setVehicleTypes(updatedTypes);
        handleFilterChange(acFilter); // Re-apply filter
        setConfirm({ ...confirm, show: false });
        showToast("تم حذف نوع المركبة بنجاح", "success");
      },
    });
  };

  const handleToggleActive = async (id: number) => {
    const vehicleType = vehicleTypes.find((vt) => vt.id === id);
    try {
      await toggleAdminVehicleTypeActive(id);
      const refreshed = await getAdminVehicleTypes();
      setVehicleTypes(refreshed);
      handleFilterChange(acFilter);
      showToast(
        `تم ${vehicleType?.active ? "تعطيل" : "تفعيل"} "${vehicleType?.name_ar}" بنجاح`,
        "success"
      );
    } catch (error: any) {
      showToast(error?.message || "فشل في تغيير حالة نوع المركبة", "error");
    }
  };

  const handleReorder = async (reorderedTypes: VehicleType[]) => {
    setVehicleTypes(reorderedTypes);
    handleFilterChange(acFilter);
    try {
      await changeAdminVehicleTypesOrder(
        reorderedTypes.map((vt, index) => ({
          id: vt.id,
          sort_order: (vt.sort_order as number) ?? index + 1,
        }))
      );
      const refreshed = await getAdminVehicleTypes();
      setVehicleTypes(refreshed);
      handleFilterChange(acFilter);
      showToast("تم إعادة ترتيب الأنواع بنجاح", "success");
    } catch (error: any) {
      try {
        const refreshed = await getAdminVehicleTypes();
        setVehicleTypes(refreshed);
        handleFilterChange(acFilter);
      } catch {}
      showToast(error?.message || "فشل في تحديث ترتيب الأنواع", "error");
    }
  };

  const handleSave = async (vehicleType: VehicleType, iconFile?: File | null) => {
    try {
      if (vehicleType.id) {
        await updateAdminVehicleType(vehicleType.id, { ...vehicleType, iconFile });
        const refreshed = await getAdminVehicleTypes();
        setVehicleTypes(refreshed);
        showToast("تم تحديث نوع المركبة بنجاح", "success");
      } else {
        const payload = {
          ...vehicleType,
          sort_order: vehicleTypes.length + 1,
          iconFile,
        };
        await createAdminVehicleType(payload);
        const refreshed = await getAdminVehicleTypes();
        setVehicleTypes(refreshed);
        showToast("تم إضافة نوع المركبة بنجاح", "success");
      }
      try {
        const latest = await getAdminVehicleTypes();
        const normalized = [...latest].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        await changeAdminVehicleTypesOrder(
          normalized.map((vt, index) => ({
            id: vt.id,
            sort_order: index + 1,
          }))
        );
        const refreshedAfterOrder = await getAdminVehicleTypes();
        setVehicleTypes(refreshedAfterOrder);
      } catch {}
      handleFilterChange(acFilter);
      setIsModalOpen(false);
    } catch (error: any) {
      showToast(error?.message || "فشل في حفظ نوع المركبة", "error");
    }
  };

  return (
    <div className="vehicle-types-page">
      <VehicleTypesHero onAddNew={handleAddNew} />
      
      <div className="ac-filter-tabs">
        <button
          className={`filter-tab ${acFilter === "all" ? "active" : ""}`}
          onClick={() => handleFilterChange("all")}
        >
          <span className="tab-icon">🚗</span>
          <span className="tab-text">جميع المركبات</span>
          <span className="tab-count">{vehicleTypes.length}</span>
        </button>
        <button
          className={`filter-tab ${acFilter === "ac" ? "active" : ""}`}
          onClick={() => handleFilterChange("ac")}
        >
          <span className="tab-icon">❄️</span>
          <span className="tab-text">مكيفة</span>
          <span className="tab-count">{vehicleTypes.filter(vt => vt.has_ac).length}</span>
        </button>
        <button
          className={`filter-tab ${acFilter === "non-ac" ? "active" : ""}`}
          onClick={() => handleFilterChange("non-ac")}
        >
          <span className="tab-icon">🌡️</span>
          <span className="tab-text">غير مكيفة</span>
          <span className="tab-count">{vehicleTypes.filter(vt => !vt.has_ac).length}</span>
        </button>
      </div>

      <VehicleTypesTable
        vehicleTypes={filteredVehicleTypes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        onReorder={handleReorder}
      />
      {isModalOpen && (
        <VehicleTypeModal
          vehicleType={selectedVehicleType}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      {confirm.show && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm({ ...confirm, show: false })}
          type="danger"
        />
      )}
    </div>
  );
}
