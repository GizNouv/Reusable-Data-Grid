"use client";

import { useRef, useEffect, useCallback } from "react";
import { useDataGridContext } from "@/context/DataGridContext";
import { cn } from "@/lib/cn";
import { Header } from "./Header";
import { Body } from "./Body";

interface TableProps {
  densityClasses: { th: string; td: string };
  onScrollChange: (scrolled: boolean) => void;
}

export function Table({ densityClasses, onScrollChange }: TableProps) {
  const { classNames, stickyColumns } = useDataGridContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const scrolled = scrollContainerRef.current.scrollLeft > 0;
      onScrollChange(scrolled);
    }
  }, [onScrollChange]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && stickyColumns) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, stickyColumns]);

  return (
    <div
      className="overflow-y-auto max-h-125"
      ref={scrollContainerRef}
    >
      <div className="overflow-x-visible">
        <table className={cn("w-full", classNames?.table)}>
          <Header densityClasses={densityClasses} />
          <Body densityClasses={densityClasses} />
        </table>
      </div>
    </div>
  );
}