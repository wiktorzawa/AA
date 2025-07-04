export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  success: boolean;
  message?: string;
}
