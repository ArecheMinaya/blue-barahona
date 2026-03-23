import { Router } from "express";
import { getMe } from "@/controllers/me-controller";
import { asyncHandler } from "@/middleware/async-handler";
import { requireAuth } from "@/middleware/auth";

export const meRouter = Router();

meRouter.get("/", requireAuth, asyncHandler(getMe));
