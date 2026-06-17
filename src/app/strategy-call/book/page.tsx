import type { Metadata } from "next";
import Script from "next/script";
import { CheckCircle2 } from "lucide-react";
import Marquee from "@/components/strategy-call/Marquee";
import StrategyNav from "@/components/strategy-call/StrategyNav";
import PageFooter from "@/components/strategy-call/PageFooter";
import { Reveal } from "@/components/strategy-call/Reveal";

export const dynamic = "force-static";

const FORM_ID = "FleeMY5JXKKZkmufZZv6";
const FORM_SRC = `https://api.leadconnectorhq.com/widget/form/${FORM_ID}`;

// Distinct, no-index URL so the Meta pixel can fire a qualified-lead conversion
// scoped to /strategy-call/book (the survey redirects qualified leads here).
export const metadata: Metadata = {
  title: "Book Your Strategy Call | StoryVenue",
  description:
    "You're a great fit. Pick a time for your free 30-minute wedding venue strategy call.",
  alternates: { canonical: "/strategy-call/book" },
  robots: { index: false, follow: false },
};

export default function StrategyCallBookPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />

      {/* Sticky shell — marquee + nav scroll together (matches /strategy-call) */}
      <div className="sticky top-0 z-40">
        <Marquee />
        <StrategyNav showCta={false} />
      </div>

      <main className="flex-1">
        <section className="bg-brand-bg pt-10 sm:pt-14 lg:pt-16 pb-14 sm:pb-20 border-b border-brand-line">
          <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
            <Reveal>
              <span
                className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-1.5 text-[11px] font-semibold tracking-[0.22em] uppercase text-green-700"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                You&apos;re A Great Fit
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1
                className="mt-6 text-[34px] sm:text-[48px] md:text-[56px] leading-[1.08] text-brand-ink"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                <span className="block">Pick A Time For Your</span>
                <span className="block">
                  Free Strategy <span style={{ color: "#8a7448" }}>Call.</span>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p
                className="mt-5 text-[15px] sm:text-[17px] text-brand-muted leading-relaxed max-w-xl mx-auto"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Choose the time that works best below. You&apos;ll get a confirmation
                with everything you need to join — we&apos;ll text and email reminders too.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Calendar / booking form embed */}
        <section className="bg-brand-bg py-10 sm:py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-10">
            <div className="bg-white border border-brand-line rounded-2xl overflow-hidden">
              <iframe
                src={FORM_SRC}
                style={{ width: "100%", height: "100%", minHeight: 720, border: "none", borderRadius: 0 }}
                id={`inline-${FORM_ID}`}
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="Strategy Call Confirmed"
                data-height="574"
                data-layout-iframe-id={`inline-${FORM_ID}`}
                data-form-id={FORM_ID}
                title="Strategy Call Confirmed"
              />
            </div>
          </div>
        </section>
      </main>

      <PageFooter />
    </div>
  );
}
