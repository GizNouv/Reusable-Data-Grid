"use client";

import { useDataGridContext } from "@/context/DataGridContext";
import { cn } from "@/lib/cn";

interface ToolbarProps {
  children?: React.ReactNode;
}

export function Toolbar({ children }: ToolbarProps) {
  const { classNames } = useDataGridContext();

  return (
    <div
      className={cn(
        "flex flex-col",
        classNames?.toolbar
      )}
    >
      {children}
    </div>
  );
}