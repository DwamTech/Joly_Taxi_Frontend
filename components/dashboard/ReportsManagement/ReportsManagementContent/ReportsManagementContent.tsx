"use client";

import { useState, useEffect, useMemo } from "react";
import { TripReport } from "@/models/TripReport";
import { useToast } from "@/components/Toast/ToastContainer";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import Pagination from "@/components/Pagination/Pagination";
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
  const [itemsPerPage] = useState(20);
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
        // TODO: Replace with API call
        const response = await fetch("/data/dashboard/mock-reports.json");
        const mockReports: TripReport[] = await response.json();
        setReports(mockReports);
      } catch (error) {
        console.error("Error loading reports:", error);
        showToast("فشل في تحميل البيانات", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, [showToast]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: reports.length,
      pending: reports.filter((r) => r.status === "pending").length,
      resolved: reports.filter((r) => r.status === "resolved").length,
      today: reports.filter(
        (r) =>
          new Date(r.created_at).toDateString() === new Date().toDateString()
      ).length,
    };
  }, [reports]);

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

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleViewReport = (report: TripReport) => {
    setSelectedReport(report);
  };

  const handleResolveReport = (reportId: number) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? { ...report, status: "resolved" as const, resolved_at: new Date().toISOString() }
          : report
      )
    );
    showToast("تم وضع علامة محلول على البلاغ", "success");
  };

  const handleDeleteReport = (reportId: number) => {
    setDeleteConfirm({ show: true, reportId });
  };

  const confirmDelete = () => {
    setReports((prev) => prev.filter((report) => report.id !== deleteConfirm.reportId));
    showToast("تم حذف البلاغ بنجاح", "success");
    setDeleteConfirm({ show: false, reportId: 0 });
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
        totalItems={filteredReports.length}
        itemsPerPage={itemsPerPage}
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
