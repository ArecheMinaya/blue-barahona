import type { Metadata } from "next";
import { OrderDetailView } from "@/components/order-detail-view";

export const metadata: Metadata = {
  title: "Order Tracking",
  description: "Follow the live journey of a Larimar order.",
};

export default async function AccountOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <OrderDetailView
      orderId={id}
      eyebrow="Order Tracking"
      heading="Your Order Journey"
      description="Each Larimar piece begins at the shore and travels with intention. Follow its route from atelier confirmation to final delivery."
    />
  );
}
