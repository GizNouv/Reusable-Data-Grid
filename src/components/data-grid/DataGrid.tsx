"use client";

import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import {
  DataGridProps,
  FetchParams,
  FetchResponse,
  FilterItem,
  Density,
} from "@/types/data-grid.types";
import { DataGridContext } from "@/context/DataGridContext";
import { useExportData } from "@/hooks/useExportData";
import { cn } from "@/lib/cn";
import { Toolbar } from "./Toolbar";
import { SearchInput } from "./SearchInput";
import { FilterComboBox } from "./FilterComboBox";
import { Filters } from "./Filters";
import { ColumnVisibilityToggle } from "./ColumnVisibilityToggle";
import { ExportButton } from "./ExportButton";
import { Table } from "./Table";
import { Header } from "./Header";
import { Body } from "./Body";
import { Row } from "./Row";
import { Cell } from "./Cell";
import { Pagination } from "./Pagination";
import { PageSizeSelector } from "./PageSizeSelector";
import { PageInfo } from "./PageInfo";
import { PageButtons } from "./PageButtons";
import { useStickyOffsets } from "@/hooks/useStickyOffsets";
import { FilterTags } from "./FilterTags";
import { FilterPopover } from "./FilterPopover";
import { usePersist } from "@/hooks/usePersist";
import { useUrlSync } from "@/hooks/useUrlSync";

const DENSITY_CLASSES: Record<Density, { th: string; td: string }> = {
  compact: { th: "px-2 py-1 text-xs", td: "px-2 py-1 text-xs" },
  standard: { th: "px-4 py-3 text-xs", td: "px-4 py-3 text-sm" },
  comfortable: { th: "px-6 py-4 text-sm", td: "px-6 py-4 text-base" },
};

export function DataGrid<TData>({
  columns,
  fetchData,
  defaultPageSize = 10,
  syncWithUrl = false,
  stickyHeader = false,
  stickyColumns,
  hideHeader = false,
  enableExport = false,
  density = "standard",
  columnVisibility: externalVisibility,
  onColumnVisibilityChange,
  classNames,
  slots,
  children,
}: DataGridProps<TData>) {
  // ──────────────────────────────────────
  // URL Sync
  // ──────────────────────────────────────
  const urlSync = useUrlSync({ enabled: syncWithUrl });

  // ──────────────────────────────────────
  // State
  // ──────────────────────────────────────
  const [data, setData] = useState<TData[]>([]);

  // Data states — synced with URL
  const [page, setPage] = useState(() =>
    urlSync.getInitial("page", 1, parseInt)
  );
  const [pageSize, setPageSize] = useState(() =>
    urlSync.getInitial("pageSize", defaultPageSize, parseInt)
  );
  const [sortField, setSortField] = useState<string | undefined>(() =>
    urlSync.getInitial("sortField", undefined as string | undefined, (v) => v)
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(() =>
    urlSync.getInitial("sortDirection", "asc" as "asc" | "desc", (v) =>
      v === "desc" ? "desc" : "asc"
    )
  );
  const [filters, setFilters] = useState<FilterItem[]>(() =>
    urlSync.getInitial("filters", [] as FilterItem[], (v) => {
      try {
        return JSON.parse(v);
      } catch {
        return [];
      }
    })
  );
  const [search, setSearch] = useState(() =>
    urlSync.getInitial("search", "", (v) => v)
  );

  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState<"loading" | "success" | "error" | "empty">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Persisted visual preferences
  const [persistedDensity, setPersistedDensity] = usePersist<Density>("density", density);

  const [internalVisibility, setInternalVisibility] = usePersist<Record<string, boolean>>(
    "columnVisibility",
    (() => {
      const init: Record<string, boolean> = {};
      columns.forEach((col) => (init[col.accessorKey] = true));
      return init;
    })()
  );

  // Use explicit prop if provided, otherwise persisted. Default to "standard".
  const currentDensity = persistedDensity;
  const visibility = externalVisibility ?? internalVisibility;
  const handleVisibilityChange = onColumnVisibilityChange ?? setInternalVisibility;

  const visibleColumns = columns.filter((col) => visibility[col.accessorKey] !== false);

  // Export
  const { exportCSV, exportExcel } = useExportData({ columns: visibleColumns, data });

  const stickyOffsets = useStickyOffsets({ stickyColumns, visibleColumns });

  // ──────────────────────────────────────
  // Push state changes to URL
  // ──────────────────────────────────────
  const prevUrlRef = useRef<string>("");

  useEffect(() => {
    const updates: Record<string, string | undefined> = {
      page: page !== 1 ? String(page) : undefined,
      pageSize: pageSize !== defaultPageSize ? String(pageSize) : undefined,
      sortField: sortField || undefined,
      sortDirection: sortDirection !== "asc" ? sortDirection : undefined,
      search: search || undefined,
      filters: filters.length > 0 ? JSON.stringify(filters) : undefined,
    };

    // Build URL string from updates
    const params = new URLSearchParams();
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const newUrl = params.toString();

    // Only push if different from last time
    if (newUrl !== prevUrlRef.current) {
      prevUrlRef.current = newUrl;
      urlSync.pushToUrl(updates);
    }
  }, [page, pageSize, sortField, sortDirection, search, filters, urlSync, defaultPageSize]);

  // ──────────────────────────────────────
  // Data fetching
  // ──────────────────────────────────────
  const loadData = useCallback(async () => {
    setStatus("loading");

    const params: FetchParams = {
      page,
      pageSize,
      sortField: sortField as FetchParams["sortField"],
      sortDirection,
      filters,
      search: search || undefined,
    };

    try {
      const response: FetchResponse<TData> = await fetchData(params);
      setData(response.data);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
      setStatus(response.data.length === 0 ? "empty" : "success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }, [page, pageSize, sortField, sortDirection, filters, search, fetchData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ──────────────────────────────────────
  // Handlers
  // ──────────────────────────────────────
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(1);
  };

  const handleToggleColumn = (field: string) => {
    handleVisibilityChange({ ...visibility, [field]: !visibility[field] });
  };

  // ──────────────────────────────────────
  // Sticky column helper
  // ──────────────────────────────────────
  const getStickyClass = (colKey: string, isHeader: boolean) => {
    let cls = "";
    if (isScrolled) {
      if (stickyColumns?.left?.includes(colKey)) {
        cls += "sticky z-10";
        if (isHeader) cls += "bg-gray-100";
      }
      if (stickyColumns?.right?.includes(colKey)) {
        cls += "sticky z-10";
        if (isHeader) cls += "bg-gray-100";
      }
      return cls;
    }
    return ""
  };

  const getStickyStyle = (colKey: string): React.CSSProperties => {
    const style: React.CSSProperties = {};

    if (stickyColumns?.left?.includes(colKey)) {
      style.left = stickyOffsets[colKey] ?? 0;
    }
    if (stickyColumns?.right?.includes(colKey)) {
      style.right = stickyOffsets[colKey] ?? 0;
    }

    return style;
  };

  // ──────────────────────────────────────
  // Context value
  // ──────────────────────────────────────
  const contextValue = useMemo(
    () => ({
      data,
      columns,
      visibleColumns,
      page,
      pageSize,
      totalCount,
      totalPages,
      sortField,
      sortDirection,
      filters,
      search,
      status,
      errorMessage,
      density: currentDensity,
      setDensity: setPersistedDensity,
      columnVisibility: visibility,
      stickyHeader,
      stickyColumns,
      hideHeader,
      enableExport,
      classNames,
      setPage,
      setPageSize,
      setSort: handleSort,
      setFilters,
      setSearch,
      toggleColumnVisibility: handleToggleColumn,
      retry: loadData,
      slots,
      isScrolled,
      getStickyClass,
      getStickyStyle,
    }),
    [
      data,
      columns,
      visibleColumns,
      page,
      pageSize,
      totalCount,
      totalPages,
      sortField,
      sortDirection,
      filters,
      search,
      status,
      errorMessage,
      currentDensity,
      setPersistedDensity,
      visibility,
      stickyHeader,
      stickyColumns,
      hideHeader,
      enableExport,
      classNames,
      loadData,
      slots,
      isScrolled,
      getStickyClass,
      getStickyStyle,
    ]
  );

  // ──────────────────────────────────────
  // Default layout
  // ──────────────────────────────────────
  const defaultLayout = (
    <>
      <Toolbar>
        {/* Row 1: Search + Actions (always visible) */}
        <div className="flex flex-wrap justify-between items-center gap-3 p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <SearchInput />
            <FilterPopover />
          </div>
          <div className="flex gap-2">
            <ColumnVisibilityToggle />
            {enableExport && <ExportButton onExportCSV={exportCSV} onExportExcel={exportExcel} />}
          </div>
        </div>

        {/* Row 2: Desktop filters (hidden on mobile) */}
        {visibleColumns.some((col) => col.filterable) && (
          <div className="hidden lg:flex flex-wrap items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
            <Filters />
          </div>
        )}

        {/* Row 3: Active filter tags (shown when filters are active) */}
        <FilterTags />
      </Toolbar>

      <Table
        densityClasses={DENSITY_CLASSES[currentDensity]}
        onScrollChange={setIsScrolled}
      />
      <Pagination>
        <div className="flex justify-between items-center flex-1 w-full">
          <PageSizeSelector />
          <PageInfo />
        </div>
        <PageButtons />
      </Pagination>
    </>
  );

  return (
    <DataGridContext.Provider value={contextValue}>
      <div className={cn("bg-white rounded-lg shadow border border-gray-200 overflow-hidden", classNames?.base)}>
        {children ?? defaultLayout}
      </div>
    </DataGridContext.Provider>
  );
}

// ──────────────────────────────────────────────────
// Attach sub-components
// ──────────────────────────────────────────────────
DataGrid.Toolbar = Toolbar;
DataGrid.SearchInput = SearchInput;
DataGrid.FilterComboBox = FilterComboBox;
DataGrid.Filters = Filters;
DataGrid.ColumnVisibilityToggle = ColumnVisibilityToggle;
DataGrid.ExportButton = ExportButton;
DataGrid.Table = Table;
DataGrid.Header = Header;
DataGrid.Body = Body;
DataGrid.Row = Row;
DataGrid.Cell = Cell;
DataGrid.Pagination = Pagination;
DataGrid.PageSizeSelector = PageSizeSelector;
DataGrid.PageInfo = PageInfo;
DataGrid.PageButtons = PageButtons;
DataGrid.FilterPopover = FilterPopover;
DataGrid.FilterTags = FilterTags;