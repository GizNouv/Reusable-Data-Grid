"use client";

import { useDataGridContext } from "@/context/DataGridContext";
import { cn } from "@/lib/cn";

interface PaginationProps {
  children?: React.ReactNode;
}

export function Pagination({ children }: PaginationProps) {
  const { classNames } = useDataGridContext();

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border-t border-gray-200 text-sm text-gray-600",
        classNames?.pagination
      )}
    >
      {children}
    </div>
  );
}