export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

// the above should be the same as the postman responce

export class PaginatedResults<T>{
  result?: T;
  pagination?: Pagination;
}
