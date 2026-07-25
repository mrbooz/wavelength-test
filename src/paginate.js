/** Paginate the workout history list. Pages are 1-indexed. */
export function paginate(items, page, perPage) {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage + 1);
}
