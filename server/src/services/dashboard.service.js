import { prisma } from "../config/db.js";

function getMonthKey(date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function buildDashboardSummary(records) {
  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryTotalsMap = new Map();
  const monthlyTrendMap = new Map();

  for (const record of records) {
    const amount = Number(record.amount);

    if (record.type === "INCOME") {
      totalIncome += amount;
    } else {
      totalExpenses += amount;
    }

    categoryTotalsMap.set(record.category, (categoryTotalsMap.get(record.category) || 0) + amount);

    const monthKey = getMonthKey(new Date(record.date));
    const monthTotals = monthlyTrendMap.get(monthKey) || { income: 0, expenses: 0 };

    if (record.type === "INCOME") {
      monthTotals.income += amount;
    } else {
      monthTotals.expenses += amount;
    }

    monthlyTrendMap.set(monthKey, monthTotals);
  }

  return {
    totals: {
      income: Number(totalIncome.toFixed(2)),
      expenses: Number(totalExpenses.toFixed(2)),
      netBalance: Number((totalIncome - totalExpenses).toFixed(2))
    },
    categoryTotals: [...categoryTotalsMap.entries()]
      .map(([category, total]) => ({
        category,
        total: Number(total.toFixed(2))
      }))
      .sort((a, b) => b.total - a.total),
    monthlyTrends: [...monthlyTrendMap.entries()]
      .map(([month, totals]) => ({
        month,
        income: Number(totals.income.toFixed(2)),
        expenses: Number(totals.expenses.toFixed(2)),
        net: Number((totals.income - totals.expenses).toFixed(2))
      }))
      .sort((a, b) => a.month.localeCompare(b.month)),
    recentActivity: records.slice(0, 5).map((record) => ({
      id: record.id,
      amount: record.amount,
      type: record.type,
      category: record.category,
      date: record.date,
      description: record.description,
      createdAt: record.createdAt
    }))
  };
}

export async function getDashboardSummary() {
  const records = await prisma.financeRecord.findMany({
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      amount: true,
      type: true,
      category: true,
      date: true,
      description: true,
      createdAt: true
    }
  });

  return buildDashboardSummary(
    records.map((record) => ({
      ...record,
      amount: Number(record.amount)
    }))
  );
}
