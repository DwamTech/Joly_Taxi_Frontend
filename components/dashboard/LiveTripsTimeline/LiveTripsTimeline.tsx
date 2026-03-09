"use client";

import { useState, useEffect } from "react";
import "./LiveTripsTimeline.css";
import { dashboardService, ActiveTrip } from "@/services/dashboardService";

export default function LiveTripsTimeline() {
  const [trips, setTrips] = useState<ActiveTrip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<ActiveTrip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveTrips = async () => {
    try {
      const data = await dashboardService.getLiveTrips();
      setTrips(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching live trips:", err);
      setError(err.message || "فشل في تحميل الرحلات الجارية");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveTrips();
    
    // تحديث كل 10 ثواني
    const interval = setInterval(() => {
      fetchLiveTrips();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (createdAt: string) => {
    const start = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} دقيقة`;
    }
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours} ساعة ${mins} دقيقة`;
  };

  return (
    <>
      <div className="live-trips-timeline">
        <div className="timeline-header">
          <h3 className="timeline-title">الرحلات الجارية</h3>
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span className="live-text">مباشر</span>
          </div>
        </div>

        <div className="timeline-list">
          {isLoading ? (
            <div className="timeline-loading">
              <div className="spinner-small"></div>
              <p>جاري التحميل...</p>
            </div>
          ) : error ? (
            <div className="timeline-error">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="timeline-empty">
              <span>📭</span>
              <p>لا توجد رحلات جارية حالياً</p>
            </div>
          ) : (
            trips.map((trip) => (
              <div 
                key={trip.id} 
                className="trip-card"
                onClick={() => setSelectedTrip(trip)}
              >
                <div className="trip-number">{trip.trip_id}</div>
                <div className="trip-info">
                  <div className="trip-row">
                    <span className="trip-icon">👤</span>
                    <span className="trip-text">{trip.rider.name}</span>
                  </div>
                  <div className="trip-row">
                    <span className="trip-icon">🚗</span>
                    <span className="trip-text">{trip.driver.name}</span>
                  </div>
                  <div className="trip-duration">
                    <span className="duration-icon">⏱️</span>
                    <span className="duration-text">{formatDuration(trip.created_at)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedTrip && (
        <div className="trip-modal-overlay" onClick={() => setSelectedTrip(null)}>
          <div className="trip-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedTrip(null)}>×</button>
            
            <h2 className="modal-title">تفاصيل الرحلة {selectedTrip.trip_id}</h2>
            
            <div className="modal-section">
              <h3 className="section-title">بيانات الراكب</h3>
              <div className="info-row">
                <span className="info-label">الاسم:</span>
                <span className="info-value">{selectedTrip.rider.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">ID:</span>
                <span className="info-value">#{selectedTrip.rider.id}</span>
              </div>
            </div>

            <div className="modal-section">
              <h3 className="section-title">بيانات السائق</h3>
              <div className="info-row">
                <span className="info-label">الاسم:</span>
                <span className="info-value">{selectedTrip.driver.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">ID:</span>
                <span className="info-value">#{selectedTrip.driver.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">نوع السيارة:</span>
                <span className="info-value">{selectedTrip.vehicle_type}</span>
              </div>
            </div>

            <div className="modal-section">
              <h3 className="section-title">تفاصيل الرحلة</h3>
              <div className="info-row">
                <span className="info-label">من:</span>
                <span className="info-value">{selectedTrip.from_address || "غير محدد"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">إلى:</span>
                <span className="info-value">{selectedTrip.to_address || "غير محدد"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">المدة:</span>
                <span className="info-value">{formatDuration(selectedTrip.created_at)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">الحالة:</span>
                <span className="info-value status">{selectedTrip.status === 'started' ? 'جارية' : selectedTrip.status}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
