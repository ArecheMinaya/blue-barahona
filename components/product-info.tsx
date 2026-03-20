import Link from "next/link";
import { AddToBagButton } from "@/components/add-to-bag-button";
import { ChevronDownIcon, ChevronRightIcon, HeartIcon } from "@/components/icons";
import { formatCurrency } from "@/lib/commerce";
import type { Product } from "@/lib/types";

export function ProductInfo({ product }: { product: Product }) {
  return (
    <section className="bg-[var(--color-surface-container-lowest)] px-6 py-10 md:px-12 lg:px-20">
      <div className="mx-auto max-w-xl">
        <nav className="font-label mb-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
          <Link href="/collection" className="hover:text-[var(--color-primary)]">
            {product.collection}
          </Link>
          <ChevronRightIcon className="h-3 w-3" />
          <span className="text-[var(--color-primary)]">{product.category}</span>
        </nav>

        <h1 className="text-5xl font-bold tracking-[-0.05em] text-[var(--color-primary)] md:text-6xl">
          {product.name}
        </h1>
        <p className="mt-4 text-2xl font-light text-[var(--color-secondary)]">
          {formatCurrency(product.price)}
        </p>

        <div className="mt-8 space-y-6">
          <p className="text-lg italic leading-8 text-[var(--color-on-surface-variant)]">
            &ldquo;{product.tagline}&rdquo;
          </p>
          <p className="leading-8 text-[var(--color-on-surface-variant)]">
            {product.description}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-8 rounded-[1.5rem] bg-[var(--color-surface)] p-6">
          <div>
            <span className="label-caps">Material</span>
            <p className="mt-2 text-sm font-medium text-[var(--color-primary)]">
              {product.metal}
            </p>
          </div>
          <div>
            <span className="label-caps">Stone</span>
            <p className="mt-2 text-sm font-medium text-[var(--color-primary)]">
              {product.stone}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[1.5rem] bg-[var(--color-surface-container-low)] p-6">
          <span className="label-caps">Larimar Tone Profile</span>
          <div className="mt-4 flex items-center gap-3">
            {product.stonePalette.map((color) => (
              <span
                key={color}
                className="h-8 w-8 rounded-full border border-white/60 shadow-[0_10px_30px_rgba(25,28,29,0.08)]"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <AddToBagButton slug={product.slug} />
          <button type="button" className="button-secondary w-full">
            <HeartIcon className="h-4 w-4" />
            Wishlist
          </button>
        </div>

        <div className="mt-14 space-y-4">
          <details
            className="rounded-[1.5rem] bg-[var(--color-surface)] px-5 py-4"
            open
          >
            <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Craftsmanship &amp; Origin
              <ChevronDownIcon className="h-4 w-4" />
            </summary>
            <p className="pt-4 text-sm leading-7 text-[var(--color-on-surface-variant)]">
              {product.craftNote} {product.story}
            </p>
          </details>

          <details className="rounded-[1.5rem] bg-[var(--color-surface)] px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Shipping &amp; Returns
              <ChevronDownIcon className="h-4 w-4" />
            </summary>
            <p className="pt-4 text-sm leading-7 text-[var(--color-on-surface-variant)]">
              {product.shippingNote}
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
