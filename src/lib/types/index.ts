export type PaginationParams = {
  pageIndex?: number;
  pageSize?: number;
}

export interface Pagination<T> {
  data: T[];
  pageIndex: number;
  pageSize: number;
  total: number;
  totalPages: number;
};