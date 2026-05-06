"use client";

import { useDataGridContext } from "@/context/DataGridContext";
import { cn } from "@/lib/cn";
import { Cell } from "./Cell";

interface RowProps {
  row: any;
  rowIndex: number;
  densityClasses: { th: string; td: string };
}

export function Row({ row, rowIndex, densityClasses }: RowProps) {
  const { visibleColumns, classNames, isScrolled, stickyColumns, getStickyClass, getStickyStyle } = useDataGridContext();

  const rowBg = rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50";

  const getStickyShadow = (colKey: string) => {
    if (!isScrolled || !stickyColumns) return "";
    if (stickyColumns.left?.includes(colKey)) return "drop-shadow-[4px_0_8px_rgba(0,0,0,0.1)]";
    if (stickyColumns.right?.includes(colKey)) return "drop-shadow-[-4px_0_8px_rgba(0,0,0,0.1)]";
    return "";
  };

  return (
    <tr
      className={cn(
        "border-b border-gray-100 transition-colors",
        rowBg,
        "hover:bg-blue-50",
        classNames?.tr
      )}
    >
      {visibleColumns.map((col) => (
        <td
          key={col.accessorKey}
          style={getStickyStyle(col.accessorKey)}
          className={cn(
            "text-gray-700 transition-shadow duration-200",
            densityClasses.td,
            getStickyClass(col.accessorKey, false),
            rowBg,
            getStickyShadow(col.accessorKey),
            classNames?.td
          )}
        >
          <Cell row={row} column={col} />
        </td>
      ))}
    </tr>
  );
}