"use client";

import { useState } from "react";
import { VehicleType } from "@/models/VehicleType";
import "./VehicleTypesTable.css";

interface VehicleTypesTableProps {
  vehicleTypes: VehicleType[];
  onEdit: (vehicleType: VehicleType) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
  onReorder?: (reorderedTypes: VehicleType[]) => void;
}

export default function VehicleTypesTable({
  vehicleTypes,
  onEdit,
  onDelete,
  onToggleActive,
  onReorder,
}: VehicleTypesTableProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const IconCell = ({ icon, alt }: { icon: string | null | undefined; alt: string }) => {
    const [error, setError] = useState(false);
    if (!icon || error) {
      return <span>🚗</span>;
    }
    const showImage =
      icon.startsWith("http://") ||
      icon.startsWith("https://") ||
      icon.startsWith("/");
    return showImage ? (
      <img
        src={icon}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setError(true)}
      />
    ) : (
      <span>{icon}</span>
    );
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...vehicleTypes];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, draggedItem);

    // Update sort_order for all items
    const updatedTypes = reordered.map((item, index) => ({
      ...item,
      sort_order: index + 1,
    }));

    if (onReorder) {
      onReorder(updatedTypes);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="vehicle-types-table-container">
      <div className="table-wrapper">
        <table className="vehicle-types-table">
          <thead>
            <tr>
              <th>🔄</th>
              <th>الأيقون</th>
              <th>الاسم بالعربية</th>
              <th>الاسم بالإنجليزية</th>
              <th>التكييف</th>
              <th>سعر المركبة</th>
              <th>السعر/كم</th>
              <th>وقت الانتظار</th>
              <th>نطاق البحث</th>
              <th>الحالة</th>
              <th>الترتيب</th>
              {/* <th>المركبات</th> 
              <th>الرحلات</th>*/}
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {vehicleTypes.map((vehicleType, index) => (
              <tr
                key={vehicleType.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  ${draggedIndex === index ? "dragging" : ""}
                  ${dragOverIndex === index ? "drag-over" : ""}
                `}
              >
                <td>
                  <div className="drag-handle" title="اسحب لإعادة الترتيب">
                    ⋮⋮
                  </div>
                </td>
                <td>
                  <div className="vehicle-icon">
                    <IconCell icon={vehicleType.icon} alt={vehicleType.name_ar} />
                  </div>
                </td>
                <td>
                  <span className="vehicle-name">{vehicleType.name_ar}</span>
                </td>
                <td>
                  <span className="vehicle-name-en">{vehicleType.name_en}</span>
                </td>
                <td>
                  <span className={`ac-badge ${vehicleType.has_ac ? "has-ac" : "no-ac"}`}>
                    {vehicleType.has_ac ? "مكيفة" : "غير مكيفة"}
                  </span>
                </td>
                <td>
                  <span className="price">{vehicleType.base_fare} ج.م</span>
                </td>
                <td>
                  <span className="price">{vehicleType.price_per_km} ج.م</span>
                </td>
                <td>
                  <span className="wait-time">{vehicleType.wait_time_seconds}ث</span>
                </td>
                <td>
                  <span className="radius">{vehicleType.max_search_radius_km} كم</span>
                </td>
                <td>
                  <span className={`status-badge ${vehicleType.active ? "active" : "inactive"}`}>
                    {vehicleType.active ? "نشط" : "غير نشط"}
                  </span>
                </td>
                <td>
                  <span className="sort-order">{vehicleType.sort_order}</span>
                </td>
              {/*  <td>
                  <span className="stat-number">{vehicleType.registered_vehicles || 0}</span>
                </td>
                <td>
                  <span className="stat-number">{vehicleType.total_trips || 0}</span>
                </td>*/}
                <td>
                  <div className="actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => onEdit(vehicleType)}
                      title="تعديل"
                    >
                      ✏️
                    </button>
                    <button
                      className={`action-btn toggle-btn ${vehicleType.active ? "active" : ""}`}
                      onClick={() => onToggleActive(vehicleType.id)}
                      title={vehicleType.active ? "تعطيل" : "تفعيل"}
                    >
                      {vehicleType.active ? "🔴" : "II"}
                    </button>
                    {/*<button
                      className="action-btn delete-btn"
                      onClick={() => onDelete(vehicleType.id)}
                      title="حذف"
                    >
                      X
                    </button>*/}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
