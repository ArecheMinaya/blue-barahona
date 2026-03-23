"use client";

import type { FulfillmentStatus, Order } from "@larimar/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import { useCart } from "@/components/providers/cart-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { apiRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/commerce";
import {
  formatDeliveryDate,
  formatFulfillmentStatus,
  formatLongDate,
  formatOrderReference,
  formatTimelineDate,
  fulfillmentSteps,
  getFulfillmentProgressWidth,
  getFulfillmentState,
} from "@/lib/order-tracking";
import { cn } from "@/lib/utils";

type OrderDetailViewProps = {
  orderId: string;
  heading: string;
  eyebrow: string;
  description: string;
};

function formatTrackingEta(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function getTimelineCaption(order: Order, stepStatus: FulfillmentStatus) {
  const state = getFulfillmentState(order.fulfillmentStatus, stepStatus);
  const recordedAt = order.fulfillmentTimeline[stepStatus];
  const step = fulfillmentSteps.find((entry) => entry.status === stepStatus);

  if (recordedAt && (state === "complete" || stepStatus === "delivered")) {
    return formatTimelineDate(recordedAt);
  }

  if (state === "active") {
    return step?.activeLabel ?? "In Progress";
  }

  if (stepStatus === "delivered" && order.estimatedDelivery) {
    return `Est ${formatTrackingEta(order.estimatedDelivery)}`;
  }

  return "Expected soon";
}

export function OrderDetailView({
  orderId,
  heading,
  eyebrow,
  description,
}: OrderDetailViewProps) {
  const { clearCart } = useCart();
  const { isAuthenticated, isReady, openAuthPanel, session } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const syncPaidOrderBag = useEffectEvent(() => {
    clearCart();
  });

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      if (!session?.access_token) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await apiRequest<{ order: Order }>(`/api/orders/${orderId}`, {
          token: session.access_token,
        });

        if (!isMounted) {
          return;
        }

        setOrder(result.order);

        if (result.order.status === "paid") {
          syncPaidOrderBag();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId, session?.access_token]);

  if (!isReady) {
    return (
      <div className="page-shell section-pad">
        <div className="h-[42rem] animate-pulse rounded-[2rem] bg-white/70" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="page-shell section-pad">
        <div className="mx-auto max-w-2xl rounded-[2rem] bg-white/80 p-10 text-center shadow-[0_24px_80px_rgba(25,28,29,0.05)]">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mt-5 text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
            Sign in to follow your order.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--color-on-surface-variant)]">
            Your order journey and shipment details are reserved for authenticated collectors.
          </p>
          <button type="button" className="button-primary mt-8" onClick={openAuthPanel}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page-shell section-pad">
        <div className="h-[42rem] animate-pulse rounded-[2rem] bg-white/70" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-shell section-pad">
        <div className="mx-auto max-w-2xl rounded-[2rem] bg-white/80 p-10 text-center shadow-[0_24px_80px_rgba(25,28,29,0.05)]">
          <h1 className="text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
            Order not found.
          </h1>
          <Link href="/account" className="button-primary mt-8 inline-flex">
            Return to Account
          </Link>
        </div>
      </div>
    );
  }

  const featuredImage = order.items?.[0]?.productSnapshot.heroImage.src ?? null;

  return (
    <div className="page-shell section-pad pt-[8rem]">
      <header className="mb-16 text-center md:text-left">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-4 text-5xl font-extrabold tracking-[-0.06em] text-[var(--color-primary)] md:text-6xl">
          {heading}
        </h1>
        <p className="mt-4 max-w-xl text-[var(--color-on-surface-variant)]">
          {description}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-8">
          <section className="rounded-[1.75rem] border border-[rgba(194,199,206,0.18)] bg-[var(--color-surface-container-lowest)] p-8 shadow-[0_40px_40px_-20px_rgba(0,26,44,0.04)]">
            <div className="flex flex-col justify-between gap-8 md:flex-row">
              <div>
                <span className="font-label mb-1 block text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)]">
                  Order Identification
                </span>
                <h2 className="font-headline text-2xl font-bold text-[var(--color-primary)]">
                  #{formatOrderReference(order)}
                </h2>
                <p className="mt-2 text-[var(--color-on-surface-variant)]">
                  Ordered on {formatLongDate(order.createdAt)}
                </p>
              </div>

              <div>
                <span className="font-label mb-1 block text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)]">
                  Total Investment
                </span>
                <p className="font-headline text-2xl font-bold text-[var(--color-primary)]">
                  {formatCurrency(order.total, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div>
                <span className="font-label mb-1 block text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)]">
                  Destination
                </span>
                {order.shippingAddressSnapshot ? (
                  <p className="leading-relaxed text-[var(--color-on-surface-variant)]">
                    {order.shippingAddressSnapshot.streetAddress}
                    {order.shippingAddressSnapshot.apartment ? (
                      <>
                        <br />
                        {order.shippingAddressSnapshot.apartment}
                      </>
                    ) : null}
                    <br />
                    {order.shippingAddressSnapshot.city}, {order.shippingAddressSnapshot.state}{" "}
                    {order.shippingAddressSnapshot.postalCode}
                    <br />
                    {order.shippingAddressSnapshot.country}
                  </p>
                ) : (
                  <p className="leading-relaxed text-[var(--color-on-surface-variant)]">
                    Delivery destination pending confirmation.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] bg-[var(--color-surface-container-low)] p-8 md:p-12">
            <h3 className="font-label mb-12 text-center text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)]">
              Live Transit Progress
            </h3>

            <div className="relative">
              <div className="absolute left-5 right-5 top-5 hidden h-[2px] bg-[rgba(194,199,206,0.2)] md:block" />
              <div
                className="absolute left-5 top-5 hidden h-[2px] bg-[var(--color-secondary)] md:block"
                style={{ width: getFulfillmentProgressWidth(order.fulfillmentStatus) }}
              />

              <div className="relative flex flex-col items-start justify-between gap-10 md:flex-row md:items-center md:gap-0">
                {fulfillmentSteps.map((step) => {
                  const state = getFulfillmentState(order.fulfillmentStatus, step.status);
                  const isComplete = state === "complete";
                  const isActive = state === "active";

                  return (
                    <div
                      key={step.status}
                      className={cn(
                        "flex flex-1 flex-row items-center gap-4 text-center md:flex-col md:gap-4",
                        state === "upcoming" && "opacity-40",
                      )}
                    >
                      <div
                        className={cn(
                          "z-10 flex h-10 w-10 items-center justify-center rounded-full",
                          isComplete && "bg-[var(--color-secondary)] text-white",
                          isActive &&
                            "bg-[var(--color-primary-container)] text-[var(--color-secondary-container)] ring-4 ring-[rgba(144,231,253,0.3)]",
                          state === "upcoming" &&
                            "bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]",
                        )}
                      >
                        <span
                          className="material-symbols-outlined text-sm"
                          style={{
                            fontVariationSettings: isComplete
                              ? '"FILL" 1, "wght" 300, "GRAD" 0, "opsz" 24'
                              : '"FILL" 0, "wght" 300, "GRAD" 0, "opsz" 24',
                          }}
                        >
                          {isComplete ? "check" : step.icon}
                        </span>
                      </div>

                      <div>
                        <p
                          className={cn(
                            "text-sm text-[var(--color-primary)]",
                            isComplete ? "font-bold" : "font-medium",
                            isActive &&
                              "font-bold underline decoration-[var(--color-secondary)] decoration-2 underline-offset-4",
                          )}
                        >
                          {step.label}
                        </p>
                        <p
                          className={cn(
                            "mt-1 text-[10px] uppercase tracking-widest",
                            isActive
                              ? "font-bold text-[var(--color-secondary)]"
                              : "text-[var(--color-on-surface-variant)]",
                          )}
                        >
                          {getTimelineCaption(order, step.status)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-label mb-8 text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)]">
              Curated Items
            </h3>

            <div className="space-y-6">
              {order.items?.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-6 rounded-[1.5rem] bg-[var(--color-surface)] p-4 transition-colors duration-500 hover:bg-white md:flex-row md:items-center md:gap-8"
                >
                  <div className="relative h-32 w-full flex-shrink-0 overflow-hidden rounded-[1rem] bg-[var(--color-surface-container)] md:w-32">
                    <Image
                      src={item.productSnapshot.heroImage.src}
                      alt={item.productSnapshot.heroImage.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 128px"
                    />
                  </div>

                  <div className="flex-grow">
                    <h4 className="font-headline text-xl font-bold text-[var(--color-primary)]">
                      {item.productSnapshot.name}
                    </h4>
                    <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
                      {item.productSnapshot.materials} • {item.productSnapshot.metal}
                    </p>
                    <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
                      Larimar Stone • Quantity {item.quantity}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-lg font-semibold text-[var(--color-primary)]">
                      {formatCurrency(item.totalPrice, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-[var(--color-outline)]">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-10 lg:col-span-4">
          <aside className="relative overflow-hidden rounded-[1.75rem] bg-[var(--color-primary)] p-8 text-white">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[rgba(144,231,253,0.1)] blur-3xl" />

            <h3 className="font-label relative z-10 mb-8 text-[10px] uppercase tracking-[0.2em] text-white/60">
              Shipment Details
            </h3>

            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between gap-6">
                <span className="text-sm font-light text-white/70">Carrier</span>
                <span className="text-right font-bold">
                  {order.carrier ?? "Pending assignment"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-6">
                <span className="text-sm font-light text-white/70">Tracking Number</span>
                <span className="text-right font-bold tracking-wider">
                  {order.trackingNumber ?? "Assigned once shipped"}
                </span>
              </div>

              <div className="border-t border-white/10 pt-8">
                <div className="flex items-center justify-between gap-6">
                  <span className="text-sm font-light text-white/70">Current Stage</span>
                  <span className="text-right font-bold">
                    {formatFulfillmentStatus(order.fulfillmentStatus)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 border-t border-white/10 pt-8">
                <span className="text-sm font-light text-white/70">Est. Delivery</span>
                <div className="text-right">
                  <span className="block text-xl font-bold text-[var(--color-secondary-container)]">
                    {order.estimatedDelivery
                      ? formatDeliveryDate(order.estimatedDelivery)
                      : "Pending dispatch"}
                  </span>
                  <span className="text-[10px] uppercase tracking-tighter opacity-60">
                    {order.fulfillmentStatus === "delivered" ? "Delivered" : "By end of day"}
                  </span>
                </div>
              </div>
            </div>

            {order.trackingUrl ? (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-10 inline-flex w-full items-center justify-center rounded-[0.75rem] bg-[var(--color-secondary-container)] px-6 py-4 font-label text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]"
              >
                Track via {order.carrier ?? "Carrier"}
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="mt-10 inline-flex w-full items-center justify-center rounded-[0.75rem] bg-[var(--color-secondary-container)] px-6 py-4 font-label text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)] opacity-70"
              >
                Tracking Activates After Dispatch
              </button>
            )}
          </aside>

          <section className="group relative flex flex-col items-center overflow-hidden rounded-[1.75rem] bg-[var(--color-surface-container-high)] p-8 text-center">
            {featuredImage ? (
              <div className="absolute inset-0 opacity-10">
                <Image
                  src={featuredImage}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 1024px) 100vw, 24rem"
                />
              </div>
            ) : null}

            <div className="relative z-10">
              <h4 className="font-headline mb-4 text-2xl font-bold text-[var(--color-primary)]">
                Complete the Set
              </h4>
              <p className="mb-8 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                Discover more treasures inspired by the tranquility of the ocean.
              </p>
              <Link href="/collection" className="button-primary">
                Explore the Collection
              </Link>
            </div>
          </section>

          <div className="rounded-[1.75rem] border border-[rgba(194,199,206,0.2)] p-8">
            <h5 className="font-label mb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
              Need Assistance?
            </h5>
            <p className="mb-6 text-sm text-[var(--color-on-surface-variant)]">
              Our concierges are available 24/7 to ensure your Larimar journey is flawless.
            </p>
            <a
              href="mailto:concierge@larimar.com"
              className="text-sm font-bold text-[var(--color-secondary)] underline decoration-[var(--color-secondary-container)] underline-offset-8 transition-colors hover:text-[var(--color-primary)]"
            >
              Contact Concierge
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
