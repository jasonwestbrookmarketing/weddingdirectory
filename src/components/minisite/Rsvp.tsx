"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Search, ChevronRight } from "lucide-react";

type Match = { token: string; fullName: string; partySize: number; group: string | null; rsvpStatus: string };
type GuestData = {
  guest: { name: string; partySize: number; rsvpStatus: string; mealChoice: string | null; dietaryNotes: string | null; responded: boolean };
  mealOptions: string[];
};

export default function Rsvp({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [searching, setSearching] = useState(false);
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [error, setError] = useState("");

  // selected guest form state
  const [token, setToken] = useState<string | null>(null);
  const [guest, setGuest] = useState<GuestData | null>(null);
  const [loadingGuest, setLoadingGuest] = useState(false);
  const [attending, setAttending] = useState<boolean | null>(null);
  const [headcount, setHeadcount] = useState(1);
  const [meal, setMeal] = useState("");
  const [dietary, setDietary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | boolean>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMatches(null);
    if (name.trim().length < 2) {
      setError("Enter your full name.");
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/minisite/${encodeURIComponent(slug)}/rsvp-lookup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setMatches(Array.isArray(data.matches) ? data.matches : []);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  async function pick(m: Match) {
    setToken(m.token);
    setGuest(null);
    setDone(null);
    setLoadingGuest(true);
    try {
      const res = await fetch(`/api/minisite/rsvp/${m.token}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not load your invitation.");
        setToken(null);
        return;
      }
      setGuest(data);
      setAttending(data.guest.rsvpStatus === "attending" ? true : data.guest.rsvpStatus === "declined" ? false : null);
      setHeadcount(Math.max(1, data.guest.partySize || 1));
      setMeal(data.guest.mealChoice ?? "");
      setDietary(data.guest.dietaryNotes ?? "");
    } finally {
      setLoadingGuest(false);
    }
  }

  async function submit() {
    if (!token || attending === null) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/minisite/rsvp/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attending,
          headcount,
          meal_choice: meal || null,
          dietary_notes: dietary || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not save your RSVP.");
        return;
      }
      setDone(attending);
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setToken(null);
    setGuest(null);
    setDone(null);
    setAttending(null);
    setMatches(null);
    setName("");
  }

  // ── Thank-you ───────────────────────────────────────────────────────────
  if (done !== null) {
    return (
      <section className="mx-auto mt-4 max-w-[520px] rounded-2xl border border-brand-line bg-white p-6 text-center shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]">
        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
        <p className="mt-3 text-brand-ink">
          {done ? "You're on the list — can't wait to celebrate with you! 🤍" : "Thanks for letting us know. You'll be missed! 🤍"}
        </p>
        <button onClick={reset} className="mt-4 text-sm font-medium text-brand-muted underline-offset-2 hover:text-brand-ink hover:underline">
          Submit another RSVP
        </button>
      </section>
    );
  }

  // ── Guest form ───────────────────────────────────────────────────────────
  if (token) {
    return (
      <section className="mx-auto mt-4 max-w-[520px] rounded-2xl border border-brand-line bg-white p-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]">
        {loadingGuest || !guest ? (
          <div className="flex justify-center py-6 text-brand-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          <>
            <p className="text-center text-sm font-medium text-brand-ink">Hi {guest.guest.name}!</p>
            <p className="mt-1 text-center text-sm text-brand-muted">Will you be joining us?</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => setAttending(true)}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${attending === true ? "border-brand-ink bg-brand-ink text-white" : "border-brand-line bg-white text-brand-ink hover:border-brand-ink"}`}
              >
                Joyfully accept
              </button>
              <button
                onClick={() => setAttending(false)}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${attending === false ? "border-brand-ink bg-brand-ink text-white" : "border-brand-line bg-white text-brand-ink hover:border-brand-ink"}`}
              >
                Regretfully decline
              </button>
            </div>

            {attending === true && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-muted">Number attending</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setHeadcount((n) => Math.max(1, n - 1))} className="h-9 w-9 rounded-lg border border-brand-line text-brand-ink">−</button>
                    <span className="min-w-[2ch] text-center text-lg font-semibold text-brand-ink">{headcount}</span>
                    <button onClick={() => setHeadcount((n) => Math.min(30, n + 1))} className="h-9 w-9 rounded-lg border border-brand-line text-brand-ink">+</button>
                    <span className="text-xs text-brand-muted">of {guest.guest.partySize} invited</span>
                  </div>
                </div>

                {guest.mealOptions.length > 0 && (
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-muted">Meal choice</label>
                    <select
                      value={meal}
                      onChange={(e) => setMeal(e.target.value)}
                      className="w-full rounded-xl border border-brand-line bg-white px-3 py-2.5 text-sm text-brand-ink focus:border-brand-ink focus:outline-none"
                    >
                      <option value="">Select…</option>
                      {guest.mealOptions.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-muted">Dietary notes (optional)</label>
                  <input
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    maxLength={500}
                    placeholder="Allergies, preferences…"
                    className="w-full rounded-xl border border-brand-line bg-white px-3 py-2.5 text-sm text-brand-ink placeholder:text-brand-muted focus:border-brand-ink focus:outline-none"
                  />
                </div>
              </div>
            )}

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="mt-5 flex items-center justify-between">
              <button onClick={reset} className="text-sm text-brand-muted hover:text-brand-ink">← Back</button>
              <button
                onClick={submit}
                disabled={submitting || attending === null}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-ink px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Send RSVP
              </button>
            </div>
          </>
        )}
      </section>
    );
  }

  // ── Name lookup ────────────────────────────────────────────────────────
  return (
    <section className="mx-auto mt-4 max-w-[520px]">
      <form onSubmit={search} className="rounded-2xl border border-brand-line bg-white p-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-muted">Find your invitation</label>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full rounded-xl border border-brand-line bg-white px-3 py-2.5 text-sm text-brand-ink placeholder:text-brand-muted focus:border-brand-ink focus:outline-none"
          />
          <button
            type="submit"
            disabled={searching}
            className="inline-flex flex-none items-center gap-1.5 rounded-xl bg-brand-ink px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </form>

      {matches !== null && (
        <div className="mt-3 space-y-2">
          {matches.length === 0 ? (
            <p className="rounded-2xl border border-brand-line bg-white px-4 py-3 text-sm text-brand-muted">
              We couldn&rsquo;t find that name. Double-check the spelling, or reach out to the couple.
            </p>
          ) : (
            matches.map((m) => (
              <button
                key={m.token}
                onClick={() => pick(m)}
                className="flex w-full items-center justify-between rounded-2xl border border-brand-line bg-white px-4 py-3 text-left transition-colors hover:border-brand-ink"
              >
                <span>
                  <span className="block text-sm font-medium text-brand-ink">{m.fullName}</span>
                  {m.group && <span className="block text-xs text-brand-muted">{m.group}</span>}
                </span>
                <ChevronRight className="h-4 w-4 text-brand-muted" />
              </button>
            ))
          )}
        </div>
      )}
    </section>
  );
}
