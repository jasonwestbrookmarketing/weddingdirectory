"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarPlus, ChevronDown } from "lucide-react";

/**
 * "Add to calendar" for wedding guests. Works on iPhone + Android + desktop:
 *  - Apple / Outlook: downloads a standards .ics file (iOS opens Calendar).
 *  - Google: opens the Google Calendar event template in a new tab.
 *
 * Times are written as "floating" local wall-clock (no timezone), so the event
 * shows the same clock time the couple entered regardless of the guest's device
 * timezone. When no start time is set, it's created as an all-day event.
 */
export default function AddToCalendar({
  title,
  date,
  time,
  location,
  details,
}: {
  title: string;
  date: string; // YYYY-MM-DD
  time: string | null; // HH:MM (24h) or null
  location: string | null;
  details: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const [y, m, d] = date.split("-").map((n) => parseInt(n, 10));
  const hasTime = !!time && /^\d{2}:\d{2}$/.test(time);
  const [hh, mm] = hasTime ? time!.split(":").map((n) => parseInt(n, 10)) : [0, 0];

  const pad = (n: number) => String(n).padStart(2, "0");
  const dateOnly = `${y}${pad(m)}${pad(d)}`;
  const nextDay = (() => {
    const dt = new Date(Date.UTC(y, m - 1, d + 1));
    return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}`;
  })();
  const startFloating = `${dateOnly}T${pad(hh)}${pad(mm)}00`;
  const endFloating = (() => {
    // Default 4-hour celebration window.
    const dt = new Date(Date.UTC(y, m - 1, d, hh + 4, mm));
    return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00`;
  })();

  function downloadIcs() {
    const stampDt = new Date();
    const stamp = `${stampDt.getUTCFullYear()}${pad(stampDt.getUTCMonth() + 1)}${pad(stampDt.getUTCDate())}T${pad(stampDt.getUTCHours())}${pad(stampDt.getUTCMinutes())}${pad(stampDt.getUTCSeconds())}Z`;
    const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//StoryVenue//Wedding//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${dateOnly}-${Math.random().toString(36).slice(2)}@storyvenue`,
      `DTSTAMP:${stamp}`,
      hasTime ? `DTSTART:${startFloating}` : `DTSTART;VALUE=DATE:${dateOnly}`,
      hasTime ? `DTEND:${endFloating}` : `DTEND;VALUE=DATE:${nextDay}`,
      `SUMMARY:${esc(title)}`,
      location ? `LOCATION:${esc(location)}` : "",
      details ? `DESCRIPTION:${esc(details)}` : "",
      "END:VEVENT",
      "END:VCALENDAR",
    ].filter(Boolean);
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^\w]+/g, "-").toLowerCase()}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setOpen(false);
  }

  function googleUrl(): string {
    const dates = hasTime ? `${startFloating}/${endFloating}` : `${dateOnly}/${nextDay}`;
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates,
    });
    if (details) params.set("details", details);
    if (location) params.set("location", location);
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  return (
    <div ref={ref} className="relative mt-3 inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-white px-4 py-1.5 text-[13px] font-medium text-brand-ink transition-colors hover:border-brand-ink"
      >
        <CalendarPlus className="h-3.5 w-3.5" /> Add to calendar
        <ChevronDown className={`h-3.5 w-3.5 text-brand-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-1/2 z-30 mt-1.5 w-44 -translate-x-1/2 overflow-hidden rounded-[5px] border border-brand-line bg-white py-1 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.4)]">
          <a
            href={googleUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-left text-sm text-brand-ink hover:bg-brand-warm"
          >
            Google Calendar
          </a>
          <button
            type="button"
            onClick={downloadIcs}
            className="block w-full px-4 py-2 text-left text-sm text-brand-ink hover:bg-brand-warm"
          >
            Apple / Outlook
          </button>
        </div>
      )}
    </div>
  );
}
