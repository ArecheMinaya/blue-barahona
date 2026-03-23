import type { NextFunction, Request, Response } from "express";
import { supabaseAdmin } from "@/lib/supabase";
import { ApiError } from "@/utils/api-error";

function getBearerToken(request: Request) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

export async function requireAuth(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const token = getBearerToken(request);

  if (!token) {
    next(new ApiError(401, "missing_auth", "A bearer token is required."));
    return;
  }

  const { data, error } = await supabaseAdmin().auth.getUser(token);

  if (error || !data.user?.email) {
    next(new ApiError(401, "invalid_auth", "The provided session is invalid."));
    return;
  }

  request.auth = {
    accessToken: token,
    user: data.user,
    userId: data.user.id,
    email: data.user.email,
  };

  next();
}
