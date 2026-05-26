import Image from "next/image";
import { Reveal } from "./Reveal";

const AVATARS = [
  "/avatars/av1.jpg",
  "/avatars/av2.jpg",
  "/avatars/av3.jpg",
  "/avatars/av4.jpg",
  "/avatars/av5.jpg",
];

const PROMISES = [
  {
    title: "Pay only when it works",
    desc: "You have 30 days from go-live to see real results before we earn a single dollar.",
  },
  {
    title: "No contracts",
    desc: "Month-to-month. You stay because it's booking weddings, not because you're locked in.",
  },
  {
    title: "No cancellation fees",
    desc: "Walk away the moment it stops being a fit. No penalties. No phone calls.",
  },
];

function CheckIcon() {
  return (
    <div
      className="shrink-0 w-7 h-7 rounded-full bg-[#1b1b1b] flex items-center justify-center"
      aria-hidden="true"
    >
      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

function Medallion() {
  return (
    <div
      className="relative flex items-center justify-center mx-auto"
      style={{ width: 240, height: 240 }}
      aria-label="30 Day Guarantee"
    >
      {/* Outermost dashed ring */}
      <div className="absolute inset-0 rounded-full border border-dashed border-[#1b1b1b]/20" />
      {/* Second ring */}
      <div
        className="absolute rounded-full border border-[#1b1b1b]/15"
        style={{ inset: 14 }}
      />
      {/* Trim ring */}
      <div
        className="absolute rounded-full border-2 border-[#1b1b1b]/70"
        style={{ inset: 26 }}
      />
      {/* Inner filled medallion */}
      <div
        className="absolute rounded-full bg-[#1b1b1b] flex flex-col items-center justify-center text-white shadow-[inset_0_2px_8px_rgba(255,255,255,0.08),0_8px_24px_-6px_rgba(0,0,0,0.5)]"
        style={{ inset: 32 }}
      >
        <span
          className="text-[10px] font-semibold tracking-[0.32em] uppercase text-white/50"
          style={{ fontFamily: "var(--font-open-sans)" }}
        >
          The
        </span>
        <span
          className="text-[52px] leading-none mt-1"
          style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
        >
          30
        </span>
        <span
          className="text-[9px] font-semibold tracking-[0.24em] uppercase text-white/55 mt-1.5"
          style={{ fontFamily: "var(--font-open-sans)" }}
        >
          Day Guarantee
        </span>
      </div>
    </div>
  );
}

export default function Guarantee() {
  return (
    <section className="relative bg-white py-20 sm:py-28 border-b border-brand-line overflow-hidden">

      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        {/* Eyebrow */}
        <Reveal>
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted text-center"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Our Guarantee
          </p>
        </Reveal>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-center">
          {/* ── Left: Medallion + caption ── */}
          <Reveal delay={0.08}>
            <div className="text-center">
              <Medallion />

              {/* Signature-style caption */}
            </div>
          </Reveal>

          {/* ── Right: Headline + promises ── */}
          <div>
            <Reveal delay={0.12}>
              <h2
                className="text-[28px] sm:text-4xl md:text-[44px] text-brand-ink leading-[1.08]"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                If it doesn&apos;t work,{" "}
                <span className="text-brand-ink">you don&apos;t pay.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.18}>
              <p
                className="mt-5 text-brand-muted text-base sm:text-[17px] leading-relaxed max-w-[520px]"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                We&apos;ve been doing this for 14 years. We know what works. So we put the risk on
                us, not you.
              </p>
            </Reveal>

            {/* Three promises */}
            <div className="mt-8 sm:mt-10 space-y-5">
              {PROMISES.map((p, i) => (
                <Reveal key={p.title} delay={0.24 + i * 0.06}>
                  <div className="flex items-start gap-4">
                    <CheckIcon />
                    <div>
                      <p
                        className="text-brand-ink text-[15px] sm:text-[16px] font-bold leading-snug"
                        style={{ fontFamily: "var(--font-open-sans)" }}
                      >
                        {p.title}
                      </p>
                      <p
                        className="mt-1 text-brand-muted text-[13px] sm:text-[14px] leading-relaxed max-w-[480px]"
                        style={{ fontFamily: "var(--font-open-sans)" }}
                      >
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Social proof bar */}
            <Reveal delay={0.46}>
              <div className="mt-10 pt-6 border-t border-brand-line flex items-center gap-5">
                {/* Avatars — slightly spaced like the reference */}
                <div className="flex -space-x-2 shrink-0">
                  {AVATARS.map((src, i) => (
                    <div
                      key={i}
                      className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden"
                      style={{ zIndex: 5 - i }}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        unoptimized
                        placeholder="empty"
                        className="object-cover object-center"
                        sizes="40px"
                      />
                    </div>
                  ))}
                </div>

                {/* Stars + label */}
                <div>
                  <div className="flex gap-1" role="img" aria-label="5 stars">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill="#1b1b1b" aria-hidden="true">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p
                    className="mt-1 text-[12px] text-brand-muted"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    From wedding venues across the U.S.A.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
