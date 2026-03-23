"use client";

import Link from "next/link";
import { AddressBook } from "@/components/address-book";
import { OrderHistory } from "@/components/order-history";
import { useAuth } from "@/components/providers/auth-provider";

export function AccountView() {
  const { isAuthenticated, isReady, openAuthPanel, profile, signOut } = useAuth();

  if (!isReady) {
    return <div className="page-shell section-pad"><div className="h-[40rem] animate-pulse rounded-[2rem] bg-white/70" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="page-shell section-pad">
        <div className="mx-auto max-w-2xl rounded-[2rem] bg-white/80 p-10 text-center shadow-[0_24px_80px_rgba(25,28,29,0.05)]">
          <span className="eyebrow">My Account</span>
          <h1 className="mt-5 text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
            Sign in to enter your private account.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--color-on-surface-variant)]">
            Review orders, save addresses, and keep your collection close at hand.
          </p>
          <button type="button" className="button-primary mt-8" onClick={openAuthPanel}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell section-pad space-y-10">
      <section className="grid gap-8 rounded-[2rem] bg-[var(--color-primary)] p-10 text-white shadow-[0_24px_80px_rgba(0,26,44,0.18)] md:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <span className="eyebrow !text-[var(--color-secondary-container)]">My Account</span>
          <h1 className="mt-4 text-5xl font-bold tracking-[-0.05em]">
            Welcome back,
            <br />
            {profile?.fullName ?? "Collector"}.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
            This private salon keeps your saved destinations, order history, and
            account access aligned with the same calm rhythm as the storefront.
          </p>
        </div>

        <div className="rounded-[1.75rem] bg-white/8 p-6">
          <span className="label-caps !text-white/55">Profile</span>
          <p className="mt-4 text-xl font-semibold">{profile?.fullName ?? "Larimar Client"}</p>
          <p className="mt-2 text-sm text-white/72">{profile?.email}</p>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/collection" className="button-secondary !border-white/10 !bg-white/10 !text-white">
              Continue Browsing
            </Link>
            <button
              type="button"
              className="font-label text-left text-[11px] uppercase tracking-[0.18em] text-white/70"
              onClick={() => void signOut()}
            >
              Sign Out
            </button>
          </div>
        </div>
      </section>

      <AddressBook />
      <OrderHistory />

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-[1.75rem] bg-white/70 p-8 shadow-[0_24px_80px_rgba(25,28,29,0.05)]">
          <span className="eyebrow">Billing</span>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
            Payment security
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-on-surface-variant)]">
            Payments are handled securely through Stripe. Card details are never
            stored directly in your Larimar account.
          </p>
        </article>

        <article className="rounded-[1.75rem] bg-white/70 p-8 shadow-[0_24px_80px_rgba(25,28,29,0.05)]">
          <span className="eyebrow">Assistance</span>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
            Concierge support
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-on-surface-variant)]">
            For bespoke requests, delivery coordination, or payment questions,
            contact <a href="mailto:concierge@larimar.com" className="text-[var(--color-primary)] underline underline-offset-4">concierge@larimar.com</a>.
          </p>
        </article>
      </section>
    </div>
  );
}
