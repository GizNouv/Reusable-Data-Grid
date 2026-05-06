"use client";

import { useState, useRef, useEffect } from "react";
import { useDataGridContext } from "@/context/DataGridContext";
import { FilterComboBox } from "./FilterComboBox";

export function FilterPopover() {
  const { visibleColumns, filters } = useDataGridContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filterableColumns = visibleColumns.filter((col) => col.filterable);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (filterableColumns.length === 0) return null;

  return (
    <div ref={ref} className="relative lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="relative inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {filters.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-blue-600 rounded-full">
            {filters.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 max-h-80 overflow-y-auto">
          <div className="flex flex-col gap-3 *:w-full!">
            {filterableColumns.map((col) => (
              <FilterComboBox
                key={col.accessorKey}
                field={col.accessorKey}
                label={col.header}
                filterDef={
                  col.filterDef || {
                    type: col.cellType === "number"
                      ? "number"
                      : col.cellType === "jalali-date"
                      ? "date"
                      : "text",
                  }
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}