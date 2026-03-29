import "./TablePagination.css";

interface Props {
  page: number;
  lastPage: number;
  total: number;
  perPage: number;
  onPageChange: (p: number) => void;
}

export default function TablePagination({ page, lastPage, total, perPage, onPageChange }: Props) {
  if (lastPage <= 1) return null;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1).reduce<(number | "...")[]>(
    (acc, p, idx, arr) => {
      if (p === 1 || p === lastPage || Math.abs(p - page) <= 1) {
        if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
        acc.push(p);
      }
      return acc;
    },
    []
  );

  return (
    <div className="table-pagination">
      <span className="tp-info">{from}–{to} من {total}</span>
      <div className="tp-controls">
        <button className="tp-btn" onClick={() => onPageChange(1)} disabled={page === 1}>«</button>
        <button className="tp-btn" onClick={() => onPageChange(page - 1)} disabled={page === 1}>‹</button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`e${i}`} className="tp-ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={`tp-btn${p === page ? " active" : ""}`}
              onClick={() => onPageChange(p as number)}
            >
              {p}
            </button>
          )
        )}
        <button className="tp-btn" onClick={() => onPageChange(page + 1)} disabled={page === lastPage}>›</button>
        <button className="tp-btn" onClick={() => onPageChange(lastPage)} disabled={page === lastPage}>»</button>
      </div>
    </div>
  );
}
