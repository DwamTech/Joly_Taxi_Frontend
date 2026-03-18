"use client";

import "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  currentPageItemsCount?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  currentPageItemsCount,
}: PaginationProps) {
  const calculatedStart = (currentPage - 1) * itemsPerPage + 1;
  const startItem = totalItems <= 0 || calculatedStart > totalItems ? 0 : calculatedStart;
  const endItem =
    totalItems <= 0
      ? 0
      : typeof currentPageItemsCount === "number"
        ? Math.min(startItem + Math.max(0, currentPageItemsCount) - 1, totalItems)
        : Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        عرض {startItem} - {endItem} من {totalItems} نتيجة
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-btn pagination-btn-prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span>‹</span>
          السابق
        </button>

        <div className="pagination-numbers">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`pagination-number ${
                page === currentPage ? "active" : ""
              } ${page === "..." ? "dots" : ""}`}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="pagination-btn pagination-btn-next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          التالي
          <span>›</span>
        </button>
      </div>
    </div>
  );
}
