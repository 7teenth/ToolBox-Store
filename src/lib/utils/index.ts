import { Pagination } from "@/lib/types"

export const getPaginatedData = <T>(
  data: T[],
  count: number | null,
  pageIndex: number,
  pageSize: number
): Pagination<T> => {
  return {
    data,
    pageIndex,
    pageSize,
    total: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}