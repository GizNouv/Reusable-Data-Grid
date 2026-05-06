import React from "react";

// ═══════════════════════════════════════
// Base Types
// ═══════════════════════════════════════

/* Types That Table Supports */
export type CellDataType = "text" | "number" | "jalali-date" | "boolean" | "custom";

/* Status Of Each Data Row */
export type RowStatus = "active" | "inactive" | "pending";
export type Density = "compact" | "standard" | "comfortable";

/* Schema OF Mock Data */
export interface UserData {
  id: number;
  name: string;
  email: string;
  age: number;
  city: string;
  status: RowStatus;
  isVerified: boolean;
  createdAt: string;
}

// ═══════════════════════════════════════
// Filter Types
// ═══════════════════════════════════════

export type FilterOperator = "contains" | "equals" | "gte" | "lte" | "is";

export interface FilterItem {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean;
}

export interface FilterDef {
  type: "text" | "number" | "select" | "boolean" | "date";
  placeholder?: string;
  options?: { label: string; value: string }[];
  operator?: FilterOperator;
}

// ═══════════════════════════════════════
// Column Definition
// ═══════════════════════════════════════

export interface BooleanCellConfig {
  trueLabel?: string;
  falseLabel?: string;
  trueClassName?: string;
  falseClassName?: string;
}

export interface ColumnDef<TData = unknown, TValue = unknown> {
  accessorKey: keyof TData & string;
  header: string;
  cellType: CellDataType;
  sortable?: boolean;
  filterable?: boolean;
  filterDef?: FilterDef;
  customRenderer?: (row: TData) => React.ReactNode;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  booleanConfig?: BooleanCellConfig;
}

// ═══════════════════════════════════════
// API Params & Response
// ═══════════════════════════════════════

export type SortField = keyof UserData;

export interface FetchParams {
  page: number;
  pageSize: number;
  sortField?: SortField;
  sortDirection?: "asc" | "desc";
  filters?: FilterItem[];
  search?: string;
}

export interface FetchResponse<TData> {
  data: TData[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ═══════════════════════════════════════
// Slot Renderers
// ═══════════════════════════════════════

export interface DataGridSlotRenderers {
  loadingRenderer?: () => React.ReactNode;
  emptyRenderer?: () => React.ReactNode;
  errorRenderer?: (message: string, onRetry: () => void) => React.ReactNode;
}

// ═══════════════════════════════════════
// ClassNames
// ═══════════════════════════════════════

export interface DataGridClassNames {
  base?: string;
  table?: string;
  thead?: string;
  th?: string;
  tbody?: string;
  tr?: string;
  td?: string;
  pagination?: string;
  toolbar?: string;
  // State wrappers
  loadingWrapper?: string;
  emptyWrapper?: string;
  errorWrapper?: string;
}

// ═══════════════════════════════════════
// Main Props
// ═══════════════════════════════════════

export interface DataGridProps<TData = UserData> {
  columns: ColumnDef<TData>[];
  fetchData: (params: FetchParams) => Promise<FetchResponse<TData>>;
  defaultPageSize?: number;
  syncWithUrl?: boolean;

  // Sticky behavior
  stickyHeader?: boolean;
  stickyColumns?: { left?: string[]; right?: string[] };

  // Header
  hideHeader?: boolean;

  // Export
  enableExport?: boolean;

  // Density
  density?: Density;

  // Column visibility (controlled)
  columnVisibility?: Record<string, boolean>;
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;

  // Styling
  classNames?: DataGridClassNames;

  // Slots
  slots?: DataGridSlotRenderers;

  // Children for compound pattern
  children?: React.ReactNode;
}

// ═══════════════════════════════════════
// Context Value
// ═══════════════════════════════════════

export interface DataGridContextValue<TData = unknown> {
  // Data
  data: TData[];
  columns: ColumnDef<TData>[];
  visibleColumns: ColumnDef<TData>[];

  // State
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  sortField?: string;
  sortDirection: "asc" | "desc";
  filters: FilterItem[];
  search: string;
  status: "loading" | "success" | "error" | "empty";
  errorMessage: string;
  density: Density;

  // Visibility
  columnVisibility: Record<string, boolean>;

  // Config
  stickyHeader: boolean;
  stickyColumns?: { left?: string[]; right?: string[] };
  hideHeader: boolean;
  enableExport: boolean;
  classNames?: DataGridClassNames;
  isScrolled: boolean;
  
  // Actions
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSort: (field: string) => void;
  setFilters: (filters: FilterItem[]) => void;
  setSearch: (search: string) => void;
  toggleColumnVisibility: (field: string) => void;
  getStickyClass: (colKey: string, isHeader: boolean) => string;
  getStickyStyle: (colKey: string) => React.CSSProperties;
  setDensity: (density: Density) => void;
  retry: () => void;

  // Slot renderers
  slots?: DataGridSlotRenderers;
}