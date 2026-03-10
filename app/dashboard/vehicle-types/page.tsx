"use client";

import { useState } from "react";
import VehicleTypesHero from "@/components/dashboard/VehicleTypesManagement/VehicleTypesHero/VehicleTypesHero";
import VehicleTypesTable from "@/components/dashboard/VehicleTypesManagement/VehicleTypesTable/VehicleTypesTable";
import VehicleTypeModal from "@/components/dashboard/VehicleTypesManagement/VehicleTypeModal/VehicleTypeModal";
import Toast, { ToastType } from "@/components/Toast/Toast";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import { VehicleType } from "@/models/VehicleType";
import mockVehicleTypes from "@/data/dashboard/mock-vehicle-types.json";
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
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>(mockVehicleTypes);
  const [filteredVehicleTypes, setFilteredVehicleTypes] = useState<VehicleType[]>(mockVehicleTypes);
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

  // Apply filter on mount and when dependencies change
  useState(() => {
    applyFilter();
  });

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

  const handleEdit = (vehicleType: VehicleType) => {
    setSelectedVehicleType(vehicleType);
    setIsModalOpen(true);
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

  const handleToggleActive = (id: number) => {
    const vehicleType = vehicleTypes.find((vt) => vt.id === id);
    const updatedTypes = vehicleTypes.map((vt) =>
      vt.id === id ? { ...vt, active: !vt.active } : vt
    );
    setVehicleTypes(updatedTypes);
    handleFilterChange(acFilter); // Re-apply filter
    showToast(
      `تم ${vehicleType?.active ? "تعطيل" : "تفعيل"} "${vehicleType?.name_ar}" بنجاح`,
      "success"
    );
  };

  const handleReorder = (reorderedTypes: VehicleType[]) => {
    setVehicleTypes(reorderedTypes);
    handleFilterChange(acFilter); // Re-apply filter
    showToast("تم إعادة ترتيب الأنواع بنجاح", "success");
  };

  const handleSave = (vehicleType: VehicleType) => {
    let updatedTypes;
    if (vehicleType.id) {
      updatedTypes = vehicleTypes.map((vt) => (vt.id === vehicleType.id ? vehicleType : vt));
      setVehicleTypes(updatedTypes);
      showToast("تم تحديث نوع المركبة بنجاح", "success");
    } else {
      const newVehicleType = {
        ...vehicleType,
        id: Math.max(...vehicleTypes.map((vt) => vt.id)) + 1,
      };
      updatedTypes = [...vehicleTypes, newVehicleType];
      setVehicleTypes(updatedTypes);
      showToast("تم إضافة نوع المركبة بنجاح", "success");
    }
    handleFilterChange(acFilter); // Re-apply filter
    setIsModalOpen(false);
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
