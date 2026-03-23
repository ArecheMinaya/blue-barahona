import { Router } from "express";
import { postPaymentIntent } from "@/controllers/checkout-controller";
import { asyncHandler } from "@/middleware/async-handler";
import { requireAuth } from "@/middleware/auth";

export const checkoutRouter = Router();

checkoutRouter.use(requireAuth);
checkoutRouter.post("/payment-intent", asyncHandler(postPaymentIntent));
