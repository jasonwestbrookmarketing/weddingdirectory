import { Reveal } from "./Reveal";

const VENUES = [
  "Arbor at the Port",
  "Atlantic Stables",
  "Bogart House",
  "Irongate",
  "The Pinetree",
  "Rachel Marie Events",
  "Waterloo Farms",
  "White Pine Manor",
  "Vista on the Docks",
];

export default function LogoWall() {
  return (
    <section className="bg-brand-warm py-14 sm:py-16 border-b border-brand-line">
      <Reveal>
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <p
            className="text-center text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted mb-8 sm:mb-10"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            — Trusted By
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8 sm:gap-y-4">
            {VENUES.map((name) => (
              <span
                key={name}
                className="text-[15px] sm:text-[17px] text-brand-ink/55 leading-none"
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontStyle: "italic",
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
