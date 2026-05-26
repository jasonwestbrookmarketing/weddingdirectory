"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "./Reveal";

const PROOF_CARDS = [
  { venue: "Atlantic Stables",         stat: "$15k", detail: "Booked weddings in 30 days"  },
  { venue: "Waterloo Farms",           stat: "2",    detail: "Weddings booked in 7 days"   },
  { venue: "Red Barn Acres",           stat: "9",    detail: "Weddings in 4 months"        },
  { venue: "Retreat at Evans Farms",   stat: "258",  detail: "Leads in 60 days"            },
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
        className="group relative bg-white border border-brand-line rounded-xl overflow-hidden h-full flex flex-col cursor-default"
        whileHover={reduce ? {} : { backgroundColor: "#1b1b1b", borderColor: "#1b1b1b" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Gold accent bar */}
        <div className="h-[3px] w-full bg-[#8a7448] shrink-0" />

        <div className="px-6 pt-5 pb-6 sm:px-7 sm:pt-6 sm:pb-7 flex flex-col flex-1">
          {/* Venue name */}
          <motion.p
            className="text-[10px] font-semibold tracking-[0.26em] uppercase"
            style={{ fontFamily: "var(--font-open-sans)", color: "#a8a29e" }}
            whileHover={reduce ? {} : { color: "rgba(255,255,255,0.4)" }}
            transition={{ duration: 0.35 }}
          >
            {venue}
          </motion.p>

          {/* Big stat — the hero of the card */}
          <motion.p
            className="mt-3 leading-none"
            style={{
              fontFamily: "EditorsNote, serif",
              fontWeight: 300,
              fontSize: "clamp(72px, 8vw, 96px)",
              color: "#1b1b1b",
            }}
            whileHover={reduce ? {} : { color: "#ffffff" }}
            transition={{ duration: 0.35 }}
          >
            {stat}
          </motion.p>

          {/* Detail — larger and bolder for instant clarity */}
          <motion.p
            className="mt-4 text-[14px] sm:text-[15px] font-semibold leading-snug"
            style={{ fontFamily: "var(--font-open-sans)", color: "#57534e" }}
            whileHover={reduce ? {} : { color: "rgba(255,255,255,0.75)" }}
            transition={{ duration: 0.35 }}
          >
            {detail}
          </motion.p>
        </div>
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
            Real Venues. Real Numbers.
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
