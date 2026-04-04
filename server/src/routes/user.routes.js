import { Router } from "express";
import {
  createUserHandler,
  getUsers,
  updateUserHandler
} from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const userRouter = Router();

userRouter.use(authenticate, authorize("ADMIN"));
userRouter.get("/", asyncHandler(getUsers));
userRouter.post("/", asyncHandler(createUserHandler));
userRouter.patch("/:id", asyncHandler(updateUserHandler));
