"use client";

import { useState } from "react";

const ITEMS = [
  { venue: "Manor", result: "2026 Dates Booked in 90 Days" },
  { venue: "Waterloo Farms", result: "2 Weddings Booked in 7 Days" },
  { venue: "Atlantic Stables", result: "$15,000 in Booked Weddings in 30 Days" },
  { venue: "Retreat at Evans Farms", result: "258 Leads in 60 Days" },
  { venue: "Red Barn Acres", result: "9 Weddings Booked in 4 Months" },
  { venue: "Irongate Wedding Venue", result: "131 Leads in 60 Days" },
];

const DOUBLED = [...ITEMS, ...ITEMS];

export default function Marquee() {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="bg-[#1c1c1c] overflow-hidden py-2.5 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-hidden="true"
    >
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: "sc-marquee 40s linear infinite",
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {DOUBLED.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center text-[11px] sm:text-xs tracking-wide text-white/75"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            <span className="font-semibold text-white">{item.venue}</span>
            <span className="ml-1.5">{item.result}</span>
            <span className="mx-5 text-white/25 select-none">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
