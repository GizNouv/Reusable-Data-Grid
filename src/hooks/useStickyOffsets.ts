"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ColumnDef } from "@/types/data-grid.types";

interface UseStickyOffsetsProps {
  stickyColumns?: { left?: string[]; right?: string[] };
  visibleColumns: ColumnDef<any>[];
}

export function useStickyOffsets({ stickyColumns, visibleColumns }: UseStickyOffsetsProps) {
  const [offsets, setOffsets] = useState<Record<string, number>>({});
  const calculatedRef = useRef(false);

  const calculateOffsets = useCallback(() => {
    if (!stickyColumns) {
      setOffsets({});
      return;
    }

    const newOffsets: Record<string, number> = {};

    const calc = (keys: string[]) => {
      let offset = 0;
      keys.forEach((key) => {
        if (!visibleColumns.find((c) => c.accessorKey === key)) return;
        newOffsets[key] = offset;
        const th = document.querySelector(`th[data-column-key="${key}"]`);
        if (th) {
          offset += th.getBoundingClientRect().width;
        }
      });
    };

    if (stickyColumns.left) calc(stickyColumns.left);
    if (stickyColumns.right) calc(stickyColumns.right);

    setOffsets(newOffsets);
  }, [stickyColumns]);

  // Initial calculation
  useEffect(() => {
    calculateOffsets();
    calculatedRef.current = true;
  }, [calculateOffsets]);

  // Recalculate on resize only
  useEffect(() => {
    if (!calculatedRef.current || !stickyColumns) return;

    const handleResize = () => calculateOffsets();

    const observer = new ResizeObserver(() => calculateOffsets());

    const allKeys = [...(stickyColumns.left || []), ...(stickyColumns.right || [])];
    allKeys.forEach((key) => {
      const th = document.querySelector(`th[data-column-key="${key}"]`);
      if (th) observer.observe(th);
    });

    window.addEventListener("resize", handleResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateOffsets, stickyColumns]);

  return offsets;
}