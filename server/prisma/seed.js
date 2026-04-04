import bcrypt from "bcryptjs";
import { prisma } from "../src/config/db.js";

async function main() {
  const passwordHash = await bcrypt.hash("Password@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@finance.local" },
    update: {
      name: "Admin User",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE"
    },
    create: {
      name: "Admin User",
      email: "admin@finance.local",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE"
    }
  });

  await prisma.user.upsert({
    where: { email: "analyst@finance.local" },
    update: {
      name: "Analyst User",
      passwordHash,
      role: "ANALYST",
      status: "ACTIVE",
      createdById: admin.id
    },
    create: {
      name: "Analyst User",
      email: "analyst@finance.local",
      passwordHash,
      role: "ANALYST",
      status: "ACTIVE",
      createdById: admin.id
    }
  });

  await prisma.user.upsert({
    where: { email: "viewer@finance.local" },
    update: {
      name: "Viewer User",
      passwordHash,
      role: "VIEWER",
      status: "ACTIVE",
      createdById: admin.id
    },
    create: {
      name: "Viewer User",
      email: "viewer@finance.local",
      passwordHash,
      role: "VIEWER",
      status: "ACTIVE",
      createdById: admin.id
    }
  });

  const recordCount = await prisma.financeRecord.count();
  if (recordCount > 0) {
    return;
  }

  await prisma.financeRecord.createMany({
    data: [
      {
        amount: 5000,
        type: "INCOME",
        category: "Salary",
        date: new Date("2026-03-01T00:00:00.000Z"),
        description: "March salary",
        createdById: admin.id
      },
      {
        amount: 1200,
        type: "EXPENSE",
        category: "Rent",
        date: new Date("2026-03-03T00:00:00.000Z"),
        description: "Apartment rent",
        createdById: admin.id
      },
      {
        amount: 320.5,
        type: "EXPENSE",
        category: "Groceries",
        date: new Date("2026-03-06T00:00:00.000Z"),
        description: "Weekly groceries",
        createdById: admin.id
      },
      {
        amount: 700,
        type: "INCOME",
        category: "Freelance",
        date: new Date("2026-03-14T00:00:00.000Z"),
        description: "Landing page project",
        createdById: admin.id
      },
      {
        amount: 150,
        type: "EXPENSE",
        category: "Utilities",
        date: new Date("2026-03-18T00:00:00.000Z"),
        description: "Electricity and water",
        createdById: admin.id
      }
    ]
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
