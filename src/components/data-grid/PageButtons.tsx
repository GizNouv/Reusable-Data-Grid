"use client";

import { useDataGridContext } from "@/context/DataGridContext";

export function PageButtons() {
  const { page, totalPages, setPage } = useDataGridContext();

  if (totalPages <= 1) return null;

  const pages = generatePageNumbers(page, totalPages);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
        className="px-2 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        ‹
      </button>

      {pages.map((pageNum, idx) =>
        pageNum === "..." ? (
          <span key={`dots-${idx}`} className="px-2 py-1 text-gray-400">…</span>
        ) : (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum as number)}
            className={`px-2 py-1 border rounded-lg text-sm min-w-8 ${
              pageNum === page
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {pageNum}
          </button>
        )
      )}

      <button
        onClick={() => setPage(page + 1)}
        disabled={page >= totalPages}
        className="px-2 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        ›
      </button>
    </div>
  );
}

function generatePageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push("...");

  pages.push(total);

  return pages;
}