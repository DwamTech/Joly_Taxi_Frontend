"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast/ToastContainer";
import BlocksHero from "../BlocksHero/BlocksHero";
import BlocksFilters, { FilterValues } from "../BlocksFilters/BlocksFilters";
import BlocksTable from "../BlocksTable/BlocksTable";
import BlockDetailsModal from "../BlockDetailsModal/BlockDetailsModal";
import Pagination from "@/components/Pagination/Pagination";
import blocksData from "@/data/blocks/blocks-data.json";
import "./BlocksManagementContent.css";

export default function BlocksManagementContent() {
  const { showToast } = useToast();
  const [blocks, setBlocks] = useState(blocksData.blocks);
  const [filteredBlocks, setFilteredBlocks] = useState(blocksData.blocks);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const itemsPerPage = 10;

  const stats = {
    total: blocks.length,
    active: blocks.filter((b) => b.status === "active").length,
    cancelled: blocks.filter((b) => b.status === "cancelled").length,
    topBlockers: blocksData.stats.topBlockers,
  };

  const handleFilterChange = (filters: FilterValues) => {
    let result = [...blocks];

    if (filters.search) {
      result = result.filter(
        (block) =>
          block.blocker_name.toLowerCase().includes(filters.search.toLowerCase()) ||
          block.blocked_name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status !== "all") {
      result = result.filter((block) => block.status === filters.status);
    }

    if (filters.dateFrom) {
      result = result.filter(
        (block) => new Date(block.created_at) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      result = result.filter(
        (block) => new Date(block.created_at) <= new Date(filters.dateTo)
      );
    }

    setFilteredBlocks(result);
    setCurrentPage(1);
  };

  const handleViewBlock = (block: any) => {
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

  const paginatedBlocks = filteredBlocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBlocks.length / itemsPerPage);

  return (
    <div className="blocks-management-page">
      <BlocksHero
        totalBlocks={stats.total}
        activeBlocks={stats.active}
        cancelledBlocks={stats.cancelled}
        topBlockers={stats.topBlockers}
      />

      <BlocksFilters
        onFilterChange={handleFilterChange}
        resultsCount={filteredBlocks.length}
      />

      <BlocksTable
        blocks={paginatedBlocks}
        onViewBlock={handleViewBlock}
        onUnblock={handleUnblock}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredBlocks.length}
        itemsPerPage={itemsPerPage}
      />

      <BlockDetailsModal block={selectedBlock} onClose={handleCloseModal} />
    </div>
  );
}
