"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useRef, useEffect } from "react";

interface UseUrlSyncOptions {
  enabled: boolean;
}

/**
 * Syncs DataGrid state with URL query parameters.
 * Only pushes to URL — reading happens once via getInitial on mount.
 */
export function useUrlSync({ enabled }: UseUrlSyncOptions) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);

  // Read initial values from URL ONCE
  const getInitial = useCallback(
    <T,>(key: string, fallback: T, parser: (val: string) => T): T => {
      if (!enabled) return fallback;
      if (initializedRef.current) return fallback; // Only read on first render
      const val = searchParams.get(key);
      if (val === null) return fallback;
      try {
        return parser(val);
      } catch {
        return fallback;
      }
    },
    [enabled, searchParams]
  );

  // Mark initialized after first read
  useEffect(() => {
    initializedRef.current = true;
  }, []);

  // Push updated values to URL
  const pushToUrl = useCallback(
    (updates: Record<string, string | undefined>) => {
      if (!enabled) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        // Build new params without reading current URL
        const params = new URLSearchParams();
        
        Object.entries(updates).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            params.set(key, value);
          }
        });

        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        
        router.replace(newUrl, { scroll: false });
      }, 300);
    },
    [enabled, router, pathname]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { getInitial, pushToUrl };
}