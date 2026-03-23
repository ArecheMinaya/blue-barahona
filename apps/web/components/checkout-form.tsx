"use client";

import type {
  Address,
  AddressInput,
  CheckoutIntentResponse,
  CheckoutValues,
  ShippingMethod,
} from "@larimar/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AddressForm } from "@/components/address-form";
import { CheckoutPaymentForm } from "@/components/checkout-payment-form";
import {
  ArrowRightIcon,
  LockIcon,
  ShieldIcon,
  VerifiedIcon,
} from "@/components/icons";
import { OrderSummary } from "@/components/order-summary";
import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "@/components/providers/cart-provider";
import { apiRequest } from "@/lib/api";
import { calculateOrderTotal, formatCurrency } from "@/lib/commerce";
import { cn } from "@/lib/utils";

export function CheckoutForm({
  initialValues,
  shippingMethods,
}: {
  initialValues: CheckoutValues;
  shippingMethods: ShippingMethod[];
}) {
  const { clearCart, isReady: isBagReady, items, lines, subtotal } = useCart();
  const {
    isAuthenticated,
    isReady: isAuthReady,
    openAuthPanel,
    session,
  } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedShippingId, setSelectedShippingId] = useState(
    shippingMethods[0]?.id ?? "priority",
  );
  const [checkoutIntent, setCheckoutIntent] = useState<CheckoutIntentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPreparingPayment, setIsPreparingPayment] = useState(false);
  const bagSignature = JSON.stringify(lines);

  const selectedShipping =
    shippingMethods.find((method) => method.id === selectedShippingId) ??
    shippingMethods[0];
  const total = calculateOrderTotal(subtotal, selectedShipping.price, 0);

  useEffect(() => {
    setCheckoutIntent(null);
  }, [bagSignature, selectedAddressId, selectedShippingId]);

  useEffect(() => {
    let isMounted = true;

    async function loadAddresses() {
      if (!session?.access_token) {
        setAddresses([]);
        setSelectedAddressId(null);
        setIsLoadingAddresses(false);
        return;
      }

      setIsLoadingAddresses(true);

      try {
        const result = await apiRequest<{ addresses: Address[] }>("/api/addresses", {
          token: session.access_token,
        });

        if (!isMounted) {
          return;
        }

        setAddresses(result.addresses);
        setSelectedAddressId((current) =>
          current ?? result.addresses.find((address) => address.isDefault)?.id ?? result.addresses[0]?.id ?? null,
        );
      } finally {
        if (isMounted) {
          setIsLoadingAddresses(false);
        }
      }
    }

    void loadAddresses();

    return () => {
      isMounted = false;
    };
  }, [session?.access_token]);

  async function createCheckoutAddress(values: AddressInput) {
    if (!session?.access_token) {
      return;
    }

    const result = await apiRequest<{ address: Address }>("/api/addresses", {
      method: "POST",
      token: session.access_token,
      body: JSON.stringify(values),
    });

    setAddresses((current) => {
      const next = [result.address, ...current.filter((address) => address.id !== result.address.id)];

      if (result.address.isDefault) {
        return next.map((address) =>
          address.id === result.address.id
            ? address
            : { ...address, isDefault: false },
        );
      }

      return next;
    });
    setSelectedAddressId(result.address.id);
    setIsAddressFormOpen(false);
  }

  async function preparePayment() {
    if (!session?.access_token) {
      setError("Please sign in to continue to payment.");
      return;
    }

    if (!selectedAddressId) {
      setError("Select or create a shipping address before continuing.");
      return;
    }

    setError(null);
    setIsPreparingPayment(true);

    try {
      const result = await apiRequest<CheckoutIntentResponse>("/api/checkout/payment-intent", {
        method: "POST",
        token: session.access_token,
        body: JSON.stringify({
          lines,
          shippingMethodId: selectedShippingId,
          addressId: selectedAddressId,
        }),
      });

      setCheckoutIntent(result);
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : "Unable to initialize payment.");
    } finally {
      setIsPreparingPayment(false);
    }
  }

  if (!isBagReady || !isAuthReady) {
    return (
      <div className="page-shell section-pad">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="h-[48rem] animate-pulse rounded-[2rem] bg-white/70 lg:col-span-7" />
          <div className="h-[38rem] animate-pulse rounded-[2rem] bg-white/70 lg:col-span-5" />
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

  if (!isAuthenticated) {
    return (
      <div className="page-shell section-pad">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_28rem]">
          <section className="rounded-[2rem] bg-[var(--color-primary)] p-10 text-white shadow-[0_24px_80px_rgba(0,26,44,0.18)]">
            <span className="eyebrow !text-[var(--color-secondary-container)]">Checkout</span>
            <h1 className="mt-5 text-5xl font-bold tracking-[-0.05em]">
              Sign in to complete your order.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              Checkout is reserved for authenticated collectors so your bag,
              saved delivery addresses, and order confirmation remain tied to a
              secure account.
            </p>
            <button type="button" className="button-secondary mt-8 !border-white/15 !bg-white/10 !text-white" onClick={openAuthPanel}>
              Sign In to Continue
            </button>
          </section>

          <aside>
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shippingAmount={selectedShipping.price}
              total={total}
            />
          </aside>
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
          Secure Transaction Portal • Stripe Payment Element • Insured Shipping
        </p>
      </header>

      <div className="grid items-start gap-16 lg:grid-cols-12">
        <div className="space-y-16 lg:col-span-7">
          <section>
            <div className="mb-10 flex items-center gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-white">
                1
              </span>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--color-primary)]">
                Bag Review
              </h2>
            </div>

            <div className="rounded-[2rem] bg-white/75 p-6 shadow-[0_24px_80px_rgba(25,28,29,0.04)]">
              <OrderSummary
                heading="Reserved Pieces"
                items={items}
                subtotal={subtotal}
                shippingAmount={0}
                total={subtotal}
              />
            </div>
          </section>

          <section>
            <div className="mb-10 flex items-center gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-container-high)] text-xs font-bold text-[var(--color-primary)]">
                2
              </span>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--color-primary)]">
                Shipping Address
              </h2>
            </div>

            {isLoadingAddresses ? (
              <div className="h-48 animate-pulse rounded-[2rem] bg-white/75" />
            ) : (
              <div className="space-y-5">
                {addresses.length ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((address) => {
                      const isSelected = selectedAddressId === address.id;

                      return (
                        <button
                          key={address.id}
                          type="button"
                          className={cn(
                            "rounded-[1.75rem] border p-6 text-left transition-colors",
                            isSelected
                              ? "border-[var(--color-primary)] bg-white shadow-[0_24px_80px_rgba(25,28,29,0.04)]"
                              : "border-transparent bg-[var(--color-surface-container-low)] hover:bg-white/80",
                          )}
                          onClick={() => setSelectedAddressId(address.id)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-lg font-semibold text-[var(--color-primary)]">
                                {address.fullName}
                              </p>
                              <p className="mt-3 text-sm leading-7 text-[var(--color-on-surface-variant)]">
                                {address.streetAddress}
                                {address.apartment ? `, ${address.apartment}` : ""}
                                <br />
                                {address.city}, {address.state} {address.postalCode}
                                <br />
                                {address.country}
                              </p>
                            </div>
                            {address.isDefault ? (
                              <span className="rounded-full bg-[rgba(144,231,253,0.24)] px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-[var(--color-primary)]">
                                Default
                              </span>
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {isAddressFormOpen || !addresses.length ? (
                  <AddressForm
                    initialValues={{
                      fullName: initialValues.fullName,
                      phone: initialValues.phone,
                      streetAddress: initialValues.streetAddress,
                      apartment: initialValues.apartment,
                      city: initialValues.city,
                      state: initialValues.state,
                      postalCode: initialValues.postalCode,
                      country: initialValues.country,
                    }}
                    submitLabel="Save Address"
                    onSubmit={createCheckoutAddress}
                    onCancel={addresses.length ? () => setIsAddressFormOpen(false) : undefined}
                  />
                ) : (
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => setIsAddressFormOpen(true)}
                  >
                    Add New Address
                  </button>
                )}
              </div>
            )}
          </section>

          <section>
            <div className="mb-10 flex items-center gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-container-high)] text-xs font-bold text-[var(--color-primary)]">
                3
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
                4
              </span>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--color-primary)]">
                Payment
              </h2>
            </div>

            {!checkoutIntent ? (
              <div className="rounded-[2rem] bg-[var(--color-primary)] p-8 text-white shadow-[0_24px_80px_rgba(0,26,44,0.18)]">
                <p className="text-lg leading-8 text-white/72">
                  Prepare a secure payment session after you confirm the shipping
                  address and insured delivery method.
                </p>
                <button
                  type="button"
                  className="button-secondary mt-8 !border-white/15 !bg-white/10 !text-white"
                  onClick={() => void preparePayment()}
                  disabled={isPreparingPayment}
                >
                  {isPreparingPayment ? "Preparing Payment" : "Continue to Secure Payment"}
                </button>
              </div>
            ) : (
              <CheckoutPaymentForm
                clientSecret={checkoutIntent.clientSecret}
                orderId={checkoutIntent.order.id}
                onSuccess={clearCart}
              />
            )}

            <div className="mt-6 flex items-start gap-3 rounded-[1.5rem] bg-[var(--color-surface-container-low)] p-4 text-sm text-[var(--color-on-surface-variant)]">
              <LockIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <p>
                Payments are confirmed through Stripe using the Payment Element.
                Larimar never stores full card details.
              </p>
            </div>

            {error ? (
              <div className="mt-6 rounded-[1.5rem] bg-[rgba(216,75,75,0.08)] p-4 text-sm leading-7 text-[rgb(143,43,43)]">
                {error}
              </div>
            ) : null}
          </section>
        </div>

        <aside className="space-y-8 lg:col-span-5 lg:sticky lg:top-32">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shippingAmount={selectedShipping.price}
            total={total}
            footer={
              <div className="space-y-6">
                <div className="rounded-[1.5rem] bg-[var(--color-surface-container-low)] p-4 text-sm leading-7 text-[var(--color-on-surface-variant)]">
                  {selectedAddressId
                    ? "Address confirmed. Continue to secure payment when ready."
                    : "Select or add an address to prepare payment."}
                </div>
                <div className="flex justify-center gap-6 text-[var(--color-on-surface-variant)] opacity-60">
                  <ShieldIcon className="h-6 w-6" />
                  <VerifiedIcon className="h-6 w-6" />
                  <ArrowRightIcon className="h-6 w-6" />
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
