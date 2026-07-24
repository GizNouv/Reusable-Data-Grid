"use client";

import { useState, useRef, useEffect } from "react";

interface ExportButtonProps {
  onExportCSV: () => void;
  onExportExcel: () => void;
}

export function ExportButton({ onExportCSV, onExportExcel }: ExportButtonProps) {
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
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            onClick={() => { onExportCSV(); setOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-t-lg cursor-pointer"
          >
            CSV
          </button>
          <button
            onClick={() => { onExportExcel(); setOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-b-lg cursor-pointer"
          >
            Excel
          </button>
        </div>
      )}
    </div>
  );
}