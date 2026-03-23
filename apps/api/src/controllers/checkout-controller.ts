import type { Request, Response } from "express";
import { z } from "zod";
import { createPaymentIntent } from "@/services/checkout-service";
import { ApiError } from "@/utils/api-error";

const addressSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  country: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  streetAddress: z.string().min(1),
  apartment: z.string().optional().default(""),
  isDefault: z.boolean().default(false),
});

const checkoutSchema = z.object({
  lines: z.array(
    z.object({
      slug: z.string().min(1),
      quantity: z.number().int().positive(),
    }),
  ),
  shippingMethodId: z.string().min(1),
  addressId: z.string().uuid().optional(),
  address: addressSchema.optional(),
  currency: z.string().default("usd"),
});

export async function postPaymentIntent(request: Request, response: Response) {
  if (!request.auth) {
    throw new ApiError(401, "missing_auth", "A bearer token is required.");
  }

  const payload = checkoutSchema.parse(request.body);
  const checkout = await createPaymentIntent(
    request.auth.userId,
    request.auth.email,
    payload,
  );

  response.status(201).json(checkout);
}
