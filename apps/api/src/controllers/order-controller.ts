import type { Request, Response } from "express";
import { getOrderById, listOrders } from "@/services/order-service";
import { ApiError } from "@/utils/api-error";

function userIdFromRequest(request: Request) {
  if (!request.auth) {
    throw new ApiError(401, "missing_auth", "A bearer token is required.");
  }

  return request.auth.userId;
}

export async function getOrders(request: Request, response: Response) {
  const orders = await listOrders(userIdFromRequest(request));
  response.json({ orders });
}

export async function getOrder(request: Request, response: Response) {
  const order = await getOrderById(userIdFromRequest(request), String(request.params.id));
  response.json({ order });
}
