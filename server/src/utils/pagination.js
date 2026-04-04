export function getPagination(query = {}) {
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Math.min(Number(query.limit), 100) : 10;

  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
}
