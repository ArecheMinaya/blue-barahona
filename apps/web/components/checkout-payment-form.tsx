"use client";

import { PaymentElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

type CheckoutPaymentFormProps = {
  clientSecret: string;
  orderId: string;
  onSuccess: () => void;
};

function CheckoutPaymentInner({
  orderId,
  onSuccess,
}: Omit<CheckoutPaymentFormProps, "clientSecret">) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/confirmation/${orderId}`,
      },
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message ?? "Payment confirmation failed.");
      setIsSubmitting(false);
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      onSuccess();
      router.push(`/checkout/confirmation/${orderId}`);
      return;
    }

    setIsSubmitting(false);
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-[1.75rem] bg-[var(--color-surface)] p-6 shadow-[0_24px_80px_rgba(25,28,29,0.04)]">
        <PaymentElement />
      </div>

      {error ? (
        <p className="rounded-[1.25rem] bg-[rgba(216,75,75,0.08)] px-4 py-3 text-sm text-[rgb(143,43,43)]">
          {error}
        </p>
      ) : null}

      <button type="submit" className="button-primary w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processing Payment" : "Confirm Order"}
      </button>
    </form>
  );
}

export function CheckoutPaymentForm({
  clientSecret,
  orderId,
  onSuccess,
}: CheckoutPaymentFormProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#001a2c",
            colorBackground: "#ffffff",
            colorText: "#191c1d",
            borderRadius: "20px",
            fontFamily: "Manrope, Inter, sans-serif",
          },
        },
      }}
    >
      <CheckoutPaymentInner orderId={orderId} onSuccess={onSuccess} />
    </Elements>
  );
}
