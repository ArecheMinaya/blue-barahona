import cors from "cors";
import express from "express";
import { postStripeWebhook } from "@/controllers/webhook-controller";
import { env } from "@/config/env";
import { addressRouter } from "@/routes/address-routes";
import { bagRouter } from "@/routes/bag-routes";
import { checkoutRouter } from "@/routes/checkout-routes";
import { meRouter } from "@/routes/me-routes";
import { orderRouter } from "@/routes/order-routes";
import { errorHandler, notFoundHandler } from "@/middleware/error-handler";
import { asyncHandler } from "@/middleware/async-handler";

export function createApp() {
  const app = express();

  app.post(
    "/api/webhooks/stripe",
    express.raw({ type: "application/json" }),
    asyncHandler(postStripeWebhook),
  );

  app.use(
    cors({
      origin: env().WEB_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.json({ ok: true });
  });

  app.use("/api/me", meRouter);
  app.use("/api/addresses", addressRouter);
  app.use("/api/bag", bagRouter);
  app.use("/api/checkout", checkoutRouter);
  app.use("/api/orders", orderRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
