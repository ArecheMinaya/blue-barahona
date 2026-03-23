import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { initialCheckoutValues, shippingMethods } from "@/data/checkout";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Finalize your Larimar order with secure payment and premium insured shipping.",
};

export default function CheckoutPage() {
  return (
    <CheckoutForm
      initialValues={initialCheckoutValues}
      shippingMethods={shippingMethods}
    />
  );
}
