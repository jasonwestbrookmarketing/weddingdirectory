"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";

const FAQ_ITEMS = [
  {
    q: "What is this strategy call?",
    a: "A 30-minute video call where we look at your venue's actual numbers — inquiries, tour conversion rate, response time — and tell you exactly how many weddings you're losing each month and what it would take to fix it. If we're a fit, we'll show you how StoryVenue works. If we're not, we'll tell you that too.",
  },
  {
    q: "Will I be pitched on the call?",
    a: "No. This is a fit call, not a sales call. We don't read from scripts and we don't pressure. If StoryVenue is the right move for your venue, we'll show you how it works. If it isn't, you'll still walk away with a clear picture of where the gaps in your booking process actually are.",
  },
  {
    q: "What if my venue is at the low or high end of the market?",
    a: "Whether your average wedding sells for $5,000 or $50,000, the math works. You only need 1 to 2 extra weddings a year to make StoryVenue pay for itself for the entire year. The system scales across price points.",
  },
  {
    q: "How does StoryVenue actually work?",
    a: "StoryVenue combines a venue-focused directory, managed Meta ads, landing pages, a concierge follow-up team, AI re-engagement, CRM, proposals, payments, and calendar into one connected system. Brides see your venue, inquire, get followed up with by our team, and book tours — while you focus on hosting. We cover all of this in detail on the call.",
  },
  {
    q: "Is there a contract?",
    a: "No long-term contracts. No cancellation fees. StoryVenue is designed to earn your business through results — not lock you into something you don't want. We back it with a 30-day, 100% results guarantee.",
  },
  {
    q: "How quickly can we get started?",
    a: "From signup to your first leads in 2 to 3 weeks. We handle the heavy lifting — your account setup, ad creative, landing pages, concierge onboarding — so you can focus on giving tours and booking weddings. We'll walk through the exact timeline on your call.",
  },
];

function AccordionItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-brand-line last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 sm:py-6 text-left group"
        aria-expanded={isOpen}
      >
        <span
          className="text-[16px] sm:text-[18px] text-brand-ink leading-snug"
          style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
        >
          {q}
        </span>
        <span
          className="shrink-0 w-6 h-6 flex items-center justify-center text-brand-muted transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ maxHeight: isOpen ? 400 : 0 }}
      >
        <p
          className="pb-5 sm:pb-6 text-brand-muted text-[14px] sm:text-[15px] leading-relaxed"
          style={{ fontFamily: "var(--font-open-sans)" }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-brand-warm py-20 sm:py-28">
      <div className="max-w-[880px] mx-auto px-6 md:px-10">
        <Reveal>
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            — Frequently Asked
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2
            className="mt-4 text-[26px] sm:text-4xl md:text-[42px] text-brand-ink leading-[1.1]"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Questions We Hear on Every Call
          </h2>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-10 sm:mt-12 border-t border-brand-line">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={item.q}
                q={item.q}
                a={item.a}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
