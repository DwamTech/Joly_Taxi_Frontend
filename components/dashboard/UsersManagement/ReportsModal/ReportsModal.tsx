"use client";

import { useState, useEffect } from "react";
import { getUserReports, ReportAgainst, ReportFrom } from "@/services/usersService";
import "./ReportsModal.css";

interface ReportsModalProps {
  userId: number;
  userName: string;
  onClose: () => void;
}

export default function ReportsModal({
  userId,
  userName,
  onClose,
}: ReportsModalProps) {
  const [reportsAgainst, setReportsAgainst] = useState<ReportAgainst[]>([]);
  const [reportsFrom, setReportsFrom] = useState<ReportFrom[]>([]);
  const [activeTab, setActiveTab] = useState<"against" | "from">("against");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const data = await getUserReports(userId);
        setReportsAgainst(data.reports_against);
        setReportsFrom(data.reports_from);
      } catch (err: any) {
        setError(err.message || "فشل في تحميل الشكاوى");
        setReportsAgainst([]);
        setReportsFrom([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [userId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "قيد المراجعة",
      reviewed: "تمت المراجعة",
      resolved: "تم الحل",
      dismissed: "مرفوض",
    };
    return labels[status] || status;
  };

  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      pending: "status-pending",
      reviewed: "status-reviewed",
      resolved: "status-resolved",
      dismissed: "status-dismissed",
    };
    return classes[status] || "";
  };

  const currentReports = activeTab === "against" ? reportsAgainst : reportsFrom;
  const totalReports = reportsAgainst.length + reportsFrom.length;

  return (
    <div className="reports-overlay" onClick={onClose}>
      <div className="reports-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              <span>⚠️</span>
              الشكاوى
            </h2>
            <p className="modal-subtitle">شكاوى {userName}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="reports-tabs">
          <button
            className={`tab-btn ${activeTab === "against" ? "active" : ""}`}
            onClick={() => setActiveTab("against")}
          >
            شكاوى ضده ({reportsAgainst.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "from" ? "active" : ""}`}
            onClick={() => setActiveTab("from")}
          >
            شكاوى منه ({reportsFrom.length})
          </button>
        </div>

        <div className="modal-body">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>جاري تحميل الشكاوى...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
              <button className="retry-btn" onClick={() => window.location.reload()}>
                إعادة المحاولة
              </button>
            </div>
          ) : currentReports.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">✅</span>
              <p>
                {activeTab === "against"
                  ? "لا توجد شكاوى ضد هذا المستخدم"
                  : "لا توجد شكاوى من هذا المستخدم"}
              </p>
            </div>
          ) : (
            <div className="reports-list">
              {activeTab === "against"
                ? reportsAgainst.map((report) => (
                    <div key={report.id} className="report-card">
                      <div className="report-header">
                        <div className="report-info">
                          <span className="report-id">#{report.id}</span>
                          <span className={`status-badge ${getStatusClass(report.status)}`}>
                            {getStatusLabel(report.status)}
                          </span>
                        </div>
                        <span className="report-date">{formatDate(report.date)}</span>
                      </div>

                      <div className="report-body">
                        <div className="report-row">
                          <span className="report-label">المُبلِّغ:</span>
                          <span className="report-value">{report.reporter_name}</span>
                        </div>

                        {report.trip_info && (
                          <div className="report-row">
                            <span className="report-label">رقم الرحلة:</span>
                            <span className="report-value trip-link">#{report.trip_info.id}</span>
                          </div>
                        )}

                        {report.trip_info && (
                          <>
                            <div className="report-row">
                              <span className="report-label">من:</span>
                              <span className="report-value">
                                {report.trip_info.from_address || "غير محدد"}
                              </span>
                            </div>
                            <div className="report-row">
                              <span className="report-label">إلى:</span>
                              <span className="report-value">
                                {report.trip_info.to_address || "غير محدد"}
                              </span>
                            </div>
                            <div className="report-row">
                              <span className="report-label">السعر:</span>
                              <span className="report-value">{report.trip_info.price} ج.م</span>
                            </div>
                          </>
                        )}

                        <div className="report-row full-width">
                          <span className="report-label">الوصف:</span>
                          <p className="report-description">{report.description}</p>
                        </div>
                      </div>
                    </div>
                  ))
                : reportsFrom.map((report) => (
                    <div key={report.id} className="report-card">
                      <div className="report-header">
                        <div className="report-info">
                          <span className="report-id">#{report.id}</span>
                          <span className={`status-badge ${getStatusClass(report.status)}`}>
                            {getStatusLabel(report.status)}
                          </span>
                        </div>
                        <span className="report-date">{formatDate(report.date)}</span>
                      </div>

                      <div className="report-body">
                        <div className="report-row">
                          <span className="report-label">المُبلَّغ عنه:</span>
                          <span className="report-value">{report.reported_name}</span>
                        </div>

                        {report.trip_info && (
                          <div className="report-row">
                            <span className="report-label">رقم الرحلة:</span>
                            <span className="report-value trip-link">#{report.trip_info.id}</span>
                          </div>
                        )}

                        {report.trip_info && (
                          <>
                            <div className="report-row">
                              <span className="report-label">من:</span>
                              <span className="report-value">
                                {report.trip_info.from_address || "غير محدد"}
                              </span>
                            </div>
                            <div className="report-row">
                              <span className="report-label">إلى:</span>
                              <span className="report-value">
                                {report.trip_info.to_address || "غير محدد"}
                              </span>
                            </div>
                            <div className="report-row">
                              <span className="report-label">السعر:</span>
                              <span className="report-value">{report.trip_info.price} ج.م</span>
                            </div>
                          </>
                        )}

                        <div className="report-row full-width">
                          <span className="report-label">الوصف:</span>
                          <p className="report-description">{report.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">إجمالي الشكاوى:</span>
              <span className="stat-value">{totalReports}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">شكاوى ضده:</span>
              <span className="stat-value">{reportsAgainst.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">شكاوى منه:</span>
              <span className="stat-value">{reportsFrom.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">قيد المراجعة:</span>
              <span className="stat-value pending">
                {[...reportsAgainst, ...reportsFrom].filter((r) => r.status === "pending").length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
