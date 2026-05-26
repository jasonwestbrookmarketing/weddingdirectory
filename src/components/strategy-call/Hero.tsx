"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import VideoPlayer from "./VideoPlayer";

const AVATARS = [
  "/avatars/av1.jpg",
  "/avatars/av2.jpg",
  "/avatars/av3.jpg",
  "/avatars/av4.jpg",
  "/avatars/av5.jpg",
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const reduce = useReducedMotion();
  const container = reduce ? {} : containerVariants;
  const item = reduce ? {} : itemVariants;
  const initial = reduce ? "visible" : "hidden";

  return (
    <section className="bg-brand-bg pt-8 sm:pt-10 lg:pt-12 pb-16 sm:pb-20 lg:pb-24 border-b border-brand-line">
      <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
        <motion.div
          variants={container}
          initial={initial}
          animate="visible"
          className="space-y-6 sm:space-y-7"
        >
          {/* Eyebrow */}
          <motion.p
            variants={item}
            className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            — For Wedding Venue Owners
          </motion.p>

          {/* H1 — big enough to fill 3 lines; gold words stay gold, no italic */}
          <motion.h1
            variants={item}
            className="text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[1.08] text-brand-ink"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Fully book your wedding venue without paying{" "}
            <span style={{ color: "#8a7448" }}>The Knot</span> or{" "}
            <span style={{ color: "#8a7448" }}>WeddingWire</span> another cent.
          </motion.h1>

          {/* Subhead — single horizontal line */}
          <motion.p
            variants={item}
            className="text-[15px] sm:text-[17px] text-brand-muted tracking-wide"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            We bring the brides.&nbsp;&nbsp;·&nbsp;&nbsp;Our team works the leads.&nbsp;&nbsp;·&nbsp;&nbsp;You show up for the tour.
          </motion.p>

          {/* Video player */}
          <motion.div variants={item} className="pt-2 sm:pt-4">
            <VideoPlayer />
          </motion.div>

          {/* CTA */}
          <motion.div variants={item} className="pt-1 space-y-3">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-strategy-modal"))}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1b1b1b] text-white font-bold tracking-[0.1em] uppercase px-7 py-3.5 text-[13px] sm:text-[14px] hover:-translate-y-px hover:shadow-[0_12px_32px_-10px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all shadow-[0_6px_20px_-8px_rgba(0,0,0,0.3)]"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Book Your Free Strategy Call
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <p
              className="text-[12px] text-brand-muted tracking-wide"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              30-minute fit call · No pitch · No pressure
            </p>
          </motion.div>

          {/* Micro proof — same pattern as /book-more-weddings */}
          <motion.div
            variants={item}
            className="flex items-center justify-center gap-3 pt-1"
          >
            <div className="flex -space-x-2.5 shrink-0">
              {AVATARS.map((src, i) => (
                <div
                  key={i}
                  className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white overflow-hidden"
                  style={{ zIndex: 5 - i }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    unoptimized
                    placeholder="empty"
                    className="object-cover object-center"
                    sizes="36px"
                  />
                </div>
              ))}
            </div>

            <div className="text-left">
              <div className="flex gap-0.5" role="img" aria-label="5 stars">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    viewBox="0 0 24 24"
                    fill="#1c1917"
                    aria-hidden="true"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p
                className="text-[10px] sm:text-[11px] text-brand-muted mt-0.5"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Google Reviews
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
