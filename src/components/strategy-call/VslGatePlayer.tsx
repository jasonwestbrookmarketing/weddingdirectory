"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { VSL_VIDEO_URL } from "./constants";

// ── GHL VSL Lead form ────────────────────────────────────────────────────────
const FORM_URL   = "https://api.leadconnectorhq.com/widget/form/64C3haEpJbc8aJ9RmsW0";
const FORM_ID    = "64C3haEpJbc8aJ9RmsW0";
const GHL_SCRIPT = "https://link.msgsndr.com/js/form_embed.js";
const STORAGE_KEY = "sv_vsl_gate_passed";

// ── Helpers ──────────────────────────────────────────────────────────────────

function toLoomEmbed(url: string, autoplay: boolean): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("loom.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) {
        const p = new URLSearchParams({
          hideEmbedTopBar: "true",
          hide_owner:      "true",
          hide_title:      "true",
          hide_share:      "true",
        });
        if (autoplay) p.set("autoplay", "1");
        return `https://www.loom.com/embed/${id}?${p.toString()}`;
      }
    }
    const u2 = new URL(url);
    if (autoplay && !u2.searchParams.has("autoplay")) u2.searchParams.set("autoplay", "1");
    return u2.toString();
  } catch {
    return url;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * VSL player with a hard gate before play.
 *
 * Phases:
 *   "gate"    — new visitor: GHL name/email form shown, no video yet.
 *   "playing" — form just submitted: video autoplays immediately as the reward.
 *   "poster"  — returning visitor (gate already passed): poster + play button,
 *               video loads on click (no repeat gate, no autoplay).
 */
export default function VslGatePlayer() {
  type Phase = "gate" | "playing" | "poster";
  const [phase, setPhase] = useState<Phase>("gate");
  const handled = useRef(false);

  // ── Returning visitor: skip the gate entirely ────────────────────────────
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) setPhase("poster");
    } catch { /* private browsing */ }
  }, []);

  // ── Load GHL embed script once ───────────────────────────────────────────
  useEffect(() => {
    if (document.querySelector(`script[src="${GHL_SCRIPT}"]`)) return;
    const s     = document.createElement("script");
    s.src       = GHL_SCRIPT;
    s.async     = true;
    document.body.appendChild(s);
  }, []);

  // ── GHL postMessage listener — active only while gate is showing ─────────
  // The VSL Lead form should be configured in GHL to redirect to
  // https://storyvenue.com/strategy-call after submission. That redirect URL
  // appears in GHL's postMessage and is the primary submit signal.
  // Generic submit/success event fields serve as a fallback.
  useEffect(() => {
    if (phase !== "gate") return;
    handled.current = false;

    function onMessage(e: MessageEvent) {
      if (handled.current) return;
      try {
        const fromGhl =
          typeof e.origin === "string" &&
          /leadconnectorhq\.com|msgsndr\.com|gohighlevel\.com/.test(e.origin);
        if (!fromGhl) return;

        const data =
          typeof e.data === "string" ? JSON.parse(e.data) : (e.data ?? {});

        const redirectUrl: string =
          data?.redirectURL      ||
          data?.redirect_url     ||
          data?.redirectUrl      ||
          data?.url              ||
          data?.data?.redirectURL ||
          "";

        const isSubmit =
          redirectUrl.length > 0 ||
          /submit|complete|success/i.test(String(data?.event  ?? "")) ||
          /submit|complete|success/i.test(String(data?.type   ?? "")) ||
          /submit|complete|success/i.test(String(data?.action ?? ""));

        if (!isSubmit) return;

        handled.current = true;
        try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
        setPhase("playing"); // video autoplays as the reward
      } catch { /* ignore parse errors */ }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [phase]);

  // ── Gate — form shown before any video ───────────────────────────────────
  if (phase === "gate") {
    return (
      <div className="w-full max-w-[920px] mx-auto">
        <div className="bg-white rounded-2xl shadow-[0_32px_80px_-24px_rgba(0,0,0,0.18)] border border-stone-100 overflow-hidden">
          {/* Card header */}
          <div className="px-7 pt-8 pb-2 text-center">
            <h3
              className="text-[24px] sm:text-[28px] leading-[1.15] text-stone-900"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              Where should we send<br className="hidden sm:block" /> your follow-up?
            </h3>
            <p
              className="mt-2.5 text-[13px] text-stone-400 tracking-wide"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Enter your details below to watch the full presentation.
            </p>
          </div>

          {/* GHL form — form_embed.js auto-resizes the iframe height */}
          <iframe
            src={FORM_URL}
            id={FORM_ID}
            data-form-id={FORM_ID}
            title="VSL Lead"
            scrolling="no"
            style={{
              width: "100%",
              border: "none",
              overflow: "hidden",
              display: "block",
              minHeight: "340px",
            }}
          />
        </div>
      </div>
    );
  }

  // ── Shared video container (playing + poster phases) ──────────────────────
  return (
    <div
      className="relative w-full max-w-[920px] mx-auto rounded-2xl overflow-hidden shadow-[0_32px_80px_-24px_rgba(0,0,0,0.28)]"
      style={{ aspectRatio: "16 / 9" }}
    >
      {/* Poster — returning visitor, click to play */}
      {phase === "poster" && (
        <>
          <div className="absolute inset-0">
            <Image
              src="/hero-wedding.jpg"
              alt=""
              fill
              className="object-cover object-center"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/55" />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <button
              onClick={() => setPhase("playing")}
              className="relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 rounded-full"
              aria-label="Play video — Watch · 4 minutes 40 seconds"
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

          {/* Duration pill */}
          <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/55 backdrop-blur-sm text-white text-[11px] sm:text-xs px-3 py-1.5 rounded-full tracking-wide pointer-events-none">
            <span className="relative inline-flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-red-500 opacity-75 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-red-500" />
            </span>
            <span style={{ fontFamily: "var(--font-open-sans)" }}>Watch · 4 min 40 sec</span>
          </div>
        </>
      )}

      {/* Video iframe — autoplays on first watch, normal play on return */}
      {phase === "playing" && (
        <iframe
          src={toLoomEmbed(VSL_VIDEO_URL, true)}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="StoryVenue — Book Your Free Strategy Call"
        />
      )}
    </div>
  );
}
