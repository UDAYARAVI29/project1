import test from "node:test";
import assert from "node:assert/strict";
import { createRecordSchema } from "../src/validations/record.validation.js";
import { updateUserSchema } from "../src/validations/user.validation.js";
import { authorize } from "../src/middleware/auth.middleware.js";

test("createRecordSchema rejects invalid negative amount", () => {
  assert.throws(() => {
    createRecordSchema.parse({
      amount: -10,
      type: "EXPENSE",
      category: "Utilities",
      date: "2026-04-01T00:00:00.000Z"
    });
  });
});

test("updateUserSchema rejects empty update payload", () => {
  assert.throws(() => {
    updateUserSchema.parse({});
  });
});

test("authorize blocks users without the required role", () => {
  let capturedError;
  const middleware = authorize("ADMIN");

  middleware(
    {
      user: {
        role: "VIEWER"
      }
    },
    {},
    (error) => {
      capturedError = error;
    }
  );

  assert.equal(capturedError.statusCode, 403);
  assert.equal(capturedError.message, "You do not have permission to perform this action");
});
