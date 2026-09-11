"use client";

import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";

/**
 * Full-page password prompt for a private wedding site. On success the unlock
 * proxy sets a signed cookie and we reload so the server renders the real page
 * (content is never sent to the browser until the password is correct).
 */
export default function LockGate({ slug, coupleName }: { slug: string; coupleName: string }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/minisite/${encodeURIComponent(slug)}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        window.location.reload();
        return;
      }
      setError(res.status === 429 ? "Too many attempts. Please try again later." : "That password isn't right. Try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-warm px-4">
      <div className="w-full max-w-sm rounded-3xl border border-brand-line bg-white p-8 text-center shadow-[0_16px_40px_-24px_rgba(0,0,0,0.4)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-ink text-white">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-5 font-[family-name:var(--font-playfair)] text-2xl italic text-brand-ink">{coupleName}</h1>
        <p className="mt-2 text-sm text-brand-muted">This wedding page is private. Enter the password from your invitation to continue.</p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-2xl border border-brand-line bg-white px-4 py-3 text-center text-sm text-brand-ink outline-none focus:border-brand-ink"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={busy || !password.trim()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-ink px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} View wedding page
          </button>
        </form>
      </div>
    </main>
  );
}
