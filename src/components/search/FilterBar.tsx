"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  BUDGET_RANGES,
  VENUE_TYPES,
  INDOOR_OUTDOOR_OPTIONS,
} from "@/lib/constants";

export interface Filters {
  location: string;
  guests: string;
  budget: string;
  style: string;
  indoor_outdoor: string;
}

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const update = (key: keyof Filters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearAll = () => {
    onFilterChange({
      location: "",
      guests: "",
      budget: "",
      style: "",
      indoor_outdoor: "",
    });
  };

  const hasFilters = Object.values(filters).some(Boolean);

  const inputClass =
    "w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-transparent focus:ring-2 focus:ring-stone-900 focus:outline-none";
  const selectClass =
    "w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-transparent focus:ring-2 focus:ring-stone-900 focus:outline-none appearance-none";

  const filterInputs = (
    <>
      <div className="flex-1 min-w-[140px]">
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => update("location", e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="w-full md:w-32">
        <input
          type="number"
          placeholder="Guests"
          min={1}
          value={filters.guests}
          onChange={(e) => update("guests", e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="w-full md:w-44">
        <select
          value={filters.budget}
          onChange={(e) => update("budget", e.target.value)}
          className={selectClass}
        >
          <option value="">Budget</option>
          {BUDGET_RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full md:w-40">
        <select
          value={filters.style}
          onChange={(e) => update("style", e.target.value)}
          className={selectClass}
        >
          <option value="">Venue Type</option>
          {VENUE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full md:w-40">
        <select
          value={filters.indoor_outdoor}
          onChange={(e) => update("indoor_outdoor", e.target.value)}
          className={selectClass}
        >
          <option value="">Indoor / Outdoor</option>
          {INDOOR_OUTDOOR_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors whitespace-nowrap"
        >
          <X className="h-3.5 w-3.5" />
          Clear Filters
        </button>
      )}
    </>
  );

  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-3">{filterInputs}</div>

        {/* Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center gap-2 text-sm font-medium text-stone-700"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasFilters && (
              <span className="bg-stone-900 text-white text-xs px-2 py-0.5 rounded-full">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </button>
          {mobileOpen && (
            <div className="flex flex-col gap-3 mt-4">{filterInputs}</div>
          )}
        </div>
      </div>
    </div>
  );
}
