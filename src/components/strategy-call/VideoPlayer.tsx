"use client";

import { useState } from "react";
import Image from "next/image";
import { VSL_VIDEO_URL } from "./constants";

interface VideoPlayerProps {
  /**
   * Video URL. Accepts a Loom share link (loom.com/share/ID), a Loom embed
   * link (loom.com/embed/ID), a Vimeo/YouTube embed URL, or any iframe-able
   * URL. Loom share links are auto-converted to embeds.
   */
  videoUrl?: string;
  /** Poster image shown before play. */
  poster?: string;
  /** Small duration pill label, e.g. "Watch · 4 min 40 sec". */
  durationLabel?: string;
  /** Accessible label for the play button. */
  ariaLabel?: string;
}

/**
 * Normalize a video URL into an autoplaying embed URL. Handles Loom share
 * links (which aren't iframe-able directly) by rewriting them to /embed/, and
 * appends an autoplay flag so the video starts as soon as the iframe mounts
 * (it only mounts after the user taps the poster play button).
 */
function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);

    // Loom: share → embed.
    // hideEmbedTopBar + hide_owner/title/share strip Loom's chrome (the
    // title, view count, and link/popout buttons) for a clean player.
    if (u.hostname.includes("loom.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) {
        const params = new URLSearchParams({
          autoplay: "1",
          hideEmbedTopBar: "true",
          hide_owner: "true",
          hide_title: "true",
          hide_share: "true",
        });
        return `https://www.loom.com/embed/${id}?${params.toString()}`;
      }
    }

    // Vimeo / YouTube / other embeds: append autoplay if not already present
    if (!/autoplay=/.test(u.search)) {
      u.searchParams.set("autoplay", "1");
    }
    return u.toString();
  } catch {
    // Not a parseable URL (e.g. an unresolved placeholder) — return as-is.
    return url;
  }
}

export default function VideoPlayer({
  videoUrl = VSL_VIDEO_URL,
  poster = "/hero-wedding.jpg",
  durationLabel = "Watch · 4 min 40 sec",
  ariaLabel = "Play video — Watch · 4 minutes 40 seconds",
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="relative w-full max-w-[920px] mx-auto rounded-2xl overflow-hidden shadow-[0_32px_80px_-24px_rgba(0,0,0,0.28)]"
      style={{ aspectRatio: "16 / 9" }}
    >
      {!playing ? (
        <>
          {/* Poster */}
          <div className="absolute inset-0">
            <Image
              src={poster}
              alt=""
              fill
              className="object-cover object-center"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/55" />
          </div>

          {/* Overlay content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Play button with pulsing ring */}
            <button
              onClick={() => setPlaying(true)}
              className="relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 rounded-full"
              aria-label={ariaLabel}
            >
              <span
                className="absolute inset-0 rounded-full bg-white/30"
                style={{ animation: "pulse-ring 2.5s ease-out infinite" }}
              />
              <span className="relative z-10 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/92 backdrop-blur-sm group-hover:bg-white group-hover:scale-105 active:scale-95 transition-all shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-[#1b1b1b] ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          </div>

          {/* Duration pill — bottom center */}
          <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/55 backdrop-blur-sm text-white text-[11px] sm:text-xs px-3 py-1.5 rounded-full tracking-wide pointer-events-none">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70" />
            <span style={{ fontFamily: "var(--font-open-sans)" }}>{durationLabel}</span>
          </div>
        </>
      ) : (
        <iframe
          src={toEmbedUrl(videoUrl)}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="StoryVenue — Book Your Free Strategy Call"
        />
      )}
    </div>
  );
}
