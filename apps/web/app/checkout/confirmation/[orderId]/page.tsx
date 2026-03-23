import type { Metadata } from "next";
import { OrderDetailView } from "@/components/order-detail-view";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "View the confirmation details for your Larimar purchase.",
};

export default async function CheckoutConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <OrderDetailView
      orderId={orderId}
      eyebrow="Confirmation"
      heading="Your order has been placed."
      description="Thank you for collecting with Larimar. Your confirmation now flows directly into live order tracking, shipment updates, and the preserved address snapshot stored with the order."
    />
  );
}
