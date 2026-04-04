import { z } from "zod";

const entryTypes = ["INCOME", "EXPENSE"];

export const createRecordSchema = z.object({
  amount: z.coerce.number().positive(),
  type: z.enum(entryTypes),
  category: z.string().min(2).max(100),
  date: z.string().datetime(),
  description: z.string().max(500).optional()
});

export const updateRecordSchema = z
  .object({
    amount: z.coerce.number().positive().optional(),
    type: z.enum(entryTypes).optional(),
    category: z.string().min(2).max(100).optional(),
    date: z.string().datetime().optional(),
    description: z.string().max(500).nullable().optional()
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  });

export const listRecordsQuerySchema = z.object({
  type: z.enum(entryTypes).optional(),
  category: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional()
});
