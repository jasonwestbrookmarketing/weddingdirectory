"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/dashboard"), 2500);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-10 shadow-sm border border-stone-100">
          {done ? (
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
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="mb-2 text-2xl font-semibold text-stone-900 text-center">
                Password updated
              </h1>
              <p className="text-stone-500 text-center text-sm">
                Your password has been changed. Redirecting you to the
                dashboard…
              </p>
            </>
          ) : (
            <>
              <h1 className="mb-2 text-2xl font-semibold text-stone-900">
                Set a new password
              </h1>
              <p className="mb-8 text-stone-500">
                Choose a strong password for your account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  id="password"
                  label="New password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <Input
                  id="confirm"
                  label="Confirm new password"
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />

                {error && <p className="text-sm text-rose-600">{error}</p>}

                <Button type="submit" loading={loading} className="w-full">
                  Update Password
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
