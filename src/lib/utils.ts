import { UserData, FilterItem, SortField } from "@/types/data-grid.types";

export function applyFilters(data: UserData[], filters: FilterItem[]): UserData[] {
  return data.filter((row) => {
    return filters.every((filter) => {
      const rowValue = row[filter.field as keyof UserData];

      switch (filter.operator) {
        case "contains":
          return String(rowValue).toLowerCase().includes(String(filter.value).toLowerCase());
        case "equals":
          if (typeof filter.value === "boolean") return rowValue === filter.value;
          return String(rowValue) === String(filter.value);
        case "gte":
          return Number(rowValue) >= Number(filter.value);
        case "lte":
          return Number(rowValue) <= Number(filter.value);
        case "is":
          if (filter.value === "true") return rowValue === true;
          if (filter.value === "false") return rowValue === false;
          return String(rowValue) === String(filter.value);
        default:
          return true;
      }
    });
  });
}

export function applySort(
  data: UserData[],
  sortField?: SortField,
  sortDirection?: "asc" | "desc"
): UserData[] {
  if (!sortField) return data;

  return [...data].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
}

export function applyPagination(
  data: UserData[],
  page: number,
  pageSize: number
): { paginatedData: UserData[]; totalPages: number } {
  const totalPages = Math.ceil(data.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return { paginatedData: data.slice(start, end), totalPages };
}