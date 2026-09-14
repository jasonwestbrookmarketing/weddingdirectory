"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import ProofTicker from "./ProofTicker";
import { SLIDES } from "./slides";

const BASE_W = 1280;
const BASE_H = 720;

export default function VslDeck() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [isFs, setIsFs] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const count = SLIDES.length;

  const go = useCallback(
    (next: number) => {
      setIndex((prev) => {
        const clamped = Math.max(0, Math.min(count - 1, next));
        if (clamped !== prev && typeof window !== "undefined") {
          window.history.replaceState(null, "", `#${clamped + 1}`);
        }
        return clamped;
      });
    },
    [count],
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  // Fit the fixed 16:9 stage to the viewport (letterboxed).
  useEffect(() => {
    const fit = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setScale(Math.min(w / BASE_W, h / BASE_H));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // Deep-link to a slide via the URL hash on first load.
  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    const n = parseInt(h, 10);
    if (!Number.isNaN(n) && n >= 1 && n <= count) setIndex(n - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard navigation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          e.preventDefault();
          go(0);
          break;
        case "End":
          e.preventDefault();
          go(count - 1);
          break;
        case "f":
        case "F":
          toggleFs();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [next, prev, go, count]);

  // Track fullscreen state.
  useEffect(() => {
    const onFs = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggleFs = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      rootRef.current?.requestFullscreen().catch(() => {});
    }
  }, []);

  // Auto-hide controls after inactivity.
  const nudgeControls = useCallback(() => {
    setShowControls(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setShowControls(false), 2600);
  }, []);
  useEffect(() => {
    nudgeControls();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [nudgeControls]);

  const onStageClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a,button")) return;
    next();
  };

  return (
    <div
      ref={rootRef}
      onMouseMove={nudgeControls}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
        touchStartX.current = null;
      }}
    >
      {/* Scaled 16:9 stage */}
      <div
        onClick={onStageClick}
        style={{
          width: BASE_W,
          height: BASE_H,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
        className="relative shrink-0 cursor-pointer select-none overflow-hidden bg-brand-warm shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]"
      >
        <div className="flex h-full w-full flex-col">
          <ProofTicker />
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                {SLIDES[index].node}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-line">
          <motion.div
            className="h-full bg-brand-gold"
            animate={{ width: `${((index + 1) / count) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Controls (crisp, viewport-fixed) */}
      <div
        className={`pointer-events-none fixed inset-x-0 bottom-5 z-50 flex items-center justify-center transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-black/55 px-4 py-2 text-white backdrop-blur">
          <button
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous slide"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15 disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="min-w-[54px] text-center text-[13px] tabular-nums">
            {index + 1} / {count}
          </span>
          <button
            onClick={next}
            disabled={index === count - 1}
            aria-label="Next slide"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15 disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <span className="mx-1 h-5 w-px bg-white/20" />
          <button
            onClick={toggleFs}
            aria-label="Toggle fullscreen"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15"
          >
            {isFs ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
