import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serve a single-event .ics with a real calendar content-type so mobile OSes
 * open the Calendar "Add event" sheet directly (no download-then-import).
 * Event details come from query params so we don't need to re-fetch anything.
 *
 * Times are "floating" local wall-clock (no timezone) so the event shows the
 * exact clock time the couple entered on every guest's device. No start time =
 * all-day event.
 */
function pad(n: number): string {
  return String(n).padStart(2, "0");
}
function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const title = (q.get("title") || "Wedding").slice(0, 300);
  const date = q.get("date") || "";
  const time = q.get("time") || "";
  const location = (q.get("location") || "").slice(0, 500);
  const details = (q.get("details") || "").slice(0, 1000);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Response("Invalid date", { status: 400 });
  }
  const [y, m, d] = date.split("-").map((n) => parseInt(n, 10));
  const hasTime = /^\d{2}:\d{2}$/.test(time);
  const [hh, mm] = hasTime ? time.split(":").map((n) => parseInt(n, 10)) : [0, 0];

  const dateOnly = `${y}${pad(m)}${pad(d)}`;
  const nextDay = (() => {
    const dt = new Date(Date.UTC(y, m - 1, d + 1));
    return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}`;
  })();
  const startFloating = `${dateOnly}T${pad(hh)}${pad(mm)}00`;
  const endFloating = (() => {
    const dt = new Date(Date.UTC(y, m - 1, d, hh + 4, mm));
    return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00`;
  })();

  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//StoryVenue//Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
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

  return new Response(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      // inline so iOS/Android open the Calendar add-event sheet instead of
      // saving a file; desktop browsers still handle it gracefully.
      "Content-Disposition": 'inline; filename="wedding.ics"',
      "Cache-Control": "no-store",
    },
  });
}
