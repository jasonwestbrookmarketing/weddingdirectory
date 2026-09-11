"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Pinterest-style masonry gallery with a full-screen lightbox. Uses CSS columns
 * so photos keep their natural aspect ratio (some tall, some wide), and a modal
 * with prev/next arrows + keyboard nav for viewing individual photos.
 */
export default function Gallery({ images, coupleName }: { images: string[]; coupleName: string }) {
  const [open, setOpen] = useState<number | null>(null);

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
      <div className="columns-2 gap-[5px] sm:columns-3 [&>*]:mb-[5px]">
        {images.map((url, i) => (
          <button
            key={`${url}-${i}`}
            type="button"
            onClick={() => setOpen(i)}
            className="group block w-full overflow-hidden rounded-[10px] bg-white"
          >
            {/* Natural aspect ratio via intrinsic sizing keeps the masonry feel. */}
            <Image
              src={url}
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
