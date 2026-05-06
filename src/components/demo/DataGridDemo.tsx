"use client";

import { DataGrid } from "@/components/data-grid/DataGrid";
import { ColumnDef, FetchParams, FetchResponse, UserData } from "@/types/data-grid.types";

const columns: ColumnDef<UserData>[] = [
  { accessorKey: "id", header: "ID", cellType: "number", sortable: true, width: 80 },
  { accessorKey: "name", header: "Name", cellType: "text", sortable: true, filterable: true },
  { accessorKey: "email", header: "Email", cellType: "text", filterable: true },
  { accessorKey: "age", header: "Age", cellType: "number", sortable: true, filterable: true },
  { accessorKey: "city", header: "City", cellType: "text", filterable: true },
  {
    accessorKey: "status",
    header: "Status",
    cellType: "custom",
    sortable: true,
    filterable: true,
    filterDef: {
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Pending", value: "pending" },
      ],
    },
    customRenderer: (row) => {
      const colors: Record<string, string> = {
        active: "bg-green-100 text-green-800",
        inactive: "bg-red-100 text-red-800",
        pending: "bg-yellow-100 text-yellow-800",
      };
      return (
        <span
          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${colors[row.status]
            }`}
        >
          {row.status}
        </span>
      );
    },
  },
  {
    accessorKey: "isVerified",
    header: "Verified",
    cellType: "boolean",
    filterable: true,
    filterDef: { type: "boolean" },
    booleanConfig: {
      trueLabel: "Sent",
      falseLabel: "Not Sent",
      trueClassName: "bg-blue-100 text-blue-800",
      falseClassName: "bg-gray-200 text-gray-500",
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cellType: "jalali-date",
    sortable: true,
    filterable: true,
    filterDef: {
      type: "date",
      placeholder: "YYYY-MM-DD",
      operator: "contains",
    },
  }
];

async function fetchUsers(params: FetchParams): Promise<FetchResponse<UserData>> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page));
  searchParams.set("pageSize", String(params.pageSize));
  if (params.sortField) searchParams.set("sortField", params.sortField.toString());
  if (params.sortDirection) searchParams.set("sortDirection", params.sortDirection);
  if (params.filters?.length) searchParams.set("filters", JSON.stringify(params.filters));
  if (params.search) searchParams.set("search", params.search);

  const res = await fetch(`/api/data?${searchParams.toString()}`);
  if (!res.ok) throw new Error((await res.json()).message || "Failed to fetch");
  return res.json();
}

export function DataGridDemo() {
  return (
    <DataGrid<UserData>
      columns={columns}
      fetchData={fetchUsers}
      defaultPageSize={10}
      enableExport
      stickyHeader
      density="standard"
      stickyColumns={{left: ['id', 'name']}}
      syncWithUrl
    />
  );
}