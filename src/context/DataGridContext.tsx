"use client";

import { createContext, useContext } from "react";
import { DataGridContextValue } from "@/types/data-grid.types";

export const DataGridContext = createContext<DataGridContextValue<any> | null>(null);

export function useDataGridContext<TData = unknown>(): DataGridContextValue<TData> {
  const context = useContext(DataGridContext);
  if (!context) {
    throw new Error(
      "DataGrid compound components must be used within <DataGrid>"
    );
  }
  return context as DataGridContextValue<TData>;
}