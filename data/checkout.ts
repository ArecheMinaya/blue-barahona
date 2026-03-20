import type { CheckoutValues, ShippingMethod } from "@/lib/types";

export const shippingMethods: ShippingMethod[] = [
  {
    id: "priority",
    name: "Priority Courier",
    leadTime: "2-3 Business Days",
    description: "Insured and carbon-neutral delivery handled by our concierge partners.",
    price: 0,
  },
  {
    id: "overnight",
    name: "Overnight Express",
    leadTime: "Next Day Delivery",
    description: "Signature required with priority handling and evening dispatch.",
    price: 45,
  },
];

export const initialCheckoutValues: CheckoutValues = {
  firstName: "Julian",
  lastName: "Amsel",
  streetAddress: "Rue de la Paix 15",
  city: "Paris",
  postalCode: "75002",
  country: "France",
  cardNumber: "•••• •••• •••• 4412",
  expiry: "08/29",
  cvc: "•••",
};
