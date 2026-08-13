export function paginate<TItem>(items: TItem[], page: number, pageSize: number): TItem[] {
  const startIndex = (page - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
}
