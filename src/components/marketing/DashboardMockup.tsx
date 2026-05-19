"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TrendingUp, CalendarCheck, Users } from "lucide-react";

const BADGES = [
  {
    icon: CalendarCheck,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    label: "Weddings Booked",
    value: "9",
    sub: "Last 90 days",
    delay: 480,
  },
  {
    icon: TrendingUp,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
    label: "Revenue Growth",
    value: "+654%",
    sub: "vs prior period",
    delay: 680,
  },
  {
    icon: Users,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    label: "Leads Captured",
    value: "258",
    sub: "In 60 days",
    delay: 880,
  },
] as const;

/**
 * Browser-chrome mockup containing the StoryVenue dashboard screenshot.
 * Slides in from the right when it enters the viewport.
 * Three floating stat badges pop in sequentially after the mockup lands.
 */
export default function DashboardMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) { setActive(true); return; }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setActive(true); observer.disconnect(); }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateX(0) rotate(-1.5deg)" : "translateX(60px) rotate(-1.5deg)",
        transition: "opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
        willChange: "opacity, transform",
      }}
    >
      {/* Browser chrome */}
      <div className="rounded-2xl overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.28)] border border-stone-200">
        {/* Title bar */}
        <div className="bg-[#f0eeec] border-b border-stone-200 px-4 py-2.5 flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          {/* URL bar */}
          <div className="flex-1 flex justify-center">
            <div className="bg-white border border-stone-200 rounded-md px-3 py-1 flex items-center gap-1.5 w-56">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span
                className="text-[11px] text-stone-500 truncate"
                style={{ fontFamily: "ui-monospace, monospace" }}
              >
                app.storyvenue.com
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard screenshot */}
        <div className="relative w-full aspect-[1024/552] bg-white">
          <Image
            src="/dashboard-preview.png"
            alt="StoryVenue dashboard"
            fill
            unoptimized
            placeholder="empty"
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Floating stat badges */}
      {BADGES.map((badge, i) => {
        const Icon = badge.icon;
        const positions = [
          "absolute -top-5 -right-6",
          "absolute top-1/2 -right-8 -translate-y-1/2",
          "absolute -bottom-5 -right-6",
        ];
        return (
          <div
            key={badge.label}
            className={`${positions[i]} bg-white rounded-2xl border border-stone-200 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.18)] px-3.5 py-2.5 flex items-center gap-2.5 min-w-[148px]`}
            style={{
              opacity: active ? 1 : 0,
              transform: active ? "translateX(0) scale(1)" : "translateX(16px) scale(0.9)",
              transition: "opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.34,1.56,0.64,1)",
              transitionDelay: `${badge.delay}ms`,
              willChange: "opacity, transform",
            }}
          >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${badge.iconBg}`}>
              <Icon className={`w-4 h-4 ${badge.iconColor}`} />
            </span>
            <div>
              <p className="text-[10px] text-stone-500 leading-none" style={{ fontFamily: "var(--font-open-sans)" }}>
                {badge.label}
              </p>
              <p className="text-[16px] font-bold text-stone-900 leading-tight mt-0.5" style={{ fontFamily: "var(--font-open-sans)" }}>
                {badge.value}
              </p>
              <p className="text-[9px] text-stone-400 leading-none mt-0.5">{badge.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
