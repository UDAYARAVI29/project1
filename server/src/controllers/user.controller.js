import {
  createUserSchema,
  listUsersQuerySchema,
  updateUserSchema
} from "../validations/user.validation.js";
import { createUser, listUsers, updateUser } from "../services/user.service.js";

export async function getUsers(req, res) {
  const query = listUsersQuerySchema.parse(req.query);
  const result = await listUsers(query);
  return res.status(200).json(result);
}

export async function createUserHandler(req, res) {
  const payload = createUserSchema.parse(req.body);
  const result = await createUser(payload, req.user.sub);
  return res.status(201).json(result);
}

export async function updateUserHandler(req, res) {
  const payload = updateUserSchema.parse(req.body);
  const result = await updateUser(req.params.id, payload);
  return res.status(200).json(result);
}
