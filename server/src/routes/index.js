import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { dashboardRouter } from "./dashboard.routes.js";
import { recordRouter } from "./record.routes.js";
import { userRouter } from "./user.routes.js";

export const appRouter = Router();

appRouter.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

appRouter.use("/auth", authRouter);
appRouter.use("/users", userRouter);
appRouter.use("/records", recordRouter);
appRouter.use("/dashboard", dashboardRouter);
