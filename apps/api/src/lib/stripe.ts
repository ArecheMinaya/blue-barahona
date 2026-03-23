import Stripe from "stripe";
import { env } from "@/config/env";

let client: Stripe | null = null;

export function stripeClient() {
  if (!client) {
    client = new Stripe(env().STRIPE_SECRET_KEY);
  }

  return client;
}
