import {
  createRecordSchema,
  listRecordsQuerySchema,
  updateRecordSchema
} from "../validations/record.validation.js";
import {
  createRecord,
  deleteRecord,
  getRecordById,
  listRecords,
  updateRecord
} from "../services/record.service.js";

export async function getRecords(req, res) {
  const query = listRecordsQuerySchema.parse(req.query);
  const result = await listRecords(query);
  return res.status(200).json(result);
}

export async function getRecord(req, res) {
  const result = await getRecordById(req.params.id);
  return res.status(200).json(result);
}

export async function createRecordHandler(req, res) {
  const payload = createRecordSchema.parse(req.body);
  const result = await createRecord(payload, req.user.sub);
  return res.status(201).json(result);
}

export async function updateRecordHandler(req, res) {
  const payload = updateRecordSchema.parse(req.body);
  const result = await updateRecord(req.params.id, payload);
  return res.status(200).json(result);
}

export async function deleteRecordHandler(req, res) {
  await deleteRecord(req.params.id);
  return res.status(204).send();
}
