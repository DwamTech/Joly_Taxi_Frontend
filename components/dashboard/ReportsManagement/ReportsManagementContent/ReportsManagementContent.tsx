"use client";

import { useState, useEffect, useMemo } from "react";
import { TripReport } from "@/models/TripReport";
import { useToast } from "@/components/Toast/ToastContainer";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import Pagination from "@/components/Pagination/Pagination";
import { deleteAdminReport, getAdminReportById, getAdminReports } from "@/services/reportsService";
import { resolveAdminReport } from "@/services/reportsResolveService";
import ReportsHero from "../ReportsHero/ReportsHero";
import ReportsFilters, { FilterValues } from "../ReportsFilters/ReportsFilters";
import ReportsTable from "../ReportsTable/ReportsTable";
import ReportDetailsModal from "../ReportDetailsModal/ReportDetailsModal";
import "./ReportsManagementContent.css";

export default function ReportsManagementContent() {
  const { showToast } = useToast();
  const [reports, setReports] = useState<TripReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<TripReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<TripReport | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    reportId: number;
  }>({ show: false, reportId: 0 });
  
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    status: "all",
    reason: "all",
    priority: "all",
    dateFrom: "",
    dateTo: "",
    sortBy: "newest",
  });

  // Load mock data
  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      try {
        const result = await getAdminReports(currentPage);
        setReports(result.reports);
        setPagination(result.pagination);
      } catch (error: any) {
        showToast(error?.message || "فشل في تحميل البيانات", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, [showToast, currentPage]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: pagination.total || reports.length,
      pending: reports.filter((r) => r.status === "pending").length,
      resolved: reports.filter((r) => r.status === "resolved").length,
      today: reports.filter(
        (r) =>
          new Date(r.created_at).toDateString() === new Date().toDateString()
      ).length,
    };
  }, [reports, pagination.total]);

  // Apply filters
  useEffect(() => {
    let result = [...reports];

    if (filters.search) {
      result = result.filter(
        (report) =>
          report.id.toString().includes(filters.search) ||
          report.reporter?.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          report.reported?.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status !== "all") {
      result = result.filter((report) => report.status === filters.status);
    }

    if (filters.reason !== "all") {
      result = result.filter((report) => report.reason === filters.reason);
    }

    if (filters.priority !== "all") {
      result = result.filter((report) => report.priority === filters.priority);
    }

    if (filters.dateFrom) {
      result = result.filter(
        (report) => new Date(report.created_at) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      result = result.filter(
        (report) => new Date(report.created_at) <= new Date(filters.dateTo)
      );
    }

    switch (filters.sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        result.sort(
          (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
        );
        break;
    }

    setFilteredReports(result);
  }, [filters, reports]);

  const totalPages = pagination.lastPage || 1;
  const paginatedReports = filteredReports;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleViewReport = async (report: TripReport) => {
    try {
      const details = await getAdminReportById(report.id);
      setSelectedReport(details);
    } catch (error: any) {
      showToast(error?.message || "فشل في جلب تفاصيل البلاغ", "error");
    }
  };

  const handleResolveReport = async (reportId: number) => {
    setIsLoading(true);
    try {
      await resolveAdminReport(reportId);
      showToast("تم وضع علامة محلول على البلاغ", "success");
      const refreshed = await getAdminReports(currentPage);
      setReports(refreshed.reports);
      setPagination(refreshed.pagination);
    } catch (error: any) {
      showToast(error?.message || "فشل في تغيير حالة البلاغ", "error");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReport = (reportId: number) => {
    setDeleteConfirm({ show: true, reportId });
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await deleteAdminReport(deleteConfirm.reportId);
      showToast("تم حذف البلاغ بنجاح", "success");
      setDeleteConfirm({ show: false, reportId: 0 });
      const refreshed = await getAdminReports(currentPage);
      setReports(refreshed.reports);
      setPagination(refreshed.pagination);
      if (currentPage > refreshed.pagination.lastPage) {
        setCurrentPage(refreshed.pagination.lastPage);
      }
    } catch (error: any) {
      showToast(error?.message || "فشل في حذف البلاغ", "error");
      setDeleteConfirm({ show: false, reportId: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, reportId: 0 });
  };

  return (
    <div className="reports-management-page">
      <ReportsHero
        totalReports={stats.total}
        pendingReports={stats.pending}
        resolvedReports={stats.resolved}
        todayReports={stats.today}
      />

      <ReportsFilters
        onFilterChange={handleFilterChange}
        resultsCount={filteredReports.length}
      />

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "2rem" }}>⏳</div>
          <p>جاري تحميل البيانات...</p>
        </div>
      ) : (
        <ReportsTable
          reports={paginatedReports}
          onViewReport={handleViewReport}
          onResolveReport={handleResolveReport}
          onDeleteReport={handleDeleteReport}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={pagination.total}
        itemsPerPage={pagination.perPage}
      />

      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onResolve={handleResolveReport}
        />
      )}

      {deleteConfirm.show && (
        <ConfirmDialog
          title="تأكيد الحذف"
          message="هل أنت متأكد من حذف هذا البلاغ؟ لا يمكن التراجع عن هذا الإجراء."
          confirmText="حذف"
          cancelText="إلغاء"
          type="danger"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
