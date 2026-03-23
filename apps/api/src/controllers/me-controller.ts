import type { Request, Response } from "express";
import { ensureProfile } from "@/services/profile-service";
import { ApiError } from "@/utils/api-error";

export async function getMe(request: Request, response: Response) {
  if (!request.auth) {
    throw new ApiError(401, "missing_auth", "A bearer token is required.");
  }

  const profile = await ensureProfile(request.auth.user);
  response.json({ profile });
}
