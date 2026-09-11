"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { eventStartMs, isWithinLiveWindow, parseEmbedSrc } from "@/lib/live-window";

/**
 * The cover hero. During the wedding's live window it replaces the cover photo
 * with the couple's livestream, then falls back to the cover photo outside the
 * window or if the embed fails to load. Tapping the maximize control (or the
 * player's own control) goes fullscreen.
 */
export default function LiveCover({
  coverUrl,
  embedHtml,
  weddingDate,
  weddingTime,
}: {
  coverUrl: string | null;
  embedHtml: string | null;
  weddingDate: string | null;
  weddingTime: string | null;
}) {
  const startMs = useMemo(() => eventStartMs(weddingDate, weddingTime), [weddingDate, weddingTime]);
  const embed = useMemo(() => parseEmbedSrc(embedHtml), [embedHtml]);
  const canGoLive = Boolean(embed && startMs != null);

  const [now, setNow] = useState<number>(() => Date.now());
  const [failed, setFailed] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Only tick the clock when a live window is even possible.
  useEffect(() => {
    if (!canGoLive) return;
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(id);
  }, [canGoLive]);

  const live = canGoLive && !failed && isWithinLiveWindow(startMs, now);

  function goFullscreen() {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else el.requestFullscreen?.();
  }

  if (live && embed) {
    return (
      <div
        ref={wrapRef}
        className="relative mb-[-56px] w-full overflow-hidden rounded-[10px] border border-brand-line bg-black shadow-[0_16px_40px_-24px_rgba(0,0,0,0.4)]"
        style={{ aspectRatio: "16 / 9" }}
      >
        <iframe
          src={embed.src}
          allow={embed.allow || "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"}
          allowFullScreen
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          onError={() => setFailed(true)}
          title="Live stream"
          className="absolute inset-0 h-full w-full border-0"
        />
        <span className="pointer-events-none absolute left-2.5 top-2.5 z-10 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
        </span>
        <button
          type="button"
          onClick={goFullscreen}
          aria-label="Full screen"
          className="absolute right-2.5 top-2.5 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (!coverUrl) return null;
  return (
    <div className="relative mb-[-56px] h-52 w-full overflow-hidden rounded-[10px] border border-brand-line shadow-[0_16px_40px_-24px_rgba(0,0,0,0.4)] sm:h-60">
      <Image src={coverUrl} alt="" fill unoptimized priority sizes="560px" className="object-cover" />
    </div>
  );
}
