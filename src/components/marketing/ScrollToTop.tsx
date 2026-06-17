"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Minimal scroll-to-top FAB.
 * Appears after the user scrolls past one viewport. Clicking smoothly
 * scrolls to the top of the page. Works on every device.
 */
export default function ScrollToTop({ mobileLift = false }: { mobileLift?: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-5 z-[80] flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 text-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.45)] transition-all duration-300 hover:bg-stone-800 active:scale-95 ${
        mobileLift ? "bottom-[92px] sm:bottom-5" : "bottom-5"
      } ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
