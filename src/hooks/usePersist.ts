"use client";

import { useState, useCallback } from "react";

const STORAGE_PREFIX = "datagrid_";

/**
 * Persists a value in localStorage.
 * Reads from localStorage on mount, writes on change.
 * Falls back to defaultValue if nothing stored or on error.
 */
export function usePersist<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Read initial value from localStorage (SSR-safe)
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (stored !== null) return JSON.parse(stored);
    } catch {
      // Corrupted or missing data — use default
    }
    return defaultValue;
  });

  // Wrapped setter that also writes to localStorage
  const setPersistedValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof newValue === "function"
            ? (newValue as (prev: T) => T)(prev)
            : newValue;
        try {
          localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(resolved));
        } catch {
          // localStorage full or unavailable — silently ignore
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, setPersistedValue];
}