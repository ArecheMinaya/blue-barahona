'use client';

import { BagDrawer } from '@/components/bag-drawer';
import { ArrowRightIcon, CloseIcon, MenuIcon } from '@/components/icons';
import { useAuth } from '@/components/providers/auth-provider';
import { useCart } from '@/components/providers/cart-provider';
import { navItems } from '@/data/site';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { isAuthenticated, openAuthPanel, profile, signOut } = useAuth();
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.removeProperty('overflow');
      return;
    }

    document.body.style.setProperty('overflow', 'hidden');

    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, [isMenuOpen]);

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
                  'font-body text-sm uppercase tracking-[0.1em] antialiased',
                  pathname === '/' ||
                    pathname.startsWith('/collection') ||
                    pathname.startsWith('/product')
                    ? 'border-b border-slate-900 pb-1 font-semibold text-slate-900'
                    : 'text-slate-500 hover:text-slate-800'
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
                  {profile?.fullName?.split(' ')[0] ?? 'Account'}
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

            <button
              type="button"
              aria-label="Open navigation menu"
              className="text-slate-900 transition-opacity duration-500 hover:opacity-70 md:hidden"
              onClick={() => {
                setIsBagOpen(false);
                setIsMenuOpen(true);
              }}
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={
          isMenuOpen
            ? 'pointer-events-auto fixed inset-0 z-[54] bg-[rgba(0,26,44,0.22)] backdrop-blur-sm md:hidden'
            : 'pointer-events-none fixed inset-0 z-[54] bg-transparent opacity-0 md:hidden'
        }
        onClick={() => setIsMenuOpen(false)}
      />

      <aside
        className={
          isMenuOpen
            ? 'fixed left-0 top-0 z-[58] flex h-full w-full max-w-sm translate-x-0 flex-col overflow-hidden border-r border-white/35 bg-[rgba(248,250,251,0.94)] shadow-[0_24px_80px_rgba(0,26,44,0.14)] backdrop-blur-2xl transition-transform duration-500 md:hidden'
            : 'fixed left-0 top-0 z-[58] flex h-full w-full max-w-sm -translate-x-full flex-col overflow-hidden border-r border-white/35 bg-[rgba(248,250,251,0.94)] shadow-[0_24px_80px_rgba(0,26,44,0.14)] backdrop-blur-2xl transition-transform duration-500 md:hidden'
        }
      >
        <div className="relative overflow-hidden border-b border-black/5 px-6 py-6">
          <div className="absolute -left-14 top-0 h-32 w-32 rounded-full bg-[rgba(144,231,253,0.18)] blur-2xl" />
          <div className="absolute right-0 top-8 h-24 w-24 rounded-full bg-[rgba(0,26,44,0.06)] blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span className="eyebrow">Mobile Navigation</span>
              <p className="mt-3 font-headline text-3xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
                Larimar
              </p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--color-on-surface-variant)]">
                The full salon menu, account access, and reserved pieces, tailored for smaller
                screens.
              </p>
            </div>

            <button
              type="button"
              aria-label="Close navigation menu"
              className="text-[var(--color-primary)]"
              onClick={() => setIsMenuOpen(false)}
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6 no-scrollbar">
          <div className="rounded-[1.75rem] bg-[var(--color-primary)] p-6 text-white shadow-[0_20px_60px_rgba(0,26,44,0.18)]">
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-secondary-container)]">
              Account
            </span>
            <p className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
              {isAuthenticated
                ? `Welcome, ${profile?.fullName?.split(' ')[0] ?? 'Collector'}.`
                : 'Private access awaits.'}
            </p>
            <p className="mt-3 text-sm leading-7 text-white/72">
              {isAuthenticated
                ? profile?.email
                : 'Sign in to manage your profile, saved addresses, order archive, and checkout progress.'}
            </p>

            <div className="mt-6 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/account"
                    className="button-secondary w-full !border-white/10 !bg-white/10 !text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <button
                    type="button"
                    className="font-label text-left text-[11px] uppercase tracking-[0.18em] text-white/70"
                    onClick={() => {
                      setIsMenuOpen(false);
                      void signOut();
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="button-secondary w-full !border-white/10 !bg-white/10 !text-white"
                  onClick={() => {
                    setIsMenuOpen(false);
                    openAuthPanel();
                  }}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          <div>
            <span className="label-caps">Explore</span>
            <div className="mt-4 space-y-3">
              {navItems.map((item) => {
                const isActive =
                  item.href === '/collection'
                    ? pathname === '/' ||
                      pathname.startsWith('/collection') ||
                      pathname.startsWith('/product')
                    : pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between rounded-[1.5rem] bg-white/80 px-5 py-4 shadow-[0_20px_50px_rgba(25,28,29,0.05)]',
                      isActive && 'bg-[var(--color-surface-container-low)]'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div>
                      <p className="font-headline text-lg font-semibold tracking-[-0.03em] text-[var(--color-primary)]">
                        {item.label}
                      </p>
                      <p className="mt-1 font-label text-[10px] uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
                        {item.label === 'Collections'
                          ? 'Explore the full archive'
                          : item.label === 'Story'
                            ? 'The world behind the stone'
                            : 'Private commissions and concierge'}
                      </p>
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-[var(--color-primary)]" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* <div className="rounded-[1.75rem] bg-[var(--color-surface-container-low)] p-5">
            <span className="label-caps">Quick Actions</span>
            <div className="mt-4 grid gap-3">
              <Link
                href="/collection"
                className="button-secondary w-full !justify-between !bg-white/75 px-5 !text-[var(--color-primary)]"
                onClick={() => setIsMenuOpen(false)}
              >
                Search the Collection
                <ArrowRightIcon className="h-4 w-4" />
              </Link>

              <button
                type="button"
                className="button-secondary w-full !justify-between !bg-white/75 px-5 !text-[var(--color-primary)]"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsBagOpen(true);
                }}
              >
                Your Bag
                <span className="font-label text-[10px] uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
                  {itemCount} piece{itemCount === 1 ? '' : 's'}
                </span>
              </button>
            </div>
          </div> */}
        </div>
      </aside>

      <BagDrawer isOpen={isBagOpen} onClose={() => setIsBagOpen(false)} />
    </>
  );
}
