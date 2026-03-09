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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | null>(null);
  const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "success" });
  const [confirm, setConfirm] = useState<ConfirmState>({
    show: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

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
        setVehicleTypes(vehicleTypes.filter((vt) => vt.id !== id));
        setConfirm({ ...confirm, show: false });
        showToast("تم حذف نوع المركبة بنجاح", "success");
      },
    });
  };

  const handleToggleActive = (id: number) => {
    const vehicleType = vehicleTypes.find((vt) => vt.id === id);
    setVehicleTypes(
      vehicleTypes.map((vt) =>
        vt.id === id ? { ...vt, active: !vt.active } : vt
      )
    );
    showToast(
      `تم ${vehicleType?.active ? "تعطيل" : "تفعيل"} "${vehicleType?.name_ar}" بنجاح`,
      "success"
    );
  };

  const handleReorder = (reorderedTypes: VehicleType[]) => {
    setVehicleTypes(reorderedTypes);
    showToast("تم إعادة ترتيب الأنواع بنجاح", "success");
  };

  const handleSave = (vehicleType: VehicleType) => {
    if (vehicleType.id) {
      setVehicleTypes(
        vehicleTypes.map((vt) => (vt.id === vehicleType.id ? vehicleType : vt))
      );
      showToast("تم تحديث نوع المركبة بنجاح", "success");
    } else {
      const newVehicleType = {
        ...vehicleType,
        id: Math.max(...vehicleTypes.map((vt) => vt.id)) + 1,
      };
      setVehicleTypes([...vehicleTypes, newVehicleType]);
      showToast("تم إضافة نوع المركبة بنجاح", "success");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="vehicle-types-page">
      <VehicleTypesHero onAddNew={handleAddNew} />
      <VehicleTypesTable
        vehicleTypes={vehicleTypes}
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
