import type { NextFunction, Request, RequestHandler, Response } from "express";

export function asyncHandler(
  handler: (request: Request, response: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return function wrappedHandler(request, response, next) {
    void handler(request, response, next).catch(next);
  };
}
