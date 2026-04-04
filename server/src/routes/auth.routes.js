import { Router } from "express";
import { login } from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const authRouter = Router();

authRouter.post("/login", asyncHandler(login));
