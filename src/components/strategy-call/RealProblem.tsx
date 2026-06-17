import { Reveal } from "./Reveal";
import HighlighterText from "@/components/marketing/HighlighterText";

export default function RealProblem() {
  return (
    <section className="bg-brand-bg py-20 sm:py-28 border-b border-brand-line">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <Reveal>
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            The Real Problem
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2
            className="mt-4 text-[26px] sm:text-4xl md:text-5xl text-brand-ink leading-[1.12]"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Why are your weekends still empty?
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <div
            className="mt-8 sm:mt-10 space-y-5 text-brand-muted text-base sm:text-lg leading-relaxed max-w-[900px]"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            <p>
              How many open weekends are on your calendar right now?
            </p>
            <p>
              <HighlighterText nowrap={false} className="lg:whitespace-nowrap">Count them. Every open weekend is a wedding that&apos;s going to happen. Just not at your venue.</HighlighterText>
              {" "}Some brides never find you. The ones who do reach out, ask about a date... and disappear.
              Not because your venue wasn&apos;t right. Because by the time you followed up, someone else
              already answered, already booked the tour, already took the deposit.
            </p>
            <p>
              So you do what every venue owner does. You throw more money at The Knot, WeddingWire, and the directories.
            </p>
            <p
              className="font-bold text-brand-ink"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              And yet here you are. Same empty weekends. Watching other venues fill the dates that should&apos;ve been yours.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
