import { useState, useMemo } from "react";

export function usePagination<T>(items: T[], perPage = 10) {
  const [page, setPage] = useState(1);

  const lastPage = Math.max(1, Math.ceil(items.length / perPage));

  const paged = useMemo(() => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page, perPage]);

  // reset to page 1 when items change
  const reset = () => setPage(1);

  return { paged, page, lastPage, setPage, reset, total: items.length };
}
