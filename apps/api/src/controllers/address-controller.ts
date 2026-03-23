import type { Request, Response } from "express";
import { z } from "zod";
import {
  createAddress,
  deleteAddress,
  listAddresses,
  setDefaultAddress,
  updateAddress,
} from "@/services/address-service";
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

function userIdFromRequest(request: Request) {
  if (!request.auth) {
    throw new ApiError(401, "missing_auth", "A bearer token is required.");
  }

  return request.auth.userId;
}

function addressIdFromRequest(request: Request) {
  return String(request.params.id);
}

export async function getAddresses(request: Request, response: Response) {
  const addresses = await listAddresses(userIdFromRequest(request));
  response.json({ addresses });
}

export async function postAddress(request: Request, response: Response) {
  const input = addressSchema.parse(request.body);
  const address = await createAddress(userIdFromRequest(request), input);
  response.status(201).json({ address });
}

export async function putAddress(request: Request, response: Response) {
  const input = addressSchema.parse(request.body);
  const address = await updateAddress(
    userIdFromRequest(request),
    addressIdFromRequest(request),
    input,
  );
  response.json({ address });
}

export async function removeAddress(request: Request, response: Response) {
  await deleteAddress(userIdFromRequest(request), addressIdFromRequest(request));
  response.status(204).send();
}

export async function makeDefaultAddress(request: Request, response: Response) {
  const address = await setDefaultAddress(
    userIdFromRequest(request),
    addressIdFromRequest(request),
  );
  response.json({ address });
}
