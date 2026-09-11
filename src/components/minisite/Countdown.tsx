"use client";

import { useEffect, useState } from "react";

/** Days/hours/minutes/seconds until the wedding date (local midnight). */
export default function Countdown({ date }: { date: string }) {
  const target = new Date(`${date}T00:00:00`).getTime();
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, target - now);
  const past = target < now;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  if (past) {
    return (
      <p className="text-center text-sm text-brand-muted">
        We celebrated on{" "}
        {new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })} 🤍
      </p>
    );
  }

  const cells: [number, string][] = [
    [days, "days"],
    [hours, "hrs"],
    [mins, "min"],
    [secs, "sec"],
  ];

  return (
    <div className="flex items-stretch justify-center gap-2.5">
      {cells.map(([value, label]) => (
        <div
          key={label}
          className="flex min-w-[62px] flex-col items-center rounded-2xl border border-brand-line bg-white px-3 py-3 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]"
        >
          <span className="text-2xl font-semibold tabular-nums text-brand-ink">{String(value).padStart(2, "0")}</span>
          <span className="mt-0.5 text-[11px] uppercase tracking-wide text-brand-muted">{label}</span>
        </div>
      ))}
    </div>
  );
}
