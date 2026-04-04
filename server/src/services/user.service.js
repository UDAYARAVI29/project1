import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import { prisma } from "../config/db.js";
import { getPagination } from "../utils/pagination.js";

export async function listUsers(query) {
  const pagination = getPagination(query);
  const where = {
    ...(query.role ? { role: query.role } : {}),
    ...(query.status ? { status: query.status } : {})
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdById: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.user.count({ where })
  ]);

  return {
    data: users,
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total
    }
  };
}

export async function createUser(payload, currentUserId) {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
    select: { id: true }
  });

  if (existingUser) {
    throw createHttpError(409, "A user with this email already exists");
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  return prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      passwordHash,
      role: payload.role,
      status: payload.status || "ACTIVE",
      createdById: currentUserId
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdById: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function updateUser(userId, payload) {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true }
  });

  if (!existingUser) {
    throw createHttpError(404, "User not found");
  }

  const data = {};

  if (payload.name) {
    data.name = payload.name;
  }

  if (payload.role) {
    data.role = payload.role;
  }

  if (payload.status) {
    data.status = payload.status;
  }

  if (payload.password) {
    data.passwordHash = await bcrypt.hash(payload.password, 10);
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdById: true,
      createdAt: true,
      updatedAt: true
    }
  });
}
