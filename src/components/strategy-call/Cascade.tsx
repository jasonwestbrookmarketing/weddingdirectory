import { Reveal } from "./Reveal";

const STEPS = [
  {
    num: "01",
    label: "Missed Inquiry",
    desc: "She never got a reply",
    red: false,
  },
  {
    num: "02",
    label: "Missed Tour",
    desc: "She booked with a competitor",
    red: false,
  },
  {
    num: "03",
    label: "Missed Proposal",
    desc: "$12,000 never sent",
    red: false,
  },
  {
    num: "04",
    label: "Missed Deposit",
    desc: "Weekend still open",
    red: false,
  },
  {
    num: "05",
    label: "Empty Weekend",
    desc: "Revenue gone for good",
    red: true,
  },
];

export default function Cascade() {
  return (
    <section className="bg-brand-warm py-20 sm:py-28 border-b border-brand-line">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <Reveal>
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            — The Cost of Doing Nothing
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2
            className="mt-4 text-[26px] sm:text-4xl md:text-[42px] text-brand-ink leading-[1.12] max-w-xl"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Every bride who slips away is more than a missed inquiry.
          </h2>
        </Reveal>

        <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={0.06 * i}>
              <div className="bg-white rounded-xl p-6 sm:p-7 border border-brand-line h-full flex flex-col">
                <p
                  className="text-[32px] sm:text-[36px] leading-none mb-3"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontStyle: "italic",
                    color: step.red ? "#dc2626" : "#8a7448",
                  }}
                >
                  {step.num}
                </p>
                <p
                  className="text-[13px] font-semibold tracking-wide text-brand-ink uppercase mb-1.5"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {step.label}
                </p>
                <p
                  className="text-[13px] sm:text-sm text-brand-muted leading-relaxed mt-auto"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
