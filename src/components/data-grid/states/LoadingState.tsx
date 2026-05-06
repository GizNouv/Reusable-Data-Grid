import { Skeleton } from "./Skeleton";

interface Props {
  rowCount: number;
  columnCount: number;
}

export function LoadingState({columnCount = 5,rowCount = 15}:Props) {
  return (
    <div className="space-y-2 p-4 min-h-125" role="status" aria-label="Loading">
      {Array.from({ length: rowCount }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {
            Array.from({length: columnCount}).map((_, i) => (
              <Skeleton key={i} className="h-6 flex-1" />
            ))
          }
        </div>
      ))}
    </div>
  );
}