import { loginSchema } from "../validations/auth.validation.js";
import { loginUser } from "../services/auth.service.js";

export async function login(req, res) {
  const payload = loginSchema.parse(req.body);
  const result = await loginUser(payload);
  return res.status(200).json(result);
}
