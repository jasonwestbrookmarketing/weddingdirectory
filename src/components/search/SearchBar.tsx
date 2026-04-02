"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
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

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-4"
    >
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="search-location" className="sr-only">
            Location
          </label>
          <input
            id="search-location"
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-transparent focus:ring-2 focus:ring-stone-900 focus:outline-none"
          />
        </div>

        <div className="w-full md:w-36">
          <label htmlFor="search-guests" className="sr-only">
            Guest Count
          </label>
          <input
            id="search-guests"
            type="number"
            placeholder="Guests"
            min={1}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-transparent focus:ring-2 focus:ring-stone-900 focus:outline-none"
          />
        </div>

        <div className="w-full md:w-48">
          <label htmlFor="search-budget" className="sr-only">
            Budget
          </label>
          <select
            id="search-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900 focus:border-transparent focus:ring-2 focus:ring-stone-900 focus:outline-none appearance-none"
          >
            <option value="">Budget</option>
            {BUDGET_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-44">
          <label htmlFor="search-style" className="sr-only">
            Style / Vibe
          </label>
          <select
            id="search-style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900 focus:border-transparent focus:ring-2 focus:ring-stone-900 focus:outline-none appearance-none"
          >
            <option value="">Style / Vibe</option>
            {VENUE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-white font-medium hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
    </form>
  );
}
