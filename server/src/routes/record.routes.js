import { Router } from "express";
import {
  createRecordHandler,
  deleteRecordHandler,
  getRecord,
  getRecords,
  updateRecordHandler
} from "../controllers/record.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const recordRouter = Router();

recordRouter.use(authenticate);
recordRouter.get("/", authorize("ADMIN", "ANALYST"), asyncHandler(getRecords));
recordRouter.get("/:id", authorize("ADMIN", "ANALYST"), asyncHandler(getRecord));
recordRouter.post("/", authorize("ADMIN"), asyncHandler(createRecordHandler));
recordRouter.patch("/:id", authorize("ADMIN"), asyncHandler(updateRecordHandler));
recordRouter.delete("/:id", authorize("ADMIN"), asyncHandler(deleteRecordHandler));
