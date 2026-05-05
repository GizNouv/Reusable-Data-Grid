// ═══════════════════════════════════════
// Fundamentals Types
// ═══════════════════════════════════════

/* Types That Table Supports */
export type CellDataType = "text" | "number" | "jalali-date" | "boolean" | "custom";

/* Status Of Each Data Row */
export type RowStatus = "active" | "inactive" | "pending";

/* Schema OF Mock Data */
export interface UserData {
  id: number;
  name: string;
  email: string;
  age: number;
  city: string;
  status: RowStatus;
  isVerified: boolean;
  createdAt: string; // Jalali Date
}

// ═══════════════════════════════════════
// Table Columns Declaration
// ═══════════════════════════════════════

export interface ColumnDef<TData = unknown, TValue = unknown> {
  accessorKey: keyof TData & string;
  header: string;
  cellType: CellDataType;
  sortable?: boolean;
  filterable?: boolean;
  customRenderer?: (row: TData) => React.ReactNode;
  width?: number;
}

// ═══════════════════════════════════════
// API Parameters
// ═══════════════════════════════════════

export type SortField = keyof UserData;

export interface FilterItem {
  field: string;
  operator: "contains" | "equals" | "gte" | "lte" | "is";
  value: string | number | boolean;
}

export interface FetchParams {
  page: number;
  pageSize: number;
  sortField?: SortField;
  sortDirection?: "asc" | "desc";
  filters?: FilterItem[];
}

// ═══════════════════════════════════════
// API Response
// ═══════════════════════════════════════

export interface FetchResponse<TData> {
  data: TData[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ═══════════════════════════════════════
// Main Module Grid Props
// ═══════════════════════════════════════

export interface DataGridProps<TData = UserData> {
  columns: ColumnDef<TData>[];
  fetchData: (params: FetchParams) => Promise<FetchResponse<TData>>;
  defaultPageSize?: number;
  syncWithUrl?: boolean;
}