"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "./Reveal";

const PROOF_CARDS = [
  {
    venue: "Manor",
    stat: "90d",
    detail: "Entire 2026 calendar booked",
  },
  {
    venue: "Waterloo Farms",
    stat: "2",
    detail: "Weddings booked in 7 days",
  },
  {
    venue: "Atlantic Stables",
    stat: "$15k",
    detail: "Booked weddings in 30 days",
  },
  {
    venue: "Red Barn Acres",
    stat: "9",
    detail: "Weddings in 4 months",
  },
];

function ProofCard({
  venue,
  stat,
  detail,
  delay,
}: {
  venue: string;
  stat: string;
  detail: string;
  delay: number;
}) {
  const reduce = useReducedMotion();

  return (
    <Reveal delay={delay}>
      <motion.div
        className="group relative bg-white border border-brand-line rounded-xl p-7 sm:p-8 cursor-default overflow-hidden h-full flex flex-col justify-between"
        whileHover={reduce ? {} : { backgroundColor: "#1a1a1a" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Venue name */}
        <motion.p
          className="text-[10px] font-semibold tracking-[0.24em] uppercase"
          style={{ fontFamily: "var(--font-open-sans)" }}
          animate={{}}
          whileHover={reduce ? {} : { color: "rgba(255,255,255,0.5)" }}
          transition={{ duration: 0.4 }}
          initial={{ color: "#6b6b6b" }}
        >
          {venue}
        </motion.p>

        {/* Big number */}
        <motion.p
          className="text-[52px] sm:text-[60px] leading-none my-4"
          style={{
            fontFamily: "EditorsNote, serif",
            fontWeight: 300,
            color: "#1a1a1a",
          }}
          whileHover={reduce ? {} : { color: "#ffffff" }}
          transition={{ duration: 0.4 }}
        >
          {stat}
        </motion.p>

        {/* Detail */}
        <motion.p
          className="text-[13px] sm:text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-open-sans)", color: "#6b6b6b" }}
          whileHover={reduce ? {} : { color: "rgba(255,255,255,0.65)" }}
          transition={{ duration: 0.4 }}
        >
          {detail}
        </motion.p>
      </motion.div>
    </Reveal>
  );
}

export default function ProofDrop() {
  return (
    <section className="bg-brand-bg py-20 sm:py-28 border-b border-brand-line">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <Reveal>
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            — Real Venues. Real Numbers.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2
            className="mt-4 text-[26px] sm:text-4xl md:text-[42px] text-brand-ink leading-[1.12] max-w-2xl"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Not because they got more leads. Because they finally had a{" "}
            <span style={{ color: "#8a7448" }}>system</span>{" "}
            that worked them.
          </h2>
        </Reveal>

        <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {PROOF_CARDS.map((card, i) => (
            <ProofCard key={card.venue} {...card} delay={0.07 * i} />
          ))}
        </div>
      </div>
    </section>
  );
}
