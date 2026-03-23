import { Suspense } from "react";
import type { Metadata } from "next";
import { CollectionFilters } from "@/components/collection-filters";
import { getCollectionProducts } from "@/lib/catalog";
import { collectionIntro } from "@/data/site";

export const metadata: Metadata = {
  title: "The Collection",
  description:
    "Discover Larimar pendants, rings, earrings, and bracelets shaped by the Dominican coast.",
};

export default function CollectionPage() {
  const products = getCollectionProducts();

  return (
    <div className="page-shell section-pad">
      <header className="mb-14 max-w-3xl">
        <h1 className="text-5xl font-extrabold tracking-[-0.05em] text-[var(--color-primary)] md:text-7xl">
          {collectionIntro.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-[var(--color-on-surface-variant)]">
          {collectionIntro.description}
        </p>
      </header>

      <Suspense
        fallback={<div className="h-[36rem] animate-pulse rounded-[2rem] bg-white/70" />}
      >
        <CollectionFilters products={products} />
      </Suspense>

      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-4 text-[rgba(114,119,126,0.4)]">
          <span className="h-px w-20 bg-current" />
          <span className="h-2 w-2 rounded-full border border-current" />
          <span className="h-px w-20 bg-current" />
        </div>
      </div>
    </div>
  );
}
