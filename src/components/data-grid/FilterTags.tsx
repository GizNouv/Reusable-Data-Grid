"use client";

import { useDataGridContext } from "@/context/DataGridContext";
import { FilterItem } from "@/types/data-grid.types";

export function FilterTags() {
  const { filters, setFilters, visibleColumns } = useDataGridContext();

  if (filters.length === 0) return null;

  const removeFilter = (filter: FilterItem) => {
    setFilters(filters.filter((f) => f !== filter));
  };

  const getFilterLabel = (filter: FilterItem): string => {
    const col = visibleColumns.find((c) => c.accessorKey === filter.field);
    const header = col?.header || filter.field;
    let value = String(filter.value);
    
    // For boolean, show readable value
    if (typeof filter.value === "boolean") {
      value = filter.value ? "Yes" : "No";
    }
    
    return `${header}: ${value}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-4 py-2 bg-gray-50 border-b border-gray-200">
      {filters.map((filter, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full"
        >
          {getFilterLabel(filter)}
          <button
            onClick={() => removeFilter(filter)}
            className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      {filters.length > 0 && (
        <button
          onClick={() => setFilters([])}
          className="text-xs text-red-600 hover:text-red-800 ml-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
}