import { getDashboardSummary } from "../services/dashboard.service.js";

export async function getSummary(req, res) {
  const result = await getDashboardSummary();
  return res.status(200).json(result);
}
