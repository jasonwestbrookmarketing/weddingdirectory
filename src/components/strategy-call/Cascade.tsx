import { Reveal } from "./Reveal";

const STEPS = [
  { label: "Missed Inquiry",  desc: "She never got a reply",           final: false },
  { label: "Missed Tour",     desc: "She booked with a competitor",    final: false },
  { label: "Missed Proposal", desc: "$12,000 never sent",              final: false },
  { label: "Missed Deposit",  desc: "Weekend still open",              final: false },
  { label: "Empty Weekend",   desc: "Revenue gone for good",           final: true  },
];

function XIcon({ large }: { large?: boolean }) {
  return (
    /* Final card: white circle so X stands out against the red background */
    <div
      className={`flex items-center justify-center rounded-full ${
        large
          ? "w-12 h-12 bg-white"
          : "w-10 h-10 bg-red-50 border border-red-200"
      }`}
      aria-hidden="true"
    >
      <svg
        className={`${large ? "w-5 h-5 text-red-600" : "w-5 h-5 text-red-500"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );
}

export default function Cascade() {
  return (
    <section className="bg-brand-warm py-20 sm:py-28 border-b border-brand-line">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <Reveal>
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            The Cost of Doing Nothing
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
            <Reveal key={step.label} delay={0.06 * i}>
              <div
                className={`rounded-xl p-6 sm:p-7 border h-full flex flex-col gap-3 ${
                  step.final
                    ? "bg-red-600 border-red-600"
                    : "bg-white border-brand-line"
                }`}
              >
                <XIcon large={step.final} />

                <div>
                  <p
                    className={`text-[12px] font-bold tracking-[0.14em] uppercase mb-1 ${
                      step.final ? "text-white" : "text-brand-ink"
                    }`}
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {step.label}
                  </p>
                  <p
                    className={`text-[13px] sm:text-sm leading-relaxed ${
                      step.final ? "text-white/80" : "text-brand-muted"
                    }`}
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
