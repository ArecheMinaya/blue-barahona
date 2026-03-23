"use client";

import type { AddressInput } from "@larimar/types";
import { useState } from "react";

type AddressFormProps = {
  initialValues?: Partial<AddressInput>;
  submitLabel: string;
  onSubmit: (values: AddressInput) => Promise<void> | void;
  onCancel?: () => void;
};

const defaultValues: AddressInput = {
  fullName: "",
  phone: "",
  country: "United States",
  city: "",
  state: "",
  postalCode: "",
  streetAddress: "",
  apartment: "",
  isDefault: false,
};

export function AddressForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  const [values, setValues] = useState<AddressInput>({
    ...defaultValues,
    ...initialValues,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<Key extends keyof AddressInput>(key: Key, value: AddressInput[Key]) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="rounded-[1.75rem] bg-white/75 p-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="label-caps">Full Name</span>
          <input
            className="input-line"
            value={values.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            placeholder="Julian Amsel"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="label-caps">Phone</span>
          <input
            className="input-line"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="+1 809 555 0124"
          />
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="label-caps">Street Address</span>
          <input
            className="input-line"
            value={values.streetAddress}
            onChange={(event) => updateField("streetAddress", event.target.value)}
            placeholder="15 Avenida de la Laguna"
          />
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="label-caps">Apartment or Suite</span>
          <input
            className="input-line"
            value={values.apartment ?? ""}
            onChange={(event) => updateField("apartment", event.target.value)}
            placeholder="Penthouse, Apt 4B, or leave blank"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="label-caps">City</span>
          <input
            className="input-line"
            value={values.city}
            onChange={(event) => updateField("city", event.target.value)}
            placeholder="Miami"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="label-caps">State or Province</span>
          <input
            className="input-line"
            value={values.state}
            onChange={(event) => updateField("state", event.target.value)}
            placeholder="Florida"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="label-caps">Postal Code</span>
          <input
            className="input-line"
            value={values.postalCode}
            onChange={(event) => updateField("postalCode", event.target.value)}
            placeholder="33139"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="label-caps">Country</span>
          <input
            className="input-line"
            value={values.country}
            onChange={(event) => updateField("country", event.target.value)}
            placeholder="United States"
          />
        </label>
      </div>

      <label className="mt-6 flex items-center gap-3 text-sm text-[var(--color-on-surface-variant)]">
        <input
          type="checkbox"
          checked={values.isDefault}
          onChange={(event) => updateField("isDefault", event.target.checked)}
        />
        Make this my default shipping address.
      </label>

      <div className="mt-8 flex flex-wrap gap-3">
        <button type="submit" className="button-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving" : submitLabel}
        </button>
        {onCancel ? (
          <button type="button" className="button-secondary" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
