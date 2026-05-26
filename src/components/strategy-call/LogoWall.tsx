import Image from "next/image";
import { Reveal } from "./Reveal";

const LOGOS = [
  { src: "/logos/arbor.png",       alt: "Arbor at the Port",         h: 36 },
  { src: "/logos/vista.png",       alt: "Vista on the Docks",        h: 34 },
  { src: "/logos/bogart.png",      alt: "Bogart House",              h: 52 },
  { src: "/logos/pinetree.png",    alt: "The Pinetree",              h: 44 },
  { src: "/logos/rachel.png",      alt: "Rachel Marie Events & Co.", h: 44 },
  { src: "/logos/waterloo.png",    alt: "Waterloo Farms",            h: 48 },
  { src: "/logos/white-pine.png",  alt: "White Pine Manor",          h: 48 },
  { src: "/logos/willowcreek.png", alt: "Willow Creek",              h: 40 },
  { src: "/logos/atlantic.png",    alt: "Atlantic Stables",          h: 44 },
];

const DOUBLED = [...LOGOS, ...LOGOS.map((l) => ({ ...l, alt: "" }))];

export default function LogoWall() {
  return (
    <section className="bg-white border-b border-brand-line">
      <Reveal>
        <p
          className="pt-8 text-center text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted"
          style={{ fontFamily: "var(--font-open-sans)" }}
        >
          Trusted By
        </p>
      </Reveal>

      {/* Scrolling logo ticker — identical rhythm to /book-more-weddings */}
      <div className="pt-6 pb-8 overflow-hidden">
        <div
          className="flex whitespace-nowrap gap-10 lg:gap-16 items-center"
          style={{ animation: "ticker 40s linear infinite" }}
        >
          {DOUBLED.map(({ src, alt, h }, i) => (
            <div key={i} className="shrink-0 flex items-center justify-center">
              <Image
                src={src}
                alt={alt}
                width={160}
                height={h}
                unoptimized
                placeholder="empty"
                className="w-auto object-contain"
                style={{
                  height: h,
                  maxWidth: 140,
                  filter:
                    "brightness(0) invert(0) sepia(0) saturate(0) hue-rotate(0deg) brightness(0.11)",
                  mixBlendMode: "multiply",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
