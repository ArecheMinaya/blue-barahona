import { Router } from "express";
import { getBag, postBagMerge, putBag } from "@/controllers/bag-controller";
import { asyncHandler } from "@/middleware/async-handler";
import { requireAuth } from "@/middleware/auth";

export const bagRouter = Router();

bagRouter.use(requireAuth);
bagRouter.get("/", asyncHandler(getBag));
bagRouter.put("/", asyncHandler(putBag));
bagRouter.post("/merge", asyncHandler(postBagMerge));
