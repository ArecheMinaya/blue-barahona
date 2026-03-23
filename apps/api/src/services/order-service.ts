import type { Order, OrderItem } from "@larimar/types";
import { supabaseAdmin } from "@/lib/supabase";
import { ApiError } from "@/utils/api-error";

function mapOrderItem(row: Record<string, unknown>): OrderItem {
  return {
    id: String(row.id),
    orderId: String(row.order_id),
    productSlug: String(row.product_slug),
    quantity: Number(row.quantity),
    unitPrice: Number(row.unit_price),
    totalPrice: Number(row.total_price),
    productSnapshot: row.product_snapshot as OrderItem["productSnapshot"],
  };
}

function mapOrder(row: Record<string, unknown>): Order {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    status: row.status as Order["status"],
    fulfillmentStatus: row.fulfillment_status as Order["fulfillmentStatus"],
    fulfillmentTimeline:
      (row.fulfillment_timeline as Order["fulfillmentTimeline"]) ?? {},
    subtotal: Number(row.subtotal),
    shippingAmount: Number(row.shipping_amount),
    total: Number(row.total),
    currency: String(row.currency),
    stripePaymentIntentId: row.stripe_payment_intent_id
      ? String(row.stripe_payment_intent_id)
      : null,
    carrier: row.carrier ? String(row.carrier) : null,
    trackingNumber: row.tracking_number ? String(row.tracking_number) : null,
    trackingUrl: row.tracking_url ? String(row.tracking_url) : null,
    estimatedDelivery: row.estimated_delivery
      ? String(row.estimated_delivery)
      : null,
    shippingAddressId: row.shipping_address_id ? String(row.shipping_address_id) : null,
    shippingAddressSnapshot: (row.shipping_address_snapshot as Order["shippingAddressSnapshot"]) ?? null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    items: Array.isArray(row.order_items)
      ? row.order_items.map((item) => mapOrderItem(item as Record<string, unknown>))
      : [],
  };
}

export async function listOrders(userId: string) {
  const { data, error } = await supabaseAdmin()
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new ApiError(500, "order_fetch_failed", "Unable to load orders.", error);
  }

  return (data ?? []).map((row) => mapOrder(row as Record<string, unknown>));
}

export async function getOrderById(userId: string, orderId: string) {
  const { data, error } = await supabaseAdmin()
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    throw new ApiError(500, "order_fetch_failed", "Unable to load the order.", error);
  }

  if (!data) {
    throw new ApiError(404, "order_not_found", "Order not found.");
  }

  return mapOrder(data);
}
