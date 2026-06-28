"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ExperimentView, ElementKey, VariantStat } from "@/lib/experiments";

const ELEMENT_META: Record<ElementKey, { label: string; multiline: boolean; hint?: string }> = {
  headline: {
    label: "Headline",
    multiline: true,
    hint: 'Text after a "|" renders in gold. e.g. "Start Booking More Brides|in 5 Minutes."',
  },
  subheadline: { label: "Subheadline", multiline: true },
  cta: { label: "CTA Button", multiline: false },
};

const ELEMENTS: ElementKey[] = ["headline", "subheadline", "cta"];

export default function FunnelDashboard({
  pageKey,
  initialView,
}: {
  pageKey: string;
  initialView: ExperimentView | null;
}) {
  const router = useRouter();
  const [view, setView] = useState<ExperimentView | null>(initialView);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function post(payload: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/experiments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pageKey, ...payload }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Action failed.");
        return false;
      }
      if (data.view) setView(data.view);
      return true;
    } catch {
      setError("Network error.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function refresh() {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/experiments?page=${pageKey}`);
      const data = await res.json().catch(() => ({}));
      if (data.view) setView(data.view);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Funnel Experiments</h1>
          <p className="text-sm text-stone-500">
            /{pageKey} hero ·{" "}
            <a
              href={`/${pageKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-stone-700"
            >
              view live page
            </a>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            disabled={busy}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
          >
            Refresh
          </button>
          <button
            onClick={logout}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Log out
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!view ? (
        <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 px-5 py-4 text-sm text-amber-800">
          <p className="font-semibold">Database not connected yet.</p>
          <p className="mt-1">
            Add <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> to the
            environment and run <code className="font-mono">db/funnel_ab_testing.sql</code>{" "}
            in Supabase, then refresh. Until then the live hero shows its default
            copy.
          </p>
        </div>
      ) : (
        <>
          <PageSettings view={view} busy={busy} onSave={post} />
          <div className="mt-6 space-y-6">
            {ELEMENTS.map((el) => (
              <ElementCard
                key={el}
                element={el}
                variants={view.elements[el]}
                busy={busy}
                onPost={post}
              />
            ))}
          </div>
          <p className="mt-8 text-xs text-stone-400 leading-relaxed">
            Allocation uses Thompson Sampling on CTA click-through rate: better
            performers automatically get more traffic. &ldquo;Win %&rdquo; is the
            probability a variant is the best. Turn on Auto-pause to switch off
            losers automatically once a variant passes 95% with enough traffic, or
            pin a winner to serve it 100%.
          </p>
        </>
      )}
    </div>
  );
}

function PageSettings({
  view,
  busy,
  onSave,
}: {
  view: ExperimentView;
  busy: boolean;
  onSave: (p: Record<string, unknown>) => Promise<boolean>;
}) {
  const [autoPause, setAutoPause] = useState(view.page.auto_pause);
  const [minImpr, setMinImpr] = useState(view.page.min_impressions);

  return (
    <div className="mt-6 rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={autoPause}
            onChange={(e) => {
              setAutoPause(e.target.checked);
              onSave({ action: "settings", auto_pause: e.target.checked, min_impressions: minImpr });
            }}
            className="h-4 w-4"
          />
          Auto-pause losing variants at 95% confidence
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-700">
          Min impressions before auto-pause
          <input
            type="number"
            value={minImpr}
            min={20}
            onChange={(e) => setMinImpr(Number(e.target.value))}
            onBlur={() => onSave({ action: "settings", auto_pause: autoPause, min_impressions: minImpr })}
            disabled={busy}
            className="w-24 rounded-md border border-stone-300 px-2 py-1 text-sm"
          />
        </label>
      </div>
    </div>
  );
}

function ElementCard({
  element,
  variants,
  busy,
  onPost,
}: {
  element: ElementKey;
  variants: VariantStat[];
  busy: boolean;
  onPost: (p: Record<string, unknown>) => Promise<boolean>;
}) {
  const meta = ELEMENT_META[element];
  const [newContent, setNewContent] = useState("");

  async function add() {
    const content = newContent.trim();
    if (!content) return;
    const ok = await onPost({ action: "upsert", element, content });
    if (ok) setNewContent("");
  }

  const totalImpr = variants.reduce((s, v) => s + v.impressions, 0);
  const totalClicks = variants.reduce((s, v) => s + v.clicks, 0);

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-stone-900">{meta.label}</h2>
        <span className="text-xs text-stone-400">
          {variants.length}/5 variations · {totalImpr.toLocaleString()} views ·{" "}
          {totalClicks.toLocaleString()} clicks
        </span>
      </div>
      {meta.hint && <p className="mt-1 text-xs text-stone-400">{meta.hint}</p>}

      <div className="mt-4 space-y-3">
        {variants.map((v) => (
          <VariantRow key={v.id} element={element} variant={v} busy={busy} onPost={onPost} />
        ))}
      </div>

      {variants.length < 5 && (
        <div className="mt-3 flex items-start gap-2">
          {meta.multiline ? (
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={`Add a ${meta.label.toLowerCase()} variation…`}
              rows={2}
              className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-900"
            />
          ) : (
            <input
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={`Add a ${meta.label.toLowerCase()} variation…`}
              className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-900"
            />
          )}
          <button
            onClick={add}
            disabled={busy || !newContent.trim()}
            className="shrink-0 rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

function VariantRow({
  element,
  variant,
  busy,
  onPost,
}: {
  element: ElementKey;
  variant: VariantStat;
  busy: boolean;
  onPost: (p: Record<string, unknown>) => Promise<boolean>;
}) {
  const meta = ELEMENT_META[element];
  const [content, setContent] = useState(variant.content);
  const dirty = content.trim() !== variant.content;
  const win = variant.probBest ?? 0;
  const isWinner = variant.enabled && win >= 0.95;

  return (
    <div
      className={`rounded-lg border p-3 ${
        variant.enabled ? "border-stone-200 bg-white" : "border-stone-200 bg-stone-50 opacity-60"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {meta.multiline ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-stone-300 px-2.5 py-1.5 text-sm outline-none focus:border-stone-900"
            />
          ) : (
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-md border border-stone-300 px-2.5 py-1.5 text-sm outline-none focus:border-stone-900"
            />
          )}

          {/* Stats */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
            <span>{variant.impressions.toLocaleString()} views</span>
            <span>{variant.clicks.toLocaleString()} clicks</span>
            <span className="font-medium text-stone-700">
              {(variant.ctr * 100).toFixed(2)}% CTR
            </span>
            {variant.enabled && (
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-16 rounded-full bg-stone-200 overflow-hidden align-middle">
                  <span
                    className="block h-full bg-emerald-500"
                    style={{ width: `${Math.round(win * 100)}%` }}
                  />
                </span>
                {Math.round(win * 100)}% win
              </span>
            )}
            {isWinner && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
                Winner
              </span>
            )}
            {variant.pinned && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">
                Pinned · serving 100%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {dirty && (
          <button
            onClick={async () => {
              const ok = await onPost({ action: "upsert", id: variant.id, element, content: content.trim() });
              if (!ok) setContent(variant.content);
            }}
            disabled={busy}
            className="rounded-md bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 disabled:opacity-50"
          >
            Save
          </button>
        )}
        <button
          onClick={() => onPost({ action: "flags", id: variant.id, enabled: !variant.enabled })}
          disabled={busy}
          className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
        >
          {variant.enabled ? "Pause" : "Enable"}
        </button>
        <button
          onClick={() => onPost({ action: "flags", id: variant.id, pinned: !variant.pinned })}
          disabled={busy}
          className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
        >
          {variant.pinned ? "Unpin" : "Pin winner"}
        </button>
        <button
          onClick={() => onPost({ action: "reset", id: variant.id })}
          disabled={busy}
          className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-50 disabled:opacity-50"
        >
          Reset stats
        </button>
        <button
          onClick={() => {
            if (confirm("Delete this variation?")) onPost({ action: "delete", id: variant.id });
          }}
          disabled={busy}
          className="ml-auto rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
