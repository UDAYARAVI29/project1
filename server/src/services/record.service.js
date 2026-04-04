import createHttpError from "http-errors";
import { prisma } from "../config/db.js";
import { getPagination } from "../utils/pagination.js";

export async function listRecords(query) {
  const pagination = getPagination(query);
  const where = {
    ...(query.type ? { type: query.type } : {}),
    ...(query.category
      ? {
          category: {
            contains: query.category,
            mode: "insensitive"
          }
        }
      : {}),
    ...((query.startDate || query.endDate)
      ? {
          date: {
            ...(query.startDate ? { gte: new Date(query.startDate) } : {}),
            ...(query.endDate ? { lte: new Date(query.endDate) } : {})
          }
        }
      : {})
  };

  const [records, total] = await Promise.all([
    prisma.financeRecord.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        amount: true,
        type: true,
        category: true,
        date: true,
        description: true,
        createdById: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.financeRecord.count({ where })
  ]);

  return {
    data: records.map((record) => ({
      ...record,
      amount: Number(record.amount)
    })),
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total
    }
  };
}

export async function getRecordById(recordId) {
  const record = await prisma.financeRecord.findUnique({
    where: { id: recordId },
    select: {
      id: true,
      amount: true,
      type: true,
      category: true,
      date: true,
      description: true,
      createdById: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!record) {
    throw createHttpError(404, "Financial record not found");
  }

  return {
    ...record,
    amount: Number(record.amount)
  };
}

export async function createRecord(payload, currentUserId) {
  const record = await prisma.financeRecord.create({
    data: {
      amount: payload.amount,
      type: payload.type,
      category: payload.category,
      date: new Date(payload.date),
      description: payload.description || null,
      createdById: currentUserId
    },
    select: {
      id: true,
      amount: true,
      type: true,
      category: true,
      date: true,
      description: true,
      createdById: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return {
    ...record,
    amount: Number(record.amount)
  };
}

export async function updateRecord(recordId, payload) {
  const existingRecord = await prisma.financeRecord.findUnique({
    where: { id: recordId },
    select: { id: true }
  });

  if (!existingRecord) {
    throw createHttpError(404, "Financial record not found");
  }

  const data = {
    ...(payload.amount !== undefined ? { amount: payload.amount } : {}),
    ...(payload.type ? { type: payload.type } : {}),
    ...(payload.category ? { category: payload.category } : {}),
    ...(payload.date ? { date: new Date(payload.date) } : {}),
    ...(payload.description !== undefined ? { description: payload.description } : {})
  };

  const record = await prisma.financeRecord.update({
    where: { id: recordId },
    data,
    select: {
      id: true,
      amount: true,
      type: true,
      category: true,
      date: true,
      description: true,
      createdById: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return {
    ...record,
    amount: Number(record.amount)
  };
}

export async function deleteRecord(recordId) {
  const existingRecord = await prisma.financeRecord.findUnique({
    where: { id: recordId },
    select: { id: true }
  });

  if (!existingRecord) {
    throw createHttpError(404, "Financial record not found");
  }

  await prisma.financeRecord.delete({
    where: { id: recordId }
  });
}
