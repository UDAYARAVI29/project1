import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createHttpError(401, "Authentication token is required"));
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret);

    if (payload.status !== "ACTIVE") {
      return next(createHttpError(403, "Inactive users cannot access this resource"));
    }

    req.user = payload;
    return next();
  } catch (_error) {
    return next(createHttpError(401, "Invalid or expired authentication token"));
  }
}

export function authorize(...roles) {
  return function roleGuard(req, _res, next) {
    if (!req.user) {
      return next(createHttpError(401, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(createHttpError(403, "You do not have permission to perform this action"));
    }

    return next();
  };
}
