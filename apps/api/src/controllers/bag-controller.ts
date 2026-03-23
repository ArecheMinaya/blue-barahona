import type { Request, Response } from "express";
import { z } from "zod";
import { listBag, mergeBag, replaceBag } from "@/services/bag-service";
import { ApiError } from "@/utils/api-error";

const bagLineSchema = z.object({
  slug: z.string().min(1),
  quantity: z.number().int().positive(),
});

const bagSchema = z.object({
  lines: z.array(bagLineSchema),
});

function userIdFromRequest(request: Request) {
  if (!request.auth) {
    throw new ApiError(401, "missing_auth", "A bearer token is required.");
  }

  return request.auth.userId;
}

export async function getBag(request: Request, response: Response) {
  const lines = await listBag(userIdFromRequest(request));
  response.json({ lines });
}

export async function putBag(request: Request, response: Response) {
  const payload = bagSchema.parse(request.body);
  const lines = await replaceBag(userIdFromRequest(request), payload.lines);
  response.json({ lines });
}

export async function postBagMerge(request: Request, response: Response) {
  const payload = bagSchema.parse(request.body);
  const lines = await mergeBag(userIdFromRequest(request), payload.lines);
  response.json({ lines });
}
