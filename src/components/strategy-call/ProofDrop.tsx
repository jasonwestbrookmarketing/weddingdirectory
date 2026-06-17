"use client";

import Image from "next/image";
import { Reveal } from "./Reveal";
import { SketchUnderline } from "./SketchUnderline";

const PROOF_CARDS = [
  {
    venue: "Atlantic Stables",
    stat: "$15k",
    detail: "In booked weddings the first 30 days",
    logo: "/logos/atlantic.png",
    logoDims: { w: 120, h: 28 },
  },
  {
    venue: "Waterloo Farms",
    stat: "$8,000",
    detail: "In booked weddings the first 7 days",
    logo: "/logos/waterloo.png",
    logoDims: { w: 120, h: 28 },
  },
  {
    venue: "Retreat at Evans Farms",
    stat: "258",
    detail: "Leads in 60 days",
    logo: "/logos/retreat.png",
    logoDims: { w: 140, h: 40 },
  },
];

function ProofCard({
  venue,
  stat,
  detail,
  logo,
  logoDims,
  delay,
}: {
  venue: string;
  stat: string;
  detail: string;
  logo: string | null;
  logoDims: { w: number; h: number };
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="w-full sm:w-auto">
      <div className="relative bg-white border border-brand-line rounded-xl overflow-hidden h-full flex flex-col w-full sm:w-[280px]">
        {/* Gold accent bar */}
        <div className="h-[3px] w-full bg-[#8a7448] shrink-0" />

        <div className="px-6 pt-5 pb-6 sm:px-7 sm:pt-6 sm:pb-7 flex flex-col flex-1">
          {/* Logo — shown instead of text name when available */}
          {logo ? (
            <div className="mb-4 flex items-start">
              <Image
                src={logo}
                alt={venue}
                width={logoDims.w}
                height={logoDims.h}
                unoptimized
                placeholder="empty"
                className="max-h-10 w-auto object-contain opacity-55 grayscale"
              />
            </div>
          ) : (
            <p
              className="mb-4 text-[10px] font-semibold tracking-[0.26em] uppercase"
              style={{ fontFamily: "var(--font-open-sans)", color: "#a8a29e" }}
            >
              {venue}
            </p>
          )}

          {/* Big stat — size tuned so even '$8,000' fits comfortably */}
          <p
            className="leading-none"
            style={{
              fontFamily: "EditorsNote, serif",
              fontWeight: 300,
              fontSize: "clamp(48px, 5.5vw, 72px)",
              color: "#1b1b1b",
            }}
          >
            {stat}
          </p>

          {/* Detail — min-height keeps single-line cards level with two-line ones */}
          <p
            className="mt-4 text-[14px] sm:text-[15px] font-semibold leading-snug min-h-[2.6em]"
            style={{ fontFamily: "var(--font-open-sans)", color: "#57534e" }}
          >
            {detail}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export default function ProofDrop() {
  return (
    <section className="bg-brand-bg py-20 sm:py-28 border-b border-brand-line">
      <div className="max-w-6xl mx-auto px-6 md:px-10 text-center">
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
            className="mt-4 text-[26px] sm:text-4xl md:text-[42px] text-brand-ink leading-[1.12] max-w-2xl mx-auto"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Not because they get more leads. Because they finally have a{" "}
            <SketchUnderline>
              <span style={{ color: "#8a7448" }}>booking system</span>
            </SketchUnderline>{" "}
            that works for them.
          </h2>
        </Reveal>

        <div className="mt-12 sm:mt-14 flex flex-wrap justify-center gap-4 sm:gap-5">
          {PROOF_CARDS.map((card, i) => (
            <ProofCard key={card.venue} {...card} delay={0.07 * i} />
          ))}
        </div>
      </div>
    </section>
  );
}
