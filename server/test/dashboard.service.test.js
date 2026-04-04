import test from "node:test";
import assert from "node:assert/strict";
import { buildDashboardSummary } from "../src/services/dashboard.service.js";

test("buildDashboardSummary calculates totals and trends", () => {
  const summary = buildDashboardSummary([
    {
      id: "1",
      amount: 5000,
      type: "INCOME",
      category: "Salary",
      date: "2026-03-01T00:00:00.000Z",
      description: "Salary",
      createdAt: "2026-03-01T00:00:00.000Z"
    },
    {
      id: "2",
      amount: 1200,
      type: "EXPENSE",
      category: "Rent",
      date: "2026-03-03T00:00:00.000Z",
      description: "Rent",
      createdAt: "2026-03-03T00:00:00.000Z"
    },
    {
      id: "3",
      amount: 700,
      type: "INCOME",
      category: "Freelance",
      date: "2026-04-03T00:00:00.000Z",
      description: "Project",
      createdAt: "2026-04-03T00:00:00.000Z"
    }
  ]);

  assert.deepEqual(summary.totals, {
    income: 5700,
    expenses: 1200,
    netBalance: 4500
  });
  assert.equal(summary.monthlyTrends.length, 2);
  assert.equal(summary.recentActivity[0].id, "1");
});
