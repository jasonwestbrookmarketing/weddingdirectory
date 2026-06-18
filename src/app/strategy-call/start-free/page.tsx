import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Rocket, Globe, TrendingUp, ArrowRight } from "lucide-react";
import PageFooter from "@/components/strategy-call/PageFooter";
import { Reveal } from "@/components/strategy-call/Reveal";
import FomoPopup from "@/components/marketing/FomoPopup";

export const dynamic = "force-static";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

// Free-plan signup — same flow as the rest of the site. Tagged so this
// entry point (post-survey, earlier-stage venues) is trackable on its own.
const FREE_SIGNUP_HREF = `${STORYPAY_URL}/signup?as=venue&plan=free&utm_source=strategy-call&utm_medium=survey&utm_campaign=start-free`;

// Distinct, no-index URL so the survey can route earlier-stage venues here and
// the Meta pixel can fire a "free signup intent" conversion scoped to this URL.
export const metadata: Metadata = {
  title: "Start Free | StoryVenue",
  description:
    "Every great venue starts here. Claim your free StoryVenue listing and get in front of couples today — no credit card, no contract.",
  alternates: { canonical: "/strategy-call/start-free" },
  robots: { index: false, follow: false },
};

const TRUST_VENUES = [
  "White Pine Manor",
  "Red Barn Acres",
  "Atlantic Stables",
  "Arbor Venues",
  "Arete Event Center",
  "Waterloo Farms",
  "Irongate Equestrian Center",
];

const STEPS = [
  {
    icon: Globe,
    title: "Claim your free listing",
    body: "Get your venue in front of engaged couples actively searching StoryVenue. No credit card. No contract. Live in minutes.",
  },
  {
    icon: TrendingUp,
    title: "Start booking tours",
    body: "Capture inquiries, respond fast, and fill your calendar with the booking tools built into every free account.",
  },
  {
    icon: Rocket,
    title: "Scale when you're ready",
    body: "As the bookings grow, upgrade to unlock concierge follow-up, ads, and the 1-on-1 strategy support that fills weekends.",
  },
];

export default function StartFreePage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <FomoPopup signupHref={FREE_SIGNUP_HREF} />

      {/* Cinematic hero — mirrors the homepage */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        {/* Static hero image — always visible */}
        <Image
          src="/hero-wedding.jpg"
          alt="Elegant wedding venue"
          fill
          priority
          className="absolute inset-0 object-cover"
          style={{ objectPosition: "center center" }}
          sizes="100vw"
        />

        {/* Video layer — desktop/tablet only */}
        <video
          className="absolute inset-0 w-full h-full object-cover hidden sm:block"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-wedding.jpg"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-happy-bride-walking-with-her-bouquet-40591-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-just-married-couple-40599-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/70" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Nav — logo (non-clickable to keep them on page) + CTA */}
        <nav className="absolute top-0 left-0 right-0 z-20 flex items-center px-6 md:px-12 py-6 gap-4">
          <div className="flex-1 flex items-center">
            <Image
              src="/storyvenue-light-logo.png"
              alt="StoryVenue"
              width={160}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </div>
          <div className="shrink-0">
            <Link
              href={FREE_SIGNUP_HREF}
              className="whitespace-nowrap rounded-full bg-white text-stone-900 px-5 py-2 text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all shadow-sm"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              List Your Venue Free
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center px-5 sm:px-8 pt-28 pb-24 sm:pt-32 sm:pb-28 flex flex-col items-center gap-5 sm:gap-6">
          <Reveal>
            <span
              className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-1.5 text-[11px] font-semibold tracking-[0.22em] uppercase text-white/90"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Your Best First Step
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1
              className="flex flex-col items-center gap-1 drop-shadow-lg"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              <span className="text-2xl sm:text-3xl md:text-4xl font-normal leading-tight tracking-tight text-white/90">
                Every Great Venue
              </span>
              <span
                className="not-italic text-5xl sm:text-7xl md:text-8xl leading-[1.05] tracking-tight text-white"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                Starts Here.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p
              className="text-sm sm:text-lg md:text-xl text-white/90 leading-relaxed font-medium text-center max-w-4xl px-2"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              We don&apos;t think the 1-on-1 program is the right fit for your venue yet.
              Start with a free listing that puts your venue in front of couples today.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-2 flex flex-col items-center gap-3">
              <Link
                href={FREE_SIGNUP_HREF}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-white text-stone-900 px-9 py-4 text-[15px] sm:text-[16px] font-semibold tracking-wide hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Claim Your Free Listing
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <p
                className="text-[13px] text-white/60"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Free Forever · No Credit Card Required
              </p>
            </div>
          </Reveal>

          {/* Venue trust ticker */}
          <div className="w-full mt-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_12%,white_88%,transparent)]">
            <div className="flex gap-12 animate-[ticker_60s_linear_infinite] whitespace-nowrap w-max">
              {[...TRUST_VENUES, ...TRUST_VENUES].map((name, i) => (
                <span
                  key={i}
                  className="text-xs sm:text-sm font-semibold text-white/40 tracking-widest uppercase shrink-0"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-bg py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
          <Reveal>
            <p
              className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              How It Works
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h2
              className="mt-4 text-[22px] sm:text-3xl md:text-[38px] text-brand-ink leading-[1.12]"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              Start small. Grow fast.
            </h2>
          </Reveal>

          <div className="mt-12 sm:mt-14 grid gap-4 sm:gap-5 sm:grid-cols-3 text-left">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={0.08 * i}>
                <div className="h-full bg-white border border-brand-line rounded-xl p-6 sm:p-7">
                  <div className="flex items-center justify-center w-11 h-11 rounded-full bg-brand-warm border border-brand-line">
                    <Icon className="w-5 h-5 text-brand-gold" />
                  </div>
                  <h3
                    className="mt-5 text-[18px] sm:text-[19px] font-bold text-brand-ink"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="mt-2.5 text-[14.5px] sm:text-[15px] text-brand-muted leading-relaxed"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-14">
              <Link
                href={FREE_SIGNUP_HREF}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-ink text-white px-9 py-4 text-[15px] sm:text-[16px] font-semibold tracking-wide hover:bg-black transition-colors"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Get Listed Free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}
