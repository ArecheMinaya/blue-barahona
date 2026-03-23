import { Router } from "express";
import {
  getAddresses,
  makeDefaultAddress,
  postAddress,
  putAddress,
  removeAddress,
} from "@/controllers/address-controller";
import { asyncHandler } from "@/middleware/async-handler";
import { requireAuth } from "@/middleware/auth";

export const addressRouter = Router();

addressRouter.use(requireAuth);
addressRouter.get("/", asyncHandler(getAddresses));
addressRouter.post("/", asyncHandler(postAddress));
addressRouter.put("/:id", asyncHandler(putAddress));
addressRouter.delete("/:id", asyncHandler(removeAddress));
addressRouter.post("/:id/default", asyncHandler(makeDefaultAddress));
