"use client";

import { useDataGridContext } from "@/context/DataGridContext";
import { FilterComboBox } from "./FilterComboBox";

export function Filters() {
  const { visibleColumns, filters, setFilters } = useDataGridContext();

  const filterableColumns = visibleColumns.filter((col) => col.filterable);

  if (filterableColumns.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 *:min-fit!">
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
      {filters.length > 0 && (
        <button
          onClick={() => setFilters([])}
          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 active:scale-95 transition-all duration-200"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Clear
        </button>
      )}
    </div>
  );
}