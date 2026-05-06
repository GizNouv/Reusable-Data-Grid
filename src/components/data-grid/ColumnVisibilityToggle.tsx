"use client";

import { useState, useRef, useEffect } from "react";
import { useDataGridContext } from "@/context/DataGridContext";

export function ColumnVisibilityToggle() {
  const { columns, columnVisibility, toggleColumnVisibility } = useDataGridContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        Columns
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {columns.map((col) => (
            <label
              key={col.accessorKey}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={columnVisibility[col.accessorKey] !== false}
                onChange={() => toggleColumnVisibility(col.accessorKey)}
                className="rounded"
              />
              {col.header}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}