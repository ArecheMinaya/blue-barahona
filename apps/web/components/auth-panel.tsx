"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";

export function AuthPanel() {
  const {
    closeAuthPanel,
    isConfigured,
    isAuthPanelOpen,
    signInWithGoogle,
    signInWithPassword,
    signUpWithPassword,
  } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        await signInWithPassword({ email, password });
      } else {
        await signUpWithPassword({ fullName, email, password });
        setMessage("Check your inbox to confirm your account, then return to continue.");
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Authentication failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);

    try {
      await signInWithGoogle();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Google sign-in failed.");
    }
  }

  return (
    <>
      <div
        className={
          isAuthPanelOpen
            ? "pointer-events-auto fixed inset-0 z-[70] bg-[rgba(0,26,44,0.28)] backdrop-blur-sm"
            : "pointer-events-none fixed inset-0 z-[70] bg-transparent opacity-0"
        }
        onClick={closeAuthPanel}
      />

      <aside
        className={
          isAuthPanelOpen
            ? "fixed right-0 top-0 z-[80] flex h-full w-full max-w-lg translate-x-0 flex-col border-l border-white/35 bg-[rgba(248,250,251,0.92)] p-8 shadow-[0_20px_80px_rgba(0,26,44,0.16)] backdrop-blur-2xl transition-transform duration-500"
            : "fixed right-0 top-0 z-[80] flex h-full w-full max-w-lg translate-x-full flex-col border-l border-white/35 bg-[rgba(248,250,251,0.92)] p-8 shadow-[0_20px_80px_rgba(0,26,44,0.16)] backdrop-blur-2xl transition-transform duration-500"
        }
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <span className="eyebrow">Private Access</span>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
              Enter the Larimar salon.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-[var(--color-on-surface-variant)]">
              Sign in to keep your bag across devices, manage delivery details,
              and review every order from the collection archive.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close account access panel"
            className="font-label text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]"
            onClick={closeAuthPanel}
          >
            Close
          </button>
        </div>

        <div className="mt-10 flex gap-3 rounded-full bg-white/70 p-1">
          <button
            type="button"
            className={
              mode === "signin"
                ? "flex-1 rounded-full bg-[var(--color-primary)] px-4 py-3 font-label text-[10px] uppercase tracking-[0.2em] text-white"
                : "flex-1 rounded-full px-4 py-3 font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)]"
            }
            onClick={() => setMode("signin")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={
              mode === "signup"
                ? "flex-1 rounded-full bg-[var(--color-primary)] px-4 py-3 font-label text-[10px] uppercase tracking-[0.2em] text-white"
                : "flex-1 rounded-full px-4 py-3 font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)]"
            }
            onClick={() => setMode("signup")}
          >
            Create Account
          </button>
        </div>

        <button
          type="button"
          className="button-secondary mt-8 w-full !bg-white"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>

        <div className="my-8 flex items-center gap-4 text-[rgba(114,119,126,0.5)]">
          <span className="h-px flex-1 bg-current" />
          <span className="font-label text-[10px] uppercase tracking-[0.2em]">or</span>
          <span className="h-px flex-1 bg-current" />
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {!isConfigured ? (
            <p className="rounded-[1.25rem] bg-[rgba(216,75,75,0.08)] px-4 py-3 text-sm text-[rgb(143,43,43)]">
              Supabase auth is not configured yet. Add the values from
              `apps/web/.env.example` to enable sign-in.
            </p>
          ) : null}

          {mode === "signup" ? (
            <label className="flex flex-col gap-2">
              <span className="label-caps">Full Name</span>
              <input
                value={fullName}
                className="input-line"
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Julian Amsel"
              />
            </label>
          ) : null}

          <label className="flex flex-col gap-2">
            <span className="label-caps">Email</span>
            <input
              type="email"
              value={email}
              className="input-line"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="collector@example.com"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="label-caps">Password</span>
            <input
              type="password"
              value={password}
              className="input-line"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error ? (
            <p className="rounded-[1.25rem] bg-[rgba(216,75,75,0.08)] px-4 py-3 text-sm text-[rgb(143,43,43)]">
              {error}
            </p>
          ) : null}

          {message ? (
            <p className="rounded-[1.25rem] bg-[rgba(144,231,253,0.18)] px-4 py-3 text-sm text-[var(--color-primary)]">
              {message}
            </p>
          ) : null}

          <button type="submit" className="button-primary w-full" disabled={isSubmitting}>
            {isSubmitting
              ? "Please Wait"
              : mode === "signin"
                ? "Enter Account"
                : "Create Account"}
          </button>
        </form>
      </aside>
    </>
  );
}
