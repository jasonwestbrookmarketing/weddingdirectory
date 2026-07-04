"use client";

import { useEffect, useRef, useState } from "react";
import { X, ArrowRight } from "lucide-react";

const MOBILE_DWELL_MS = 30000;

export default function StartFreeExitNudge({ trialHref }: { trialHref: string }) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const enteredRef = useRef(false);

  useEffect(() => { openRef.current = open; }, [open]);

  useEffect(() => {
    let mobileTimer: ReturnType<typeof setTimeout>;

    const fire = () => {
      if (openRef.current) return;
      setOpen(true);
    };

    const onPointerActive = () => { enteredRef.current = true; };

    const onMouseOut = (e: MouseEvent) => {
      if (!enteredRef.current) return;
      if (e.relatedTarget || (e as MouseEvent & { toElement?: unknown }).toElement) return;
      if (e.clientY > 10) return;
      fire();
    };

    document.addEventListener("mousemove", onPointerActive, { once: true });
    document.addEventListener("mouseout", onMouseOut);

    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      mobileTimer = setTimeout(fire, MOBILE_DWELL_MS);
    }

    return () => {
      document.removeEventListener("mousemove", onPointerActive);
      document.removeEventListener("mouseout", onMouseOut);
      clearTimeout(mobileTimer);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 ${open ? "" : "!hidden"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Start your free trial"
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-[0_32px_80px_-12px_rgba(0,0,0,0.45)] px-7 pt-7 pb-8 text-center">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <h2
          className="mt-2 text-[26px] sm:text-[30px] leading-[1.12] text-stone-900"
          style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
        >
          Before you go:{" "}
          <span style={{ color: "#8a7448" }}>14 days free, no credit card needed.</span>
        </h2>

        <p
          className="mt-4 text-[15px] text-stone-500 leading-relaxed"
          style={{ fontFamily: "var(--font-open-sans)" }}
        >
          The Bride Booking System captures every bride, follows up in seconds, and books more tours for you. Try it free and see what changes in your first two weeks.
        </p>

        <div className="mt-7 flex flex-col items-center gap-3">
          <a
            href={trialHref}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-white font-bold tracking-[0.08em] uppercase px-8 py-4 text-[13px] sm:text-[14px] hover:-translate-y-px hover:shadow-[0_14px_36px_-10px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all shadow-[0_6px_20px_-8px_rgba(0,0,0,0.3)]"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Start My Free Trial
            <ArrowRight className="w-4 h-4" />
          </a>
          <p
            className="text-[11px] text-stone-400"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Free for 14 days, then $97/mo or downgrade to free anytime
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-[13px] text-stone-400 hover:text-stone-600 transition-colors"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            No thanks, I&apos;ll pass for now
          </button>
        </div>
      </div>
    </div>
  );
}
