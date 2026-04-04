import { z } from "zod";

const roles = ["ADMIN", "ANALYST", "VIEWER"];
const statuses = ["ACTIVE", "INACTIVE"];

export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(roles),
  status: z.enum(statuses).optional()
});

export const updateUserSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    password: z.string().min(8).max(100).optional(),
    role: z.enum(roles).optional(),
    status: z.enum(statuses).optional()
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  });

export const listUsersQuerySchema = z.object({
  role: z.enum(roles).optional(),
  status: z.enum(statuses).optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional()
});
