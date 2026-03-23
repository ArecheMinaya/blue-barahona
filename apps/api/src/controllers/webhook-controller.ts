import type { Request, Response } from "express";
import Stripe from "stripe";
import { env } from "@/config/env";
import { stripeClient } from "@/lib/stripe";
import { handleStripePaymentEvent } from "@/services/checkout-service";
import { ApiError } from "@/utils/api-error";

export async function postStripeWebhook(request: Request, response: Response) {
  const signature = request.headers["stripe-signature"];
  const webhookSecret = env().STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    throw new ApiError(400, "missing_webhook_signature", "Webhook signature is missing.");
  }

  const rawBody = Buffer.isBuffer(request.body)
    ? request.body
    : Buffer.from(request.body);

  let event: Stripe.Event;

  try {
    event = stripeClient().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    throw new ApiError(400, "invalid_webhook_signature", "Webhook signature validation failed.", error);
  }

  if (
    event.type === "payment_intent.succeeded" ||
    event.type === "payment_intent.payment_failed" ||
    event.type === "payment_intent.canceled"
  ) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await handleStripePaymentEvent(event.type, paymentIntent.id);
  }

  response.json({ received: true });
}
