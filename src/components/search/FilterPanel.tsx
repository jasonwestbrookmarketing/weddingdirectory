"use client";

import { MapPin, X } from "lucide-react";
import {
  VENUE_TYPES,
  INDOOR_OUTDOOR_OPTIONS,
  AMENITIES_LIST,
  BUDGET_RANGES,
} from "@/lib/constants";

export interface SearchFilters {
  location: string;
  budget: string;
  priceMin: string;
  priceMax: string;
  guests: string;
  style: string;
  indoor_outdoor: string;
  amenities: string[];
}

export const DEFAULT_FILTERS: SearchFilters = {
  location: "",
  budget: "",
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

const sectionLabel = "block text-sm font-semibold text-stone-900 mb-2";
const inputClass =
  "w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 bg-white";
const selectClass =
  "w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400 bg-white appearance-none cursor-pointer";

export default function FilterPanel({ filters, onChange, onApply, loading }: Props) {
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
    filters.budget ||
    filters.priceMin ||
    filters.priceMax ||
    filters.guests ||
    filters.style ||
    filters.indoor_outdoor ||
    filters.amenities.length > 0;

  return (
    <aside className="w-72 shrink-0 flex flex-col bg-white overflow-y-auto">

      {/* Header */}
      <div className="flex items-center justify-between pt-6 pb-5 px-1">
        <span className="text-2xl font-bold text-stone-900">Filters</span>
        {hasFilters && (
          <button
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5 px-1 pb-6">

        {/* Location */}
        <div>
          <label className={sectionLabel}>Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="City, state, address, or zip"
              value={filters.location}
              onChange={(e) => set("location", e.target.value)}
              className="w-full border border-stone-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 bg-white"
            />
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className={sectionLabel}>Budget</label>
          <div className="grid grid-cols-5 gap-1.5 mb-3">
            {BUDGET_RANGES.map((r) => {
              const active = filters.budget === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => set("budget", active ? "" : r.value)}
                  className={`text-xs py-2 rounded-lg border font-medium transition-colors ${
                    active
                      ? "bg-stone-900 text-white border-stone-900"
                      : "border-stone-200 text-stone-600 hover:border-stone-400 bg-white"
                  }`}
                >
                  {r.scale}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Price from"
              value={filters.priceMin}
              onChange={(e) => set("priceMin", e.target.value)}
              className={inputClass}
              min={0}
            />
            <input
              type="number"
              placeholder="Price to"
              value={filters.priceMax}
              onChange={(e) => set("priceMax", e.target.value)}
              className={inputClass}
              min={0}
            />
          </div>
        </div>

        {/* Venue Type */}
        <div>
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
              <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor"><path d="M6 8L1 3h10z"/></svg>
            </div>
          </div>
        </div>

        {/* Setting */}
        <div>
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
              <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor"><path d="M6 8L1 3h10z"/></svg>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className={sectionLabel}>Amenities</label>
          <div className="grid grid-cols-2 gap-2">
            {AMENITIES_LIST.map((a) => {
              const active = filters.amenities.includes(a.value);
              return (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => toggleAmenity(a.value)}
                  className={`flex items-center gap-2 text-xs px-3 py-2.5 rounded-xl border text-left transition-colors leading-tight ${
                    active
                      ? "bg-stone-900 text-white border-stone-900"
                      : "border-stone-200 text-stone-700 hover:border-stone-400 bg-white"
                  }`}
                >
                  <span className="w-4 h-4 shrink-0 opacity-60">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-full h-full">
                      <circle cx="8" cy="8" r="3"/>
                    </svg>
                  </span>
                  <span className="truncate">{a.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Number of Guests */}
        <div>
          <label className={sectionLabel}>Number of Guests</label>
          <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => {
                const cur = Number(filters.guests) || 1;
                if (cur <= 1) set("guests", "");
                else set("guests", String(cur - 1));
              }}
              className="w-11 h-11 flex items-center justify-center text-stone-500 hover:bg-stone-50 text-xl select-none transition-colors"
            >
              −
            </button>
            <span className="flex-1 text-center text-sm font-medium text-stone-900 tabular-nums">
              {filters.guests || "1"}
            </span>
            <button
              type="button"
              onClick={() => set("guests", String((Number(filters.guests) || 1) + 1))}
              className="w-11 h-11 flex items-center justify-center text-stone-500 hover:bg-stone-50 text-xl select-none transition-colors"
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
        </div>

      </div>

      {/* APPLY */}
      <div className="px-1 pb-6 mt-auto">
        <button
          onClick={onApply}
          className="w-full bg-stone-900 text-white rounded-xl py-3.5 text-sm font-bold tracking-widest uppercase hover:bg-stone-700 active:scale-[0.98] transition-all"
        >
          {loading ? "Searching…" : "Apply"}
        </button>
      </div>
    </aside>
  );
}
