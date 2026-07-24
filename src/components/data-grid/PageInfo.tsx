"use client";

import { useDataGridContext } from "@/context/DataGridContext";

export function PageInfo() {
  const { page, pageSize, totalCount } = useDataGridContext();

  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  return (
    <span className="text-gray-500">
      {startItem}–{endItem} of {totalCount}
    </span>
  );
}