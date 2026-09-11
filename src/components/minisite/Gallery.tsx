"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const GAP = 5; // px between photos, all sides

/**
 * True shortest-column masonry: each photo is placed into the currently shortest
 * column (balanced by its real aspect ratio), so columns fill evenly and there
 * is NEVER an awkward gap between rows — on any device or width. Falls back to a
 * balanced square layout until natural sizes are known.
 */
function useColumnBuckets(images: string[], cols: number): number[][] {
  const [ratios, setRatios] = useState<number[]>([]); // height / width per image

  useEffect(() => {
    if (images.length === 0) {
      setRatios([]);
      return;
    }
    let alive = true;
    const rs = new Array(images.length).fill(1);
    let done = 0;
    images.forEach((url, i) => {
      const img = new window.Image();
      const finish = (r: number) => {
        rs[i] = r > 0 && Number.isFinite(r) ? r : 1;
        if (alive && ++done === images.length) setRatios([...rs]);
      };
      img.onload = () => finish(img.naturalHeight / img.naturalWidth);
      img.onerror = () => finish(1);
      img.src = url;
    });
    return () => {
      alive = false;
    };
  }, [images]);

  return useMemo(() => {
    const heights = new Array(cols).fill(0);
    const buckets: number[][] = Array.from({ length: cols }, () => []);
    images.forEach((_, i) => {
      const r = ratios[i] ?? 1;
      let c = 0;
      for (let k = 1; k < cols; k++) if (heights[k] < heights[c]) c = k;
      buckets[c].push(i);
      heights[c] += r; // equal column widths ⇒ rendered height ∝ ratio
    });
    return buckets;
  }, [images, ratios, cols]);
}

export default function Gallery({ images, coupleName }: { images: string[]; coupleName: string }) {
  const [open, setOpen] = useState<number | null>(null);

  // Column count from the actual rendered width — mirrors the mobile look
  // everywhere (2 up), widening to 3 only on genuinely wide layouts.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(2);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setCols(w >= 640 ? 3 : 2);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const buckets = useColumnBuckets(images, cols);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(() => setOpen((i) => (i === null ? i : (i - 1 + images.length) % images.length)), [images.length]);
  const next = useCallback(() => setOpen((i) => (i === null ? i : (i + 1) % images.length)), [images.length]);

  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  if (images.length === 0) return null;

  return (
    <>
      <div ref={wrapRef} className="flex items-start" style={{ gap: GAP }}>
        {buckets.map((bucket, c) => (
          <div key={c} className="flex min-w-0 flex-1 flex-col" style={{ gap: GAP }}>
            {bucket.map((i) => (
              <button
                key={`${images[i]}-${i}`}
                type="button"
                onClick={() => setOpen(i)}
                className="group block w-full overflow-hidden rounded-[10px] bg-white"
              >
                {/* Intrinsic sizing keeps each photo's natural aspect ratio. */}
                <Image
                  src={images[i]}
                  alt={`${coupleName} photo ${i + 1}`}
                  width={500}
                  height={500}
                  unoptimized
                  sizes="(max-width: 640px) 50vw, 180px"
                  className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </button>
            ))}
          </div>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous photo"
              className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
          )}

          <div className="relative max-h-[85vh] w-auto max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[open]}
              alt={`${coupleName} photo ${open + 1}`}
              width={1400}
              height={1400}
              unoptimized
              className="max-h-[85vh] w-auto rounded-2xl object-contain"
            />
            {images.length > 1 && (
              <p className="mt-3 text-center text-sm text-white/70">{open + 1} / {images.length}</p>
            )}
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next photo"
              className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
