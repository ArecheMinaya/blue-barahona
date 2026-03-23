"use client";

import type { Address, AddressInput } from "@larimar/types";
import { useEffect, useState } from "react";
import { AddressForm } from "@/components/address-form";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";

export function AddressBook() {
  const { session } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  async function loadAddresses() {
    if (!session?.access_token) {
      setAddresses([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiRequest<{ addresses: Address[] }>("/api/addresses", {
        token: session.access_token,
      });
      setAddresses(result.addresses);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function hydrateAddresses() {
      if (!session?.access_token) {
        if (!isMounted) {
          return;
        }

        setAddresses([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const result = await apiRequest<{ addresses: Address[] }>("/api/addresses", {
          token: session.access_token,
        });

        if (isMounted) {
          setAddresses(result.addresses);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void hydrateAddresses();

    return () => {
      isMounted = false;
    };
  }, [session?.access_token]);

  async function createNewAddress(values: AddressInput) {
    if (!session?.access_token) {
      return;
    }

    await apiRequest<{ address: Address }>("/api/addresses", {
      method: "POST",
      token: session.access_token,
      body: JSON.stringify(values),
    });
    setIsCreating(false);
    await loadAddresses();
  }

  async function saveAddress(values: AddressInput) {
    if (!session?.access_token || !editingAddress) {
      return;
    }

    await apiRequest<{ address: Address }>(`/api/addresses/${editingAddress.id}`, {
      method: "PUT",
      token: session.access_token,
      body: JSON.stringify(values),
    });
    setEditingAddress(null);
    await loadAddresses();
  }

  async function deleteCurrentAddress(addressId: string) {
    if (!session?.access_token) {
      return;
    }

    await apiRequest<void>(`/api/addresses/${addressId}`, {
      method: "DELETE",
      token: session.access_token,
    });
    await loadAddresses();
  }

  async function setDefault(addressId: string) {
    if (!session?.access_token) {
      return;
    }

    await apiRequest<{ address: Address }>(`/api/addresses/${addressId}/default`, {
      method: "POST",
      token: session.access_token,
    });
    await loadAddresses();
  }

  return (
    <section className="rounded-[2rem] bg-white/70 p-8 shadow-[0_24px_80px_rgba(25,28,29,0.05)]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="eyebrow">Saved Addresses</span>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
            Shipping destinations
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-on-surface-variant)]">
            Keep your preferred residences, ateliers, and concierge delivery
            points ready for checkout.
          </p>
        </div>

        <button type="button" className="button-primary" onClick={() => setIsCreating(true)}>
          Add Address
        </button>
      </div>

      {isCreating ? (
        <div className="mt-8">
          <AddressForm
            submitLabel="Save Address"
            onSubmit={createNewAddress}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      ) : null}

      {editingAddress ? (
        <div className="mt-8">
          <AddressForm
            initialValues={editingAddress}
            submitLabel="Update Address"
            onSubmit={saveAddress}
            onCancel={() => setEditingAddress(null)}
          />
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-8 h-48 animate-pulse rounded-[1.75rem] bg-[var(--color-surface-container-low)]" />
      ) : addresses.length ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {addresses.map((address) => (
            <article
              key={address.id}
              className="rounded-[1.75rem] bg-[var(--color-surface)] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold tracking-[-0.03em] text-[var(--color-primary)]">
                    {address.fullName}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-on-surface-variant)]">
                    {address.streetAddress}
                    {address.apartment ? `, ${address.apartment}` : ""}
                    <br />
                    {address.city}, {address.state} {address.postalCode}
                    <br />
                    {address.country}
                  </p>
                </div>
                {address.isDefault ? (
                  <span className="rounded-full bg-[rgba(144,231,253,0.25)] px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-[var(--color-primary)]">
                    Default
                  </span>
                ) : null}
              </div>

              <p className="mt-4 text-sm text-[var(--color-on-surface-variant)]">
                {address.phone}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {!address.isDefault ? (
                  <button type="button" className="button-secondary" onClick={() => void setDefault(address.id)}>
                    Set Default
                  </button>
                ) : null}
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => setEditingAddress(address)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="font-label text-[11px] uppercase tracking-[0.16em] text-[var(--color-on-surface-variant)]"
                  onClick={() => void deleteCurrentAddress(address.id)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[1.75rem] bg-[var(--color-surface)] p-8 text-center">
          <p className="text-lg font-semibold text-[var(--color-primary)]">
            No saved addresses yet.
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-on-surface-variant)]">
            Add a destination now to streamline insured delivery during checkout.
          </p>
        </div>
      )}
    </section>
  );
}
