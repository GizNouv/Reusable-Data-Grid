"use client";

import { useDataGridContext } from "@/context/DataGridContext";
import { cn } from "@/lib/cn";

interface HeaderProps {
  densityClasses: { th: string; td: string };
}

export function Header({ densityClasses }: HeaderProps) {
  const { visibleColumns, sortField, sortDirection, setSort, stickyHeader, hideHeader, classNames, isScrolled, stickyColumns, getStickyClass, getStickyStyle } =
    useDataGridContext();

  if (hideHeader) return null;

  const getStickyShadow = (colKey: string) => {
    if (!isScrolled || !stickyColumns) return "";
    if (stickyColumns.left?.includes(colKey)) return "drop-shadow-[4px_0_8px_rgba(0,0,0,0.1)]";
    if (stickyColumns.right?.includes(colKey)) return "drop-shadow-[-4px_0_8px_rgba(0,0,0,0.1)]";
    return "";
  };

  return (
    <thead
      className={cn(
        "bg-gray-100",
        stickyHeader && "sticky top-0 z-30",
        classNames?.thead
      )}
    >
      <tr>
        {visibleColumns.map((col) => {
          const isSorted = sortField === col.accessorKey;
          return (
            <th
              key={col.accessorKey}
              data-column-key={col.accessorKey}
              style={{
                width: col.width,
                minWidth: col.minWidth,
                maxWidth: col.maxWidth,
                ...getStickyStyle(col.accessorKey),
              }} className={cn(
                "text-left font-semibold text-gray-600 uppercase tracking-wider transition-shadow duration-200 bg-gray-100",
                densityClasses.th,
                col.sortable && "cursor-pointer select-none hover:bg-gray-200",
                getStickyClass(col.accessorKey, true),
                getStickyShadow(col.accessorKey),
                classNames?.th
              )}
              onClick={() => {
                if (col.sortable) setSort(col.accessorKey);
              }}
            >
              <span className="inline-flex items-center gap-1">
                {col.header}
                {isSorted && (
                  <span className="text-blue-600">
                    {sortDirection === "asc" ? " ↑" : " ↓"}
                  </span>
                )}
              </span>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}