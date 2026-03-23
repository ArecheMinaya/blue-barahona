import {
  getProductBySlug,
  getShippingMethods,
} from "@larimar/catalog";
import type {
  AddressInput,
  AddressSnapshot,
  BagLine,
  CheckoutIntentResponse,
  CheckoutPayload,
  Order,
  ShippingMethod,
} from "@larimar/types";
import { createAddress, getAddressById } from "@/services/address-service";
import { clearBag } from "@/services/bag-service";
import { stripeClient } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { ApiError } from "@/utils/api-error";

type OrderRow = {
  id: string;
  user_id: string;
  status: Order["status"];
  fulfillment_status: Order["fulfillmentStatus"];
  fulfillment_timeline: Order["fulfillmentTimeline"];
  subtotal: number;
  shipping_amount: number;
  total: number;
  currency: string;
  stripe_payment_intent_id: string | null;
  carrier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  estimated_delivery: string | null;
  shipping_address_id: string | null;
  shipping_address_snapshot: AddressSnapshot | null;
  created_at: string;
  updated_at: string;
};

function toMinorUnits(amount: number) {
  return Math.round(amount * 100);
}

function addBusinessDays(date: Date, businessDays: number) {
  const next = new Date(date);
  let remaining = businessDays;

  while (remaining > 0) {
    next.setDate(next.getDate() + 1);

    const day = next.getDay();

    if (day !== 0 && day !== 6) {
      remaining -= 1;
    }
  }

  return next;
}

function estimateDeliveryDate(shippingMethod: ShippingMethod) {
  const businessDays = shippingMethod.id === "overnight" ? 1 : 3;
  return addBusinessDays(new Date(), businessDays).toISOString();
}

function resolveCarrier(shippingMethod: ShippingMethod) {
  if (shippingMethod.id === "overnight") {
    return "DHL Express";
  }

  return "DHL Express";
}

function resolveShippingMethod(shippingMethodId: string) {
  const shippingMethod = getShippingMethods().find(
    (method) => method.id === shippingMethodId,
  );

  if (!shippingMethod) {
    throw new ApiError(400, "invalid_shipping_method", "Shipping method is invalid.");
  }

  return shippingMethod;
}

function resolveBagLines(lines: BagLine[]) {
  if (!lines.length) {
    throw new ApiError(400, "empty_bag", "The bag is empty.");
  }

  return lines.map((line) => {
    const product = getProductBySlug(line.slug);

    if (!product) {
      throw new ApiError(400, "invalid_product", `Unknown product slug: ${line.slug}`);
    }

    if (line.quantity <= 0) {
      throw new ApiError(400, "invalid_quantity", "All quantities must be greater than zero.");
    }

    return {
      product,
      quantity: line.quantity,
      total: product.price * line.quantity,
    };
  });
}

function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    userId: row.user_id,
    status: row.status,
    fulfillmentStatus: row.fulfillment_status,
    fulfillmentTimeline: row.fulfillment_timeline ?? {},
    subtotal: row.subtotal,
    shippingAmount: row.shipping_amount,
    total: row.total,
    currency: row.currency,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    carrier: row.carrier,
    trackingNumber: row.tracking_number,
    trackingUrl: row.tracking_url,
    estimatedDelivery: row.estimated_delivery,
    shippingAddressId: row.shipping_address_id,
    shippingAddressSnapshot: row.shipping_address_snapshot,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items: [],
  };
}

async function resolveAddress(
  userId: string,
  addressId: string | undefined,
  addressInput: AddressInput | undefined,
) {
  if (addressId) {
    return getAddressById(userId, addressId);
  }

  if (addressInput) {
    return createAddress(userId, addressInput);
  }

  throw new ApiError(400, "missing_address", "A shipping address is required.");
}

async function insertOrderItems(orderId: string, lines: ReturnType<typeof resolveBagLines>) {
  const payload = lines.map((line) => ({
    order_id: orderId,
    product_slug: line.product.slug,
    quantity: line.quantity,
    unit_price: line.product.price,
    total_price: line.total,
    product_snapshot: {
      slug: line.product.slug,
      name: line.product.name,
      heroImage: line.product.heroImage,
      materials: line.product.materials,
      stone: line.product.stone,
      metal: line.product.metal,
    },
  }));

  const { error } = await supabaseAdmin().from("order_items").insert(payload);

  if (error) {
    throw new ApiError(500, "order_item_create_failed", "Unable to create order items.", error);
  }
}

async function insertOrderDraft(input: {
  userId: string;
  shippingMethod: ShippingMethod;
  addressSnapshot: AddressSnapshot;
  shippingAddressId: string | null;
  lines: ReturnType<typeof resolveBagLines>;
  currency: string;
}) {
  const subtotal = input.lines.reduce((sum, line) => sum + line.total, 0);
  const shippingAmount = input.shippingMethod.price;
  const total = subtotal + shippingAmount;

  const { data, error } = await supabaseAdmin()
    .from("orders")
    .insert({
      user_id: input.userId,
      status: "awaiting_payment",
      fulfillment_status: "confirmed",
      fulfillment_timeline: {
        confirmed: new Date().toISOString(),
      },
      subtotal,
      shipping_amount: shippingAmount,
      total,
      currency: input.currency,
      carrier: resolveCarrier(input.shippingMethod),
      estimated_delivery: estimateDeliveryDate(input.shippingMethod),
      shipping_address_id: input.shippingAddressId,
      shipping_address_snapshot: input.addressSnapshot,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new ApiError(500, "order_create_failed", "Unable to create the order.", error);
  }

  await insertOrderItems(data.id, input.lines);

  return {
    order: mapOrder(data as OrderRow),
    subtotal,
    shippingAmount,
    total,
  };
}

export async function createPaymentIntent(
  userId: string,
  customerEmail: string,
  payload: CheckoutPayload,
): Promise<CheckoutIntentResponse> {
  const shippingMethod = resolveShippingMethod(payload.shippingMethodId);
  const lines = resolveBagLines(payload.lines);
  const address = await resolveAddress(userId, payload.addressId, payload.address);
  const currency = (payload.currency ?? "usd").toLowerCase();
  const orderDraft = await insertOrderDraft({
    userId,
    shippingMethod,
    addressSnapshot: {
      fullName: address.fullName,
      phone: address.phone,
      country: address.country,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      streetAddress: address.streetAddress,
      apartment: address.apartment,
      isDefault: address.isDefault,
    },
    shippingAddressId: address.id,
    lines,
    currency,
  });

  const paymentIntent = await stripeClient().paymentIntents.create({
    amount: toMinorUnits(orderDraft.total),
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
    receipt_email: customerEmail,
    metadata: {
      orderId: orderDraft.order.id,
      userId,
    },
  });

  if (!paymentIntent.client_secret) {
    throw new ApiError(500, "payment_intent_failed", "Stripe did not return a client secret.");
  }

  const { data, error } = await supabaseAdmin()
    .from("orders")
    .update({
      stripe_payment_intent_id: paymentIntent.id,
    })
    .eq("id", orderDraft.order.id)
    .select("*")
    .single();

  if (error || !data) {
    throw new ApiError(500, "order_update_failed", "Unable to attach payment details.", error);
  }

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    order: mapOrder(data as OrderRow),
    shippingMethod,
  };
}

async function updateOrderStatus(paymentIntentId: string, status: Order["status"]) {
  const { data, error } = await supabaseAdmin()
    .from("orders")
    .update({
      status,
    })
    .eq("stripe_payment_intent_id", paymentIntentId)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new ApiError(500, "order_update_failed", "Unable to update order status.", error);
  }

  return data as OrderRow | null;
}

export async function handleStripePaymentEvent(eventType: string, paymentIntentId: string) {
  if (eventType === "payment_intent.succeeded") {
    const order = await updateOrderStatus(paymentIntentId, "paid");

    if (order) {
      await clearBag(order.user_id);
    }

    return;
  }

  if (eventType === "payment_intent.payment_failed") {
    await updateOrderStatus(paymentIntentId, "payment_failed");
    return;
  }

  if (eventType === "payment_intent.canceled") {
    await updateOrderStatus(paymentIntentId, "cancelled");
  }
}
