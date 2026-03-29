"use client";

import { useState, useEffect, useCallback } from "react";
import ActivityLogHero from "../ActivityLogHero/ActivityLogHero";
import ActivityLogFilters, {
  FilterValues,
} from "../ActivityLogFilters/ActivityLogFilters";
import ActivityLogTable from "../ActivityLogTable/ActivityLogTable";
import { AuditLogService } from "@/services/auditLogService";
import { AuditLog, AuditLogPagination, AuditLogStats } from "@/models/AuditLog";
import "./ActivityLogContent.css";

const PER_PAGE = 20;

const defaultPagination: AuditLogPagination = {
  current_page: 1,
  last_page: 1,
  per_page: PER_PAGE,
  total: 0,
};

export default function ActivityLogContent() {
  const [activities, setActivities] = useState<AuditLog[]>([]);
  const [pagination, setPagination] =
    useState<AuditLogPagination>(defaultPagination);
  const [stats, setStats] = useState<AuditLogStats | null>(null);
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    actionType: "all",
    adminId: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(
    async (page: number, activeFilters: FilterValues) => {
      setLoading(true);
      setError(null);
      try {
        const result = await AuditLogService.getAuditLogs({
          search: activeFilters.search || undefined,
          action_type: activeFilters.actionType,
          admin_id: activeFilters.adminId,
          date_from: activeFilters.dateFrom || undefined,
          date_to: activeFilters.dateTo || undefined,
          page,
          per_page: PER_PAGE,
        });
        setActivities(result.data);
        setPagination(result.pagination);
        if (result.stats) setStats(result.stats);
      } catch (err: any) {
        setError(err.message || "حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchLogs(currentPage, filters);
  }, [currentPage, filters, fetchLogs]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1); // reset to first page on filter change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // unique admins from current page (server-side filtering handles the rest)
  const uniqueAdmins = Array.from(
    new Map(
      activities.map((a) => [a.admin_id, { id: String(a.admin_id), name: a.admin_name }])
    ).values()
  );

  return (
    <div className="activity-log-content">
      <ActivityLogHero
        totalActivities={stats?.total_activities ?? pagination.total}
        todayActivities={stats?.today_activities ?? 0}
        activeAdmins={stats?.active_admins ?? uniqueAdmins.length}
        criticalActions={stats?.critical_actions ?? 0}
      />

      <div className="activity-log-content-wrapper">
        <ActivityLogFilters
          onFilterChange={handleFilterChange}
          resultsCount={pagination.total}
          admins={uniqueAdmins}
        />

        {loading && (
          <div className="activity-log-loading">
            <div className="loading-spinner" />
            <span>جاري التحميل...</span>
          </div>
        )}

        {error && !loading && (
          <div className="activity-log-error">
            <span>⚠️ {error}</span>
            <button onClick={() => fetchLogs(currentPage, filters)}>
              إعادة المحاولة
            </button>
          </div>
        )}

        {!loading && !error && (
          <ActivityLogTable
            activities={activities}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
