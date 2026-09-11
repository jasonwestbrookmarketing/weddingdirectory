"use client";

import { useEffect, useMemo, useState } from "react";
import { Radio } from "lucide-react";
import { eventStartMs, isWithinLiveWindow } from "@/lib/live-window";

/**
 * The standalone "Livestream / embed" section. Renders the couple's embed as
 * usual, EXCEPT during the live window (when the cover hero shows the same feed)
 * — then it hides itself so guests never see two players at once.
 */
export default function LiveEmbedSection({
  embedHtml,
  embedTitle,
  weddingDate,
  weddingTime,
}: {
  embedHtml: string;
  embedTitle: string | null;
  weddingDate: string | null;
  weddingTime: string | null;
}) {
  const startMs = useMemo(() => eventStartMs(weddingDate, weddingTime), [weddingDate, weddingTime]);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (startMs == null) return;
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(id);
  }, [startMs]);

  // During the live window the cover hero owns the feed — don't duplicate it.
  if (isWithinLiveWindow(startMs, now)) return null;

  return (
    <section className="mt-10">
      <h2 className="flex items-center justify-center gap-2 text-center text-lg font-semibold text-brand-ink">
        <Radio className="h-4 w-4" /> {embedTitle || "Livestream"}
      </h2>
      <div
        className="relative mt-4 w-full overflow-hidden rounded-[10px] border border-brand-line bg-black shadow-[0_10px_30px_-20px_rgba(0,0,0,0.5)]"
        style={{ paddingBottom: "56.25%" }}
        // Single https iframe rebuilt server-side by StoryPay (no scripts) — safe.
        dangerouslySetInnerHTML={{ __html: embedHtml }}
      />
    </section>
  );
}
