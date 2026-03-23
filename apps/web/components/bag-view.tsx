"use client";

import Image from "next/image";
import Link from "next/link";
import { bagBenefits } from "@/data/site";
import { bagRecommendationSlugs } from "@/data/cart";
import { ArrowRightIcon, LeafIcon, VerifiedIcon } from "@/components/icons";
import { BagItem } from "@/components/bag-item";
import { OrderSummary } from "@/components/order-summary";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/components/providers/cart-provider";
import { getProductsBySlugs } from "@/lib/catalog";

const recommendedProducts = getProductsBySlugs(bagRecommendationSlugs);

export function BagView() {
  const { items, subtotal, isReady, updateQuantity, removeItem } = useCart();

  if (!isReady) {
    return (
      <div className="page-shell section-pad">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_30rem]">
          <div className="h-[32rem] animate-pulse rounded-[2rem] bg-white/70" />
          <div className="h-[32rem] animate-pulse rounded-[2rem] bg-white/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell section-pad">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_30rem]">
        <section className="relative overflow-hidden rounded-[2rem] bg-[var(--color-primary)] px-8 py-10 text-white md:px-12 lg:min-h-[44rem]">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeYcfZ4ZvyeJZalHio15lM8EDnG0AD41ff6CQeFCswzpdELFuOcMQs5aEsJ6Yp0d1yMAD8I1W041kHcBlX4AAqkqkA8WgPpz278YD_CwfaHuLvUUgclCoRKMI2wNx6DUA7XFY3WFICfswvPvDyWGFIFJXbAaV2D4YDVuDeNaz_NYoQIZ0T4m-QpdOBc-L-paOh5OOSs0LxMUOONV0IdL0e_nqGBqYqiAGBC36i_MYG7whGawXG8ktBj9Iqe33Qr0f86s729bE_NHY"
            alt="Close up of Larimar gemstone pendant"
            fill
            className="object-cover opacity-20"
            sizes="(min-width: 1024px) 60vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(144,231,253,0.18)] via-transparent to-[rgba(0,47,75,0.58)]" />

          <div className="relative z-10">
            <span className="eyebrow !text-[var(--color-secondary-container)]">
              Your Bag
            </span>
            <h1 className="mt-5 max-w-xl text-5xl font-extrabold tracking-[-0.06em] md:text-7xl">
              A curated edit of the Caribbean.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              Each piece is packaged with museum-grade care, authenticity
              documentation, and insured transport from our studio to your door.
            </p>

            <div className="mt-10 space-y-4">
              {bagBenefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-tertiary-fixed)]" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/collection"
                className="button-secondary !border-white/[0.15] !bg-white/[0.08] !text-white"
              >
                Continue Shopping
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-14 rounded-[1.75rem] bg-white/[0.08] p-6 backdrop-blur-lg">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-label text-[10px] uppercase tracking-[0.18em] text-white/60">
                    Recommended Next
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                    Continue the collection.
                  </p>
                </div>
              </div>
              <div className="mt-8 grid gap-8 md:grid-cols-3">
                {recommendedProducts.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    meta={product.collection}
                    className="[&_h3]:text-white [&_p]:text-white/60"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="glass-panel overflow-hidden rounded-[2rem]">
            <div className="border-b border-black/5 px-8 pb-6 pt-8">
              <h2 className="text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
                Your Bag
              </h2>
              <p className="font-label mt-2 text-[10px] uppercase tracking-[0.14em] text-[var(--color-on-surface-variant)]">
                Complimentary carbon-neutral shipping on all orders.
              </p>
            </div>

            <div className="max-h-[26rem] space-y-8 overflow-y-auto px-8 py-6 no-scrollbar">
              {items.length ? (
                items.map((item) => (
                  <BagItem
                    key={item.product.slug}
                    item={item}
                    onIncrease={() =>
                      updateQuantity(item.product.slug, item.quantity + 1)
                    }
                    onDecrease={() =>
                      updateQuantity(item.product.slug, item.quantity - 1)
                    }
                    onRemove={() => removeItem(item.product.slug)}
                  />
                ))
              ) : (
                <div className="rounded-[1.5rem] bg-white/70 p-6 text-center">
                  <p className="text-lg font-semibold text-[var(--color-primary)]">
                    Your bag is empty.
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-on-surface-variant)]">
                    Explore the collection to reserve a new Larimar piece.
                  </p>
                  <Link href="/collection" className="button-primary mt-6">
                    Browse the Collection
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-white/35 p-6">
              <OrderSummary
                items={items}
                subtotal={subtotal}
                shippingAmount={0}
                total={subtotal}
                showItems={false}
                footer={
                  <div className="space-y-4">
                    <Link href="/checkout" className="button-primary w-full">
                      Checkout Now
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                    <div className="flex justify-center gap-6 text-[10px] uppercase tracking-[0.14em] text-[var(--color-on-surface-variant)]">
                      <span className="flex items-center gap-2">
                        <VerifiedIcon className="h-4 w-4" />
                        Secure Checkout
                      </span>
                      <span className="flex items-center gap-2">
                        <LeafIcon className="h-4 w-4" />
                        Eco-Packaging
                      </span>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
