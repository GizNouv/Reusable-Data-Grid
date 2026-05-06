"use client";

import { useDataGridContext } from "@/context/DataGridContext";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export function PageSizeSelector() {
  const { pageSize, setPageSize } = useDataGridContext();

  return (
    <div className="flex items-center gap-2">
      <span>Show</span>
      <select
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
        className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <span>per page</span>
    </div>
  );
}