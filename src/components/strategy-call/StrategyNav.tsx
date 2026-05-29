"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function StrategyNav({ showCta = true }: { showCta?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`bg-white/85 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "border-b border-[#e8e6df] shadow-[0_2px_16px_-6px_rgba(0,0,0,0.08)]" : "border-b border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-10 py-3 lg:py-4">
        <span className="shrink-0 flex items-center">
          <Image
            src="/storyvenue-dark-logo.png"
            alt="StoryVenue"
            width={185}
            height={44}
            className="h-9 lg:h-10 w-auto object-contain"
            priority
          />
        </span>

        {showCta && (
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-strategy-modal"))}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1b1b1b] text-white text-[11px] sm:text-[12px] font-bold tracking-[0.1em] uppercase px-4 sm:px-5 py-2 sm:py-2.5 hover:-translate-y-px hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] active:scale-[0.98] transition-all"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Book Strategy Call
          </button>
        )}
      </nav>
    </header>
  );
}
