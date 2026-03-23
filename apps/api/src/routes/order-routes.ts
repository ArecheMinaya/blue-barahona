import { Router } from "express";
import { getOrder, getOrders } from "@/controllers/order-controller";
import { asyncHandler } from "@/middleware/async-handler";
import { requireAuth } from "@/middleware/auth";

export const orderRouter = Router();

orderRouter.use(requireAuth);
orderRouter.get("/", asyncHandler(getOrders));
orderRouter.get("/:id", asyncHandler(getOrder));
