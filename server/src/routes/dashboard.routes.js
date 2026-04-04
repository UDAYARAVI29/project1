import { Router } from "express";
import { getSummary } from "../controllers/dashboard.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const dashboardRouter = Router();

dashboardRouter.use(authenticate, authorize("ADMIN", "ANALYST", "VIEWER"));
dashboardRouter.get("/summary", asyncHandler(getSummary));
