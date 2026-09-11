/**
 * Shared "is the wedding livestream live right now?" logic for the public
 * minisite. Used by both the cover takeover (LiveCover) and the standalone
 * livestream section (LiveEmbedSection) so they always agree and never show two
 * players at once.
 *
 * The window is time-based (computed from the couple's wedding date + time in
 * the *viewer's* local clock, matching the floating times used elsewhere). We
 * cannot reliably detect from a cross-origin embed whether a feed is actually
 * broadcasting, so "live" here means "within the scheduled event window".
 */

// How long after the start time the cover keeps showing the feed.
export const LIVE_WINDOW_HOURS = 6;
// Small head start so a stream that's already rolling shows right at (or just
// before) the ceremony, and guests who open early aren't left staring at a
// photo the moment it begins.
export const LIVE_PRE_ROLL_MINUTES = 15;

/** Parse "YYYY-MM-DD" + optional "HH:MM" into a local epoch ms, or null. */
export function eventStartMs(date: string | null, time: string | null): number | null {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  if (!time || !/^\d{2}:\d{2}$/.test(time)) return null; // no time → no auto window
  const [y, m, d] = date.split("-").map((n) => parseInt(n, 10));
  const [hh, mm] = time.split(":").map((n) => parseInt(n, 10));
  const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
  const ms = dt.getTime();
  return Number.isNaN(ms) ? null : ms;
}

/** True when `now` falls inside [start - preroll, start + window]. */
export function isWithinLiveWindow(startMs: number | null, now: number): boolean {
  if (startMs == null) return false;
  const from = startMs - LIVE_PRE_ROLL_MINUTES * 60_000;
  const to = startMs + LIVE_WINDOW_HOURS * 3_600_000;
  return now >= from && now < to;
}

/** Extract the (already-sanitized) https src + allow attrs from an embed iframe. */
export function parseEmbedSrc(embedHtml: string | null): { src: string; allow: string } | null {
  if (!embedHtml) return null;
  const srcMatch = embedHtml.match(/src="([^"]+)"/i);
  const src = srcMatch?.[1];
  if (!src || !/^https:\/\//i.test(src)) return null;
  const allowMatch = embedHtml.match(/allow="([^"]*)"/i);
  return { src, allow: allowMatch?.[1] ?? "" };
}
