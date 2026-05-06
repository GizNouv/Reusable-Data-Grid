"use client";

import { ColumnDef } from "@/types/data-grid.types";
import { formatJalaliDate } from "@/lib/utils";

interface CellProps<TData> {
  row: TData;
  column: ColumnDef<TData>;
}

export function Cell<TData>({ row, column }: CellProps<TData>) {
  const value = row[column.accessorKey];

  if (column.cellType === "custom" && column.customRenderer) {
    return <>{column.customRenderer(row)}</>;
  }

  switch (column.cellType) {
    case "boolean": {
      const config = column.booleanConfig || {};
      const trueLabel = config.trueLabel || "Yes";
      const falseLabel = config.falseLabel || "No";
      const trueClass = config.trueClassName || "bg-green-100 text-green-800";
      const falseClass = config.falseClassName || "bg-gray-100 text-gray-600";

      return (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full flex items-center justify-center whitespace-nowrap max-w-fit ${
            value ? trueClass : falseClass
          }`}
        >
          {value ? trueLabel : falseLabel}
        </span>
      );
    }

    case "jalali-date":
      return <span dir="ltr">{formatJalaliDate(String(value))}</span>;

    case "number":
      return <span>{Number(value).toLocaleString()}</span>;

    case "text":
    default:
      return <span>{String(value)}</span>;
  }
}