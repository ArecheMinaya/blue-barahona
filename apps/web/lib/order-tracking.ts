import type { FulfillmentStatus, Order } from "@/lib/types";

export const fulfillmentSteps: Array<{
  status: FulfillmentStatus;
  label: string;
  icon: string;
  activeLabel: string;
}> = [
  {
    status: "confirmed",
    label: "Order Confirmed",
    icon: "check",
    activeLabel: "Confirmed",
  },
  {
    status: "processing",
    label: "Processing",
    icon: "diamond",
    activeLabel: "In Atelier",
  },
  {
    status: "shipped",
    label: "Shipped",
    icon: "local_shipping",
    activeLabel: "In Transit",
  },
  {
    status: "out_for_delivery",
    label: "Out for Delivery",
    icon: "hail",
    activeLabel: "Arriving Today",
  },
  {
    status: "delivered",
    label: "Delivered",
    icon: "inventory_2",
    activeLabel: "Delivered",
  },
];

export function getFulfillmentIndex(status: FulfillmentStatus) {
  return fulfillmentSteps.findIndex((step) => step.status === status);
}

export function getFulfillmentState(
  currentStatus: FulfillmentStatus,
  stepStatus: FulfillmentStatus,
) {
  const currentIndex = getFulfillmentIndex(currentStatus);
  const stepIndex = getFulfillmentIndex(stepStatus);

  if (stepIndex < currentIndex) {
    return "complete";
  }

  if (stepIndex === currentIndex) {
    return "active";
  }

  return "upcoming";
}

export function getFulfillmentProgressWidth(status: FulfillmentStatus) {
  const currentIndex = getFulfillmentIndex(status);

  if (currentIndex <= 0) {
    return "0px";
  }

  const progress = currentIndex / (fulfillmentSteps.length - 1);
  return `calc(${progress * 100}% - 1.25rem)`;
}

export function formatOrderReference(order: Pick<Order, "id" | "createdAt">) {
  const year = new Date(order.createdAt).getFullYear();
  const fragment = order.id.replaceAll("-", "").slice(0, 4).toUpperCase();

  return `LR-${year}-${fragment}`;
}

export function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatTimelineDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

export function formatDeliveryDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatFulfillmentStatus(status: FulfillmentStatus) {
  return fulfillmentSteps.find((step) => step.status === status)?.label ?? status;
}
