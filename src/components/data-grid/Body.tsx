"use client";

import { useDataGridContext } from "@/context/DataGridContext";
import { Row } from "./Row";
import { LoadingState } from "./states/LoadingState";
import { EmptyState } from "./states/EmptyState";
import { ErrorState } from "./states/ErrorState";
import { cn } from "@/lib/cn";

// Default styles for tbody
const DEFAULT_TBODY_CLASSES = "max-h-125";

interface BodyProps {
  densityClasses: { th: string; td: string };
}

export function Body({ densityClasses }: BodyProps) {
  const { data, status, errorMessage, retry, slots, visibleColumns, classNames, pageSize } =
    useDataGridContext();

  if (status === "loading") {
    return (
      <tbody className={cn(DEFAULT_TBODY_CLASSES, classNames?.tbody, classNames?.loadingWrapper)}>
        <tr>
          <td colSpan={visibleColumns.length}>
            {slots?.loadingRenderer ? (
              slots.loadingRenderer()
            ) : (
              <LoadingState
                columnCount={visibleColumns.length}
                rowCount={pageSize}
              />
            )}
          </td>
        </tr>
      </tbody>
    );
  }

  if (status === "error") {
    return (
      <tbody className={cn(DEFAULT_TBODY_CLASSES, classNames?.tbody, classNames?.errorWrapper)}>
        <tr>
          <td colSpan={visibleColumns.length || 1}>
            {slots?.errorRenderer ? (
              slots.errorRenderer(errorMessage, retry)
            ) : (
              <ErrorState message={errorMessage} onRetry={retry} />
            )}
          </td>
        </tr>
      </tbody>
    );
  }

  if (status === "empty") {
    return (
      <tbody className={cn(DEFAULT_TBODY_CLASSES, classNames?.tbody, classNames?.emptyWrapper)}>
        <tr>
          <td colSpan={visibleColumns.length || 1}>
            {slots?.emptyRenderer ? slots.emptyRenderer() : <EmptyState />}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className={cn(DEFAULT_TBODY_CLASSES, classNames?.tbody)}>
      {data.map((row, index) => (
        <Row
          key={index}
          row={row}
          rowIndex={index}
          densityClasses={densityClasses}
        />
      ))}
    </tbody>
  );
}