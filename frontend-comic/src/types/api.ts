// Định nghĩa các kiểu dữ liệu response từ API
export type ApiResponse<T = unknown> = {
  status: number;
  message?: string;
  data?: T;
  timestamp: string;
  totalPages?: number;
  limit?: number;
  page?: number;
  total?: number;
};

// Định nghĩa kiểu dữ liệu phân trang
export type PaginatedResponse<T = unknown> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Định nghĩa kiểu dữ liệu cho thể loại
export type CategoryResponse = {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

// Định nghĩa kiểu dữ liệu cho việc tạo/cập nhật thể loại
export type CategoryCreateUpdate = {
  name: string;
  slug: string;
  description?: string;
};

// Định nghĩa kiểu dữ liệu cho truyện
export type ComicResponse = {
  id: number;
  name: string;
  slug: string;
  description: string;
  author: string;
  thumbUrl: string;
  status: string;
  viewsCount: number;
  rating: number;
  followersCount: number;
  categories: CategoryResponse[];
  createdAt: string;
  updatedAt: string;
};

// Định nghĩa kiểu dữ liệu cho việc tạo/cập nhật truyện
export type ComicCreateUpdate = {
  name: string;
  slug: string;
  description: string;
  author: string;
  thumbUrl: string;
  status: string;
  categories: string[];
};
