"use client";

import { useCallback } from "react";
import { ColumnDef } from "@/types/data-grid.types";

interface UseExportDataProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  filename?: string;
}

export function useExportData<TData>({
  columns,
  data,
  filename = "export",
}: UseExportDataProps<TData>) {
  const getRowValue = (row: TData, col: ColumnDef<TData>): string => {
    const val = row[col.accessorKey];
    if (val === null || val === undefined) return "";
    if (typeof val === "boolean") return val ? "Yes" : "No";
    return String(val);
  };

  const exportCSV = useCallback(() => {
    const headers = columns.map((col) => col.header).join(",");
    const rows = data
      .map((row) => columns.map((col) => `"${getRowValue(row, col)}"`).join(","))
      .join("\n");
    const csv = `${headers}\n${rows}`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [columns, data, filename]);

  const exportExcel = useCallback(() => {
    const headers = columns.map((col) => col.header).join("\t");
    const rows = data
      .map((row) => columns.map((col) => getRowValue(row, col)).join("\t"))
      .join("\n");
    const tsv = `${headers}\n${rows}`;

    const blob = new Blob([tsv], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  }, [columns, data, filename]);

  return { exportCSV, exportExcel };
}