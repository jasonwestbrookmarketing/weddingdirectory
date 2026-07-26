"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Pill-style venue name input + CTA button.
 * On submit fires fbq Lead event then navigates to href (with ?venue= appended).
 *
 * variant="dark"  → white pill on dark backgrounds
 * variant="light" → default — white pill on light backgrounds (same visual, kept for clarity)
 */
export default function FreeListingVenueInput({
  href,
  placeholder = "Enter your venue name",
  buttonText = "Claim My Free Listing",
}: {
  href: string;
  placeholder?: string;
  buttonText?: string;
}) {
  const [venue, setVenue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const w = window as unknown as { fbq?: (...a: unknown[]) => void };
      w.fbq?.("track", "Lead", {
        content_name: "Free Listing Input CTA",
        content_category: "Venue Directory",
      });
    } catch { /* non-fatal */ }

    const url = new URL(href);
    if (venue.trim()) url.searchParams.set("venue", venue.trim());
    window.location.href = url.toString();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-white rounded-full shadow-[0_4px_24px_-6px_rgba(0,0,0,0.14)] border border-stone-200/80 p-1.5 w-full max-w-[480px]"
    >
      <input
        type="text"
        value={venue}
        onChange={(e) => setVenue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent pl-4 pr-2 py-1.5 text-[15px] text-stone-700 placeholder:text-stone-400 outline-none"
        style={{ fontFamily: "var(--font-open-sans)" }}
      />
      <button
        type="submit"
        className="group shrink-0 inline-flex items-center gap-2 rounded-full bg-stone-900 text-white font-semibold px-5 py-2.5 text-[14px] hover:bg-stone-800 active:scale-[0.98] transition-all"
        style={{ fontFamily: "var(--font-open-sans)" }}
      >
        <span className="hidden sm:inline">{buttonText}</span>
        <span className="sm:hidden">Get Started</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}
