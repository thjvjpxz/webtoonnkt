// Định nghĩa kiểu dữ liệu cho thể loại
export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Định nghĩa kiểu dữ liệu cho việc tạo/cập nhật thể loại
export interface CategoryCreateUpdate {
  name: string;
  slug: string;
  description: string;
}