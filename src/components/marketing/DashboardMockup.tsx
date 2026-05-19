"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp, CalendarCheck, Users } from "lucide-react";

const BADGES = [
  {
    icon: CalendarCheck,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    label: "Weddings Booked",
    value: "34",
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

export default function DashboardMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) { setActive(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.2 }
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
        transform: active ? "translateX(0)" : "translateX(48px)",
        transition: "opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
        willChange: "opacity, transform",
      }}
    >
      {/* Browser chrome */}
      <div className="rounded-xl overflow-hidden shadow-[0_40px_100px_-24px_rgba(0,0,0,0.22)] border border-stone-200/80">
        <div className="bg-stone-50 border-b border-stone-200/80 px-3 py-2 flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white border border-stone-200/80 rounded-md px-2.5 py-0.5 flex items-center gap-1.5 w-48">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[10px] text-stone-400 truncate" style={{ fontFamily: "ui-monospace, monospace" }}>
                app.storyvenue.com
              </span>
            </div>
          </div>
        </div>
        <DashboardScreen />
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
              <p className="text-[10px] text-stone-500 leading-none" style={{ fontFamily: "var(--font-open-sans)" }}>{badge.label}</p>
              <p className="text-[16px] font-bold text-stone-900 leading-tight mt-0.5" style={{ fontFamily: "var(--font-open-sans)" }}>{badge.value}</p>
              <p className="text-[9px] text-stone-400 leading-none mt-0.5">{badge.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline dashboard UI — no screenshot, full control over numbers     */
/* ------------------------------------------------------------------ */

function DashboardScreen() {
  const stats = [
    { label: "LEADS", value: "47", trend: "+312%", icon: "👤", iconColor: "#ec4899" },
    { label: "TOURS BOOKED", value: "18", trend: "+180%", icon: "📅", iconColor: "#6366f1" },
    { label: "PROPOSALS", value: "12", trend: "+240%", icon: "📄", iconColor: "#3b82f6" },
    { label: "WEDDINGS BOOKED", value: "34", trend: "+225%", icon: "🤍", iconColor: "#f43f5e" },
    { label: "REVENUE", value: "$142,800", trend: "+654%", icon: "💵", iconColor: "#22c55e" },
  ];

  const proposals = [
    { name: "Sarah & Michael Thompson", email: "sarah.thompson@gmail.com", status: "Paid", statusColor: "#22c55e", statusBg: "#f0fdf4", amount: "$10,000" },
    { name: "Emily & James Hartwell", email: "emily.hartwell@gmail.com", status: "Signed", statusColor: "#6366f1", statusBg: "#eef2ff", amount: "$9,800" },
    { name: "Madison & Connor Wright", email: "madison.wright@gmail.com", status: "Sent", statusColor: "#3b82f6", statusBg: "#eff6ff", amount: "$11,200" },
  ];

  /* Revenue chart — SVG line from near-zero to $142,800 */
  const chartW = 440;
  const chartH = 100;
  const points = [
    [0, chartH],
    [chartW * 0.15, chartH * 0.85],
    [chartW * 0.35, chartH * 0.6],
    [chartW * 0.55, chartH * 0.38],
    [chartW * 0.75, chartH * 0.18],
    [chartW, 0],
  ];
  const pathD = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const areaD = pathD + ` L ${chartW} ${chartH} L 0 ${chartH} Z`;

  return (
    <div className="bg-white flex" style={{ fontFamily: "var(--font-open-sans)" }}>
      {/* Sidebar */}
      <div className="w-[120px] shrink-0 border-r border-stone-100 bg-white py-3 flex flex-col gap-0.5 px-2">
        <p className="text-[11px] font-bold text-stone-900 px-2 mb-2">StoryVenue™</p>
        {["Home", "Contacts", "Conversations", "Calendar", "Leads", "Media", "Reports", "Venue listing", "Payments", "Marketing"].map((item, i) => (
          <div key={item} className={`px-2 py-1 rounded-md text-[10px] ${i === 0 ? "bg-stone-900 text-white font-semibold" : "text-stone-500"}`}>
            {item}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 py-3 overflow-hidden">
        {/* Page header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[13px] font-bold text-stone-900">Home</p>
            <p className="text-[10px] text-stone-400">Your venue payment dashboard</p>
          </div>
          <div className="border border-stone-200 rounded-md px-2 py-1 text-[9px] text-stone-500 flex items-center gap-1">
            📅 Last 30 days ▾
          </div>
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          {stats.map((s) => (
            <div key={s.label} className="border border-stone-100 rounded-lg p-2 bg-white">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[8px] font-semibold tracking-wide text-stone-400 uppercase leading-none">{s.label}</p>
                <span style={{ color: s.iconColor }} className="text-[10px]">{s.icon}</span>
              </div>
              <p className="text-[13px] font-bold text-stone-900 leading-none">{s.value}</p>
              <p className="text-[8px] text-stone-400 mt-0.5">vs prior</p>
              <p className="text-[8px] font-semibold text-emerald-600 mt-0.5">↗ {s.trend}</p>
            </div>
          ))}
        </div>

        {/* Chart + Proposal status row */}
        <div className="grid grid-cols-[3fr_2fr] gap-2 mb-3">
          {/* Revenue chart */}
          <div className="border border-stone-100 rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[8px] font-semibold tracking-wide text-stone-400 uppercase">Revenue</p>
                <p className="text-[15px] font-bold text-stone-900">$142,800</p>
              </div>
              <span className="text-[8px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">↗ +654% vs prior</span>
            </div>
            <svg viewBox={`0 0 ${chartW} ${chartH + 8}`} className="w-full h-[72px]" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1c1917" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#1c1917" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaD} fill="url(#chartFill)" />
              <path d={pathD} fill="none" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex justify-between mt-1">
              <span className="text-[8px] text-stone-400">Jan</span>
              <span className="text-[8px] text-stone-400">May</span>
            </div>
          </div>

          {/* Proposal status */}
          <div className="border border-stone-100 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[8px] font-semibold tracking-wide text-stone-400 uppercase">Proposal Status</p>
            </div>
            <div className="flex gap-0.5 h-2 rounded-full overflow-hidden mb-2">
              <div className="bg-emerald-500" style={{ width: "42%" }} />
              <div className="bg-indigo-500" style={{ width: "33%" }} />
              <div className="bg-blue-400" style={{ width: "16%" }} />
              <div className="bg-amber-400" style={{ width: "9%" }} />
            </div>
            {[
              { label: "Paid", count: 5, color: "#22c55e" },
              { label: "Signed", count: 4, color: "#6366f1" },
              { label: "Sent", count: 2, color: "#60a5fa" },
              { label: "Opened", count: 1, color: "#fbbf24" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: row.color }} />
                  <span className="text-[9px] text-stone-600">{row.label}</span>
                </div>
                <span className="text-[9px] font-semibold text-stone-900">{row.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent proposals */}
        <div className="border border-stone-100 rounded-lg p-3">
          <p className="text-[10px] font-bold text-stone-800 mb-2">Recent Proposals</p>
          <div className="grid grid-cols-[2fr_80px_70px] gap-x-2 mb-1 pb-1 border-b border-stone-100">
            {["CUSTOMER", "STATUS", "AMOUNT"].map((h) => (
              <p key={h} className="text-[8px] font-semibold tracking-wide text-stone-400 uppercase">{h}</p>
            ))}
          </div>
          {proposals.map((p) => (
            <div key={p.name} className="grid grid-cols-[2fr_80px_70px] gap-x-2 py-1.5 border-b border-stone-50 last:border-0 items-center">
              <div>
                <p className="text-[9px] font-semibold text-stone-800 leading-none">{p.name}</p>
                <p className="text-[8px] text-stone-400 mt-0.5">{p.email}</p>
              </div>
              <span
                className="text-[8px] font-semibold px-2 py-0.5 rounded-full w-fit"
                style={{ color: p.statusColor, background: p.statusBg }}
              >
                {p.status}
              </span>
              <p className="text-[9px] font-bold text-stone-800">{p.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
