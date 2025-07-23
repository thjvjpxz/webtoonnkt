// Định nghĩa các kiểu dữ liệu response từ API
export interface ApiResponse<T = unknown> {
  status: number;
  message?: string;
  data?: T;
  timestamp: string;
  totalPages?: number;
  limit?: number;
  page?: number;
  total?: number;
}

// Định nghĩa kiểu dữ liệu phân trang
export interface PaginatedResponse<T = unknown> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

