"use client";

import { X } from "lucide-react";
import {
  VENUE_TYPES,
  INDOOR_OUTDOOR_OPTIONS,
  AMENITIES_LIST,
  BUDGET_RANGES,
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

const labelClass = "block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2";
const inputClass =
  "w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 bg-white";
const selectClass =
  "w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-400 bg-white appearance-none";

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
    <aside className="w-72 shrink-0 flex flex-col gap-0 border-r border-stone-200 bg-white h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
        <span className="text-base font-semibold text-stone-900">Filters</span>
        {hasFilters && (
          <button
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6 px-6 py-6">

        {/* Location */}
        <div>
          <label className={labelClass}>Location</label>
          <input
            type="text"
            placeholder="City, state, or zip"
            value={filters.location}
            onChange={(e) => set("location", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Price Range */}
        <div>
          <label className={labelClass}>Price</label>
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
          {/* Quick budget pills */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {BUDGET_RANGES.map((r) => {
              const active = filters.priceMin === String(r.min) && filters.priceMax === String(r.max);
              return (
                <button
                  key={r.value}
                  onClick={() => {
                    if (active) {
                      onChange({ ...filters, priceMin: "", priceMax: "" });
                    } else {
                      onChange({ ...filters, priceMin: String(r.min), priceMax: String(r.max) });
                    }
                  }}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    active
                      ? "bg-stone-900 text-white border-stone-900"
                      : "border-stone-200 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  {r.scale}
                </button>
              );
            })}
          </div>
        </div>

        {/* Venue Type */}
        <div>
          <label className={labelClass}>Venue Type</label>
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
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 8L1 3h10z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Indoor / Outdoor */}
        <div>
          <label className={labelClass}>Setting</label>
          <div className="relative">
            <select
              value={filters.indoor_outdoor}
              onChange={(e) => set("indoor_outdoor", e.target.value)}
              className={selectClass}
            >
              <option value="">Any setting</option>
              {INDOOR_OUTDOOR_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 8L1 3h10z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Number of Guests */}
        <div>
          <label className={labelClass}>Number of Guests</label>
          <div className="flex items-center gap-3 border border-stone-200 rounded-lg px-4 py-2.5">
            <button
              type="button"
              onClick={() => set("guests", String(Math.max(0, (Number(filters.guests) || 0) - 10)))}
              className="text-stone-400 hover:text-stone-900 w-5 h-5 flex items-center justify-center text-lg leading-none select-none"
            >
              −
            </button>
            <span className="flex-1 text-center text-sm text-stone-900 tabular-nums">
              {filters.guests ? Number(filters.guests).toLocaleString() : "Any"}
            </span>
            <button
              type="button"
              onClick={() => set("guests", String((Number(filters.guests) || 0) + 10))}
              className="text-stone-400 hover:text-stone-900 w-5 h-5 flex items-center justify-center text-lg leading-none select-none"
            >
              +
            </button>
          </div>
          {filters.guests && (
            <button
              className="mt-1 text-xs text-stone-400 hover:text-stone-600 transition-colors"
              onClick={() => set("guests", "")}
            >
              <X className="inline h-3 w-3 mr-0.5" />Clear
            </button>
          )}
        </div>

        {/* Amenities */}
        <div>
          <label className={labelClass}>Amenities</label>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_LIST.map((a) => {
              const active = filters.amenities.includes(a.value);
              return (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => toggleAmenity(a.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    active
                      ? "bg-stone-900 text-white border-stone-900"
                      : "border-stone-200 text-stone-600 hover:border-stone-400 bg-white"
                  }`}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Apply button */}
      <div className="sticky bottom-0 bg-white border-t border-stone-200 px-6 py-4 mt-auto">
        <button
          onClick={onApply}
          className="w-full bg-stone-900 text-white rounded-lg py-3 text-sm font-semibold hover:bg-stone-700 active:scale-[0.98] transition-all"
        >
          {loading ? "Searching…" : `Show ${resultCount} Venue${resultCount !== 1 ? "s" : ""}`}
        </button>
      </div>
    </aside>
  );
}
