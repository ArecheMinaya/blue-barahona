"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { BagItem } from "@/components/bag-item";
import { OrderSummary } from "@/components/order-summary";
import { useCart } from "@/components/providers/cart-provider";

type BagDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function BagDrawer({ isOpen, onClose }: BagDrawerProps) {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <>
      <div
        className={
          isOpen
            ? "pointer-events-auto fixed inset-0 z-[60] bg-[rgba(0,26,44,0.22)] backdrop-blur-sm"
            : "pointer-events-none fixed inset-0 z-[60] bg-transparent opacity-0"
        }
        onClick={onClose}
      />

      <aside
        className={
          isOpen
            ? "fixed right-0 top-0 z-[65] flex h-full w-full max-w-xl translate-x-0 flex-col bg-[rgba(248,250,251,0.96)] shadow-[0_24px_80px_rgba(25,28,29,0.12)] backdrop-blur-2xl transition-transform duration-500"
            : "fixed right-0 top-0 z-[65] flex h-full w-full max-w-xl translate-x-full flex-col bg-[rgba(248,250,251,0.96)] shadow-[0_24px_80px_rgba(25,28,29,0.12)] backdrop-blur-2xl transition-transform duration-500"
        }
      >
        <div className="flex items-center justify-between border-b border-black/5 px-8 py-6">
          <div>
            <span className="eyebrow">Your Bag</span>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
              Reserved pieces
            </h2>
          </div>
          <button
            type="button"
            className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-8 py-8 no-scrollbar">
          {items.length ? (
            items.map((item) => (
              <BagItem
                key={item.product.slug}
                item={item}
                onIncrease={() => updateQuantity(item.product.slug, item.quantity + 1)}
                onDecrease={() => updateQuantity(item.product.slug, item.quantity - 1)}
                onRemove={() => removeItem(item.product.slug)}
              />
            ))
          ) : (
            <div className="rounded-[1.75rem] bg-white/80 p-8 text-center">
              <p className="text-2xl font-semibold tracking-[-0.03em] text-[var(--color-primary)]">
                Your bag is empty.
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--color-on-surface-variant)]">
                Discover the collection to reserve a new Larimar piece.
              </p>
              <Link href="/collection" className="button-primary mt-8 inline-flex" onClick={onClose}>
                Explore the Collection
              </Link>
            </div>
          )}
        </div>

        <div className="border-t border-black/5 px-8 py-8">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shippingAmount={0}
            total={subtotal}
            showItems={false}
            footer={
              items.length ? (
                <div className="space-y-4">
                  <Link href="/bag" className="button-secondary w-full" onClick={onClose}>
                    Review Bag
                  </Link>
                  <Link href="/checkout" className="button-primary w-full" onClick={onClose}>
                    Continue to Checkout
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              ) : null
            }
          />
        </div>
      </aside>
    </>
  );
}
