import type { CheckoutValues, ShippingMethod } from "@larimar/types";

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

export const emptyCheckoutValues: CheckoutValues = {
  fullName: "",
  phone: "",
  streetAddress: "",
  apartment: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
};
