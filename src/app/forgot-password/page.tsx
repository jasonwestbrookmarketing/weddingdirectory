"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
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
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
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
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-10 shadow-sm border border-stone-100">
          {submitted ? (
            <>
              <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 mx-auto">
                <svg
                  className="w-6 h-6 text-stone-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <h1 className="mb-2 text-2xl font-semibold text-stone-900 text-center">
                Check your email
              </h1>
              <p className="mb-8 text-stone-500 text-center text-sm leading-relaxed">
                If an account exists for{" "}
                <span className="font-medium text-stone-700">{email}</span>,
                we&apos;ve sent a password reset link. Check your inbox and
                click the link to reset your password.
              </p>
              <p className="text-center text-sm text-stone-400">
                Didn&apos;t receive it?{" "}
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setEmail("");
                  }}
                  className="text-stone-700 font-medium hover:underline"
                >
                  Try again
                </button>
              </p>
            </>
          ) : (
            <>
              <h1 className="mb-2 text-2xl font-semibold text-stone-900">
                Reset your password
              </h1>
              <p className="mb-8 text-stone-500">
                Enter your email and we&apos;ll send you a link to reset your
                password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                {error && <p className="text-sm text-rose-600">{error}</p>}

                <Button type="submit" loading={loading} className="w-full">
                  Send Reset Link
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-stone-500">
                <Link
                  href="/login"
                  className="font-medium text-stone-900 hover:underline"
                >
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
