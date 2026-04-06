"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck } from "lucide-react";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Something went wrong.");
        setLoading(false);
        return;
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="flex flex-col items-center mb-8 gap-3">
          <Image
            src="/storyvenue-light-logo.png"
            alt="StoryVenue"
            width={140}
            height={36}
            className="h-8 w-auto object-contain"
            priority
          />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin Portal
          </span>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
          {submitted ? (
            <>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mx-auto mb-4">
                <svg className="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-white text-center mb-2">Check your email</h1>
              <p className="text-sm text-white/50 text-center mb-6 leading-relaxed">
                If an admin account exists for <span className="text-white/70 font-medium">{email}</span>, we&apos;ve sent a reset link.
              </p>
              <Link
                href="/admin/login"
                className="block w-full text-center rounded-xl bg-white text-stone-900 px-4 py-3 text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                Back to sign in
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-white mb-1">Reset password</h1>
              <p className="text-sm text-white/50 mb-6">
                Enter your admin email to receive a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@example.com"
                    className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-white text-stone-900 px-4 py-3 text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-white/30">
                <Link href="/admin/login" className="text-white/50 hover:text-white/80 transition-colors">
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
