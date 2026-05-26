"use client";

import { motion, useReducedMotion } from "framer-motion";
import VideoPlayer from "./VideoPlayer";
import { BOOKING_URL } from "./constants";

const AVATAR_GRADIENTS = [
  "from-rose-200 to-pink-400",
  "from-amber-200 to-amber-400",
  "from-stone-200 to-stone-500",
  "from-emerald-200 to-teal-400",
  "from-violet-200 to-purple-400",
];

function GoldItalic({ children }: { children: React.ReactNode }) {
  return (
    <em
      className="not-italic"
      style={{
        fontFamily: "var(--font-playfair), Georgia, serif",
        fontStyle: "italic",
        color: "#8a7448",
      }}
    >
      {children}
    </em>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
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
    <section className="bg-brand-bg py-16 sm:py-20 lg:py-28 border-b border-brand-line">
      <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
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

          {/* H1 */}
          <motion.h1
            variants={item}
            className="text-[28px] sm:text-[40px] md:text-[48px] lg:text-[52px] leading-[1.08] text-brand-ink max-w-4xl mx-auto"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Fully book your wedding venue without paying{" "}
            <GoldItalic>The Knot</GoldItalic> or{" "}
            <GoldItalic>WeddingWire</GoldItalic> another cent.
          </motion.h1>

          {/* Subhead — 3 stacked italic serif lines */}
          <motion.div
            variants={item}
            className="space-y-0.5 text-[18px] sm:text-[20px] md:text-[22px] text-brand-muted leading-relaxed"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontStyle: "italic",
            }}
          >
            <p>We bring the brides.</p>
            <p>Our team works the leads.</p>
            <p>You show up for the tour.</p>
          </motion.div>

          {/* Video player */}
          <motion.div variants={item} className="pt-2 sm:pt-4">
            <VideoPlayer />
          </motion.div>

          {/* CTA */}
          <motion.div variants={item} className="pt-1 space-y-3">
            <a
              href={BOOKING_URL}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a1a1a] text-white font-semibold px-7 py-3.5 text-[15px] hover:-translate-y-px hover:shadow-[0_12px_32px_-10px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all shadow-[0_6px_20px_-8px_rgba(0,0,0,0.3)]"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Book Your Free Strategy Call
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            <p
              className="text-[12px] text-brand-muted tracking-wide"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              30-minute fit call · No pitch · No pressure
            </p>
          </motion.div>

          {/* Micro proof */}
          <motion.div
            variants={item}
            className="flex items-center justify-center gap-3 pt-1"
          >
            {/* Avatars */}
            <div className="flex -space-x-2.5 shrink-0" aria-hidden="true">
              {AVATAR_GRADIENTS.map((gradient, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white bg-gradient-to-br ${gradient}`}
                  style={{ zIndex: 5 - i }}
                />
              ))}
            </div>

            {/* Stars + rating */}
            <div className="text-left">
              <div className="flex gap-0.5" role="img" aria-label="5 stars">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    viewBox="0 0 24 24"
                    fill="#8a7448"
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
                4.9 / 5 from 100+ wedding venues
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
