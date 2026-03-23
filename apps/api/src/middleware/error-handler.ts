import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/utils/api-error";

export function notFoundHandler(_request: Request, response: Response) {
  response.status(404).json({
    error: {
      code: "not_found",
      message: "Resource not found.",
    },
  });
}

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
    return;
  }

  response.status(500).json({
    error: {
      code: "internal_server_error",
      message: "An unexpected server error occurred.",
    },
  });
}
