"use client";

import { useDataGridContext } from "@/context/DataGridContext";
import { FilterDef } from "@/types/data-grid.types";
import { useState } from "react";

interface FilterComboBoxProps {
  field: string;
  label: string;
  filterDef: FilterDef;
}

export function FilterComboBox({ field, label, filterDef }: FilterComboBoxProps) {
  const { filters, setFilters } = useDataGridContext();
  const [isFocused, setIsFocused] = useState(false);

  const currentValue =
    (filters.find((f) => f.field === field)?.value as string) ?? "";

  const handleChange = (value: string) => {
    const otherFilters = filters.filter((f) => f.field !== field);
    if (value === "") {
      setFilters(otherFilters);
    } else {
      setFilters([
        ...otherFilters,
        {
          field,
          operator: filterDef.operator || "contains",
          value,
        },
      ]);
    }
  };

  const baseInputClasses =
    "border border-gray-300 rounded-lg px-3 py-2 text-sm transition-all duration-200 ease-in-out outline-none";

  const focusClasses = "focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  // Boolean filter
  if (filterDef.type === "boolean") {
    return (
      <div className="relative">
        <select
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${baseInputClasses} ${focusClasses} appearance-none pr-8 bg-white cursor-pointer w-full ${
            isFocused ? "shadow-md" : ""
          }`}
        >
          <option value="">{label}</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <svg
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-transform duration-200 ${
            isFocused ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    );
  }

  // Select filter
  if (filterDef.type === "select" && filterDef.options) {
    return (
      <div className="relative">
        <select
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${baseInputClasses} ${focusClasses} appearance-none pr-8 bg-white cursor-pointer w-full ${
            isFocused ? "shadow-md" : ""
          }`}
        >
          <option value="">{label}</option>
          {filterDef.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-transform duration-200 ${
            isFocused ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    );
  }

  // Date filter (Jalali)
  if (filterDef.type === "date") {
    return (
      <div className="relative">
        <input
          type="text"
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={filterDef.placeholder || `${label} (YYYY/MM/DD)`}
          className={`${baseInputClasses} ${focusClasses} w-full pl-9 ${
            isFocused ? "shadow-md" : ""
          }`}
        />
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  // Text or number input
  return (
    <input
      type={filterDef.type === "number" ? "number" : "text"}
      value={currentValue}
      onChange={(e) => handleChange(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={filterDef.placeholder || label}
      className={`${baseInputClasses} ${focusClasses} w-40 ${
        isFocused ? "shadow-md" : ""
      }`}
    />
  );
}