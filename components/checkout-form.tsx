"use client";

import Link from "next/link";
import { useState } from "react";
import { shippingMethods as defaultShippingMethods } from "@/data/checkout";
import {
  ArrowRightIcon,
  BankIcon,
  CreditCardIcon,
  LockIcon,
  ShieldIcon,
  VerifiedIcon,
} from "@/components/icons";
import { OrderSummary } from "@/components/order-summary";
import { useCart } from "@/components/providers/cart-provider";
import {
  calculateEstimatedTax,
  calculateOrderTotal,
  formatCurrency,
} from "@/lib/commerce";
import type { CheckoutValues, ShippingMethod } from "@/lib/types";
import { cn } from "@/lib/utils";

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: keyof CheckoutValues;
  label: string;
  value: string;
  onChange: (id: keyof CheckoutValues, value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label-caps">
        {label}
      </label>
      <input
        id={id}
        className="input-line"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(id, event.target.value)}
      />
    </div>
  );
}

export function CheckoutForm({
  initialValues,
  shippingMethods = defaultShippingMethods,
}: {
  initialValues: CheckoutValues;
  shippingMethods?: ShippingMethod[];
}) {
  const { items, subtotal, isReady } = useCart();
  const [values, setValues] = useState(initialValues);
  const [selectedShippingId, setSelectedShippingId] = useState(
    shippingMethods[0]?.id ?? "priority",
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedShipping =
    shippingMethods.find((method) => method.id === selectedShippingId) ??
    shippingMethods[0];

  const taxAmount = calculateEstimatedTax(subtotal + selectedShipping.price);
  const total = calculateOrderTotal(subtotal, selectedShipping.price, taxAmount);

  function updateField(id: keyof CheckoutValues, value: string) {
    setValues((current) => ({ ...current, [id]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  if (!isReady) {
    return (
      <div className="page-shell section-pad">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 h-[48rem] animate-pulse rounded-[2rem] bg-white/70" />
          <div className="lg:col-span-5 h-[38rem] animate-pulse rounded-[2rem] bg-white/70" />
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="page-shell section-pad">
        <div className="mx-auto max-w-2xl rounded-[2rem] bg-white/80 p-10 text-center shadow-[0_24px_80px_rgba(25,28,29,0.05)]">
          <span className="eyebrow">Checkout</span>
          <h1 className="mt-5 text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
            Your checkout is waiting for a selection.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--color-on-surface-variant)]">
            Add a Larimar piece to continue with shipping and payment details.
          </p>
          <Link href="/collection" className="button-primary mt-8">
            Explore the Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell section-pad">
      <header className="mb-16">
        <h1 className="text-5xl font-bold tracking-[-0.05em] text-[var(--color-primary)] md:text-7xl">
          Checkout
        </h1>
        <p className="font-label mt-4 text-xs uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
          Secure Transaction Portal • Carbon Neutral Shipping
        </p>
      </header>

      <div className="grid items-start gap-16 lg:grid-cols-12">
        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          className="space-y-16 lg:col-span-7"
        >
          <section>
            <div className="mb-10 flex items-center gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-white">
                1
              </span>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--color-primary)]">
                Shipping Destination
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
              <Field
                id="firstName"
                label="First Name"
                value={values.firstName}
                placeholder="Julian"
                onChange={updateField}
              />
              <Field
                id="lastName"
                label="Last Name"
                value={values.lastName}
                placeholder="Amsel"
                onChange={updateField}
              />
              <div className="md:col-span-2">
                <Field
                  id="streetAddress"
                  label="Street Address"
                  value={values.streetAddress}
                  placeholder="Rue de la Paix 15"
                  onChange={updateField}
                />
              </div>
              <Field
                id="city"
                label="City"
                value={values.city}
                placeholder="Paris"
                onChange={updateField}
              />
              <Field
                id="postalCode"
                label="Postal Code"
                value={values.postalCode}
                placeholder="75002"
                onChange={updateField}
              />
            </div>
          </section>

          <section>
            <div className="mb-10 flex items-center gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-container-high)] text-xs font-bold text-[var(--color-primary)]">
                2
              </span>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--color-primary)]">
                Shipping Method
              </h2>
            </div>

            <div className="space-y-4">
              {shippingMethods.map((method) => {
                const isSelected = method.id === selectedShippingId;

                return (
                  <button
                    key={method.id}
                    type="button"
                    className={cn(
                      "w-full rounded-[1.5rem] px-6 py-5 text-left",
                      isSelected
                        ? "bg-white shadow-[0_24px_80px_rgba(25,28,29,0.05)]"
                        : "bg-[var(--color-surface-container-low)] hover:bg-white/80",
                    )}
                    onClick={() => setSelectedShippingId(method.id)}
                  >
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <span
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full border-2",
                            isSelected
                              ? "border-[var(--color-primary)]"
                              : "border-[rgba(114,119,126,0.35)]",
                          )}
                        >
                          {isSelected ? (
                            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                          ) : null}
                        </span>
                        <div>
                          <p className="font-medium text-[var(--color-primary)]">
                            {method.name}
                          </p>
                          <p className="text-xs text-[var(--color-on-surface-variant)]">
                            {method.leadTime} • {method.description}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-[var(--color-primary)]">
                        {method.price === 0
                          ? "Complimentary"
                          : formatCurrency(method.price, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div className="mb-10 flex items-center gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-container-high)] text-xs font-bold text-[var(--color-primary)]">
                3
              </span>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--color-primary)]">
                Payment Method
              </h2>
            </div>

            <div className="rounded-[2rem] bg-[var(--color-primary)] p-8 text-white shadow-[0_24px_80px_rgba(0,26,44,0.2)]">
              <div className="mb-12 flex items-start justify-between">
                <div>
                  <p className="font-label text-[10px] uppercase tracking-[0.18em] text-white/[0.55]">
                    Card Member
                  </p>
                  <p className="mt-1 font-medium tracking-[0.2em]">
                    {values.firstName.toUpperCase()} {values.lastName.toUpperCase()}
                  </p>
                </div>
                <CreditCardIcon className="h-8 w-8 text-white/75" />
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="cardNumber" className="text-[10px] uppercase tracking-[0.18em] text-white/[0.55]">
                    Card Number
                  </label>
                  <input
                    id="cardNumber"
                    className="w-full border-0 border-b border-white/20 bg-transparent py-2 text-lg tracking-[0.22em] outline-none"
                    value={values.cardNumber}
                    onChange={(event) => updateField("cardNumber", event.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="expiry" className="text-[10px] uppercase tracking-[0.18em] text-white/[0.55]">
                      Expiry
                    </label>
                    <input
                      id="expiry"
                      className="border-0 border-b border-white/20 bg-transparent py-2 outline-none"
                      value={values.expiry}
                      onChange={(event) => updateField("expiry", event.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="cvc" className="text-[10px] uppercase tracking-[0.18em] text-white/[0.55]">
                      CVC
                    </label>
                    <input
                      id="cvc"
                      className="border-0 border-b border-white/20 bg-transparent py-2 outline-none"
                      value={values.cvc}
                      onChange={(event) => updateField("cvc", event.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-[1.5rem] bg-[var(--color-surface-container-low)] p-4 text-sm text-[var(--color-on-surface-variant)]">
              <LockIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <p>
                Your payment is encrypted with 256-bit SSL security. We do not
                store full card details.
              </p>
            </div>

            {isSubmitted ? (
              <div className="mt-6 rounded-[1.5rem] bg-[rgba(144,231,253,0.18)] p-4 text-sm leading-7 text-[var(--color-primary)]">
                Order preview confirmed. A Larimar concierge would review the
                request and arrange final payment capture and insured dispatch.
              </div>
            ) : null}
          </section>
        </form>

        <aside className="space-y-8 lg:col-span-5 lg:sticky lg:top-32">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shippingAmount={selectedShipping.price}
            taxAmount={taxAmount}
            total={total}
            footer={
              <div className="space-y-6">
                <button type="submit" form="checkout-form" className="button-primary w-full">
                  Finalize Order
                  <ArrowRightIcon className="h-4 w-4" />
                </button>

                <div className="flex justify-center gap-6 text-[var(--color-on-surface-variant)] opacity-60">
                  <CreditCardIcon className="h-6 w-6" />
                  <BankIcon className="h-6 w-6" />
                  <ShieldIcon className="h-6 w-6" />
                </div>
              </div>
            }
          />

          <div className="rounded-[1.75rem] bg-[var(--color-surface-container-low)] p-6">
            <div className="flex items-start gap-4">
              <VerifiedIcon className="mt-0.5 h-5 w-5 text-[var(--color-tertiary)]" />
              <div>
                <p className="font-semibold text-[var(--color-primary)]">
                  Lifetime Authenticity
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-on-surface-variant)]">
                  Each piece includes a digital certificate of authenticity and a
                  lifetime warranty on the craftsmanship of the setting.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
