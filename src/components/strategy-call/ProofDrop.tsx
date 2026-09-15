"use client";

import Image from "next/image";
import { Reveal } from "./Reveal";
import { SketchUnderline } from "./SketchUnderline";

const PROOF_CARDS = [
  {
    venue: "Retreat at Evans Farms",
    client: "Cheryl",
    stat: "100+",
    detail: "Bride inquiries every month",
    logo: "/logos/retreat.png",
    logoDims: { w: 140, h: 40 },
  },
  {
    venue: "White Pine Manor",
    client: "Joanne",
    stat: "8 Tours + 3 Weddings",
    detail: "Booked in the last 30 days",
    logo: "/logos/white-pine.png",
    logoDims: { w: 120, h: 28 },
  },
  {
    venue: "Atlantic Stables",
    client: "Cole",
    stat: "$10,000",
    detail: "In booked weddings their first month live",
    logo: "/logos/atlantic.png",
    logoDims: { w: 120, h: 28 },
  },
  {
    venue: "Magnolia Weddings & Event Center",
    client: "Antonio",
    stat: "48 Hours",
    detail: "To their very first booked tour after going live",
    logo: "/logos/magnolia.png",
    logoDims: { w: 150, h: 52 },
  },
];

// Content-aware stat size — keeps short stats punchy while letting longer,
// multi-word stats (e.g. "8 Tours + 3 Weddings") wrap cleanly instead of
// overflowing the card.
function statFont(stat: string): string {
  const n = stat.length;
  if (n <= 6) return "clamp(46px, 5.2vw, 68px)";
  if (n <= 9) return "clamp(38px, 4.4vw, 56px)";
  return "clamp(26px, 3vw, 40px)";
}

function ProofCard({
  venue,
  client,
  stat,
  detail,
  logo,
  logoDims,
  delay,
}: {
  venue: string;
  client: string;
  stat: string;
  detail: string;
  logo: string | null;
  logoDims: { w: number; h: number };
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="w-full">
      <div className="relative bg-white border border-brand-line rounded-xl overflow-hidden h-full flex flex-col w-full">
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

          {/* Big stat — bottom-aligned in a fixed box so single- and
              multi-line stats keep the detail line level across cards. */}
          <div className="flex items-end min-h-[80px] sm:min-h-[92px]">
            <p
              className="leading-[1.02]"
              style={{
                fontFamily: "EditorsNote, serif",
                fontWeight: 300,
                fontSize: statFont(stat),
                color: "#1b1b1b",
              }}
            >
              {stat}
            </p>
          </div>

          {/* Detail — min-height keeps single-line cards level with two-line ones */}
          <p
            className="mt-4 text-[14px] sm:text-[15px] font-semibold leading-snug min-h-[2.6em]"
            style={{ fontFamily: "var(--font-open-sans)", color: "#57534e" }}
          >
            {detail}
          </p>

          {/* Client attribution — real person, third person. Thin divider keeps
              it structured and on-brand. */}
          <p
            className="mt-auto pt-4 border-t border-brand-line text-[12px] sm:text-[12.5px] leading-snug"
            style={{ fontFamily: "var(--font-open-sans)", color: "#78716c" }}
          >
            <span className="font-semibold text-brand-ink">{client}</span>
            {" · "}
            {venue}
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
            className="mt-4 text-[26px] sm:text-4xl md:text-[40px] text-brand-ink leading-[1.12] max-w-5xl mx-auto text-balance"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Not because they get more leads. Because they finally have a{" "}
            <SketchUnderline>
              <span style={{ color: "#8a7448" }}>booking system</span>
            </SketchUnderline>{" "}
            that works for them.
          </h2>
        </Reveal>

        <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-[720px] mx-auto text-left">
          {PROOF_CARDS.map((card, i) => (
            <ProofCard key={card.venue} {...card} delay={0.07 * i} />
          ))}
        </div>
      </div>
    </section>
  );
}
