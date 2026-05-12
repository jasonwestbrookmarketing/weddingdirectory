"use client";

import { X } from "lucide-react";
import {
  VENUE_TYPES,
  INDOOR_OUTDOOR_OPTIONS,
  AMENITIES_LIST,
} from "@/lib/constants";

export interface SearchFilters {
  location: string;
  priceMin: string;
  priceMax: string;
  guests: string;
  style: string;
  indoor_outdoor: string;
  amenities: string[];
}

export const DEFAULT_FILTERS: SearchFilters = {
  location: "",
  priceMin: "",
  priceMax: "",
  guests: "",
  style: "",
  indoor_outdoor: "",
  amenities: [],
};

interface Props {
  filters: SearchFilters;
  onChange: (f: SearchFilters) => void;
  onApply: () => void;
  resultCount: number;
  loading: boolean;
}

const sectionLabel = "block text-xs font-semibold text-stone-700 mb-2.5";
const inputClass =
  "w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 bg-white";
const selectClass =
  "w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-stone-400 bg-white appearance-none cursor-pointer";

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 py-4 border-b border-stone-100">
      {children}
    </div>
  );
}

export default function FilterPanel({ filters, onChange, onApply, resultCount, loading }: Props) {
  const set = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) =>
    onChange({ ...filters, [key]: value });

  const toggleAmenity = (val: string) => {
    const next = filters.amenities.includes(val)
      ? filters.amenities.filter((a) => a !== val)
      : [...filters.amenities, val];
    set("amenities", next);
  };

  const hasFilters =
    filters.location ||
    filters.priceMin ||
    filters.priceMax ||
    filters.guests ||
    filters.style ||
    filters.indoor_outdoor ||
    filters.amenities.length > 0;

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-white h-full overflow-y-auto">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
        <span className="text-sm font-bold text-stone-900">Filters</span>
        {hasFilters && (
          <button
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Location */}
      <Section>
        <label className={sectionLabel}>Location</label>
        <input
          type="text"
          placeholder="City, state, or zip"
          value={filters.location}
          onChange={(e) => set("location", e.target.value)}
          className={inputClass}
        />
      </Section>

      {/* Price */}
      <Section>
        <label className={sectionLabel}>Price</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="From"
            value={filters.priceMin}
            onChange={(e) => set("priceMin", e.target.value)}
            className={inputClass}
            min={0}
          />
          <input
            type="number"
            placeholder="To"
            value={filters.priceMax}
            onChange={(e) => set("priceMax", e.target.value)}
            className={inputClass}
            min={0}
          />
        </div>
      </Section>

      {/* Venue Type */}
      <Section>
        <label className={sectionLabel}>Venue Type</label>
        <div className="relative">
          <select
            value={filters.style}
            onChange={(e) => set("style", e.target.value)}
            className={selectClass}
          >
            <option value="">All types</option>
            {VENUE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 8L1 3h10z"/>
            </svg>
          </div>
        </div>
      </Section>

      {/* Setting */}
      <Section>
        <label className={sectionLabel}>Setting</label>
        <div className="relative">
          <select
            value={filters.indoor_outdoor}
            onChange={(e) => set("indoor_outdoor", e.target.value)}
            className={selectClass}
          >
            <option value="">Any</option>
            {INDOOR_OUTDOOR_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 8L1 3h10z"/>
            </svg>
          </div>
        </div>
      </Section>

      {/* Amenities */}
      <Section>
        <label className={sectionLabel}>Amenities</label>
        <div className="grid grid-cols-2 gap-2">
          {AMENITIES_LIST.map((a) => {
            const active = filters.amenities.includes(a.value);
            return (
              <button
                key={a.value}
                type="button"
                onClick={() => toggleAmenity(a.value)}
                className={`text-xs px-3 py-2 rounded-lg border text-left transition-colors leading-tight ${
                  active
                    ? "bg-stone-900 text-white border-stone-900"
                    : "border-stone-200 text-stone-700 hover:border-stone-400 bg-white"
                }`}
              >
                {a.label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Number of Guests */}
      <Section>
        <label className={sectionLabel}>Number of Guests</label>
        <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => {
              const cur = Number(filters.guests) || 1;
              if (cur <= 1) set("guests", "");
              else set("guests", String(cur - 1));
            }}
            className="w-10 h-10 flex items-center justify-center text-stone-500 hover:bg-stone-50 text-lg border-r border-stone-200 select-none"
          >
            −
          </button>
          <span className="flex-1 text-center text-sm text-stone-900 tabular-nums">
            {filters.guests || "1"}
          </span>
          <button
            type="button"
            onClick={() => set("guests", String((Number(filters.guests) || 1) + 1))}
            className="w-10 h-10 flex items-center justify-center text-stone-500 hover:bg-stone-50 text-lg border-l border-stone-200 select-none"
          >
            +
          </button>
        </div>
        {filters.guests && (
          <button
            className="mt-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-1"
            onClick={() => set("guests", "")}
          >
            <X className="h-3 w-3" />Clear
          </button>
        )}
      </Section>

      {/* Apply */}
      <div className="px-5 py-4 mt-auto">
        <button
          onClick={onApply}
          className="w-full bg-stone-900 text-white rounded-lg py-3 text-sm font-bold uppercase tracking-wider hover:bg-stone-700 active:scale-[0.98] transition-all"
        >
          {loading ? "Searching…" : "Apply"}
        </button>
      </div>

    </aside>
  );
}
