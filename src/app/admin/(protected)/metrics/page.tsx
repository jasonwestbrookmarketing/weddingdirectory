"use client";

import { useEffect, useState } from "react";
import { Building2, FileText, Globe, TrendingUp, TriangleAlert } from "lucide-react";

const RANGES = [
  { value: "7d", label: "Last 7 days" },
  { value: "14d", label: "Last 14 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "60d", label: "Last 60 days" },
  { value: "month", label: "This month" },
  { value: "ytd", label: "Year to date" },
  { value: "lastyear", label: "Last year" },
  { value: "all", label: "All time" },
];

interface MetricsData {
  range: string;
  period: { venues: number; published: number; drafts: number; leads: number };
  allTime: { venues: number; published: number; leads: number };
  topStates: { state: string; count: number }[];
  topCities: { city: string; count: number }[];
  topVenuesByLeads: { name: string; leads: number }[];
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color = "stone",
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ElementType;
  color?: string;
}) {
  const iconBg: Record<string, string> = {
    stone: "bg-stone-100 text-stone-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
  };
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-stone-500">{label}</p>
          <p className="mt-1 text-3xl font-bold text-stone-900">{value}</p>
          {sub && <p className="mt-1 text-xs text-stone-400">{sub}</p>}
        </div>
        <div className={`rounded-xl p-2.5 ${iconBg[color] ?? iconBg.stone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function BarList({
  title,
  items,
  labelKey,
  countKey,
}: {
  title: string;
  items: Record<string, string | number>[];
  labelKey: string;
  countKey: string;
}) {
  const max = Math.max(...items.map((i) => Number(i[countKey])), 1);
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-stone-700 mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-stone-400">No data for this period.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-28 shrink-0 truncate text-sm text-stone-700">
                {String(item[labelKey])}
              </span>
              <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-stone-900 transition-all duration-500"
                  style={{ width: `${(Number(item[countKey]) / max) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right text-sm font-medium text-stone-600">
                {item[countKey]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminMetricsPage() {
  const [range, setRange] = useState("30d");
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  // Load maintenance state
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((s) => setMaintenance(s.maintenance_mode === "true"))
      .catch(() => {});
  }, []);

  async function toggleMaintenance() {
    setMaintenanceLoading(true);
    const next = !maintenance;
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maintenance_mode: String(next) }),
    });
    setMaintenance(next);
    setMaintenanceLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/metrics?range=${range}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [range]);

  const rangeLabel = RANGES.find((r) => r.value === range)?.label ?? range;

  return (
    <div>
      {/* Maintenance mode banner + toggle */}
      <div className={`mb-6 rounded-2xl border px-5 py-4 flex items-center justify-between gap-4 ${
        maintenance
          ? "bg-amber-50 border-amber-200"
          : "bg-white border-stone-200"
      }`}>
        <div className="flex items-center gap-3">
          <TriangleAlert className={`h-5 w-5 shrink-0 ${maintenance ? "text-amber-500" : "text-stone-300"}`} />
          <div>
            <p className={`text-sm font-semibold ${maintenance ? "text-amber-800" : "text-stone-700"}`}>
              Maintenance Mode
            </p>
            <p className={`text-xs mt-0.5 ${maintenance ? "text-amber-600" : "text-stone-400"}`}>
              {maintenance
                ? "Site is DOWN — all public pages show maintenance screen. Admins can still access /admin."
                : "Site is live and accessible to all visitors."}
            </p>
          </div>
        </div>
        <button
          onClick={toggleMaintenance}
          disabled={maintenanceLoading}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-60 ${
            maintenance ? "bg-amber-500" : "bg-stone-200"
          }`}
          role="switch"
          aria-checked={maintenance}
        >
          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
            maintenance ? "translate-x-5" : "translate-x-0"
          }`} />
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Metrics</h1>
          <p className="text-sm text-stone-500 mt-1">
            Platform performance overview
          </p>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-900"
        >
          {RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
        </div>
      ) : data ? (
        <>
          {/* Period label */}
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-4">
            {rangeLabel}
          </p>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="New Venues"
              value={data.period.venues}
              sub={`${data.allTime.venues} all time`}
              icon={Building2}
              color="stone"
            />
            <StatCard
              label="Published"
              value={data.period.published}
              sub={`${data.allTime.published} all time`}
              icon={Globe}
              color="emerald"
            />
            <StatCard
              label="Drafts"
              value={data.period.drafts}
              icon={FileText}
              color="amber"
            />
            <StatCard
              label="Leads"
              value={data.period.leads}
              sub={`${data.allTime.leads} all time`}
              icon={TrendingUp}
              color="blue"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <BarList
              title="Top States"
              items={data.topStates as Record<string, string | number>[]}
              labelKey="state"
              countKey="count"
            />
            <BarList
              title="Top Cities"
              items={data.topCities as Record<string, string | number>[]}
              labelKey="city"
              countKey="count"
            />
            <BarList
              title="Most Leads by Venue"
              items={data.topVenuesByLeads as Record<string, string | number>[]}
              labelKey="name"
              countKey="leads"
            />
          </div>
        </>
      ) : (
        <p className="text-stone-500">Failed to load metrics.</p>
      )}
    </div>
  );
}
