"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BagDrawer } from "@/components/bag-drawer";
import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "@/components/providers/cart-provider";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { isAuthenticated, openAuthPanel, profile, signOut } = useAuth();
  const [isBagOpen, setIsBagOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-white/60 px-8 py-4 shadow-sm shadow-slate-200/20 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between">
          <div className="flex items-center gap-12">
            <Link
              href="/"
              className="font-headline text-2xl font-bold tracking-tighter text-slate-900"
            >
              LARIMAR
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              <Link
                href="/collection"
                className={cn(
                  "font-body text-sm uppercase tracking-[0.1em] antialiased",
                  pathname === "/" ||
                    pathname.startsWith("/collection") ||
                    pathname.startsWith("/product")
                    ? "border-b border-slate-900 pb-1 font-semibold text-slate-900"
                    : "text-slate-500 hover:text-slate-800",
                )}
              >
                Collections
              </Link>
              <Link
                href="/#story"
                className="font-body text-sm uppercase tracking-[0.1em] text-slate-500 antialiased transition-colors duration-300 hover:text-slate-800"
              >
                Story
              </Link>
              <Link
                href="/collection#bespoke"
                className="font-body text-sm uppercase tracking-[0.1em] text-slate-500 antialiased transition-colors duration-300 hover:text-slate-800"
              >
                Bespoke
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/collection"
              aria-label="Search"
              className="material-symbols-outlined text-slate-900 transition-opacity duration-500 hover:opacity-70"
            >
              search
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/account"
                  className="font-label hidden text-[11px] uppercase tracking-[0.18em] text-slate-900 md:block"
                >
                  {profile?.fullName?.split(" ")[0] ?? "Account"}
                </Link>
                <button
                  type="button"
                  className="font-label hidden text-[11px] uppercase tracking-[0.18em] text-slate-500 md:block"
                  onClick={() => void signOut()}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                type="button"
                className="font-label hidden text-[11px] uppercase tracking-[0.18em] text-slate-900 md:block"
                onClick={openAuthPanel}
              >
                Sign In
              </button>
            )}

            <button
              type="button"
              aria-label="Shopping bag"
              className="relative material-symbols-outlined text-slate-900 transition-opacity duration-500 hover:opacity-70"
              onClick={() => setIsBagOpen(true)}
            >
              shopping_bag
              {itemCount ? (
                <span className="absolute -right-2 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-semibold text-white">
                  {itemCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </nav>

      <BagDrawer isOpen={isBagOpen} onClose={() => setIsBagOpen(false)} />
    </>
  );
}
