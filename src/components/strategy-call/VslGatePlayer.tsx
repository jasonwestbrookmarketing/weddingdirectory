"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { VSL_VIDEO_URL } from "./constants";

const FORM_URL    = "https://api.leadconnectorhq.com/widget/form/64C3haEpJbc8aJ9RmsW0";
const FORM_ID     = "64C3haEpJbc8aJ9RmsW0";
const GHL_SCRIPT  = "https://link.msgsndr.com/js/form_embed.js";
const STORAGE_KEY = "sv_vsl_gate_passed";

function toLoomEmbed(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("loom.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) {
        return `https://www.loom.com/embed/${id}?` + new URLSearchParams({
          hideEmbedTopBar: "true",
          hide_owner:      "true",
          hide_title:      "true",
          hide_share:      "true",
          autoplay:        "1",
        }).toString();
      }
    }
    const u2 = new URL(url);
    if (!u2.searchParams.has("autoplay")) u2.searchParams.set("autoplay", "1");
    return u2.toString();
  } catch { return url; }
}

/**
 * VSL player with a native-feeling locked overlay.
 *
 * "locked"  — blurred poster in a 16:9 frame; pulsing red dot + play button
 *             open the gate modal on click.
 * "modal"   — GHL lead form in a centered modal over the page.
 * "playing" — form submitted, video autoplays immediately.
 * "poster"  — returning visitor (already submitted), normal poster + play.
 */
export default function VslGatePlayer() {
  type Phase = "locked" | "modal" | "playing" | "poster";
  const [phase, setPhase] = useState<Phase>("locked");
  const handled = useRef(false);

  // Skip gate for returning visitors
  useEffect(() => {
    try { if (localStorage.getItem(STORAGE_KEY)) setPhase("poster"); } catch {}
  }, []);

  // Load GHL embed script
  useEffect(() => {
    if (document.querySelector(`script[src="${GHL_SCRIPT}"]`)) return;
    const s = document.createElement("script");
    s.src = GHL_SCRIPT; s.async = true;
    document.body.appendChild(s);
  }, []);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = phase === "modal" ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  // GHL postMessage — active only while modal is open
  useEffect(() => {
    if (phase !== "modal") return;
    handled.current = false;

    function onMessage(e: MessageEvent) {
      if (handled.current) return;
      try {
        const fromGhl = /leadconnectorhq\.com|msgsndr\.com|gohighlevel\.com/.test(e.origin ?? "");
        if (!fromGhl) return;
        const data = typeof e.data === "string" ? JSON.parse(e.data) : (e.data ?? {});
        const redirect: string =
          data?.redirectURL || data?.redirect_url || data?.redirectUrl ||
          data?.url || data?.data?.redirectURL || "";
        const isSubmit =
          redirect.length > 0 ||
          /submit|complete|success/i.test(String(data?.event  ?? "")) ||
          /submit|complete|success/i.test(String(data?.type   ?? "")) ||
          /submit|complete|success/i.test(String(data?.action ?? ""));
        if (!isSubmit) return;
        handled.current = true;
        try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
        setPhase("playing");
      } catch {}
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [phase]);

  // ── Shared 16:9 video container ───────────────────────────────────────────
  const videoContainer = (children: React.ReactNode) => (
    <div
      className="relative w-full max-w-[920px] mx-auto rounded-2xl overflow-hidden shadow-[0_32px_80px_-24px_rgba(0,0,0,0.28)]"
      style={{ aspectRatio: "16 / 9" }}
    >
      {children}
    </div>
  );

  // ── Playing — video autoplays ─────────────────────────────────────────────
  if (phase === "playing") {
    return videoContainer(
      <iframe
        src={toLoomEmbed(VSL_VIDEO_URL)}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="StoryVenue — Book Your Free Strategy Call"
      />
    );
  }

  // ── Poster — returning visitor ────────────────────────────────────────────
  if (phase === "poster") {
    return videoContainer(
      <>
        <div className="absolute inset-0">
          <Image src="/hero-wedding.jpg" alt="" fill className="object-cover object-center" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/55" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => setPhase("playing")}
            className="relative group focus-visible:outline-none rounded-full"
            aria-label="Play video"
          >
            <span className="absolute inset-0 rounded-full bg-white/30" style={{ animation: "pulse-ring 2.5s ease-out infinite" }} />
            <span className="relative z-10 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/92 backdrop-blur-sm group-hover:bg-white group-hover:scale-105 active:scale-95 transition-all shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#1b1b1b] ml-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        </div>
        <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/55 backdrop-blur-sm text-white text-[11px] sm:text-xs px-3 py-1.5 rounded-full tracking-wide pointer-events-none">
          <span className="relative inline-flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-red-500 opacity-75 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-red-500" />
          </span>
          <span style={{ fontFamily: "var(--font-open-sans)" }}>Watch · 4 min 40 sec</span>
        </div>
      </>
    );
  }

  // ── Locked + Modal ────────────────────────────────────────────────────────
  return (
    <>
      {/* Locked overlay — looks like a native video player */}
      {videoContainer(
        <>
          {/* Blurred poster */}
          <div className="absolute inset-0 scale-[1.08]">
            <Image src="/hero-wedding.jpg" alt="" fill className="object-cover object-center" priority unoptimized style={{ filter: "blur(10px)" }} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/65" />

          {/* Centre — pulsing red badge + play button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            {/* Live badge */}
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white text-[11px] sm:text-[12px] font-semibold tracking-[0.12em] uppercase px-3.5 py-1.5 rounded-full" style={{ fontFamily: "var(--font-open-sans)" }}>
              <span className="relative inline-flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-red-500 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-red-500" />
              </span>
              Watch Now
            </div>

            {/* Play button — opens gate modal */}
            <button
              onClick={() => setPhase("modal")}
              className="relative group focus-visible:outline-none rounded-full"
              aria-label="Watch the full presentation"
            >
              <span className="absolute inset-0 rounded-full bg-white/25" style={{ animation: "pulse-ring 2.5s ease-out infinite" }} />
              <span className="relative z-10 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/92 backdrop-blur-sm group-hover:bg-white group-hover:scale-105 active:scale-95 transition-all shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#1b1b1b] ml-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          </div>

          {/* Duration pill — bottom */}
          <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/55 backdrop-blur-sm text-white text-[11px] sm:text-xs px-3 py-1.5 rounded-full tracking-wide pointer-events-none">
            <span className="relative inline-flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-red-500 opacity-75 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-red-500" />
            </span>
            <span style={{ fontFamily: "var(--font-open-sans)" }}>Watch · 4 min 40 sec</span>
          </div>
        </>
      )}

      {/* Gate modal — shown over the full page when play is clicked */}
      {phase === "modal" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Watch the full presentation">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setPhase("locked")} />

          {/* MOBILE: full-screen */}
          <div className={`sm:hidden fixed inset-0 z-10 bg-white overflow-y-auto`} style={{ WebkitOverflowScrolling: "touch" }}>
            <button onClick={() => setPhase("locked")} className="fixed top-3 right-3 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/95 shadow-lg text-stone-700" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
            <div className="px-6 pt-12 pb-4 text-center">
              <p className="text-[12px] text-stone-400 tracking-wide" style={{ fontFamily: "var(--font-open-sans)" }}>
                Enter your details to watch the full presentation.
              </p>
            </div>
            <iframe src={FORM_URL} id={FORM_ID} title="VSL Lead" scrolling="no" style={{ width: "100%", border: "none", overflow: "hidden", display: "block" }} />
          </div>

          {/* DESKTOP: centered card */}
          <div className="hidden sm:block relative z-10 w-full max-w-md bg-white rounded-3xl shadow-[0_32px_80px_-12px_rgba(0,0,0,0.45)] overflow-hidden">
            {/* Close */}
            <div className="flex justify-end px-4 pt-4">
              <button onClick={() => setPhase("locked")} className="flex items-center justify-center w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Minimal header */}
            <div className="px-8 pt-1 pb-2 text-center">
              <p className="text-[12px] text-stone-400 tracking-wide" style={{ fontFamily: "var(--font-open-sans)" }}>
                Enter your details to watch the full presentation.
              </p>
            </div>
            {/* Form */}
            <div className="px-4 pb-2">
              <iframe src={FORM_URL} id={`${FORM_ID}_modal`} title="VSL Lead" scrolling="no" style={{ width: "100%", border: "none", overflow: "hidden", display: "block", minHeight: "320px" }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
