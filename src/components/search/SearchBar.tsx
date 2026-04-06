"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { BUDGET_RANGES, VENUE_TYPES } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

export default function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState("");
  const [style, setStyle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (guests) params.set("guests", guests);
    if (budget) params.set("budget", budget);
    if (style) params.set("style", style);

    trackEvent("homepage_search_submitted", {
      location,
      guests: guests ? Number(guests) : null,
      budget,
      style,
    });

    router.push(`/search?${params.toString()}`);
  };

  const inputBase =
    "w-full bg-transparent text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none";
  const dividerV = "hidden md:block w-px self-stretch bg-stone-200 my-1.5 shrink-0";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      {/* Desktop — single pill row */}
      <div className="hidden md:flex items-stretch bg-white rounded-full shadow-xl border border-white/20 overflow-hidden">

        {/* Location */}
        <div className="flex items-center gap-2 flex-1 min-w-0 px-5 py-3.5">
          <MapPin className="h-4 w-4 text-stone-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wide leading-none mb-0.5">Where</p>
            <input
              type="text"
              placeholder="City or state"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputBase}
            />
          </div>
        </div>

        <div className={dividerV} />

        {/* Guests */}
        <div className="flex items-center flex-none w-32 px-4 py-3.5">
          <div className="w-full">
            <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wide leading-none mb-0.5">Guests</p>
            <input
              type="number"
              placeholder="Any"
              min={1}
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className={inputBase}
            />
          </div>
        </div>

        <div className={dividerV} />

        {/* Budget */}
        <div className="flex items-center flex-none w-40 px-4 py-3.5">
          <div className="w-full">
            <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wide leading-none mb-0.5">Budget</p>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={`${inputBase} appearance-none cursor-pointer`}
            >
              <option value="">Any budget</option>
              {BUDGET_RANGES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={dividerV} />

        {/* Style */}
        <div className="flex items-center flex-none w-40 px-4 py-3.5">
          <div className="w-full">
            <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wide leading-none mb-0.5">Style</p>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className={`${inputBase} appearance-none cursor-pointer`}
            >
              <option value="">Any style</option>
              {VENUE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search button */}
        <div className="flex items-center p-2 shrink-0">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-full bg-stone-900 hover:bg-stone-700 active:scale-95 transition-all text-white px-5 py-3 text-sm font-semibold"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>

      {/* Mobile — stacked card */}
      <div className="flex flex-col md:hidden bg-white rounded-2xl shadow-xl overflow-hidden border border-white/20">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-stone-100">
          <MapPin className="h-4 w-4 text-stone-400 shrink-0" />
          <input
            type="text"
            placeholder="City or state"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 border-b border-stone-100">
          <div className="px-4 py-3 border-r border-stone-100">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-1">Guests</p>
            <input
              type="number"
              placeholder="Any"
              min={1}
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
            />
          </div>
          <div className="px-4 py-3">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-1">Budget</p>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full text-sm text-stone-900 focus:outline-none appearance-none bg-transparent"
            >
              <option value="">Any</option>
              {BUDGET_RANGES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-stone-100">
          <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-1">Style / Vibe</p>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full text-sm text-stone-900 focus:outline-none appearance-none bg-transparent"
          >
            <option value="">Any style</option>
            {VENUE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-700 active:scale-[0.99] transition-all text-white px-6 py-4 text-sm font-semibold"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
    </form>
  );
}
