import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell section-pad">
      <div className="mx-auto max-w-2xl rounded-[2rem] bg-white/75 px-8 py-14 text-center shadow-[0_24px_80px_rgba(25,28,29,0.05)]">
        <span className="eyebrow">Not Found</span>
        <h1 className="mt-5 text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
          This piece has drifted beyond the shoreline.
        </h1>
        <p className="mt-5 text-lg leading-8 text-[var(--color-on-surface-variant)]">
          The requested page is unavailable or no longer part of the current
          Larimar edit.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 md:flex-row">
          <Link href="/" className="button-secondary">
            Return Home
          </Link>
          <Link href="/collection" className="button-primary">
            Browse the Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
