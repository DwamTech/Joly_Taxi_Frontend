"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import { UserBlockItem, UserBlocksStatisticsData } from "@/models/Block";
import { blocksService } from "@/services/blocksService";
import BlocksHero from "../BlocksHero/BlocksHero";
import BlocksFilters, { FilterValues } from "../BlocksFilters/BlocksFilters";
import BlocksTable from "../BlocksTable/BlocksTable";
import BlockDetailsModal from "../BlockDetailsModal/BlockDetailsModal";
import Pagination from "@/components/Pagination/Pagination";
import "./BlocksManagementContent.css";

const EMPTY_STATS: UserBlocksStatisticsData = {
  total_blocks: 0,
  active_blocks: 0,
  inactive_blocks: 0,
  cancelled_blocks: 0,
  today_blocks: 0,
  this_week_blocks: 0,
  this_month_blocks: 0,
  most_blocked_users: [],
  most_blocking_users: [],
};

export default function BlocksManagementContent() {
  const { showToast } = useToast();
  const [blocks, setBlocks] = useState<UserBlockItem[]>([]);
  const [filteredBlocks, setFilteredBlocks] = useState<UserBlockItem[]>([]);
  const [stats, setStats] = useState<UserBlocksStatisticsData>(EMPTY_STATS);
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState<UserBlockItem | null>(null);

  const parseDate = (value: string) => new Date(value.replace(" ", "T"));
  const getArabicToastMessage = useCallback((error: any, fallbackMessage: string) => {
    const rawMessage = String(error?.message ?? "").trim();
    if (!rawMessage) return fallbackMessage;
    if (/[\u0600-\u06FF]/.test(rawMessage)) return rawMessage;

    const normalized = rawMessage.toLowerCase();

    if (
      normalized.includes("failed to fetch") ||
      normalized.includes("network") ||
      normalized.includes("networkerror")
    ) {
      return "تعذر الاتصال بالخادم";
    }
    if (
      normalized.includes("unauthorized") ||
      normalized.includes("unauthenticated") ||
      normalized.includes("forbidden")
    ) {
      return "ليس لديك صلاحية لتنفيذ هذا الإجراء";
    }
    if (normalized.includes("not found")) {
      return "البيانات المطلوبة غير موجودة";
    }
    if (
      normalized.includes("internal server error") ||
      normalized.includes("server error")
    ) {
      return "حدث خطأ في الخادم";
    }
    if (normalized.includes("timeout")) {
      return "انتهت مهلة الاتصال بالخادم";
    }

    return fallbackMessage;
  }, []);

  const applyFilters = useCallback((sourceBlocks: UserBlockItem[], activeFilters: FilterValues) => {
    let result = [...sourceBlocks];

    if (activeFilters.search) {
      const searchValue = activeFilters.search.toLowerCase();
      result = result.filter(
        (block) =>
          block.blocker.name.toLowerCase().includes(searchValue) ||
          block.blocked.name.toLowerCase().includes(searchValue) ||
          block.blocker.phone.toLowerCase().includes(searchValue) ||
          block.blocked.phone.toLowerCase().includes(searchValue) ||
          block.blocker.email.toLowerCase().includes(searchValue) ||
          block.blocked.email.toLowerCase().includes(searchValue)
      );
    }

    if (activeFilters.status !== "all") {
      result = result.filter((block) => block.status === activeFilters.status);
    }

    if (activeFilters.dateFrom) {
      const fromDate = new Date(activeFilters.dateFrom);
      result = result.filter(
        (block) => parseDate(block.created_at) >= fromDate
      );
    }

    if (activeFilters.dateTo) {
      const toDate = new Date(activeFilters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(
        (block) => parseDate(block.created_at) <= toDate
      );
    }

    setFilteredBlocks(result);
  }, []);

  const loadBlocks = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      try {
        const response = await blocksService.getUserBlocks(page);
        const pageData = response?.data;
        const list = Array.isArray(pageData?.data) ? pageData.data : [];
        setBlocks(list);
        setFilteredBlocks(list);
        setCurrentPage(pageData?.current_page ?? page);
        setLastPage(Math.max(1, pageData?.last_page ?? 1));
        setItemsPerPage(pageData?.per_page ?? list.length ?? 1);
        setTotalItems(pageData?.total ?? list.length);
      } catch (error: any) {
        showToast(getArabicToastMessage(error, "فشل في جلب قائمة الحظر"), "error");
      } finally {
        setIsLoading(false);
      }
    },
    [showToast, getArabicToastMessage]
  );

  const loadStatistics = useCallback(async () => {
    try {
      const response = await blocksService.getUserBlocksStatistics();
      setStats(response?.data ?? EMPTY_STATS);
    } catch (error: any) {
      showToast(getArabicToastMessage(error, "فشل في جلب إحصائيات الحظر"), "error");
    }
  }, [showToast, getArabicToastMessage]);

  useEffect(() => {
    loadBlocks(1);
    loadStatistics();
  }, [loadBlocks, loadStatistics]);

  useEffect(() => {
    applyFilters(blocks, filters);
  }, [blocks, filters, applyFilters]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const handleViewBlock = (block: UserBlockItem) => {
    setSelectedBlock(block);
  };

  const handleCloseModal = () => {
    setSelectedBlock(null);
  };

  const handleUnblock = (id: number) => {
    setBlocks(
      blocks.map((block) =>
        block.id === id ? { ...block, status: "cancelled" } : block
      )
    );
    setFilteredBlocks(
      filteredBlocks.map((block) =>
        block.id === id ? { ...block, status: "cancelled" } : block
      )
    );
    showToast("تم إلغاء الحظر بنجاح", "success");
  };
  const hasActiveFilters =
    Boolean(filters.search.trim()) ||
    filters.status !== "all" ||
    Boolean(filters.dateFrom) ||
    Boolean(filters.dateTo);
  const totalPages = hasActiveFilters ? 1 : lastPage;
  const paginationCurrentPage = hasActiveFilters ? 1 : currentPage;
  const paginationTotalItems = hasActiveFilters ? filteredBlocks.length : totalItems;

  return (
    <div className="blocks-management-page">
      <BlocksHero
        totalBlocks={stats.total_blocks || totalItems}
        activeBlocks={stats.active_blocks}
        inactiveBlocks={stats.inactive_blocks}
        cancelledBlocks={stats.cancelled_blocks}
        todayBlocks={stats.today_blocks}
        thisWeekBlocks={stats.this_week_blocks}
        thisMonthBlocks={stats.this_month_blocks}
        topBlockingUserName={stats.most_blocking_users[0]?.user?.name || "لا يوجد بيانات"}
        topBlockingUserCount={stats.most_blocking_users[0]?.block_count || 0}
        topBlockedUserName={stats.most_blocked_users[0]?.user?.name || "لا يوجد بيانات"}
        topBlockedUserCount={stats.most_blocked_users[0]?.block_count || 0}
      />

      <BlocksFilters onFilterChange={handleFilterChange} resultsCount={filteredBlocks.length} />

      {isLoading ? (
        <div className="blocks-loading-state">جاري تحميل قائمة الحظر...</div>
      ) : (
        <>
          <BlocksTable
            blocks={filteredBlocks}
            onViewBlock={handleViewBlock}
            onUnblock={handleUnblock}
          />

          <Pagination
            currentPage={paginationCurrentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              if (hasActiveFilters) {
                return;
              }
              loadBlocks(page);
            }}
            totalItems={paginationTotalItems}
            itemsPerPage={itemsPerPage}
            currentPageItemsCount={filteredBlocks.length}
          />
        </>
      )}

      <BlockDetailsModal block={selectedBlock} onClose={handleCloseModal} />
    </div>
  );
}
