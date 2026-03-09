"use client";

import { Trip } from "@/models/Trip";
import "./TripsTable.css";

interface TripsTableProps {
  trips: Trip[];
  onViewTrip: (trip: Trip) => void;
}

export default function TripsTable({ trips, onViewTrip }: TripsTableProps) {
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      open: "مفتوحة",
      accepted: "مقبولة",
      started: "جارية",
      ended: "منتهية",
      cancelled: "ملغاة",
      expired: "منتهية الصلاحية",
    };
    return labels[status] || status;
  };

  return (
    <div className="trips-table-container">
      <div className="table-wrapper">
        <table className="trips-table">
          <thead>
            <tr>
              <th>رقم الرحلة</th>
              <th>الراكب</th>
              <th>السائق</th>
              <th>نوع المركبة</th>
              <th>الحالة</th>
              <th>السعر</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id}>
                <td className="trip-number-cell" data-label="رقم الرحلة">TRIP-{trip.id}</td>
                <td data-label="الراكب">
                  <div className="user-info-cell">
                    <span className="user-name">{trip.rider_name}</span>
                  </div>
                </td>
                <td data-label="السائق">
                  {trip.driver_name ? (
                    <div className="driver-cell">
                      <div className="driver-avatar">
                        {trip.driver_name.charAt(0)}
                      </div>
                      <div className="driver-info">
                        <span className="driver-name">{trip.driver_name}</span>
                        {trip.driver_rating && (
                          <span className="driver-rating">
                            ⭐ {trip.driver_rating}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="no-driver">لا يوجد سائق</span>
                  )}
                </td>
                <td data-label="نوع المركبة">
                  <span className="vehicle-badge">{trip.vehicle_type}</span>
                </td>
                <td data-label="الحالة">
                  <span className={`status-badge status-${trip.status}`}>
                    {getStatusLabel(trip.status)}
                  </span>
                </td>
                <td className="price-cell" data-label="السعر">
                  {trip.final_price || trip.suggested_price} جنيه
                </td>
                <td data-label="الإجراءات">
                  <div className="actions-cell">
                    <button
                      className="action-btn view-btn"
                      onClick={() => onViewTrip(trip)}
                      title="عرض التفاصيل"
                    >
                      📋
                    </button>
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
